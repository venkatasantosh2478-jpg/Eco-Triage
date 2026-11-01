import {
  ActivityLogItem,
  AlertItem,
  ArticleRecord,
  Crew,
  CycloneRecord,
  HelpPoint,
  HeroProfile,
  Incident,
  UserProfile,
} from '../types.ts';

const STORAGE_KEYS = {
  INCIDENTS: 'ecotriage_incidents',
  HELP_POINTS: 'ecotriage_help_points',
  ALERTS: 'ecotriage_alerts',
  HEROES: 'ecotriage_heroes',
  HERO_SUGGESTIONS: 'ecotriage_hero_suggestions',
  CYCLONES: 'ecotriage_cyclones',
  ARTICLES: 'ecotriage_articles',
  CREWS: 'ecotriage_crews',
  LOGS: 'ecotriage_logs',
  USER: 'ecotriage_user',
  SETTINGS: 'ecotriage_settings',
  THANKS: 'ecotriage_thanked_heroes',
  QUEUED_REPORTS: 'ecotriage_queued_reports',
};

export const SAMPLE_USERS: UserProfile[] = [
  {
    id: 'user_cmd_1',
    name: 'Ravi (Governance Command)',
    role: 'command',
    pin: '1234',
    department: 'Municipal Governance Command',
    description: 'Verifies & approves reported hazards, dispatches clearance squads, pins verified hazards to live map.',
  },
  {
    id: 'user_fld_1',
    name: 'Lakshmi (Field)',
    role: 'field',
    pin: '2345',
    zone: 'Zone 3 (Central Vizag)',
    department: 'Clearance Squad 4',
    description: 'Inspects blockages, reports photos on-site, logs status updates.',
  },
  {
    id: 'user_adm_1',
    name: 'Admin Sample',
    role: 'admin',
    pin: '9999',
    department: 'System Administration',
    description: 'Full control over users, crews, zones, help points, content CRUD, and system data.',
  },
  {
    id: 'user_viw_1',
    name: 'Viewer Sample',
    role: 'viewer',
    pin: '0000',
    department: 'Senior Observers / Media',
    description: 'Read-only live visibility across incidents, map, and dashboard.',
  },
];

export const SAMPLE_CREWS: Crew[] = [
  { id: 'crew_1', name: 'PWD Heavy Unit 1 (Bulldozer + Loader)', type: 'PWD Heavy Unit', status: 'Busy', assignedIncidentId: 'inc_1' },
  { id: 'crew_2', name: 'PWD Tree Cutter Unit 2', type: 'PWD Heavy Unit', status: 'Busy', assignedIncidentId: 'inc_3' },
  { id: 'crew_3', name: 'State Electricity Board Squad A', type: 'State Electricity Board', status: 'Busy', assignedIncidentId: 'inc_4' },
  { id: 'crew_4', name: 'State Electricity Board Squad B', type: 'State Electricity Board', status: 'Free' },
  { id: 'crew_5', name: 'Municipal Clearance Squad 7', type: 'PWD Heavy Unit', status: 'Free' },
  { id: 'crew_6', name: 'Fire & Rescue Unit Vizag North', type: 'Fire and Rescue', status: 'Free' },
];

