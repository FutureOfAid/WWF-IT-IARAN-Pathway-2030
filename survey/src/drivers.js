// Preselected drivers v0.3 — WWF Italia: Sistema Natura 2030.
// driver_id values are stable. Wording updates must bump driver_version, not
// mutate driver_id, so existing responses remain joinable.
const DRIVER_VERSION = '0.3';

const DRIVERS = [
  { driver_id: 'D01', title: 'Mediterranean climate hotspot amplification', category: 'Climate', geography_lens: 'Italy/Mediterranean', order_index: 1 },
  { driver_id: 'D02', title: 'Water scarcity, drought and hydrological stress', category: 'Climate', geography_lens: 'Italy', order_index: 2 },
  { driver_id: 'D04', title: 'Wildfire risk and forest vulnerability', category: 'Climate', geography_lens: 'Italy', order_index: 3 },
  { driver_id: 'D06', title: 'Sea-level rise and coastal exposure', category: 'Climate', geography_lens: 'Italy/Coast', order_index: 4 },
  { driver_id: 'D07', title: 'Marine warming and species redistribution', category: 'Climate', geography_lens: 'Mediterranean', order_index: 5 },
  { driver_id: 'D09', title: '30x30 protected area implementation gap', category: 'Policy', geography_lens: 'Italy/EU', order_index: 6 },
  { driver_id: 'D10', title: 'Protected area management effectiveness deficit', category: 'Policy', geography_lens: 'Italy', order_index: 7 },
  { driver_id: 'D11', title: 'Nature Restoration Plan ambition gap', category: 'Policy', geography_lens: 'Italy/EU', order_index: 8 },
  { driver_id: 'D12', title: 'Unfavourable habitat and ecosystem conservation status', category: 'Biodiversity', geography_lens: 'Italy', order_index: 9 },
  { driver_id: 'D13', title: 'Soil sealing and land consumption', category: 'Land use', geography_lens: 'Italy', order_index: 10 },
  { driver_id: 'D14', title: 'Habitat fragmentation and ecological connectivity deficit', category: 'Biodiversity', geography_lens: 'Italy', order_index: 11 },
  { driver_id: 'D16', title: 'Water pollution and pesticide pressure', category: 'Pollution', geography_lens: 'Italy', order_index: 12 },
  { driver_id: 'D17', title: 'Marine litter, plastic pollution and ghost gear', category: 'Pollution', geography_lens: 'Mediterranean', order_index: 13 },
  { driver_id: 'D18', title: 'Agroecology and organic transition gap', category: 'Food/Agriculture', geography_lens: 'Italy/EU', order_index: 14 },
  { driver_id: 'D21', title: 'Mediterranean fisheries recovery, overexploitation and compliance gap', category: 'Fisheries', geography_lens: 'Mediterranean', order_index: 15 },
  { driver_id: 'D23', title: 'Offshore wind and marine spatial planning tension', category: 'Energy', geography_lens: 'Italy/Coast', order_index: 16 },
  { driver_id: 'D24', title: 'Renewable energy deployment and fossil fuel dependence', category: 'Energy', geography_lens: 'Italy/EU', order_index: 17 },
  { driver_id: 'D28', title: 'Environmentally harmful subsidies and fiscal misalignment', category: 'Finance', geography_lens: 'Italy/EU', order_index: 18 },
  { driver_id: 'D30', title: 'Administrative and institutional inertia', category: 'Governance', geography_lens: 'Italy', order_index: 19 },
  { driver_id: 'D33', title: 'Public concern-action gap', category: 'Society', geography_lens: 'Italy', order_index: 20 },
  { driver_id: 'D35', title: 'Community co-management and local livelihood alignment', category: 'Governance', geography_lens: 'Italy', order_index: 21 },
  { driver_id: 'D37', title: 'Political polarisation and backlash against environmental transition', category: 'Society', geography_lens: 'Italy/EU', order_index: 22 },
  { driver_id: 'D41', title: 'Sea-floor integrity and benthic habitat disturbance', category: 'Biodiversity', geography_lens: 'Mediterranean', order_index: 23 },
  { driver_id: 'D42', title: 'Public trust and legitimacy of environmental action', category: 'Society', geography_lens: 'Italy', order_index: 24 },
  { driver_id: 'D43', title: 'Volatility and competition in nature funding', category: 'Finance', geography_lens: 'Italy/EU', order_index: 25 },
].map(d => ({
  ...d,
  short_definition: '',
  version: DRIVER_VERSION,
  status: 'active',
  active: 1,
}));

module.exports = { DRIVERS, DRIVER_VERSION };
