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
const SCENARIO_VERSION = 'scn-2030-draft-2';

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
      'Ampio sostegno sociale e reale capacità di attuazione si allineano, e ' +
      'l’Italia traduce i propri impegni per la natura in azione finanziata, ' +
      'controllata e radicata nei territori.',
    bullets: [
      'L’azione ecologica è ampiamente legittimata e vissuta come valore pubblico condiviso, non come identità politica contesa.',
      'L’Italia avanza con credibilità verso il 30% di terra e mare protetti, con piani di ripristino finanziati e verificati su obiettivi misurabili.',
      'Bilanci pubblici e un precoce riorientamento dei sussidi dannosi indirizzano finanza stabile verso natura, agroecologia e recupero costiero.',
      'Regioni, comuni e attori locali hanno capacità, dati e continuità per attuare: i territori diventano motori, non colli di bottiglia.',
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
      'L’Italia costruisce e finanzia la transizione con forza tecnocratica, ma ' +
      'senza ampio consenso — così il progresso arriva accompagnato dalla ' +
      'polarizzazione.',
    bullets: [
      'Rinnovabili, infrastrutture e ripristino vengono realizzati con rapidità grazie a finanziamenti, mandati e capacità amministrativa.',
      'L’azione ecologica è politicamente contesa e percepita da parte del pubblico come imposta, elitaria o anti-territoriale.',
      'L’attuazione si concentra dove Stato e mercati sono forti, acuendo le tensioni su suolo, coste, localizzazione energetica e uso dell’acqua.',
      'Gli obiettivi misurabili avanzano — copertura delle aree protette, quota rinnovabili — mentre licenza sociale e titolarità locale si erodono.',
      'La comunicazione raggiunge i già convinti; il «centro mobile» e i territori contesi si sentono agiti, non consultati.',
      'Cresce la reazione contro le regole di origine UE anche mentre vengono attuate, rendendo i risultati fragili e reversibili.',
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
      'Né consenso né capacità reggono: la natura scende nell’agenda, gli impegni ' +
      'vengono silenziosamente abbandonati e le tendenze pesanti corrono in gran ' +
      'parte non gestite.',
    bullets: [
      'L’azione ecologica perde legittimazione e priorità politica; l’ambiente diventa un cuneo divisivo o semplicemente svanisce dal dibattito.',
      'Gli impegni UE sono formalmente mantenuti ma svuotati, con ambizione di ripristino minima ed espansione delle aree protette in stallo.',
      'La finanza per la natura crolla di fronte a priorità concorrenti; i sussidi dannosi persistono e gli allarmi sul rischio ecosistemico restano inascoltati.',
      'Governance frammentata e regioni a corto di risorse non gestiscono i conflitti su terra, mare, acqua, cibo ed energia, che si intensificano.',
      'Clima, siccità, incendi e pressioni marine avanzano con scarso adattamento, aumentando il rischio per il capitale naturale e l’economia.',
      'Disimpegno civico e sfiducia verso le regole UE rafforzano l’inerzia, normalizzando il declino come uno status quo inavvertito.',
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