export const SAMPLE_INCIDENTS: Incident[] = [
  {
    id: 'inc_1',
    location: 'Maddilapalem Junction',
    lat: 17.7385,
    lng: 83.3150,
    obstruction: 'complete_block',
    hazard: 'live_electrical_wire',
    priority_score: 9.8,
    severity: 'Critical',
    roadType: 'Hospital Route',
    zone: 'Zone 3 (Central Vizag)',
    status: 'Pending',
    source: 'Photo',
    equipment: 'PWD Heavy Unit + State Electricity Board Team',
    createdAt: '12 minutes ago',
    updatedAt: 'Just now',
    reportedBy: 'Field Officer Lakshmi',
    verified: true,
    pinnedToMap: true,
    approvedByGovernance: true,
    governanceOfficerName: 'Ravi (Governance Command)',
    lastUpdatedBy: 'System AI',
    sample: true,
    photo: '/assets/aistudio/Gemini_Generated_Image_ubc9rmubc9rmubc9_a09387d6.png',
    note: 'Large banyan tree fallen across both lanes near Apollo hospital turn. 11kV live power cable snapped and sparking.',
    aiRecommendation: 'Immediately isolate 11kV feeder line and dispatch PWD heavy loader with tree cutter team.',
    history: [
      { status: 'Pending', by: 'Lakshmi (Field)', time: '12m ago', note: 'Photo triage captured on site' },
      { status: 'Pending', by: 'Ravi (Governance Command)', time: '10m ago', note: 'Governance officer verified and pinned to live map.' },
    ],
    priorityHistory: [],
  },
  {
    id: 'inc_2',
    location: 'Beach Road, RK Beach',
    lat: 17.7120,
    lng: 83.3230,
    obstruction: 'single_lane',
    hazard: 'none',
    priority_score: 4.2,
    severity: 'Medium',
    roadType: 'Residential',
    zone: 'Zone 2 (Beach Coastal)',
    status: 'Cleared',
    source: 'Sample',
    equipment: 'Municipal Clearance Squad',
    createdAt: '3 hours ago',
    updatedAt: '15 minutes ago',
    reportedBy: 'Citizen Helpline',
    verified: true,
    pinnedToMap: true,
    approvedByGovernance: true,
    governanceOfficerName: 'Ravi (Governance Command)',
    lastUpdatedBy: 'Squad 3 Leader',
    sample: true,
    note: 'Coconut tree branches partially obstructing eastbound lane. Cleared and traffic restored.',
    history: [
      { status: 'Pending', by: 'System', time: '3h ago' },
      { status: 'Assigned', by: 'Ravi (Governance Command)', time: '2h ago' },
      { status: 'Cleared', by: 'Squad 3 Leader', time: '15m ago', note: 'Branches shredded and piled safely off tarmac.' },
    ],
    priorityHistory: [],
  },
  {
    id: 'inc_3',
    location: 'MVP Colony Sector 4',
    lat: 17.7410,
    lng: 83.3330,
    obstruction: 'complete_block',
    hazard: 'none',
    priority_score: 6.5,
    severity: 'Medium',
    roadType: 'Standard Road',
    zone: 'Zone 3 (Central Vizag)',
    status: 'Assigned',
    source: 'Sample',
    equipment: 'PWD Heavy Unit + Industrial Tree Cutter',
    createdAt: '45 minutes ago',
    updatedAt: '20 minutes ago',
    reportedBy: 'Field Squad 2',
    verified: true,
    pinnedToMap: true,
    approvedByGovernance: true,
    governanceOfficerName: 'Ravi (Governance Command)',
    assignedTo: 'PWD Tree Cutter Unit 2',
    lastUpdatedBy: 'Ravi (Governance Command)',
    sample: true,
    note: 'Gulmohar tree completely across crossroad. No electric cables involved.',
    aiRecommendation: 'Deploy chainsaw crew to cut trunk into sections.',
    history: [
      { status: 'Pending', by: 'Field Squad 2', time: '45m ago' },
      { status: 'Assigned', by: 'Ravi (Governance Command)', time: '20m ago', note: 'Assigned to Unit 2' },
    ],
    priorityHistory: [],
  },
  {
    id: 'inc_4',
    location: 'Seethammadhara North',
    lat: 17.7450,
    lng: 83.3060,
    obstruction: 'complete_block',
    hazard: 'live_electrical_wire',
    priority_score: 9.5,
    severity: 'Critical',
    roadType: 'Emergency Shelter',
    zone: 'Zone 1 (North Vizag)',
    status: 'Pending',
    source: 'Sample',
    equipment: 'PWD Heavy Unit + State Electricity Board Team',
    createdAt: '25 minutes ago',
    updatedAt: '10 minutes ago',
    reportedBy: 'Unverified Citizen SMS',
    verified: false,
    pinnedToMap: false,
    approvedByGovernance: false,
    lastUpdatedBy: 'Citizen SMS Gateway',
    sample: true,
    note: 'Concrete electric pole snapped at base, transformer fallen onto road leading to primary cyclone shelter school.',
    aiRecommendation: 'High danger to shelter access. De-energize sub-station circuit and send heavy crane.',
    history: [
      { status: 'Pending', by: 'SMS Gateway', time: '25m ago', note: 'Awaiting Governance Officer approval before pinning to map.' },
    ],
    priorityHistory: [],
  },
  {
    id: 'inc_5',
    location: 'DAB Gardens Main Road',
    lat: 17.7150,
    lng: 83.3000,
    obstruction: 'single_lane',
    hazard: 'none',
    priority_score: 3.1,
    severity: 'Low',
    roadType: 'Commercial',
    zone: 'Zone 4 (South Vizag)',
    status: 'Cleared',
    source: 'Sample',
    equipment: 'Municipal Clearance Squad',
    createdAt: '5 hours ago',
    updatedAt: '1 hour ago',
    reportedBy: 'Traffic Warden',
    verified: true,
    pinnedToMap: true,
    approvedByGovernance: true,
    governanceOfficerName: 'Ravi (Governance Command)',
    lastUpdatedBy: 'Ravi (Governance Command)',
    sample: true,
    note: 'Commercial sign hoarding blown onto sidewalk edge. Removed to depot.',
    history: [
      { status: 'Pending', by: 'Traffic Warden', time: '5h ago' },
      { status: 'Cleared', by: 'Ravi (Governance Command)', time: '1h ago' },
    ],
    priorityHistory: [],
  },
  {
    id: 'inc_6',
    location: 'Siripuram Circle',
    lat: 17.7220,
    lng: 83.3180,
    obstruction: 'complete_block',
    hazard: 'none',
    priority_score: 8.9,
    severity: 'High',
    roadType: 'Major Artery',
    zone: 'Zone 3 (Central Vizag)',
    status: 'Assigned',
    source: 'Sample',
    equipment: 'PWD Heavy Unit + Tree Cutter',
    createdAt: '1 hour ago',
    updatedAt: '35 minutes ago',
    reportedBy: 'Police Control',
    verified: true,
    pinnedToMap: true,
    approvedByGovernance: true,
    governanceOfficerName: 'Ravi (Governance Command)',
    assignedTo: 'PWD Heavy Unit 1',
    lastUpdatedBy: 'Ravi (Governance Command)',
    sample: true,
    note: 'Two heavy roadside neem trees uprooted simultaneously blocking the Siripuram roundabout junction.',
    history: [
      { status: 'Pending', by: 'Police Control', time: '1h ago' },
      { status: 'Assigned', by: 'Ravi (Governance Command)', time: '35m ago' },
    ],
    priorityHistory: [],
  },
  {
    id: 'inc_7',
    location: 'Waltair Uplands',
    lat: 17.7230,
    lng: 83.3050,
    obstruction: 'single_lane',
    hazard: 'none',
    priority_score: 5.0,
    severity: 'Medium',
    roadType: 'Residential',
    zone: 'Zone 2 (Beach Coastal)',
    status: 'Pending',
    source: 'Sample',
    equipment: 'Municipal Clearance Squad',
    createdAt: '50 minutes ago',
    updatedAt: '50 minutes ago',
    reportedBy: 'Resident Association',
    verified: true,
    pinnedToMap: true,
    approvedByGovernance: true,
    governanceOfficerName: 'Ravi (Governance Command)',
    lastUpdatedBy: 'System',
    sample: true,
    note: 'Fallen ashoka tree tilting against boundary wall, single lane narrow pass available for compact cars.',
    history: [
      { status: 'Pending', by: 'Resident Association', time: '50m ago' },
    ],
    priorityHistory: [],
  },
  {
    id: 'inc_8',
    location: 'Gajuwaka Steel Plant Rd',
    lat: 17.6850,
    lng: 83.2100,
    obstruction: 'complete_block',
    hazard: 'live_electrical_wire',
    priority_score: 9.2,
    severity: 'Critical',
    roadType: 'Industrial Lifeline',
    zone: 'Zone 5 (Industrial Belt)',
    status: 'Pending',
    source: 'Sample',
    equipment: 'PWD Heavy Unit + State Electricity Board Team',
    createdAt: '30 minutes ago',
    updatedAt: '30 minutes ago',
    reportedBy: 'Plant Safety Cell',
    verified: true,
    pinnedToMap: true,
    approvedByGovernance: true,
    governanceOfficerName: 'Ravi (Governance Command)',
    lastUpdatedBy: 'System',
    sample: true,
    note: 'Heavy steel container roof blown onto road with high tension wires entangled. Oxygen cylinder trucks held up.',
    history: [
      { status: 'Pending', by: 'Plant Safety Cell', time: '30m ago' },
    ],
    priorityHistory: [],
  },
  {
    id: 'inc_9',
    location: 'Akkayyapalem 100ft Rd',
    lat: 17.7390,
    lng: 83.2900,
    obstruction: 'complete_block',
    hazard: 'none',
    priority_score: 7.8,
    severity: 'High',
    roadType: 'Transit Route',
    zone: 'Zone 1 (North Vizag)',
    status: 'Assigned',
    source: 'Sample',
    equipment: 'PWD Heavy Unit + Tree Cutter',
    createdAt: '2 hours ago',
    updatedAt: '40 minutes ago',
    reportedBy: 'RTC Bus Depot',
    verified: true,
    pinnedToMap: true,
    approvedByGovernance: true,
    governanceOfficerName: 'Ravi (Governance Command)',
    assignedTo: 'Municipal Clearance Squad 7',
    lastUpdatedBy: 'Ravi (Governance Command)',
    sample: true,
    note: 'Giant tamarind tree blocked bus movement towards highway.',
    history: [
      { status: 'Pending', by: 'RTC Depot', time: '2h ago' },
      { status: 'Assigned', by: 'Ravi (Governance Command)', time: '40m ago' },
    ],
    priorityHistory: [],
  },
  {
    id: 'inc_10',
    location: 'Dwaraka Nagar 4th Lane',
    lat: 17.7240,
    lng: 83.3040,
    obstruction: 'single_lane',
    hazard: 'none',
    priority_score: 4.0,
    severity: 'Medium',
    roadType: 'Commercial',
    zone: 'Zone 4 (South Vizag)',
    status: 'Cleared',
    source: 'Sample',
    equipment: 'Municipal Clearance Squad',
    createdAt: '4 hours ago',
    updatedAt: '1 hour ago',
    reportedBy: 'Field Officer Lakshmi',
    verified: true,
    pinnedToMap: true,
    approvedByGovernance: true,
    governanceOfficerName: 'Ravi (Governance Command)',
    lastUpdatedBy: 'Lakshmi (Field)',
    sample: true,
    note: 'Debris and branches cleared, lane fully swept and opened.',
    history: [
      { status: 'Pending', by: 'Lakshmi', time: '4h ago' },
      { status: 'Cleared', by: 'Lakshmi', time: '1h ago' },
    ],
    priorityHistory: [],
  },
];

