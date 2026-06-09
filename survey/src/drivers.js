// Preselected drivers v0.4.0 — WWF Italia: Sistema Natura 2030.
//
// driver_id values are stable across versions. Wording updates bump
// DRIVER_VERSION and seed NEW (driver_id, version) rows rather than mutating
// existing ones, so historical responses stay joinable to the wording they
// were collected under.
//
// v0.4.0 (this version): survey-ready edition from the v0.4 Driver Register
//   ("Updated Survey List v0.4"). Respondent-facing `title` and
//   `short_definition` are Italian: `title` is the survey formulation and
//   `short_definition` is the extended pedagogical definition aimed at a broad
//   audience. `title_en` keeps the original English formulation as a canonical
//   reference label (not persisted; the drivers table is unchanged).
//   Active set: 25 drivers. Versus v0.3.1: removed D14, D35, D41; added
//   D15, D20, D38; the 22 retained drivers were re-worded.
// v0.3.1: 25-driver set with English titles + Italian short_definition.
// v0.3:   initial 25-driver set with empty short_definition.
const DRIVER_VERSION = '0.4.0';

const DRIVERS = [
  {
    driver_id: 'D01',
    title: 'Mediterraneo come hotspot climatico',
    title_en: 'Mediterranean climate hotspot amplification',
    category: 'Climate',
    geography_lens: 'Italy primary + Mediterranean/global pressure layer',
    order_index: 1,
    short_definition:
      'L’Italia si trova in una regione mediterranea dove caldo, siccità, incendi, riscaldamento del mare e rischi costieri crescono più rapidamente della media globale. Questo può amplificare molte pressioni su biodiversità, acqua, agricoltura, salute degli ecosistemi, coste e territori, rendendo il clima una condizione trasversale per quasi tutte le scelte future su natura e sviluppo.',
  },
  {
    driver_id: 'D02',
    title: 'Scarsità d’acqua e stress idrologico',
    title_en: 'Water scarcity, drought and hydrological stress',
    category: 'Water',
    geography_lens: 'Italy primary',
    order_index: 2,
    short_definition:
      'Piogge più irregolari, periodi secchi più lunghi, maggiore evaporazione e maggiore competizione tra usi rendono l’acqua meno disponibile e più contesa. Questo può trasformare ecosistemi d’acqua dolce, agricoltura, foreste, energia, zone umide e gestione del territorio, aumentando i conflitti tra bisogni ecologici, economici e sociali.',
  },
  {
    driver_id: 'D04',
    title: 'Rischio incendi e vulnerabilità delle foreste',
    title_en: 'Wildfire risk and forest vulnerability',
    category: 'Land use',
    geography_lens: 'Italy primary',
    order_index: 3,
    short_definition:
      'Temperature più alte, siccità prolungata e territori più fragili aumentano il rischio di incendi e riducono la resilienza delle foreste. Questo può minacciare biodiversità, aree protette, suoli, capacità di assorbire carbonio, sicurezza delle comunità locali e continuità degli ecosistemi forestali.',
  },
  {
    driver_id: 'D06',
    title: 'Vulnerabilità delle coste e degli habitat costieri',
    title_en: 'Sea-level rise, coastal exposure and coastal habitat vulnerability',
    category: 'Marine',
    geography_lens: 'Italy primary + Mediterranean/global pressure layer',
    order_index: 4,
    short_definition:
      'Innalzamento del mare, erosione, sviluppo costiero, turismo, nautica, ancoraggi e inquinamento aumentano la pressione su coste, dune, zone umide e praterie marine. La qualità degli habitat costieri dipenderà dalla capacità di gestire insieme rischi climatici, usi del territorio, usi del mare e tutela degli ecosistemi più sensibili.',
  },
  {
    driver_id: 'D07',
    title: 'Riscaldamento del mare e cambiamento delle specie marine',
    title_en: 'Marine warming, tropicalisation and species redistribution',
    category: 'Marine',
    geography_lens: 'Italy primary + Mediterranean/global pressure layer',
    order_index: 5,
    short_definition:
      'Il riscaldamento del mare e le ondate di calore marine stanno modificando distribuzione delle specie, aree di nidificazione, catene alimentari e presenza di specie tropicali nel Mediterraneo. Questo può cambiare rapidamente le priorità di conservazione marina, il monitoraggio delle specie e la gestione degli habitat più vulnerabili.',
  },
  {
    driver_id: 'D09',
    title: 'Distanza tra obiettivo 30x30 e protezione effettiva',
    title_en: '30x30, OECM and strict-protection implementation gap',
    category: 'Governance',
    geography_lens: 'Italy primary + EU policy dependency',
    order_index: 6,
    short_definition:
      'L’Italia dovrà avanzare verso l’obiettivo di proteggere efficacemente il 30% di terra e mare. La sfida non sarà solo aumentare le aree designate, ma garantire protezione reale, qualità ecologica, OECM credibili, protezione stretta dove necessaria, gestione effettiva e monitoraggio degli effetti.',
  },
  {
    driver_id: 'D10',
    title: 'Qualità reale delle aree protette',
    title_en: 'Protected-area quality, management effectiveness and ecological integrity deficit',
    category: 'Governance',
    geography_lens: 'Italy primary + EU/transboundary context',
    order_index: 7,
    short_definition:
      'Un’area protetta non produce automaticamente benefici per la natura se mancano gestione, risorse, controlli, connettività, qualità degli habitat e capacità di adattarsi ai cambiamenti climatici. La distanza tra protezione formale e protezione effettiva può diventare decisiva per la biodiversità italiana.',
  },
  {
    driver_id: 'D11',
    title: 'Ambizione e attuazione del Piano di Ripristino della Natura',
    title_en: 'Nature Restoration Plan ambition gap',
    category: 'Governance',
    geography_lens: 'Italy primary + EU policy dependency',
    order_index: 8,
    short_definition:
      'L’Italia dovrà tradurre il quadro europeo sul ripristino della natura in un piano nazionale concreto. Il risultato dipenderà da ambizione politica, risorse, capacità amministrativa, coordinamento tra livelli istituzionali e volontà di trasformare il piano in azioni reali sul territorio.',
  },
  {
    driver_id: 'D12',
    title: 'Stato critico di habitat, specie ed ecosistemi',
    title_en: 'Unfavourable habitat, species and ecosystem conservation status',
    category: 'Land use',
    geography_lens: 'Italy primary + EU policy dependency',
    order_index: 9,
    short_definition:
      'Molti habitat, specie ed ecosistemi italiani restano in condizioni sfavorevoli o vulnerabili. Questa situazione di partenza aumenta l’urgenza di scegliere bene dove concentrare protezione, ripristino, monitoraggio e gestione ecologica, soprattutto quando risorse e capacità operative sono limitate.',
  },
  {
    driver_id: 'D13',
    title: 'Consumo di suolo e pressione infrastrutturale',
    title_en: 'Land consumption, soil degradation and infrastructure pressure',
    category: 'Land use',
    geography_lens: 'Italy primary + EU policy dependency',
    order_index: 10,
    short_definition:
      'Urbanizzazione, infrastrutture, impermeabilizzazione del suolo, perdita di sostanza organica e desertificazione frammentano gli habitat e riducono la resilienza dei territori. Il suolo diventa una risorsa sempre più strategica per clima, acqua, biodiversità, agricoltura e sicurezza delle comunità.',
  },
  {
    driver_id: 'D15',
    title: 'Espansione delle specie aliene invasive',
    title_en: 'Invasive alien species expansion',
    category: 'Biodiversity',
    geography_lens: 'Italy primary + European/Mediterranean spread dynamics',
    order_index: 11,
    short_definition:
      'Le specie aliene invasive possono diffondersi più facilmente con cambiamento climatico, commercio, trasporti e degrado degli habitat. Possono alterare ecosistemi, competere con specie native, modificare equilibri ecologici e aumentare i costi di prevenzione, monitoraggio, gestione e controllo.',
  },
  {
    driver_id: 'D16',
    title: 'Inquinamento delle acque e contaminanti emergenti',
    title_en: 'Water, chemical and emerging contaminant pollution',
    category: 'Water',
    geography_lens: 'Italy primary + EU policy dependency',
    order_index: 12,
    short_definition:
      'Pesticidi, sostanze chimiche, eutrofizzazione e contaminanti emergenti possono compromettere acqua, suoli, ecosistemi, filiere alimentari e salute. Alcuni effetti sono diffusi, lenti da rilevare e difficili da correggere una volta accumulati, soprattutto quando monitoraggio e regolazione non tengono il passo.',
  },
  {
    driver_id: 'D17',
    title: 'Dipendenza dalla plastica e inquinamento diffuso',
    title_en: 'Plastic-intensive systems and diffuse plastic pollution',
    category: 'Marine',
    geography_lens: 'Italy primary + Mediterranean/global pressure layer',
    order_index: 13,
    short_definition:
      'Prodotti, imballaggi e filiere ad alta intensità di plastica alimentano rifiuti, microplastiche, nanoplastiche e attrezzi da pesca dispersi. Questa pressione collega mare, terra, cibo, salute e modelli di consumo, e richiede di guardare sia ai rifiuti visibili sia alle dipendenze strutturali a monte.',
  },
  {
    driver_id: 'D18',
    title: 'Transizione agroecologica e incentivi agricoli',
    title_en: 'Agroecology, CAP incentives and food-system transition gap',
    category: 'Food/Agriculture',
    geography_lens: 'Italy primary + EU policy dependency',
    order_index: 14,
    short_definition:
      'La transizione verso pratiche agricole più ecologiche dipende da politiche pubbliche, PAC, mercati, filiere, costi, domanda dei consumatori e capacità degli agricoltori di cambiare. Anche dove biologico e agroecologia crescono, il cambiamento può restare limitato se gli incentivi del sistema non sono coerenti.',
  },
  {
    driver_id: 'D20',
    title: 'Domanda alimentare, diete e limiti ecologici',
    title_en: 'Food demand, diets and ecological limits',
    category: 'Food/Agriculture',
    geography_lens: 'Italy primary',
    order_index: 15,
    short_definition:
      'Cambiamenti nei consumi alimentari, spreco, domanda di proteine, trasformazione della dieta mediterranea e pressione sulle filiere possono aumentare l’impatto su suolo, acqua, mare e biodiversità. Il modo in cui si produce, distribuisce e consuma cibo resta una forza centrale del sistema natura.',
  },
  {
    driver_id: 'D21',
    title: 'Pressione su pesca, pesca ricreativa e filiere ittiche',
    title_en: 'Fisheries pressure, recreational fishing and seafood supply-chain demand',
    category: 'Marine',
    geography_lens: 'Italy primary + Mediterranean/EU governance layer',
    order_index: 16,
    short_definition:
      'Anche se alcuni segnali indicano miglioramenti nella pesca mediterranea, sovrasfruttamento, catture accessorie, scarti, pesca ricreativa, domanda globale di prodotti ittici e controlli insufficienti continuano a pesare sulla biodiversità marina e sulle comunità costiere. Il driver include sia pressioni ecologiche dirette sia dinamiche di domanda, mercato e governance.',
  },
  {
    driver_id: 'D23',
    title: 'Pressioni cumulative della blue economy',
    title_en: 'Cumulative blue-economy and marine spatial planning pressure',
    category: 'Energy',
    geography_lens: 'Italy primary + EU policy dependency',
    order_index: 17,
    short_definition:
      'Pesca, acquacoltura, traffico marittimo, energia offshore, turismo, nautica e altri usi del mare si sovrappongono sempre di più. La sfida sarà organizzare questi usi senza compromettere ecosistemi marini, coste, habitat sensibili e capacità pubblica di pianificazione spaziale marina.',
  },
  {
    driver_id: 'D24',
    title: 'Transizione energetica e dipendenza dai combustibili fossili',
    title_en: 'Renewable energy deployment and fossil fuel dependence',
    category: 'Energy',
    geography_lens: 'Italy primary + EU policy dependency',
    order_index: 18,
    short_definition:
      'La transizione energetica italiana avanza, ma resta condizionata da dipendenza dal gas, ritardi autorizzativi, infrastrutture, opposizioni locali e scelte politiche. Il modo in cui verrà realizzata influenzerà clima, paesaggi, biodiversità, uso del suolo e consenso sociale.',
  },
  {
    driver_id: 'D28',
    title: 'Sussidi dannosi e incoerenza della finanza pubblica',
    title_en: 'Environmentally harmful subsidies and fiscal misalignment',
    category: 'Finance',
    geography_lens: 'Italy primary + EU policy dependency',
    order_index: 19,
    short_definition:
      'Una parte della finanza pubblica continua a sostenere attività dannose per ambiente, clima o biodiversità. Se tasse, incentivi e sussidi non sono coerenti con gli obiettivi ecologici, la transizione rischia di essere rallentata, contraddetta o resa meno credibile.',
  },
  {
    driver_id: 'D30',
    title: 'Attuazione debole, controlli insufficienti e interessi consolidati',
    title_en: 'Institutional inertia, enforcement gap and vested interests',
    category: 'Governance',
    geography_lens: 'Italy primary',
    order_index: 20,
    short_definition:
      'Anche quando gli obiettivi ambientali sono chiari, frammentazione istituzionale, controlli deboli, illegalità ambientale, lentezza amministrativa e interessi consolidati possono ridurre l’efficacia delle politiche. Il problema è la distanza tra decisioni formali, capacità di esecuzione e risultati reali.',
  },
  {
    driver_id: 'D33',
    title: 'Distanza tra preoccupazione pubblica e cambiamento reale',
    title_en: 'Public concern-action gap and lifestyle lock-in',
    category: 'Society',
    geography_lens: 'Italy primary',
    order_index: 21,
    short_definition:
      'Molte persone dichiarano preoccupazione per clima e natura, ma questo non si traduce automaticamente in comportamenti, comprensione delle politiche o pressione politica. Abitudini, costi, comodità, modelli di consumo e mancanza di alternative accessibili possono bloccare il cambiamento.',
  },
  {
    driver_id: 'D37',
    title: 'Contestazione politica della transizione ecologica',
    title_en: 'Deregulation, political backlash and transition contestation',
    category: 'Governance',
    geography_lens: 'Italy primary + EU political/regulatory layer',
    order_index: 22,
    short_definition:
      'Le politiche ambientali possono diventare più contestate, indebolite o semplificate sotto la pressione di interessi economici, costi sociali percepiti, cicli elettorali e narrative anti-regolazione. Questo può cambiare lo spazio politico disponibile per protezione della natura e transizione ecologica.',
  },
  {
    driver_id: 'D38',
    title: 'Educazione, competenze verdi e cambiamento culturale',
    title_en: 'Education, green competences and cultural transformation',
    category: 'Society',
    geography_lens: 'Italy primary',
    order_index: 23,
    short_definition:
      'Scuola, università, formazione professionale, competenze verdi e aspettative culturali possono cambiare il modo in cui cittadini, studenti, insegnanti e professionisti comprendono natura, rischio e transizione. Questo può influenzare il sostegno sociale alla protezione della natura e la capacità collettiva di immaginare scelte diverse.',
  },
  {
    driver_id: 'D42',
    title: 'Fiducia pubblica, legittimità e disuguaglianze ambientali',
    title_en: 'Public trust, legitimacy and environmental health inequalities',
    category: 'Society',
    geography_lens: 'Italy primary + European public-debate layer',
    order_index: 24,
    short_definition:
      'Il sostegno alle politiche ambientali può indebolirsi se clima e natura sono percepiti come temi elitari, punitivi o lontani dai bisogni locali. Fiducia nelle istituzioni, salute ambientale, disuguaglianze e distribuzione dei costi influenzeranno la legittimità della transizione.',
  },
  {
    driver_id: 'D43',
    title: 'Stabilità e accessibilità dei finanziamenti per la natura',
    title_en: 'Volatility and competition in nature funding',
    category: 'Finance',
    geography_lens: 'Italy primary + EU finance/policy layer',
    order_index: 25,
    short_definition:
      'I bisogni di investimento per natura, ripristino e adattamento crescono, ma i finanziamenti possono restare instabili, competitivi, burocratici, condizionati o legati a priorità politiche mutevoli. Questo può influenzare continuità, scala, qualità e accessibilità degli interventi.',
  },
].map((d) => ({
  ...d,
  version: DRIVER_VERSION,
  status: 'active',
  active: 1,
}));

module.exports = { DRIVERS, DRIVER_VERSION };
