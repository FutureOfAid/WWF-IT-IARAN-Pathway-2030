# WWF-IT-Pathway-2030 — Survey

Survey app for the **WWF Italia: Sistema Natura 2030** foresight process. Respondents
rate a pre-selected list of external drivers on two pedagogical **1–4 scales**
(importance and uncertainty), each level carrying a plain-language description tied
to 2030 / the next four years, plus optional free-text comments. The app is **not**
a strategy-selection tool; it feeds the scenario construction stage.

The two questions shown per driver are:

- **Importance** — *Da qui al 2030, quanto questo driver potrebbe modificare il sistema
  “WWF Italia: Natura 2030”?* (1 Limitato · 2 Rilevante · 3 Molto importante · 4 Determinante)
- **Uncertainty** — *Da qui al 2030, quanto può variare la direzione, l'intensità o gli
  effetti di questo driver?* (1 Abbastanza prevedibile · 2 Parzialmente prevedibile · 3 Difficile da
  prevedere · 4 Molto imprevedibile)

Scores are validated server-side to the 1–4 range. Responses collected under earlier
driver versions (which used a 1–5 scale) are never re-validated and remain in the
database unchanged, so version history is preserved.

## What's in this folder

- `src/server.js` — Express API + static hosting.
- `src/db.js` — Database abstraction. PostgreSQL when `DATABASE_URL` is set
  (Railway), SQLite locally (`db/survey.sqlite`).
- `src/drivers.js` — Preselected driver set v0.4.0 (25 drivers, survey-ready Italian wording).
- `src/seed.js` — Idempotent driver seed. **Never deletes** drivers or responses.
- `public/index.html` — Italian respondent interface (mobile-friendly).
- `public/admin.html` — Aggregate results + raw response export.

## Run locally

```bash
cd survey
npm install
npm start
```

The app listens on `PORT` (default `3001`) and stores data in
`survey/db/survey.sqlite` so responses persist across restarts.

Open:

- Respondent UI: <http://localhost:3001/>
- Admin / results: <http://localhost:3001/admin.html>

To wipe local dev data, delete `survey/db/survey.sqlite`.

## Railway deployment

Railway should run this folder as the service root.

**Required environment variables**

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string from a Railway Postgres plugin. **Required** in production — without it the app falls back to SQLite on an ephemeral filesystem and you will lose data on every redeploy. |
| `PORT` | Provided by Railway automatically. |
| `ADMIN_TOKEN` | **Required for launch.** Gates every admin view and results/export API (`/api/admin/responses`, `/api/admin/export.csv`, `/api/driver-summary`, `/api/matrix`). The value is the launch password and is supplied to the backend only as the admin-entered credential (`X-Admin-Token` header or `?token=` query param). It is **never** committed to the frontend or backend code. **Fails closed:** if `ADMIN_TOKEN` is unset, these endpoints return `503` and no results are exposed. **Current launch password: `WWF&I`** — set `ADMIN_TOKEN=WWF&I` on the Railway web service (this secret is documented here only as configuration guidance; it is not hardcoded anywhere in the app). |
| `PGSSL` | Optional. Set to `disable` to turn off TLS (Railway internal networking already does TLS). |

**Build command**

```
npm install
```

**Start command**

```
npm start
```

(That runs `node src/server.js`, which calls `db.init()` and then `seedDrivers()`
on every boot — both are idempotent.)

**Database setup**

1. Add the PostgreSQL plugin to the Railway project.
2. Reference the plugin's `DATABASE_URL` env var from the web service.
3. Deploy. On first boot the server creates `drivers`, `survey_responses`,
   `response_items` if missing and inserts the v0.4.0 driver set.

### Avoiding data resets on redeploy

- **Always run against the Railway Postgres** in production. The SQLite fallback
  is for local development only — Railway redeploys wipe the container
  filesystem, so SQLite there means losing every response.
- The schema uses `CREATE TABLE IF NOT EXISTS` and never drops anything. New
  deploys do not touch existing rows.
- The seed step inserts only `(driver_id, version)` pairs that are missing. It
  never updates titles in place and never deletes drivers.

### Updating drivers without deleting responses

The data model preserves history through driver versioning:

- `drivers.driver_id` is **stable**. Never change it.
- `drivers.version` (and `DRIVER_VERSION` in `src/drivers.js`) is the survey
  edition. Existing responses keep their original `driver_version` on every
  `response_items` row, so they remain joinable to the version they were
  collected under.