export const SAMPLE_HELP_POINTS: HelpPoint[] = [
  {
    id: 'help_1',
    name: 'Sample Relief Camp, Beach Road School',
    category: 'relief_camp',
    lat: 17.7180,
    lng: 83.3280,
    address: 'Near Pandurangapuram, Beach Road, Visakhapatnam',
    phone: '+91 891 256 0001 (Sample)',
    status: 'Open',
    capacity: 350,
    capacityFree: 140,
    facilities: ['Hot Food', 'Drinking Water', 'Medical Doctor', 'Backup Generator', 'Toilets', 'Women & Child Area'],
    updatedAt: '10:42 AM',
    sample: true,
  },
  {
    id: 'help_2',
    name: 'Sample Community Hall Relief Camp, Gajuwaka',
    category: 'relief_camp',
    lat: 17.6910,
    lng: 83.2180,
    address: 'High School Ground Road, Gajuwaka, Visakhapatnam',
    phone: '+91 891 256 0002 (Sample)',
    status: 'Almost full',
    capacity: 500,
    capacityFree: 45,
    facilities: ['Hot Food', 'Drinking Water', 'First Aid', 'Backup Generator', 'Toilets'],
    updatedAt: '10:15 AM',
    sample: true,
  },
  {
    id: 'help_3',
    name: 'Sample King George Hospital Emergency Wing',
    category: 'hospital',
    lat: 17.7080,
    lng: 83.3070,
    address: 'Collector Office Road, Maharanipeta, Visakhapatnam',
    phone: '+91 891 256 4891 (Sample)',
    status: 'Open',
    facilities: ['24/7 Trauma Care', 'Blood Bank', 'ICU', 'Oxygen Plant', 'Ambulance Bay'],
    updatedAt: '11:00 AM',
    sample: true,
  },
  {
    id: 'help_4',
    name: 'Sample Care Multi-specialty Hospital',
    category: 'hospital',
    lat: 17.7280,
    lng: 83.3110,
    address: 'Waltair Main Road, Ram Nagar, Visakhapatnam',
    phone: '+91 891 304 1000 (Sample)',
    status: 'Open',
    facilities: ['Emergency Ward', 'Surgical Units', 'Pharmacy'],
    updatedAt: '09:30 AM',
    sample: true,
  },
  {
    id: 'help_5',
    name: 'Sample North Fire Station & Rescue Depot',
    category: 'fire_station',
    lat: 17.7420,
    lng: 83.3210,
    address: 'Near Maddilapalem Bus Depot, Visakhapatnam',
    phone: '+91 891 255 1010 (Sample)',
    status: 'Open',
    facilities: ['Heavy Rescue Vehicles', 'Tree Cutters', 'Inflatable Boats', 'Water Pumps'],
    updatedAt: '11:15 AM',
    sample: true,
  },
  {
    id: 'help_6',
    name: 'Sample PWD Heavy Machinery Depot (Zone 3)',
    category: 'depot',
    lat: 17.7340,
    lng: 83.3010,
    address: 'Resapuvanipalem Works Yard, Visakhapatnam',
    phone: '+91 891 278 4321 (Sample)',
    status: 'Open',
    facilities: ['4 JCB Excavators', '2 Heavy Cranes', 'Wood Shredders', 'Dump Trucks'],
    updatedAt: '08:45 AM',
    sample: true,
  },
  {
    id: 'help_7',
    name: 'Sample State Electricity Board Sub-Division Depot',
    category: 'depot',
    lat: 17.7190,
    lng: 83.2980,
    address: 'Suryabagh Power House, Visakhapatnam',
    phone: '+91 891 254 7711 (Sample)',
    status: 'Open',
    facilities: ['High Voltage Wire Crews', 'Transformer Spares', 'Pole Lifters'],
    updatedAt: '10:00 AM',
    sample: true,
  },
  {
    id: 'help_8',
    name: 'Sample Municipal Clean Water & Food Distribution Point',
    category: 'water_food',
    lat: 17.7250,
    lng: 83.3190,
    address: 'Andhra University Open Ground, Visakhapatnam',
    phone: '+91 891 284 4000 (Sample)',
    status: 'Open',
    facilities: ['RO Water Tankers (10,000L)', 'Packed Food Packets', 'Baby Formula Supplies'],
    updatedAt: '10:30 AM',
    sample: true,
  },
];

