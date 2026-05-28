// Preselected drivers v0.3.1 — WWF Italia: Sistema Natura 2030.
// driver_id values are stable. Wording updates bump driver_version rather
// than mutating existing rows, so historical responses stay joinable.
//
// v0.3.1 (this version): adds Italian respondent-facing short_definition for
//   each driver. English title kept as the canonical reference label.
// v0.3:   initial 25-driver set with empty short_definition.
const DRIVER_VERSION = '0.3.1';

const DRIVERS = [
  {
    driver_id: 'D01',
    title: 'Mediterranean climate hotspot amplification',
    category: 'Climate',
    geography_lens: 'Italy/Mediterranean',
    order_index: 1,
    short_definition:
      'Il Mediterraneo si riscalda a un ritmo circa 20% più rapido della media globale. Conseguenze: ondate di calore terrestri e marine più intense, alterazione di precipitazioni e stagionalità, pressione cumulativa su ecosistemi e specie già al limite climatico.',
  },
  {
    driver_id: 'D02',
    title: 'Water scarcity, drought and hydrological stress',
    category: 'Climate',
    geography_lens: 'Italy',
    order_index: 2,
    short_definition:
      'Riduzione strutturale della disponibilità idrica in Italia: siccità prolungate, abbassamento delle falde, riduzione delle portate fluviali, conflitti d\'uso fra agricoltura, ecosistemi, energia e usi civili.',
  },
  {
    driver_id: 'D04',
    title: 'Wildfire risk and forest vulnerability',
    category: 'Climate',
    geography_lens: 'Italy',
    order_index: 3,
    short_definition:
      'Aumento di frequenza, intensità e durata degli incendi boschivi in un patrimonio forestale reso più vulnerabile da clima, abbandono colturale e accumulo di biomassa secca, con impatti su biodiversità, carbonio e popolazioni locali.',
  },
  {
    driver_id: 'D06',
    title: 'Sea-level rise and coastal exposure',
    category: 'Climate',
    geography_lens: 'Italy/Coast',
    order_index: 4,
    short_definition:
      'Innalzamento del livello del mare e maggiore frequenza di eventi estremi costieri: erosione, ingressione salina, perdita di habitat di transizione (lagune, zone umide, dune) e crescente esposizione di infrastrutture e insediamenti.',
  },
  {
    driver_id: 'D07',
    title: 'Marine warming and species redistribution',
    category: 'Climate',
    geography_lens: 'Mediterranean',
    order_index: 5,
    short_definition:
      'Riscaldamento delle acque mediterranee, mortalità di massa di specie sessili (es. gorgonie, posidonia) e tropicalizzazione: ingresso e affermazione di specie aliene termofile che riconfigurano comunità e reti trofiche.',
  },
  {
    driver_id: 'D09',
    title: '30x30 protected area implementation gap',
    category: 'Policy',
    geography_lens: 'Italy/EU',
    order_index: 6,
    short_definition:
      'Distanza fra l\'impegno UE-globale a proteggere il 30% di terra e mare entro il 2030 (di cui 10% in protezione rigorosa) e la copertura, qualità e rappresentatività effettive in Italia.',
  },
  {
    driver_id: 'D10',
    title: 'Protected area management effectiveness deficit',
    category: 'Policy',
    geography_lens: 'Italy',
    order_index: 7,
    short_definition:
      'Aree protette esistenti ma con piani di gestione assenti, obsoleti o sottofinanziati, sorveglianza limitata e indicatori di efficacia non monitorati: "parchi sulla carta" che non garantiscono conservazione reale.',
  },
  {
    driver_id: 'D11',
    title: 'Nature Restoration Plan ambition gap',
    category: 'Policy',
    geography_lens: 'Italy/EU',
    order_index: 8,
    short_definition:
      'Rischio che il Piano nazionale di ripristino della natura previsto dal Regolamento UE sia poco ambizioso, scarsamente finanziato o lento nell\'attuazione rispetto agli obiettivi vincolanti su habitat, fiumi, suoli e impollinatori.',
  },
  {
    driver_id: 'D12',
    title: 'Unfavourable habitat and ecosystem conservation status',
    category: 'Biodiversity',
    geography_lens: 'Italy',
    order_index: 9,
    short_definition:
      'Stato di conservazione sfavorevole o in peggioramento per una quota elevata di habitat e specie italiane di interesse comunitario (Direttive Habitat e Uccelli), con trend negativi consolidati nei reporting nazionali.',
  },
  {
    driver_id: 'D13',
    title: 'Soil sealing and land consumption',
    category: 'Land use',
    geography_lens: 'Italy',
    order_index: 10,
    short_definition:
      'Consumo di suolo e impermeabilizzazione che procedono a ritmi elevati in Italia, riducendo terreni agricoli, aree naturali, servizi ecosistemici (acqua, carbonio, raffrescamento) e amplificando il rischio idrogeologico.',
  },
  {
    driver_id: 'D14',
    title: 'Habitat fragmentation and ecological connectivity deficit',
    category: 'Biodiversity',
    geography_lens: 'Italy',
    order_index: 11,
    short_definition:
      'Frammentazione del territorio da infrastrutture, urbanizzazione e agricoltura intensiva, con perdita di corridoi ecologici terrestri e fluviali e isolamento delle popolazioni animali e vegetali.',
  },
  {
    driver_id: 'D16',
    title: 'Water pollution and pesticide pressure',
    category: 'Pollution',
    geography_lens: 'Italy',
    order_index: 12,
    short_definition:
      'Pressione chimica diffusa su acque superficiali e sotterranee da nutrienti, pesticidi, farmaci e contaminanti emergenti, che compromette stato ecologico, salute pubblica e obiettivi della Direttiva Acque.',
  },
  {
    driver_id: 'D17',
    title: 'Marine litter, plastic pollution and ghost gear',
    category: 'Pollution',
    geography_lens: 'Mediterranean',
    order_index: 13,
    short_definition:
      'Rifiuti marini, plastiche, microplastiche e attrezzi da pesca abbandonati ("reti fantasma") che impattano fauna marina, coste e attività economiche; il Mediterraneo è fra i mari più inquinati al mondo.',
  },
  {
    driver_id: 'D18',
    title: 'Agroecology and organic transition gap',
    category: 'Food/Agriculture',
    geography_lens: 'Italy/EU',
    order_index: 14,
    short_definition:
      'Lentezza nella transizione verso pratiche agroecologiche e biologiche: ritmo di conversione, sostegno PAC, filiere e mercato non sufficienti rispetto agli obiettivi Farm-to-Fork e alle pressioni su suolo, acqua e biodiversità.',
  },
  {
    driver_id: 'D21',
    title: 'Mediterranean fisheries recovery, overexploitation and compliance gap',
    category: 'Fisheries',
    geography_lens: 'Mediterranean',
    order_index: 15,
    short_definition:
      'Pesca mediterranea ancora in larga parte sovrasfruttata, con ritardi nel recupero degli stock, deroghe ricorrenti e debolezze di controllo e compliance rispetto a piani pluriennali UE e raccomandazioni CGPM.',
  },
  {
    driver_id: 'D23',
    title: 'Offshore wind and marine spatial planning tension',
    category: 'Energy',
    geography_lens: 'Italy/Coast',
    order_index: 16,
    short_definition:
      'Tensione fra la rapida espansione dell\'eolico offshore necessaria per la transizione energetica e gli usi e i valori ecologici dello spazio marino (rotte di cetacei e uccelli, fondali sensibili, pesca, paesaggio).',
  },
  {
    driver_id: 'D24',
    title: 'Renewable energy deployment and fossil fuel dependence',
    category: 'Energy',
    geography_lens: 'Italy/EU',
    order_index: 17,
    short_definition:
      'Ritmo e qualità dell\'installazione di rinnovabili rispetto agli obiettivi 2030, e velocità di uscita dai combustibili fossili: impatti potenziali su biodiversità, suolo e paesaggio se la transizione non è ben pianificata.',
  },
  {
    driver_id: 'D28',
    title: 'Environmentally harmful subsidies and fiscal misalignment',
    category: 'Finance',
    geography_lens: 'Italy/EU',
    order_index: 18,
    short_definition:
      'Sussidi ambientalmente dannosi (energia fossile, alcuni usi agricoli, pesca) e fiscalità non allineata agli obiettivi di natura e clima, che continuano a finanziare pressioni invece di rimuoverle.',
  },
  {
    driver_id: 'D30',
    title: 'Administrative and institutional inertia',
    category: 'Governance',
    geography_lens: 'Italy',
    order_index: 19,
    short_definition:
      'Lentezza amministrativa, frammentazione delle competenze fra livelli (Stato, Regioni, enti locali), capacità tecnica limitata e turnover, che ritardano attuazione di norme e progetti ambientali.',
  },
  {
    driver_id: 'D33',
    title: 'Public concern-action gap',
    category: 'Society',
    geography_lens: 'Italy',
    order_index: 20,
    short_definition:
      'Distanza fra la preoccupazione dichiarata dei cittadini su clima e natura e i comportamenti, le scelte di consumo e le pressioni politiche effettivamente esercitate per il cambiamento sistemico.',
  },
  {
    driver_id: 'D35',
    title: 'Community co-management and local livelihood alignment',
    category: 'Governance',
    geography_lens: 'Italy',
    order_index: 21,
    short_definition:
      'Capacità di coinvolgere comunità locali, pescatori, agricoltori e operatori nella co-gestione delle aree e nell\'allineamento fra conservazione e mezzi di sussistenza, anziché percepire la natura come vincolo esterno.',
  },
  {
    driver_id: 'D37',
    title: 'Political polarisation and backlash against environmental transition',
    category: 'Society',
    geography_lens: 'Italy/EU',
    order_index: 22,
    short_definition:
      'Polarizzazione politica e reazione contro le politiche ambientali (Green Deal, ripristino natura, agricoltura, energia), con rischio di rallentamento, smantellamento o svuotamento normativo.',
  },
  {
    driver_id: 'D41',
    title: 'Sea-floor integrity and benthic habitat disturbance',
    category: 'Biodiversity',
    geography_lens: 'Mediterranean',
    order_index: 23,
    short_definition:
      'Disturbo fisico ai fondali marini da pesca a strascico, ancoraggi, dragaggi e infrastrutture, con perdita di habitat strutturanti (coralligeno, praterie di posidonia, fondi a maerl) e dei servizi associati.',
  },
  {
    driver_id: 'D42',
    title: 'Public trust and legitimacy of environmental action',
    category: 'Society',
    geography_lens: 'Italy',
    order_index: 24,
    short_definition:
      'Livello di fiducia dei cittadini nelle istituzioni ambientali, nella scienza e nelle ONG, e percezione di legittimità delle decisioni di conservazione: precondizione per consenso sociale alle misure necessarie.',
  },
  {
    driver_id: 'D43',
    title: 'Volatility and competition in nature funding',
    category: 'Finance',
    geography_lens: 'Italy/EU',
    order_index: 25,
    short_definition:
      'Volatilità e competizione crescente sui finanziamenti per la natura: priorità di bilancio in mutamento (difesa, energia, sociale), incertezza sui fondi UE post-2027 e dipendenza da bandi a breve termine.',
  },
].map((d) => ({
  ...d,
  version: DRIVER_VERSION,
  status: 'active',
  active: 1,
}));

module.exports = { DRIVERS, DRIVER_VERSION };
