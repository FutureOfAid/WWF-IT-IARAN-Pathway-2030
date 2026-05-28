# WWF-IT-Pathway-2030 — Survey

Survey app for the **WWF Italia: Sistema Natura 2030** foresight process. Respondents
rate a pre-selected list of external drivers on two 1–5 scales (importance and
uncertainty) plus optional free-text comments. The app is **not** a strategy-
selection tool; it feeds the scenario construction stage.

## What's in this folder

- `src/server.js` — Express API + static hosting.
- `src/db.js` — Database abstraction. PostgreSQL when `DATABASE_URL` is set
  (Railway), SQLite locally (`db/survey.sqlite`).
- `src/drivers.js` — Preselected driver set v0.3 (25 drivers from the brief).
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
| `ADMIN_TOKEN` | Optional. If set, `/api/admin/*` endpoints require `?token=…` or `X-Admin-Token` header. If unset, admin is open (acceptable for early closed-link pilots, otherwise set it). |
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
   `response_items` if missing and inserts the v0.3 driver set.

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
| POST | `/api/responses` | Submit a response with items `[{driver_id, importance_score, uncertainty_score, driver_comment}]`. |
| GET  | `/api/driver-summary` | Aggregate (n, avg, stddev, importance × uncertainty) per driver. Public — aggregate only, no PII. |
| GET  | `/api/matrix` | Raw `(driver_id, importance, uncertainty)` points for the 2D matrix. |
| GET  | `/api/admin/responses` | Admin: all responses + items (JSON). Token-protected if `ADMIN_TOKEN` set. |
| GET  | `/api/admin/export.csv` | Admin: flat CSV (one row per response × item). |

## Limitations / known gaps

- No respondent authentication (yet). The brief allows this for now; add
  `ADMIN_TOKEN` at minimum before sharing the admin link.
- Driver `short_definition` is blank in the seed — fill in via the Google Sheet
  or a follow-up edit to `src/drivers.js` (will require a `DRIVER_VERSION` bump
  if the change is substantive).
- Stddev is computed in JS so the SQL stays portable across Postgres / SQLite;
  on very large datasets, swap to native `STDDEV_POP` in Postgres.