export const SAMPLE_ALERTS: AlertItem[] = [
  {
    id: 'alert_1',
    type: 'weather',
    severity: 'Warning',
    message: 'Cyclone Warning: Coastal Visakhapatnam. High risk of heavy rainfall and strong winds.',
    messageTe: 'తీవ్ర తుఫాను హెచ్చరిక: విశాఖపట్నం తీరప్రాంతం. అతి భారీ వర్షాలు మరియు పెనుగాలులు వీచే అవకాశం.',
    messageHi: 'चक्रवात चेतावनी: तटीय विशाखापत्तनम। भारी वर्षा और तेज़ हवाओं का गंभीर ख़तरा।',
    issuedAt: '27 Oct, 2026 • 4:30 PM',
    expiresAt: '28 Oct, 2026 • 8:00 AM',
    source: 'IMD Coastal Warning Bulletin (Sample)',
    active: true,
  },
  {
    id: 'alert_2',
    type: 'road',
    severity: 'Warning',
    message: 'Maddilapalem Junction: road blocked, live wire reported. Clearance crew dispatched.',
    messageTe: 'మద్దిలపాలెం జంక్షన్: రోడ్డు బ్లాక్, కరెంట్ వైర్లు. క్లియరెన్స్ బృందం చేరుకుంది.',
    messageHi: 'मद्दिपलेम जंक्शन: रास्ता बंद, बिजली का तार गिरा। राहत दस्ता रवाना।',
    issuedAt: '27 Oct, 2026 • 4:45 PM',
    expiresAt: '27 Oct, 2026 • 7:00 PM',
    source: 'Municipal Control Room (Sample)',
    active: true,
  },
  {
    id: 'alert_3',
    type: 'road',
    severity: 'Advisory',
    message: 'Beach Road cleared for emergency traffic. Drive cautiously due to sea spray.',
    messageTe: 'బీచ్ రోడ్డు అత్యవసర వాహనాల కోసం పునరుద్ధరించబడింది. జాగ్రత్తగా ప్రయాణించండి.',
    messageHi: 'बीच रोड आपातकालीन यातायात के लिए साफ़ कर दी गई है। सावधानी से चलें।',
    issuedAt: '27 Oct, 2026 • 3:15 PM',
    expiresAt: '28 Oct, 2026 • 12:00 PM',
    source: 'Traffic Police Vizag (Sample)',
    active: true,
  },
];

