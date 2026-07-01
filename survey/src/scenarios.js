// Scenario content for the public sense-check page — WWF Italia: Sistema Natura 2030.
//
// Wording (titles, axes, one-sentence summaries, bullets) is taken VERBATIM from
// the Italian draft scenario deck shared this morning with Luisa and Alessandra
// (wwf_four_scenarios_draft_deck_IT). This is a sense-check of those drafts; it
// does NOT reopen drivers or axes.
//
// SCENARIO_VERSION lets the backend tag every piece of feedback with the draft
// edition it was given on, so future revisions stay joinable to the wording the
// respondent actually saw (same versioning discipline as the driver survey).
// Bumped to draft-2 for the corrected scenario architecture (corrected axis
// labels + English public titles). Feedback rows store this version so any
// pre-existing draft-1 feedback stays joinable to the wording it was given on.
// Bumped to draft-3 to align the public essence/bullets with the corrected
// PowerPoint deck (revised wording for scenarios 2–4). Feedback rows store this
// version so earlier draft-1/draft-2 feedback stays joinable to its own wording.
const SCENARIO_VERSION = 'scn-2030-draft-3';

// The two critical-uncertainty axes that structure the 2x2. Corrected Italian
// labels from the revised scenario deck. Not reopened here — shown for context
// only. The quadrant logic is unchanged: axis1 = public legitimacy / political
// feasibility, axis2 = effective implementation of protection and restoration.
const AXES = {
  axis1: {
    key: 'legittimazione',
    label: 'Legittimazione pubblica e praticabilità politica della transizione ecologica',
    low: 'contestata · polarizzata · poca fiducia',
    high: 'legittimata · sostenuta · praticabile',
  },
  axis2: {
    key: 'capacita',
    label: 'Attuazione effettiva della tutela e del ripristino della natura',
    low: 'frammentata · sottofinanziata · in stallo',
    high: 'coerente · finanziata · ripristino e riduzione pressioni',
  },
};