- To revise driver wording or change the active set:
  1. Edit `src/drivers.js`. Bump `DRIVER_VERSION` (e.g. `0.3` → `0.4`).
  2. Update titles / add / remove drivers as needed.
  3. Deploy. The seed inserts the new `(driver_id, '0.4')` rows. Old `'0.3'`
     rows stay in place (their `active=1` flag plus the `version` filter in
     `/api/drivers` means only the current `DRIVER_VERSION` is shown to new
     respondents).
  4. Past responses still resolve to their original driver wording via
     `(response_items.driver_id, response_items.driver_version)`.

If you need to make a driver invisible without bumping the version, set its
`active` flag to `0` directly in the DB. This will hide it from `/api/drivers`
but preserve responses that referenced it.

## Google companion systems

The brief established Google Sheets and Google Form companion artefacts. They
are **not** used as the primary store — both as a fallback and because the
available Google-Form connector can only create text questions (no native 1–5
rating grids). Use them for transparency / archival only.

- **Google Sheet**: `WWF-IT-Pathway-2030 Survey Database`
  - ID `1Q16Ze2jAO-9iL0Ev7kLEtVV36o58RY5h8YZigv3HsIU`
  - URL <https://docs.google.com/spreadsheets/d/1Q16Ze2jAO-9iL0Ev7kLEtVV36o58RY5h8YZigv3HsIU/edit>
  - Tabs: `Drivers`, `Responses`, `ResponseItems`, `DriverSummary`.
  - To sync, export from `/api/admin/export.csv` and paste into the relevant tab.
- **Google Form companion** (text-only, fallback):
  - ID `1-zmj-nszsGkmzGJqkXz1tejnuHXNQJA-Lz3gMDEInEc`
  - Responder URL <https://docs.google.com/forms/d/e/1FAIpQLScKlfmtpEiU2jgzsrpsjHeX8Ll4aUVhlDxhpbflUB8Jv8jX2w/viewform>

## API surface

| Method | Path | Notes |
| --- | --- | --- |
| GET  | `/api/health` | Health + current driver version. |
| GET  | `/api/drivers` | Active drivers for current `DRIVER_VERSION`. |
| POST | `/api/responses` | Submit a response with `respondent_group` (**required**, `400` if missing), optional `client_id` (same-device guard, `409` if already used), and items `[{driver_id, importance_score, uncertainty_score, driver_comment}]`. |
| GET  | `/api/driver-summary` | Aggregate (n, avg, stddev, importance × uncertainty) per driver. **Token-protected** (results data). |
| GET  | `/api/matrix` | Raw `(driver_id, importance, uncertainty)` points for the 2D matrix. **Token-protected** (results data). |
| GET  | `/api/admin/responses` | Admin: all responses + items (JSON). **Token-protected.** |
| DELETE | `/api/admin/responses/:responseId` | Admin: delete one response and its items by `response_id` (for removing test/erroneous submissions). Returns `404` if not found. All other data is preserved. **Token-protected.** |
| GET  | `/api/admin/export.csv` | Admin: flat CSV (one row per response × item). **Token-protected.** |

All endpoints above require a valid `ADMIN_TOKEN` (sent as `X-Admin-Token`
header or `?token=` query param). They fail closed: with no `ADMIN_TOKEN`
configured they return `503` and expose nothing.

### Admin token handling (and the 401 troubleshooting note)

The server **trims** the configured `ADMIN_TOKEN` and the provided credential
before comparing them (constant-time). This matters because env-var UIs such as
Railway frequently keep a trailing newline or space when a value is pasted; an
untrimmed compare would then fail the length check and return `401` even though
the correct password was set. If you ever see a `401` with the right password,
re-check for stray whitespace in the env var — but the trim now handles it.

The credential is accepted via the `X-Admin-Token` header, the `?token=` query
param, or a `token` body field, consistently.

**Ampersand caveat for the current password (`WWF&I`):** when passing the token
in a URL query string by hand, the `&` must be percent-encoded as `%26`
(`?token=WWF%26I`), otherwise the browser treats `&I` as a separate query
parameter and only `WWF` reaches the server (→ `401`). The admin UI already
`encodeURIComponent()`s the token for its CSV download link, so this only affects
hand-built URLs. The `X-Admin-Token` header path needs no encoding.

## Driver-version history