export const SAMPLE_CYCLONES: CycloneRecord[] = [
  {
    id: 'cyc_hudhud',
    name: 'Very Severe Cyclonic Storm Hudhud',
    year: 2014,
    impact: 'Struck Visakhapatnam coast on 12 October 2014 with gusts over 185 km/h, uprooting over 40,000 trees and downing thousands of electrical poles.',
    affectedArea: 'Visakhapatnam, Vizianagaram, Srikakulam',
    lessonsLearned: 'Micro-level crowdsourced hazard reporting and pre-allocated clearance squads reduce road reopening time from 72h to under 12h.',
    source: 'India Meteorological Department (IMD) Report on Hudhud (2014)',
    wikiUrl: 'https://en.wikipedia.org/wiki/Cyclone_Hudhud',
  },
  {
    id: 'cyc_gulab',
    name: 'Cyclonic Storm Gulab',
    year: 2021,
    impact: 'Made landfall near Kalingapatnam in September 2021, causing flash urban flooding and localized tree-falls in central Visakhapatnam.',
    affectedArea: 'North Coastal Andhra Pradesh',
    lessonsLearned: 'Rapid identification of blocked hospital lifelines must take top triage precedence during urban flash-floods.',
    source: 'National Disaster Management Authority (NDMA) Archive (2021)',
    wikiUrl: 'https://en.wikipedia.org/wiki/Cyclone_Gulab',
  },
  {
    id: 'cyc_michaung',
    name: 'Severe Cyclonic Storm Michaung',
    year: 2023,
    impact: 'Triggered persistent downpours along the Bay of Bengal coastline, waterlogging underpasses and disrupting arterial freight routes.',
    affectedArea: 'South & Central Coastal AP',
    lessonsLearned: 'Offline-capable communication for field squads is vital when cellular infrastructure loses battery backup power.',
    source: 'State Disaster Management Authority (APSDMA) Report (2023)',
    wikiUrl: 'https://en.wikipedia.org/wiki/Cyclone_Michaung',
  },
  {
    id: 'cyc_asani',
    name: 'Cyclonic Storm Asani',
    year: 2022,
    impact: 'Skirted off Visakhapatnam shore in May 2022, delivering gale force squalls and high swells that damaged coastal protection infrastructure.',
    affectedArea: 'Visakhapatnam Port & Beach corridor',
    lessonsLearned: 'Real-time hazard mapping helps prioritize tourist and fishermen evacuation points first.',
    source: 'District Administration Disaster Cell Bulletin (2022)',
    wikiUrl: 'https://en.wikipedia.org/wiki/Cyclone_Asani',
  },
];