// Four scenarios, keyed by a stable scenario_id (s1..s4). The IDs are stable and
// must never change: feedback rows store scenario_id so they stay joinable even
// if titles are later revised.
const SCENARIOS = [
  {
    scenario_id: 's1',
    number: 1,
    title: 'Promessa incompiuta',
    title_en: 'Implementation Gap',
    quadrant: 'Alta legittimazione · Bassa attuazione',
    axis_position: { legittimazione: 'ALTA', capacita: 'BASSA' },
    essence:
      'Gli italiani riconoscono che la natura conta, ma il sistema pubblico e ' +
      'territoriale non riesce a finanziare, organizzare e far rispettare la ' +
      'protezione che la società ormai si aspetta.',
    bullets: [
      'La preoccupazione per clima e natura è diffusa e largamente depoliticizzata; gli obiettivi ecologici godono di sostegno retorico trasversale.',
      'I quadri UE — 30x30, Regolamento Ripristino, condizionalità PAC — sono formalmente accolti e citati nelle istituzioni.',
      'La designazione supera l’attuazione: le aree protette esistono sulla carta, ma ripristino, monitoraggio e controllo restano poco finanziati.',
      'La finanza per la natura resta compressa tra bilanci ristretti e oltre 24 mld € di sussidi dannosi, discussi ma non riorientati.',
      'Regioni e comuni mancano di personale, dati e continuità per tradurre l’ambizione in esiti ecologici misurabili e in riduzione delle pressioni.',
      'Il divario marino 30x30 e l’arretrato del ripristino persistono nonostante il consenso, alimentando una sorda frustrazione per le promesse non mantenute.',
    ],
  },
  {
    scenario_id: 's2',
    number: 2,
    title: 'Il patto dei territori viventi',
    title_en: 'The Living Territories Pact',
    quadrant: 'Alta legittimazione · Alta attuazione',
    axis_position: { legittimazione: 'ALTA', capacita: 'ALTA' },
    essence:
      'Ampia legittimazione sociale e condizioni di attuazione selettive ma ' +
      'sufficienti si allineano, e l’Italia traduce parte dei propri impegni ' +
      'per la natura in azione finanziata, monitorata e radicata nei territori.',
    bullets: [
      'L’azione ecologica è ampiamente legittimata e vissuta come valore pubblico condiviso, non come identità politica contesa.',
      'L’Italia avanza in modo credibile verso il 30% di terra e mare protetti, con piani di ripristino finanziati e verificati dove le condizioni abilitanti sono presenti.',
      'Bilanci pubblici e un precoce riorientamento dei sussidi dannosi indirizzano finanza stabile verso natura, agroecologia e recupero costiero.',
      'Dove regioni, comuni e attori locali dispongono di dati e continuità, i territori diventano motori dell’attuazione anziché colli di bottiglia.',
      'I conflitti su energia, acqua, cibo e suolo si negoziano con la pianificazione territoriale, e le pressioni sugli ecosistemi calano in modo misurabile.',
      'Scienza e monitoraggio sorreggono le decisioni, dando alle politiche durata oltre i cicli elettorali.',
    ],
  },
  {
    scenario_id: 's3',
    number: 3,
    title: 'La transizione che divide',
    title_en: 'The Contested Transition',
    quadrant: 'Bassa legittimazione · Alta attuazione',
    axis_position: { legittimazione: 'BASSA', capacita: 'ALTA' },
    essence:
      'L’Italia riesce ad attuare parti importanti della transizione ecologica, ' +
      'soprattutto dove obblighi europei, investimenti e capacità territoriali si ' +
      'allineano, ma senza costruire un consenso sociale sufficientemente ampio: ' +
      'il progresso avanza, ma divide.',
    bullets: [
      'Rinnovabili e ripristino avanzano in modo selettivo, dove obblighi europei, investimenti e capacità territoriali si allineano.',
      'La pianificazione territoriale resta fragile: i progetti arrivano prima di una visione condivisa, generando conflitti locali.',
      'L’azione ecologica è percepita da parte del pubblico come distante, tecnica e calata dall’alto.',
      'Le rinnovabili diventano emblematiche: necessarie, ma fonte di conflitto dove mancano pianificazione e ascolto dei territori.',
      'La comunicazione raggiunge soprattutto chi è già convinto, mentre i territori contesi restano esposti a polarizzazione e disinformazione.',
      'I risultati sono reali ma fragili e reversibili in assenza di legittimazione sociale.',
    ],
  },
  {
    scenario_id: 's4',
    number: 4,
    title: 'Disillusione ecologica',
    title_en: 'Age of Ecological Disillusion',
    quadrant: 'Bassa legittimazione · Bassa attuazione',
    axis_position: { legittimazione: 'BASSA', capacita: 'BASSA' },
    essence:
      'Né il consenso sociale né la capacità di attuazione reggono: la natura ' +
      'perde centralità politica, gli impegni restano in parte formali e le ' +
      'pressioni ecologiche avanzano più rapidamente della capacità collettiva ' +
      'di risposta.',
    bullets: [
      'L’azione ecologica perde priorità e tende a diventare divisiva, scivolando ai margini del dibattito pubblico.',
      'Gli impegni europei vengono richiamati in modo formale, ma indeboliti nell’ambizione e nell’attuazione concreta.',
      'La finanza per la natura viene compressa, i sussidi dannosi persistono e gli allarmi sul rischio ecosistemico sono poco ascoltati.',
      'Governance frammentata e territori a corto di risorse faticano a gestire i conflitti su terra, mare, acqua, cibo ed energia.',
      'Clima, siccità, incendi e pressioni marine avanzano mentre la capacità di adattamento resta debole.',
      'L’inerzia istituzionale evita rotture brusche ma blocca la prevenzione; il disimpegno civico normalizza progressivamente il declino.',
    ],
  },
];

// Respondent categories: the same set used by the driver survey (current v0.5
// display names from the admin GROUP_ALIASES map), plus an explicit "Altro"
// option. Kept here so the public page and the API share one source of truth.
const RESPONDENT_GROUPS = [
  'WWF Italia Staff',
  'Consiglieri',
  'Delegati e volontari WWF',
  'Partner e stakeholder',
  'Comitato scientifico WWF e altri esperti',
  'Altro',
];

const VALID_SCENARIO_IDS = new Set(SCENARIOS.map((s) => s.scenario_id));

// One cross-scenario question, asked once (not per scenario). The answer is
// stored in scenario_feedback.cross_scenario on the general-comment submission,
// so it lands in the same table, logically separable from per-scenario fields.
const CROSS_SCENARIO_QUESTION =
  'Quale scenario le sembra più utile per mettere alla prova la strategia ' +
  '2027–2030 di WWF Italia, e perché?';

module.exports = {
  SCENARIO_VERSION,
  AXES,
  SCENARIOS,
  RESPONDENT_GROUPS,
  VALID_SCENARIO_IDS,
  CROSS_SCENARIO_QUESTION,
};