| Version | Change |
| --- | --- |
| `0.3` | Initial 25-driver set with empty `short_definition`. |
| `0.3.1` | Adds Italian respondent-facing `short_definition` for every driver. |
| `0.4.0` (current) | Survey-ready edition from the v0.4 Driver Register. Italian `title` (survey formulation) + Italian `short_definition` (extended pedagogical definition); `title_en` keeps the English reference label. Active set still 25 drivers, but D14/D35/D41 dropped and D15/D20/D38 added; the 22 retained drivers were re-worded. |

> **Scale change (UI/validation, not a driver-set bump):** the rating scale moved
> from academic 1–5 labels to a pedagogical **1–4** scale with plain-language
> descriptions tied to 2030 (see the questions at the top of this README). The
> driver set is unchanged, so `DRIVER_VERSION` stays `0.4.0`. The server now
> validates new scores to 1–4; existing 1–5 responses are untouched and remain
> joinable by their stored `driver_version`. The admin importance × uncertainty
> matrix axes were updated to 1–4 accordingly.

All versions remain present in the `drivers` table after each bump — only the
current `DRIVER_VERSION` is served to new respondents, and any responses
collected against an earlier version keep their original `driver_version` and
remain joinable to the wording they were collected under.

## Limitations / known gaps

- No respondent authentication (yet) for the public survey page itself; the
  survey is shared as a closed link. Results and admin views are gated by
  `ADMIN_TOKEN`, which must be set before launch (the API fails closed without it).
- Stddev is computed in JS so the SQL stays portable across Postgres / SQLite;
  on very large datasets, swap to native `STDDEV_POP` in Postgres.
- **Same-device anti-duplication is pragmatic, not authentication.** After a
  successful submission the browser stores a flag (`wwf_n2030_submitted`) and a
  stable client id (`wwf_n2030_client_id`) in `localStorage`; the id is also
  persisted on the response (`survey_responses.client_id`). Repeat access from
  the same browser shows the "già inviato" screen, and the server rejects a
  second submission carrying a known `client_id` with `409`. This blocks the
  common same-person/same-device double submit only — it does **not** stop a
  user who clears storage, uses private browsing, or switches device/browser.
  When `localStorage` is unavailable (private mode) the client id is `null` and
  the guard falls back to the local flag only.
  **Admin deletion does not reset the client flag:** if an admin deletes a test
  response via `DELETE /api/admin/responses/:responseId`, the browser that
  submitted it stays blocked (its `localStorage` flag persists, and the only
  way to let that browser re-submit is to clear its site storage). There is no
  admin "reset client" workflow.

## Scenario architecture (scn-2030-draft-2)

`src/scenarios.js` defines the four 2030 scenarios and the two-axis frame used
in the scenario-feedback page. As of `SCENARIO_VERSION = 'scn-2030-draft-2'`:

- **Axis 1:** *Legittimazione pubblica e praticabilità politica della
  transizione ecologica*
- **Axis 2:** *Attuazione effettiva della tutela e del ripristino della natura*
- **Scenario titles (IT / EN):**
  1. Promessa incompiuta / *Implementation Gap*
  2. Il patto dei territori viventi / *The Living Territories Pact*
  3. La transizione che divide / *The Contested Transition*
  4. Disillusione ecologica / *Age of Ecological Disillusion*

Scenario descriptions are **external, plausible 2030 contexts only** — they
contain no WWF strategic recommendations or positioning. A single
cross-scenario question (`CROSS_SCENARIO_QUESTION`) is exported and surfaced via
`GET /api/scenarios` as `cross_scenario_question`.

Note: the *driver-survey foresight matrix* axes (Incertezza / Importanza) are a
separate construct and are intentionally **unchanged**.

### Additive migration: `scenario_feedback.cross_scenario`

The cross-scenario answer is stored in a new nullable `cross_scenario TEXT`
column on `scenario_feedback`. The migration is **purely additive and
idempotent** — no data is touched, reset, or migrated destructively:

- **Postgres:** `CREATE TABLE` includes the column, plus
  `ALTER TABLE scenario_feedback ADD COLUMN IF NOT EXISTS cross_scenario TEXT;`
- **SQLite:** `CREATE TABLE` includes the column; on existing DBs an
  `ALTER TABLE ... ADD COLUMN cross_scenario TEXT` runs in `init()` and swallows
  the "duplicate column" error so re-runs are safe.

The column flows through `POST /api/scenario-feedback`, the admin feedback
read endpoint, and the CSV/JSON exports.