export const SAMPLE_ARTICLES: ArticleRecord[] = [
  {
    id: 'art_1',
    title: 'Post-Cyclone Urban Road Blockage Dynamics & Recovery Bottlenecks',
    source: 'National Institute of Disaster Management (NIDM)',
    date: 'March 2023',
    summary: 'Detailed research showing how blocked primary arteries delay first responders and power restoration by an average of 42 hours without automated spatial triage.',
    link: 'https://nidm.gov.in',
  },
  {
    id: 'art_2',
    title: 'Visakhapatnam Urban Greenery Resilience & Storm Preparedness Protocol',
    source: 'Times of India (Vizag Edition)',
    date: 'October 2024',
    summary: 'Analysis of coastal tree root vulnerability and the urgent municipal need for fast crowdsourced obstruction clearance after severe squalls.',
    link: 'https://timesofindia.indiatimes.com',
  },
  {
    id: 'art_3',
    title: 'Civic Geospatial Tools for Disaster Response in Port Cities',
    source: 'NDEM / National Remote Sensing Centre',
    date: 'January 2025',
    summary: 'Why nationwide satellite platforms require micro-level crowdsourced field reporting to pinpoint road-level emergencies accurately.',
    link: 'https://nrsc.gov.in',
  },
];

export const SAMPLE_HEROES: HeroProfile[] = [
  {
    id: 'hero_1',
    name: 'K. Appa Rao',
    role: 'Lead Heavy Machinery Operator',
    department: 'Municipal',
    story: 'Worked 18 continuous hours during the storm to slice and haul 24 massive fallen trees off the critical King George Hospital emergency route.',
    thankCount: 428,
    sample: true,
    isHeroOfMonth: true,
    avatarSeed: 'apparrao',
    status: 'approved',
  },
  {
    id: 'hero_2',
    name: 'S. Nageswara Rao',
    role: 'Senior Line Inspector',
    department: 'Electricity',
    story: 'Manually isolated fallen 11kV live cables in chest-deep storm water at Maddilapalem, preventing electrical shocks and enabling ambulance clearance.',
    thankCount: 389,
    sample: true,
    avatarSeed: 'nageswar',
    status: 'approved',
  },
  {
    id: 'hero_3',
    name: 'Dr. P. Sirisha',
    role: 'Chief Medical Officer',
    department: 'Medical',
    story: 'Organized mobile emergency triage vans to reach isolated coastal colonies cut off by fallen trees along Bheemili beach corridor.',
    thankCount: 512,
    sample: true,
    avatarSeed: 'sirisha',
    status: 'approved',
  },
  {
    id: 'hero_4',
    name: 'M. Suresh Kumar',
    role: 'Sub-Officer',
    department: 'Fire and Rescue',
    story: 'Led a 6-person squad to rescue 48 senior citizens trapped in an inundated community hall after two huge neem trees blocked all exit gates.',
    thankCount: 317,
    sample: true,
    avatarSeed: 'suresh',
    status: 'approved',
  },
  {
    id: 'hero_5',
    name: 'V. Ramana Murthy',
    role: 'Traffic Sub-Inspector',
    department: 'Police',
    story: 'Stood in gale squalls for 9 hours directing emergency convoys and heavy crane trucks safely around blocked arterial flyovers.',
    thankCount: 245,
    sample: true,
    avatarSeed: 'ramana',
    status: 'approved',
  },
  {
    id: 'hero_6',
    name: 'Ch. Lavanya',
    role: 'Community Youth Volunteer Lead',
    department: 'Volunteers',
    story: 'Mobilized 40 university volunteers to deliver emergency food packets and clean drinking water to 600 stranded families in MVP Colony.',
    thankCount: 403,
    sample: true,
    avatarSeed: 'lavanya',
    status: 'approved',
  },
  {
    id: 'hero_7',
    name: 'G. Satyanarayana',
    role: 'Sanitation Squad Supervisor',
    department: 'Municipal',
    story: 'Coordinated round-the-clock road sweeping squads to remove glass, jagged roofing sheets, and branch debris from major bus corridors.',
    thankCount: 198,
    sample: true,
    avatarSeed: 'satya',
    status: 'approved',
  },
  {
    id: 'hero_8',
    name: 'B. Jagannadha Reddy',
    role: 'Disaster Cell Radio Operator',
    department: 'Police',
    story: 'Maintained uninterrupted wireless VHF radio relay between ground crews and relief depots when standard mobile towers collapsed.',
    thankCount: 276,
    sample: true,
    avatarSeed: 'jagannadha',
    status: 'approved',
  },
];

