// Preselected drivers v0.5 — WWF Italia: Sistema Natura 2030.
//
// driver_id values are stable across versions. Wording updates bump
// DRIVER_VERSION and seed NEW (driver_id, version) rows rather than mutating
// existing ones, so historical responses stay joinable to the wording they
// were collected under.
//
// v0.5 (this version): survey-ready edition from the v0.5 Driver Register.
//   Respondent-facing `title` and `short_definition` are Italian: `title` is
//   the survey formulation and `short_definition` is the extended pedagogical
//   definition aimed at a broad audience. `title_en` keeps an English
//   formulation as a canonical reference label (not persisted; the drivers
//   table is unchanged). short_label is a compact Italian display label used by
//   the admin matrix/legend (also not persisted).
//   Active set: 24 drivers. Versus v0.4.0: removed D06 and D10 from the active
//   survey; added D48; re-worded retained drivers.
//   Historical responses may still reference D06/D10 (or other archived IDs);
//   results/admin views remain robust because driver-summary and the matrix
//   join only the active, current-version drivers, and the raw response list
//   shows stored driver_id values as-is.
// v0.4.0: 25-driver set; removed D14, D35, D41; added D15, D20, D38.
// v0.3.1: 25-driver set with English titles + Italian short_definition.
// v0.3:   initial 25-driver set with empty short_definition.
const DRIVER_VERSION = '0.5';