export const SAMPLE_ACTIVITY_LOGS: ActivityLogItem[] = [
  { id: 'log_1', who: 'System AI', what: 'Analyzed photo report at Maddilapalem Junction. Priority Score: 9.8 (Critical).', when: '12m ago', timestamp: Date.now() - 12 * 60000 },
  { id: 'log_2', who: 'Ravi (Governance Command)', what: 'Approved and pinned hazard at Maddilapalem Junction onto live operational map.', when: '10m ago', timestamp: Date.now() - 10 * 60000 },
  { id: 'log_3', who: 'Ravi (Governance Command)', what: 'Dispatched PWD Heavy Unit 1 to Siripuram Circle.', when: '35m ago', timestamp: Date.now() - 35 * 60000 },
  { id: 'log_4', who: 'Lakshmi (Field)', what: 'Marked incident at Beach Road as Cleared.', when: '15m ago', timestamp: Date.now() - 15 * 60000 },
  { id: 'log_5', who: 'Admin Sample', what: 'Updated relief camp free capacity at Beach Road School.', when: '2h ago', timestamp: Date.now() - 120 * 60000 },
];

export const VISAKHAPATNAM_ZONES = [
  'Zone 1 (North Vizag - Madhurawada / Rushikonda)',
  'Zone 2 (Beach Coastal - RK Beach / Bheemili)',
  'Zone 3 (Central Vizag - Maddilapalem / Siripuram)',
  'Zone 4 (South Vizag - Dwaraka Nagar / DAB Gardens)',
  'Zone 5 (Industrial Belt - Gajuwaka / Steel Plant)',
  'Zone 6 (West Vizag - Pendurthi / Simhachalam)',
];

// Helper functions for LocalStorage management
export function loadIncidents(): Incident[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INCIDENTS);
    if (!raw) {
      saveIncidents(SAMPLE_INCIDENTS);
      return SAMPLE_INCIDENTS;
    }
    return JSON.parse(raw);
  } catch {
    return SAMPLE_INCIDENTS;
  }
}

export function saveIncidents(incidents: Incident[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(incidents));
  } catch (err) {
    console.warn('Initial saveIncidents hit quota limit. Compacting photo payloads...', err);
    try {
      // Step 1: Keep photos only for top 3 most recent incidents if photos are large base64 strings
      const compacted = incidents.map((inc, index) => {
        if (index > 2 && inc.photo && inc.photo.length > 30000) {
          return { ...inc, photo: undefined };
        }
        return inc;
      });
      localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(compacted));
    } catch (err2) {
      console.warn('Second saveIncidents attempt failed. Stripping large photos and truncating list...', err2);
      try {
        // Step 2: Strip all base64 photo strings > 30KB and keep top 40 incidents
        const stripped = incidents.slice(0, 40).map((inc) => ({
          ...inc,
          photo: inc.photo && inc.photo.length > 30000 ? undefined : inc.photo,
        }));
        localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(stripped));
      } catch (err3) {
        console.error('Failed to persist incidents to localStorage due to strict quota limits:', err3);
      }
    }
  }
}

export function loadHelpPoints(): HelpPoint[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HELP_POINTS);
    if (!raw) {
      saveHelpPoints(SAMPLE_HELP_POINTS);
      return SAMPLE_HELP_POINTS;
    }
    return JSON.parse(raw);
  } catch {
    return SAMPLE_HELP_POINTS;
  }
}

export function saveHelpPoints(points: HelpPoint[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.HELP_POINTS, JSON.stringify(points));
  } catch (err) {
    console.error('Failed to save help points', err);
  }
}

export function loadAlerts(): AlertItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ALERTS);
    if (!raw) {
      saveAlerts(SAMPLE_ALERTS);
      return SAMPLE_ALERTS;
    }
    return JSON.parse(raw);
  } catch {
    return SAMPLE_ALERTS;
  }
}

export function saveAlerts(alerts: AlertItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
  } catch (err) {
    console.error('Failed to save alerts', err);
  }
}

export function loadHeroes(): HeroProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HEROES);
    if (!raw) {
      saveHeroes(SAMPLE_HEROES);
      return SAMPLE_HEROES;
    }
    return JSON.parse(raw);
  } catch {
    return SAMPLE_HEROES;
  }
}

export function saveHeroes(heroes: HeroProfile[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.HEROES, JSON.stringify(heroes));
  } catch (err) {
    console.error('Failed to save heroes', err);
  }
}

export function loadActivityLogs(): ActivityLogItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (!raw) {
      saveActivityLogs(SAMPLE_ACTIVITY_LOGS);
      return SAMPLE_ACTIVITY_LOGS;
    }
    return JSON.parse(raw);
  } catch {
    return SAMPLE_ACTIVITY_LOGS;
  }
}

export function saveActivityLogs(logs: ActivityLogItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs.slice(0, 100)));
  } catch (err) {
    console.error('Failed to save logs', err);
  }
}

export function addActivityLog(who: string, what: string): void {
  const current = loadActivityLogs();
  const newLog: ActivityLogItem = {
    id: 'log_' + Date.now(),
    who,
    what,
    when: 'Just now',
    timestamp: Date.now(),
  };
  saveActivityLogs([newLog, ...current]);
}

export function resetAllDataToDefault(): void {
  try {
    localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(SAMPLE_INCIDENTS));
    localStorage.setItem(STORAGE_KEYS.HELP_POINTS, JSON.stringify(SAMPLE_HELP_POINTS));
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(SAMPLE_ALERTS));
    localStorage.setItem(STORAGE_KEYS.HEROES, JSON.stringify(SAMPLE_HEROES));
    localStorage.setItem(STORAGE_KEYS.CYCLONES, JSON.stringify(SAMPLE_CYCLONES));
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(SAMPLE_ARTICLES));
    localStorage.setItem(STORAGE_KEYS.CREWS, JSON.stringify(SAMPLE_CREWS));
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(SAMPLE_ACTIVITY_LOGS));
    localStorage.removeItem(STORAGE_KEYS.QUEUED_REPORTS);
  } catch (err) {
    console.warn('Could not reset all localStorage keys due to quota:', err);
  }
  addActivityLog('Admin Sample', 'Reset all system data to initial sample state.');
}