const DRIVERS = [
  {
    driver_id: 'D01',
    title: 'Mediterraneo come hotspot climatico',
    short_label: 'Hotspot climatico Mediterraneo',
    title_en: 'Mediterranean climate hotspot amplification',
    category: 'Climate',
    geography_lens: 'Italy primary + Mediterranean/global pressure layer',
    order_index: 1,
    short_definition:
      'L’Italia si trova in una regione dove riscaldamento atmosferico e marino, eventi estremi, siccità, incendi, innalzamento del livello del mare, erosione costiera e crescente esposizione delle aree costiere aumentano più rapidamente o con effetti più intensi della media globale. Questo amplifica le pressioni su biodiversità, risorse idriche, ecosistemi marini e terrestri, agricoltura e territori, rendendo il clima una condizione trasversale per molte scelte future su natura e sviluppo.',
  },
  {
    driver_id: 'D02',
    title: 'Scarsità idrica e stress idrologico',
    short_label: 'Scarsità idrica',
    title_en: 'Water scarcity, drought and hydrological stress',
    category: 'Water',
    geography_lens: 'Italy primary',
    order_index: 2,
    short_definition:
      'Precipitazioni più irregolari, periodi di siccità più prolungati, maggiore evaporazione e maggiore competizione tra usi rendono l’acqua meno disponibile e più contesa. Questo può compromettere ecosistemi d’acqua dolce, agricoltura, foreste, energia, zone umide e gestione del territorio, aumentando i conflitti tra bisogni ecologici, economici e sociali.',
  },
  {
    driver_id: 'D04',
    title: 'Rischio incendi e vulnerabilità delle foreste',
    short_label: 'Incendi e foreste',
    title_en: 'Wildfire risk and forest vulnerability',
    category: 'Land use',
    geography_lens: 'Italy primary',
    order_index: 3,
    short_definition:
      'Temperature più alte, siccità prolungata e territori più fragili aumentano il rischio di incendi e riducono la resilienza delle foreste. Questo può minacciare biodiversità, aree protette, suoli, capacità di assorbire carbonio, sicurezza delle comunità locali e continuità degli ecosistemi forestali.',
  },
  {
    driver_id: 'D07',
    title: 'Riscaldamento del mare e cambiamento degli ecosistemi marini',
    short_label: 'Mare caldo, ecosistemi in cambiamento',
    title_en: 'Marine warming and Mediterranean ecosystem change',
    category: 'Marine',
    geography_lens: 'Italy primary + Mediterranean/global pressure layer',
    order_index: 4,
    short_definition:
      'Il riscaldamento del mare e le ondate di calore marine stanno modificando distribuzione delle specie, aree di riproduzione, reti alimentari e diffusione di specie termofile e non indigene nel Mediterraneo, riorganizzando ecosistemi e alterando equilibri ecologici. Le conseguenze riguardano la conservazione e il monitoraggio della biodiversità, ma anche la gestione delle attività umane, in particolare la pesca, che dovrà adattarsi a cambiamenti nella disponibilità degli stock e nello stato degli habitat chiave.',
  },
  {
    driver_id: 'D09',
    title: 'Distanza tra obiettivo 30x30 e protezione effettiva',
    short_label: 'Gap 30x30',
    title_en: '30x30, OECM and strict-protection implementation gap',
    category: 'Governance',
    geography_lens: 'Italy primary + EU policy dependency',
    order_index: 5,
    short_definition:
      'L’Italia dovrà avanzare verso l’obiettivo di proteggere efficacemente il 30% di terra e mare. La sfida non sarà solo designare nuove aree, ma garantire protezione reale, tutela dei valori di biodiversità più significativi, OECM credibili, protezione stretta dove necessaria, gestione efficace e monitoraggio adeguato. La distanza tra target formali e risultati effettivi può cambiare profondamente il futuro della conservazione.',
  },
  {
    driver_id: 'D11',
    title: 'Ambizione e attuazione del Piano di Ripristino della Natura',
    short_label: 'Ripristino della natura',
    title_en: 'Nature Restoration Plan ambition gap',
    category: 'Governance',
    geography_lens: 'Italy primary + EU policy dependency',
    order_index: 6,
    short_definition:
      'L’Italia dovrà tradurre il quadro europeo sul ripristino della natura in un piano nazionale concreto. Il risultato dipenderà da ambizione politica, risorse, capacità amministrativa, coordinamento tra livelli istituzionali e volontà di trasformare il piano in azioni reali sul territorio.',
  },
  {
    driver_id: 'D12',
    title: 'Stato critico di habitat, specie ed ecosistemi',
    short_label: 'Habitat in stato critico',
    title_en: 'Unfavourable habitat, species and ecosystem conservation status',
    category: 'Land use',
    geography_lens: 'Italy primary + EU policy dependency',
    order_index: 7,
    short_definition:
      'Molti habitat, specie ed ecosistemi italiani restano in condizioni sfavorevoli o vulnerabili. Questa situazione di partenza aumenta l’urgenza di scegliere bene dove concentrare protezione, ripristino, monitoraggio e gestione ecologica, soprattutto quando risorse e capacità operative sono limitate.',
  },
  {
    driver_id: 'D13',
    title: 'Consumo di suolo e pressione infrastrutturale',
    short_label: 'Consumo di suolo',
    title_en: 'Land consumption, soil degradation and infrastructure pressure',
    category: 'Land use',
    geography_lens: 'Italy primary + EU policy dependency',
    order_index: 8,
    short_definition:
      'Urbanizzazione, infrastrutture, impermeabilizzazione del suolo, perdita di sostanza organica e desertificazione frammentano gli habitat e riducono la resilienza dei territori. Il suolo diventa una risorsa sempre più strategica per clima, acqua, biodiversità, agricoltura e sicurezza delle comunità.',
  },
  {
    driver_id: 'D15',
    title: 'Espansione delle specie aliene invasive',
    short_label: 'Specie aliene invasive',
    title_en: 'Invasive alien species expansion',
    category: 'Biodiversity',
    geography_lens: 'Italy primary + European/Mediterranean spread dynamics',
    order_index: 9,
    short_definition:
      'Le specie aliene invasive possono diffondersi più facilmente con cambiamento climatico, commercio, trasporti e degrado degli habitat. Possono alterare ecosistemi, competere con specie native, modificare equilibri ecologici e aumentare i costi di prevenzione, monitoraggio, gestione e controllo.',
  },
  {
    driver_id: 'D16',
    title: 'Inquinamento, contaminanti emergenti e pressione chimica',
    short_label: 'Inquinamento e contaminanti',
    title_en: 'Pollution, emerging contaminants and chemical pressure',
    category: 'Water',
    geography_lens: 'Italy primary + EU policy dependency',
    order_index: 10,
    short_definition:
      'Pesticidi, nutrienti, sostanze chimiche tossiche e contaminanti emergenti possono compromettere la qualità di acque, suoli ed ecosistemi, con impatti su filiere alimentari e salute. Queste sostanze possono accumularsi nell’ambiente e negli organismi e produrre effetti persistenti, diffusi e tardivi, difficili da gestire se monitoraggio e regolazione non tengono il passo.',
  },
  {
    driver_id: 'D17',
    title: 'Flussi di materiali, plastica ed economia circolare incompiuta',
    short_label: 'Materiali, plastica e circolarità',
    title_en: 'Material flows, plastic and incomplete circular economy',
    category: 'Marine',
    geography_lens: 'Italy primary + Mediterranean/global pressure layer',
    order_index: 11,
    short_definition:
      'Modelli di produzione e consumo ancora dipendenti da materiali usa-e-getta, imballaggi, plastica, filiere lineari e bassa circolarità alimentano rifiuti, microplastiche, nanoplastiche, consumo di risorse primarie ed emissioni lungo il ciclo di vita dei prodotti. Questa pressione collega ecosistemi terrestri e marini, fauna selvatica, sicurezza alimentare, imprese, cittadini e politiche industriali, e rende centrale la capacità del sistema di ridurre a monte l’uso di materiali e la produzione di rifiuti.',
  },
  {
    driver_id: 'D18',
    title: 'Transizione agroecologica e incentivi agricoli',
    short_label: 'Transizione agroecologica',
    title_en: 'Agroecology, CAP incentives and food-system transition gap',
    category: 'Food/Agriculture',
    geography_lens: 'Italy primary + EU policy dependency',
    order_index: 12,
    short_definition:
      'La transizione agroecologica dei sistemi agricoli e alimentari dipende da politiche pubbliche, PAC, mercati, filiere, costi di produzione, domanda dei consumatori, propensione al cambiamento degli agricoltori e gestione sostenibile delle risorse naturali. La direzione degli incentivi pubblici e privati può accelerare o frenare il passaggio verso pratiche agricole più compatibili con biodiversità, suolo, acqua e clima.',
  },
  {
    driver_id: 'D20',
    title: 'Modelli alimentari, spreco e limiti ecologici',
    short_label: 'Diete, spreco e limiti ecologici',
    title_en: 'Food patterns, waste and ecological limits',
    category: 'Food/Agriculture',
    geography_lens: 'Italy primary',
    order_index: 13,
    short_definition:
      'Cambiamenti nei modelli alimentari, maggiore consumo di proteine animali, spreco lungo le filiere e trasformazione della dieta mediterranea possono aumentare le pressioni sui limiti ecologici della biosfera. Gli impatti riguardano suolo, risorse idriche, biodiversità, ecosistemi marini e salute umana, rendendo i sistemi alimentari una forza strutturale nell’evoluzione del sistema natura.',
  },
  {
    driver_id: 'D21',
    title: 'Pressione su pesca, pesca ricreativa e filiere ittiche',
    short_label: 'Pressione sulla pesca',
    title_en: 'Fisheries pressure, recreational fishing and seafood supply-chain demand',
    category: 'Marine',
    geography_lens: 'Italy primary + Mediterranean/EU governance layer',
    order_index: 14,
    short_definition:
      'Anche se alcuni segnali indicano miglioramenti nella pesca mediterranea, sovrasfruttamento, catture accessorie, scarti, pesca ricreativa, domanda globale di prodotti ittici e controlli insufficienti continuano a pesare sulla biodiversità marina e sulle comunità costiere. Il driver include sia pressioni ecologiche dirette sia dinamiche di domanda, mercato e governance.',
  },
  {
    driver_id: 'D23',
    title: 'Pressioni cumulative della blue economy',
    short_label: 'Pressioni blue economy',
    title_en: 'Cumulative blue-economy and marine spatial planning pressure',
    category: 'Energy',
    geography_lens: 'Italy primary + EU policy dependency',
    order_index: 15,
    short_definition:
      'Sviluppo costiero, turismo, nautica, ancoraggi, pesca, acquacoltura, traffico marittimo ed energia offshore si sovrappongono nello spazio marino e costiero, aumentando la pressione su habitat sensibili come dune, praterie marine, coralligeno, habitat di profondità e specie vulnerabili. La sfida sarà gestire in modo integrato usi del mare, pianificazione spaziale marina e riduzione degli impatti cumulativi.',
  },
  {
    driver_id: 'D24',
    title: 'Transizione energetica e dipendenza dai combustibili fossili',
    short_label: 'Transizione energetica',
    title_en: 'Renewable energy deployment and fossil fuel dependence',
    category: 'Energy',
    geography_lens: 'Italy primary + EU policy dependency',
    order_index: 16,
    short_definition:
      'La transizione energetica italiana avanza, ma resta condizionata da dipendenza dal gas, ritardi autorizzativi, infrastrutture, opposizioni locali e scelte politiche. Il modo in cui verrà realizzata influenzerà clima, paesaggi, biodiversità, uso del suolo e consenso sociale.',
  },
  {
    driver_id: 'D28',
    title: 'Sussidi dannosi e incoerenza della finanza pubblica',
    short_label: 'Sussidi dannosi',
    title_en: 'Environmentally harmful subsidies and fiscal misalignment',
    category: 'Finance',
    geography_lens: 'Italy primary + EU policy dependency',
    order_index: 17,
    short_definition:
      'Una parte della finanza pubblica continua a sostenere attività dannose per ambiente, clima o biodiversità. Se tasse, incentivi e sussidi non sono coerenti con gli obiettivi ecologici, la transizione rischia di essere rallentata, contraddetta o resa meno credibile.',
  },
  {
    driver_id: 'D48',
    title: 'Dipendenza da filiere globali, commodity e materie prime critiche',
    short_label: 'Filiere globali e materie prime critiche',
    title_en: 'Dependence on global supply chains, commodities and critical raw materials',
    category: 'Finance',
    geography_lens: 'Italy primary + global supply-chain/trade layer',
    order_index: 18,
    short_definition:
      'L’Italia dipende da filiere globali per molte materie prime, prodotti agricoli, forestali e materiali critici, come soia, legname, cacao, caffè, olio di palma, carne bovina, pelle, terre rare e altri materiali strategici. Questa dipendenza collega consumi, imprese, finanza, transizione energetica e commercio internazionale a pressioni sugli ecosistemi anche fuori dal territorio nazionale. Entro il 2030, regole europee, crisi geopolitiche, prezzi, tracciabilità, disponibilità delle risorse e pressioni sui mercati potrebbero cambiare il modo in cui queste filiere vengono governate, controllate e percepite.',
  },
  {
    driver_id: 'D30',
    title: 'Attuazione debole, controlli insufficienti e interessi consolidati',
    short_label: 'Attuazione e controlli deboli',
    title_en: 'Institutional inertia, enforcement gap and vested interests',
    category: 'Governance',
    geography_lens: 'Italy primary',
    order_index: 19,
    short_definition:
      'Anche quando gli obiettivi ambientali sono chiari, frammentazione istituzionale, controlli deboli, illegalità ambientale, lentezza amministrativa e interessi consolidati possono ridurre l’efficacia delle politiche. Il problema è la distanza tra decisioni formali, capacità di esecuzione e risultati reali.',
  },
  {
    driver_id: 'D33',
    title: 'Distanza tra preoccupazione pubblica e cambiamento reale',
    short_label: 'Divario azione–consapevolezza',
    title_en: 'Public concern-action gap and lifestyle lock-in',
    category: 'Society',
    geography_lens: 'Italy primary',
    order_index: 20,
    short_definition:
      'Molte persone dichiarano preoccupazione per clima e natura, ma questo non si traduce automaticamente in comportamenti, comprensione delle politiche o pressione politica. Abitudini, costi, comodità, modelli di consumo e mancanza di alternative accessibili possono bloccare il cambiamento.',
  },
  {
    driver_id: 'D37',
    title: 'Contestazione politica della transizione ecologica',
    short_label: 'Contestazione della transizione',
    title_en: 'Deregulation, political backlash and transition contestation',
    category: 'Governance',
    geography_lens: 'Italy primary + EU political/regulatory layer',
    order_index: 21,
    short_definition:
      'Le politiche ambientali possono diventare più contestate, indebolite o semplificate sotto la pressione di interessi economici, costi sociali percepiti, cicli elettorali e narrative anti-regolazione. Questo può cambiare lo spazio politico disponibile per protezione della natura e transizione ecologica.',
  },
  {
    driver_id: 'D38',
    title: 'Educazione, competenze verdi e cambiamento culturale',
    short_label: 'Educazione e competenze verdi',
    title_en: 'Education, green competences and cultural transformation',
    category: 'Society',
    geography_lens: 'Italy primary',
    order_index: 22,
    short_definition:
      'Scuola, università, formazione professionale, competenze verdi e aspettative culturali possono cambiare il modo in cui cittadini, studenti, insegnanti e professionisti comprendono natura, rischio e transizione. Questo può influenzare il sostegno sociale alla protezione della natura e la capacità collettiva di immaginare scelte diverse.',
  },
  {
    driver_id: 'D42',
    title: 'Fiducia pubblica, legittimità e disuguaglianze ambientali',
    short_label: 'Fiducia e disuguaglianze',
    title_en: 'Public trust, legitimacy and environmental health inequalities',
    category: 'Society',
    geography_lens: 'Italy primary + European public-debate layer',
    order_index: 23,
    short_definition:
      'Il sostegno alle politiche ambientali può indebolirsi se clima e natura sono percepiti come temi elitari, punitivi o lontani dai bisogni locali. Fiducia nelle istituzioni, salute ambientale, disuguaglianze e distribuzione dei costi influenzeranno la legittimità della transizione.',
  },
  {
    driver_id: 'D43',
    title: 'Stabilità e accessibilità dei finanziamenti per la natura',
    short_label: 'Finanza per la natura',
    title_en: 'Volatility and competition in nature funding',
    category: 'Finance',
    geography_lens: 'Italy primary + EU finance/policy layer',
    order_index: 24,
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
