import { Language, UserRole } from '../types.ts';

export type OperatingMode = 'daily' | 'emergency';

export interface ModeSettingsTable {
  app_mode: OperatingMode;
  modeSince: string;
  modeReason: string;
  disasterName: string;
  expectedEnd?: string;
  emergencyBroadcastMessage?: string;
  emergencyBroadcastExpiry?: string;
  scheduledSwitch?: {
    targetMode: OperatingMode;
    switchAt: string;
    reason: string;
    disasterName?: string;
    createdBy: string;
  } | null;
  lastUpdated: string;
}

export interface ModeHistoryRecord {
  id: string;
  from_mode: OperatingMode;
  to_mode: OperatingMode;
  reason: string;
  disasterName?: string;
  switched_by: string;
  switched_at: string;
  ended_at?: string;
  duration?: string;
}

export type ModeFeatureKey =
  | 'report_hazard'
  | 'everyday_hazard_types'
  | 'urgent_6_hazard_types'
  | 'urgent_one_tap_report'
  | 'live_map'
  | 'priority_queue'
  | 'triage_drawer'
  | 'nearby_help_static'
  | 'live_relief_camp_capacity'
  | 'route_safety_warning'
  | 'evacuation_safe_route_guide'
  | 'emergency_contacts'
  | 'volunteer_signup_tasks'
  | 'precautions_preparedness_kit'
  | 'weather_widget'
  | 'active_warning_card'
  | 'alerts_warnings'
  | 'recently_cleared_list'
  | 'cyclone_history_articles'
  | 'our_heroes'
  | 'our_heroes_thank_you_banner'
  | 'dashboard_7day_trend'
  | 'dashboard_live_panel'
  | 'crew_tracking_board'
  | 'emergency_broadcast_banner'
  | 'red_emergency_strip'
  | 'sound_vibration_alerts'
  | 'citizen_road_clear_feedback'
  | 'low_data_mode';

export interface ModeFeatureRecord {
  feature_key: ModeFeatureKey;
  label_en: string;
  label_te: string;
  label_hi: string;
  category: 'Reporting' | 'Map & Help' | 'Preparedness & Alerts' | 'Operations & Heroes';
  daily_enabled: boolean;
  emergency_enabled: boolean;
  updated_by: string;
  updated_at: string;
}

export type ModeAssetSlotKey =
  | 'home_hero'
  | 'tile_help'
  | 'tile_medical'
  | 'tile_precautions'
  | 'tile_heroes'
  | 'precautions_thumb'
  | 'share_card';

export interface ModeAssetRecord {
  slot_key: ModeAssetSlotKey;
  slot_label: string;
  mode: OperatingMode;
  image_url_desktop: string;
  image_url_mobile: string;
  fallback_color: string;
  alt_en: string;
  alt_te: string;
  alt_hi: string;
  credit: string;
  licence: string;
  updated_by: string;
  updated_at: string;
}

export type ModeContentKey =
  | 'global_pill'
  | 'hero_headline'
  | 'hero_subline'
  | 'primary_cta'
  | 'secondary_cta'
  | 'banner_message'
  | 'empty_reports_text'
  | 'heroes_banner_text'
  | 'share_tagline';

export interface ModeContentRecord {
  key: ModeContentKey;
  label: string;
  mode: OperatingMode;
  language: Language;
  text: string;
  updated_by: string;
  updated_at: string;
}

export interface VolunteerTaskRequest {
  id: string;
  title: string;
  area: string;
  skillsNeeded: string;
  postedBy: string;
  postedAt: string;
  volunteersResponded: {
    name: string;
    phone: string;
    confirmed: boolean;
  }[];
  status: 'Open' | 'Fulfilled';
}

export interface EmergencyContact {
  id: string;
  name: string;
  category:
    | 'national_emergency'
    | 'medical'
    | 'fire_rescue'
    | 'police'
    | 'control_room'
    | 'electricity_water'
    | 'volunteers_ngo'
    | 'animal_wildlife';
  description: string;
  phone: string;
  whatsapp?: string;
  area: string;
  availability: string;
  languages: string[];
  verified: boolean;
  verifiedOn: string;
  source: string;
  sample: boolean;
  status: 'Approved' | 'Pending' | 'Hidden';
  createdBy?: string;
  updatedAt: string;
}

export interface VolunteerRegistration {
  id: string;
  name: string;
  phone: string;
  area: string;
  skills: string[];
  availability: string;
  status: 'Pending' | 'Approved' | 'Inactive';
  approvedBy?: string;
  createdAt: string;
  consentToShowPhone: boolean;
}

export const MODE_CONFIG = {
  daily: {
    name: 'Daily mode',
    badgeText: 'Daily mode',
    badgeBg: 'bg-blue-100 text-[#2457C5] border border-blue-200',
    dotColor: 'bg-[#2457C5]',
    tickerStyle: 'calm blue',
    heroOverlayClass: 'from-white/95 via-white/75 to-transparent text-[#101A3A]',
    heroBorderClass: 'border-slate-200',
    heroHeadline: 'Safer roads, every day.',
    heroSubline: 'Report road hazards. Find help nearby. Be prepared.',
    primaryButtonText: 'Report Road Hazard',
    secondaryButtonText: 'Find Help Nearby',
    homeSectionOrder: ['help', 'precautions', 'clearances', 'alerts', 'heroes', 'workflow'] as const,
    reportDefaultUrgency: 'low',
    mapDefaultFilter: 'All open',
    helpDefaultChip: 'All',
    precautionsTab: 'before' as const,
    statusWords: {
      Pending: 'Open',
      Assigned: 'Scheduled',
      'In Progress': 'Scheduled',
      Cleared: 'Cleared',
    },
    dashboardView: '7-day trend, average clearance time & crew availability',
    notificationStyle: 'In-app toasts only',
    priorityBoost: 0,
  },
  emergency: {
    name: 'Emergency mode',
    badgeText: 'EMERGENCY MODE',
    badgeBg: 'bg-red-600 text-white animate-pulse border border-red-400',
    dotColor: 'bg-red-600 animate-ping',
    tickerStyle: 'urgent red strip',
    heroOverlayClass: 'from-white/98 via-white/92 to-white/45 text-[#101A3A]',
    heroBorderClass: 'border-t-4 border-t-[#D32F2F] border-slate-200',
    heroHeadline: 'Help reaches blocked roads faster.',
    heroSubline: 'Report hazards. Find help. Stay safe.',
    primaryButtonText: 'Report Hazard',
    secondaryButtonText: 'Find Help Nearby',
    homeSectionOrder: ['contacts', 'blockedRoads', 'reliefCamps', 'alerts', 'precautions', 'heroes', 'workflow'] as const,
    reportDefaultUrgency: 'critical',
    mapDefaultFilter: 'Critical and Pending',
    helpDefaultChip: 'Shelter',
    precautionsTab: 'during' as const,
    statusWords: {
      Pending: 'Pending',
      Assigned: 'On the way',
      'In Progress': 'Working',
      Cleared: 'Cleared',
    },
    dashboardView: 'Live panel: open critical count, free/busy crews, average time & relief camp capacity',
    notificationStyle: 'In-app toasts + sound/vibration + critical banner',
    priorityBoost: 0.5,
  },
};

export const DEFAULT_MODE_SETTINGS: ModeSettingsTable = {
  app_mode: 'daily',
  modeSince: '08:30',
  modeReason: 'Routine municipal road operations across Visakhapatnam.',
  disasterName: 'Cyclone Alert — Coastal Visakhapatnam',
  expectedEnd: '',
  emergencyBroadcastMessage: 'Heavy coastal squalls active. Keep arterial hospital corridors clear for emergency vehicles.',
  emergencyBroadcastExpiry: '23:59 IST',
  scheduledSwitch: null,
  lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

export const DEFAULT_MODE_HISTORY: ModeHistoryRecord[] = [
  {
    id: 'mh_1',
    from_mode: 'emergency',
    to_mode: 'daily',
    reason: 'Post-storm arterial corridors cleared; returning to normal municipal schedule.',
    disasterName: 'Coastal Squall Warning',
    switched_by: 'Admin (Municipal Commissioner Office)',
    switched_at: 'Yesterday, 18:20',
    ended_at: 'Active',
    duration: '14h 10m',
  },
  {
    id: 'mh_2',
    from_mode: 'daily',
    to_mode: 'emergency',
    reason: 'IMD Orange Alert issued for Visakhapatnam coast; precautionary crew deployment.',
    disasterName: 'Coastal Squall Warning',
    switched_by: 'Admin (Municipal Commissioner Office)',
    switched_at: '2 days ago, 06:00',
    ended_at: 'Yesterday, 18:20',
    duration: '36h 20m',
  },
];

export const DEFAULT_MODE_FEATURES: ModeFeatureRecord[] = [
  {
    feature_key: 'report_hazard',
    label_en: 'Report road hazard (photo, GPS, AI score, SMS, offline queue)',
    label_te: 'రోడ్డు ప్రమాద నివేదిక (ఫోటో, GPS, AI స్కోర్, SMS, ఆఫ్‌లైన్ క్యూ)',
    label_hi: 'सड़क खतरे की रिपोर्ट (फोटो, जीपीएस, एआई स्कोर, एसएमएस, ऑफ़लाइन कतार)',
    category: 'Reporting',
    daily_enabled: true,
    emergency_enabled: true,
    updated_by: 'System Default',
    updated_at: 'Default',
  },
  {
    feature_key: 'everyday_hazard_types',
    label_en: 'Everyday hazard types (fallen branch, waterlogged road, hanging wire, leaning tree)',
    label_te: 'సాధారణ ప్రమాద రకాలు (పడిన కొమ్మ, నీరు నిలిచిన రోడ్డు, వేలాడే తీగ, వంగిన చెట్టు)',
    label_hi: 'रोजमर्रा के खतरे के प्रकार (गिरी टहनी, जलभराव, लटकता तार, झुका पेड़)',
    category: 'Reporting',
    daily_enabled: true,
    emergency_enabled: false,
    updated_by: 'System Default',
    updated_at: 'Default',
  },
  {
    feature_key: 'urgent_6_hazard_types',
    label_en: '6 urgent hazard types only (Fully blocked, One lane, Live wire, Tree, Pole, Water)',
    label_te: '6 అత్యవసర ప్రమాద రకాలు మాత్రమే (పూర్తి బ్లాక్, ఒక లేన్, విద్యుత్ తీగ, చెట్టు, స్తంభం, నీరు)',
    label_hi: 'केवल 6 तत्काल खतरे के प्रकार (पूरी तरह बंद, एक लेन, बिजली तार, पेड़, खंभा, पानी)',
    category: 'Reporting',
    daily_enabled: false,
    emergency_enabled: true,
    updated_by: 'System Default',
    updated_at: 'Default',
  },
  {
    feature_key: 'urgent_one_tap_report',
    label_en: 'Urgent one-tap report shortcut (opens camera and sends with GPS in 2 taps)',
    label_te: 'అత్యవసర వన్-ట్యాప్ రిపోర్ట్ షార్ట్‌కట్ (కెమెరా మరియు GPS తో 2 ట్యాప్‌లలో నివేదిక)',
    label_hi: 'तत्काल वन-टैप रिपोर्ट शॉर्टकट (कैमरा और जीपीएस के साथ 2 टैप में रिपोर्ट)',
    category: 'Reporting',
    daily_enabled: false,
    emergency_enabled: true,
    updated_by: 'System Default',
    updated_at: 'Default',
  },
  {
    feature_key: 'live_map',
    label_en: 'Live Map with Hazards and Help points layers',
    label_te: 'ప్రమాదాలు మరియు సహాయ కేంద్రాలతో లైవ్ మ్యాప్',
    label_hi: 'खतरों और सहायता केंद्रों के साथ लाइव मैप',
    category: 'Map & Help',
    daily_enabled: true,
    emergency_enabled: true,
    updated_by: 'System Default',
    updated_at: 'Default',
  },
  {
    feature_key: 'priority_queue',
    label_en: 'Queue sorted by priority score',
    label_te: 'ప్రాధాన్యత ఆధారంగా క్రమబద్ధీకరించిన క్యూ',
    label_hi: 'प्राथमिकता के अनुसार क्रमबद्ध कतार',
    category: 'Map & Help',
    daily_enabled: true,
    emergency_enabled: true,
    updated_by: 'System Default',
    updated_at: 'Default',
  },
  {
    feature_key: 'triage_drawer',
    label_en: 'Triage Drawer with dispatch (staff only)',
    label_te: 'డిస్పాచ్‌తో ట్రయాజ్ డ్రాయర్ (సిబ్బందికి మాత్రమే)',
    label_hi: 'डिस्पैच के साथ ट्राइएज ड्रॉअर (केवल स्टाफ)',
    category: 'Operations & Heroes',
    daily_enabled: true,
    emergency_enabled: true,
    updated_by: 'System Default',
    updated_at: 'Default',
  },
  {
    feature_key: 'nearby_help_static',
    label_en: 'Nearby Help directory with distance, Call and Directions',
    label_te: 'దూరం, కాల్ మరియు దిశలతో సమీప సహాయ జాబితా',
    label_hi: 'दूरी, कॉल और दिशाओं के साथ निकटतम सहायता सूची',
    category: 'Map & Help',
    daily_enabled: true,
    emergency_enabled: true,
    updated_by: 'System Default',
    updated_at: 'Default',
  },
  {
    feature_key: 'live_relief_camp_capacity',
    label_en: 'Live relief camp capacity (beds free & status + Command update button)',
    label_te: 'లైవ్ పునరావాస కేంద్రాల సామర్థ్యం (ఖాళీ పడకలు & స్థితి)',
    label_hi: 'लाइव राहत शिविर क्षमता (खाली बेड और स्थिति)',
    category: 'Map & Help',
    daily_enabled: false,
    emergency_enabled: true,
    updated_by: 'System Default',
    updated_at: 'Default',
  },
  {
    feature_key: 'route_safety_warning',
    label_en: 'Route safety warning on directions (warns about blocked hazards along route)',
    label_te: 'మార్గ భద్రతా హెచ్చరిక (మార్గంలో ఉన్న అడ్డంకులపై హెచ్చరిక)',
    label_hi: 'मार्ग सुरक्षा चेतावनी (रास्ते में रुकावटों की चेतावनी)',
    category: 'Map & Help',
    daily_enabled: false,
    emergency_enabled: true,
    updated_by: 'System Default',
    updated_at: 'Default',
  },
  {
    feature_key: 'evacuation_safe_route_guide',
    label_en: 'Evacuation and safe-route guide',
    label_te: 'తరలింపు మరియు సురక్షిత మార్గదర్శి',
    label_hi: 'निकासी और सुरक्षित मार्गदर्शिका',
    category: 'Map & Help',
    daily_enabled: false,
    emergency_enabled: true,
    updated_by: 'System Default',
    updated_at: 'Default',
  },
  {
    feature_key: 'emergency_contacts',
    label_en: 'Emergency Contacts directory (national numbers pinned at top)',
    label_te: 'అత్యవసర నంబర్ల డైరెక్టరీ (జాతీయ నంబర్లు పైన పిన్ చేయబడతాయి)',
    label_hi: 'आपातकालीन संपर्क निर्देशिका (राष्ट्रीय नंबर शीर्ष पर पिन)',
    category: 'Preparedness & Alerts',
    daily_enabled: true,
    emergency_enabled: true,
    updated_by: 'System Default',
    updated_at: 'Default',
  },
  {
    feature_key: 'volunteer_signup_tasks',
    label_en: 'Volunteer sign-up and "Volunteers needed now" task requests',
    label_te: 'వాలంటీర్ నమోదు మరియు తక్షణ వాలంటీర్ టాస్క్ అభ్యర్థనలు',
    label_hi: 'स्वयंसेवक पंजीकरण और तत्काल कार्य अनुरोध',
    category: 'Operations & Heroes',
    daily_enabled: false,
    emergency_enabled: true,
    updated_by: 'System Default',
    updated_at: 'Default',
  },
  {
    feature_key: 'precautions_preparedness_kit',
    label_en: 'Precautions "Before cyclone" checklist and preparedness kit list',
    label_te: 'తుఫానుకు ముందు జాగ్రత్తలు మరియు సిద్ధత కిట్ జాబితా',
    label_hi: 'चक्रवात से पहले की सावधानियां और तैयारी किट सूची',
    category: 'Preparedness & Alerts',
    daily_enabled: true,
    emergency_enabled: false,
    updated_by: 'System Default',
    updated_at: 'Default',
  },
  {
    feature_key: 'weather_widget',
    label_en: 'Coastal Weather widget (Daily mode)',
    label_te: 'తీరప్రాంత వాతావరణ విడ్జెట్ (డైలీ మోడ్)',
    label_hi: 'तटीय मौसम विजेट (दैनिक मोड)',
    category: 'Preparedness & Alerts',
    daily_enabled: true,
    emergency_enabled: false,
    updated_by: 'System Default',
    updated_at: 'Default',
  },
  {
    feature_key: 'active_warning_card',
    label_en: 'Active Cyclone Warning card in place of weather widget',
    label_te: 'వాతావరణ విడ్జెట్ స్థానంలో యాక్టివ్ తుఫాను హెచ్చరిక కార్డు',
    label_hi: 'मौसम विजेट के स्थान पर सक्रिय चक्रवात चेतावनी कार्ड',
    category: 'Preparedness & Alerts',
    daily_enabled: false,
    emergency_enabled: true,
    updated_by: 'System Default',
    updated_at: 'Default',
  },
  {
    feature_key: 'alerts_warnings',
    label_en: 'Alerts and Warnings feed',
    label_te: 'హెచ్చరికలు మరియు సూచనల జాబితా',
    label_hi: 'चेतावनी और सूचनाएं फ़ीड',
    category: 'Preparedness & Alerts',
    daily_enabled: true,
    emergency_enabled: true,
    updated_by: 'System Default',
    updated_at: 'Default',
  },
  {
    feature_key: 'recently_cleared_list',
    label_en: '"Recently cleared" road hazards list (last 7 days)',
    label_te: '"ఇటీవల క్లియర్ చేసినవి" జాబితా (గత 7 రోజులు)',
    label_hi: '"हाल ही में साफ की गई" सड़कें (पिछले 7 दिन)',
    category: 'Preparedness & Alerts',
    daily_enabled: true,
    emergency_enabled: false,
    updated_by: 'System Default',
    updated_at: 'Default',
  },
  {
    feature_key: 'cyclone_history_articles',
    label_en: 'Cyclone History and Research Articles',
    label_te: 'తుఫాను చరిత్ర మరియు పరిశోధన వ్యాసాలు',
    label_hi: 'चक्रवात इतिहास और शोध लेख',
    category: 'Preparedness & Alerts',
    daily_enabled: true,
    emergency_enabled: true,
    updated_by: 'System Default',
    updated_at: 'Default',
  },
  {
    feature_key: 'our_heroes',
    label_en: 'Our Heroes responder recognition page',
    label_te: 'మన హీరోలు (సిబ్బంది గుర్తింపు పేజీ)',
    label_hi: 'हमारे नायक (राहतकर्मी सम्मान पृष्ठ)',
    category: 'Operations & Heroes',
    daily_enabled: true,
    emergency_enabled: true,
    updated_by: 'System Default',
    updated_at: 'Default',
  },
  {
    feature_key: 'our_heroes_thank_you_banner',
    label_en: '"Thank you to everyone working right now" special banner on Our Heroes',
    label_te: '"ప్రస్తుతం పనిచేస్తున్న ప్రతి ఒక్కరికీ ధన్యవాదాలు" ప్రత్యేక బ్యానర్',
    label_hi: '"अभी काम कर रहे सभी लोगों को धन्यवाद" विशेष बैनर',
    category: 'Operations & Heroes',
    daily_enabled: false,
    emergency_enabled: true,
    updated_by: 'System Default',
    updated_at: 'Default',
  },
  {
    feature_key: 'dashboard_7day_trend',
    label_en: 'Staff Dashboard: 7-day trend and average clearance time',
    label_te: 'స్టాఫ్ డాష్‌బోర్డ్: 7-రోజుల ట్రెండ్ మరియు సగటు క్లియరెన్స్ సమయం',
    label_hi: 'स्टाफ डैशबोर्ड: 7-दिन का रुझान और औसत सफाई समय',
    category: 'Operations & Heroes',
    daily_enabled: true,
    emergency_enabled: false,
    updated_by: 'System Default',
    updated_at: 'Default',
  },
  {
    feature_key: 'dashboard_live_panel',
    label_en: 'Live Dashboard panel (open critical, crews free/busy, relief capacity, 10s refresh)',
    label_te: 'లైవ్ డాష్‌బోర్డ్ ప్యానెల్ (క్రిటికల్ సంఖ్య, సిబ్బంది స్థితి, 10 సెకన్ల రిఫ్రెష్)',
    label_hi: 'लाइव डैशबोर्ड पैनल (गंभीर मामले, दल स्थिति, 10 सेकंड रिफ्रेश)',
    category: 'Operations & Heroes',
    daily_enabled: false,
    emergency_enabled: true,
    updated_by: 'System Default',
    updated_at: 'Default',
  },
  {
    feature_key: 'crew_tracking_board',
    label_en: 'Crew tracking board (Free, Busy, On the way, Working)',
    label_te: 'క్రూ ట్రాకింగ్ బోర్డ్ (ఖాళీగా, బిజీగా, మార్గంలో, పనిలో)',
    label_hi: 'दल ट्रैकिंग बोर्ड (उपलब्ध, व्यस्त, रास्ते में, कार्यरत)',
    category: 'Operations & Heroes',
    daily_enabled: false,
    emergency_enabled: true,
    updated_by: 'System Default',
    updated_at: 'Default',
  },
  {
    feature_key: 'red_emergency_strip',
    label_en: 'Red Emergency Mode strip at top of every page with disaster name and Active since [time]',
    label_te: 'ప్రతి పేజీ పైన తుఫాను పేరు మరియు సమయంతో ఎరుపు ఎమర్జెన్సీ స్ట్రిప్',
    label_hi: 'हर पृष्ठ के शीर्ष पर आपदा नाम और समय के साथ लाल आपातकालीन पट्टी',
    category: 'Preparedness & Alerts',
    daily_enabled: false,
    emergency_enabled: true,
    updated_by: 'System Default',
    updated_at: 'Default',
  },
  {
    feature_key: 'emergency_broadcast_banner',
    label_en: 'Emergency broadcast banner from Command to all users with expiry time',
    label_te: 'కమాండ్ నుండి అందరు వినియోగదారులకు అత్యవసర బ్రాడ్‌కాస్ట్ బ్యానర్',
    label_hi: 'कमांड से सभी उपयोगकर्ताओं के लिए आपातकालीन प्रसारण बैनर',
    category: 'Preparedness & Alerts',
    daily_enabled: false,
    emergency_enabled: true,
    updated_by: 'System Default',
    updated_at: 'Default',
  },
  {
    feature_key: 'sound_vibration_alerts',
    label_en: 'Sound and vibration alerts for new Critical incidents (opt-in)',
    label_te: 'కొత్త క్రిటికల్ సంఘటనల కోసం సౌండ్ మరియు వైబ్రేషన్ అలర్ట్‌లు',
    label_hi: 'नई गंभीर घटनाओं के लिए ध्वनि और कंपन अलर्ट',
    category: 'Preparedness & Alerts',
    daily_enabled: false,
    emergency_enabled: true,
    updated_by: 'System Default',
    updated_at: 'Default',
  },
  {
    feature_key: 'citizen_road_clear_feedback',
    label_en: 'Citizen "Is this road clear?" verification feedback',
    label_te: '"ఈ రోడ్డు క్లియర్ అయిందా?" పౌరుల అభిప్రాయం',
    label_hi: '"क्या यह सड़क साफ है?" नागरिक प्रतिक्रिया',
    category: 'Reporting',
    daily_enabled: false,
    emergency_enabled: true,
    updated_by: 'System Default',
    updated_at: 'Default',
  },
  {
    feature_key: 'low_data_mode',
    label_en: 'Automatic Low-data mode on 2G/Offline (smaller images, text-first lists)',
    label_te: '2G/ఆఫ్‌లైన్‌లో ఆటోమేటిక్ లో-డేటా మోడ్ (టెక్స్ట్-ఫస్ట్ జాబితాలు)',
    label_hi: '2G/ऑफ़लाइन पर स्वचालित लो-डेटा मोड (टेक्स्ट-फर्स्ट सूचियां)',
    category: 'Map & Help',
    daily_enabled: false,
    emergency_enabled: true,
    updated_by: 'System Default',
    updated_at: 'Default',
  },
];

export const DEFAULT_MODE_ASSETS: ModeAssetRecord[] = [
  // Home Hero
  {
    slot_key: 'home_hero',
    slot_label: 'Home Hero Banner (Desktop & Mobile Crops)',
    mode: 'daily',
    image_url_desktop: '/assets/aistudio/d035fa80-03c5-49c5-931f-af467492e964_47cae099.jpg',
    image_url_mobile: '/assets/aistudio/d035fa80-03c5-49c5-931f-af467492e964_47cae099.jpg',
    fallback_color: '#E0F2FE',
    alt_en: 'Bright, calm coastal road in Visakhapatnam on a clear day. A municipal worker in an orange vest inspects a tree by the road. Families walk on the footpath under a sunny sky.',
    alt_te: 'విశాఖపట్నం తీరప్రాంత రోడ్డులో ఆరెంజ్ వెస్ట్ ధరించిన మున్సిపల్ కార్మికుడు మరియు ఫుట్‌పాత్‌పై నడుస్తున్న కుటుంబాలు.',
    alt_hi: 'साफ दिन में विशाखापत्तनम की तटीय सड़क पर नारंगी जैकेट पहने नगर निगम कर्मी और फुटपाथ पर चलते परिवार।',
    credit: 'EcoTriage Original Illustration',
    licence: 'CC-BY 4.0 Municipal Civic Media',
    updated_by: 'System Default',
    updated_at: 'Default',
  },
  {
    slot_key: 'home_hero',
    slot_label: 'Home Hero Banner (Desktop & Mobile Crops)',
    mode: 'emergency',
    image_url_desktop: '/assets/aistudio/Gemini_Generated_Image_ubc9rmubc9rmubc9_a09387d6.png',
    image_url_mobile: '/assets/aistudio/Gemini_Generated_Image_ubc9rmubc9rmubc9_a09387d6.png',
    fallback_color: '#1E293B',
    alt_en: 'Municipal response crew in reflective jackets clearing a fallen tree on a wet coastal road during a storm',
    alt_te: 'తుఫాను సమయంలో తడిసిన తీరప్రాంత రోడ్డుపై పడిపోయిన చెట్టును తొలగిస్తున్న మున్సిపల్ బృందం',
    alt_hi: 'तूफान के दौरान गीली तटीय सड़क पर गिरे पेड़ को हटाता नगर निगम राहत दल',
    credit: 'EcoTriage Original Illustration',
    licence: 'CC-BY 4.0 Municipal Emergency Media',
    updated_by: 'System Default',
    updated_at: 'Default',
  },
  // Service Tile 1: Help / Relief Camp
  {
    slot_key: 'tile_help',
    slot_label: 'Service Tile: Nearby Help / Relief Camps',
    mode: 'daily',
    image_url_desktop: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=75',
    image_url_mobile: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=400&q=70',
    fallback_color: '#DCFCE7',
    alt_en: 'Community school building prepared as a standby municipal relief center in daylight',
    alt_te: 'స్టాండ్‌బై పునరావాస కేంద్రంగా సిద్ధంగా ఉన్న పాఠశాల భవనం',
    alt_hi: 'स्टैंडबाय राहत केंद्र के रूप में तैयार सामुदायिक स्कूल भवन',
    credit: 'EcoTriage Civic Archive',
    licence: 'CC0 Public Domain',
    updated_by: 'System Default',
    updated_at: 'Default',
  },
  {
    slot_key: 'tile_help',
    slot_label: 'Service Tile: Nearby Help / Relief Camps',
    mode: 'emergency',
    image_url_desktop: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=600&q=75',
    image_url_mobile: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=400&q=70',
    fallback_color: '#FEE2E2',
    alt_en: 'Active emergency relief camp with volunteers distributing water and supplies',
    alt_te: 'వాలంటీర్లు నీరు మరియు ఆహారం అందిస్తున్న యాక్టివ్ పునరావాస కేంద్రం',
    alt_hi: 'स्वयंसेवकों द्वारा पानी और राहत सामग्री वितरित करते हुए सक्रिय राहत शिविर',
    credit: 'EcoTriage Emergency Media',
    licence: 'CC0 Public Domain',
    updated_by: 'System Default',
    updated_at: 'Default',
  },
  // Service Tile 2: Medical
  {
    slot_key: 'tile_medical',
    slot_label: 'Service Tile: Medical Help',
    mode: 'daily',
    image_url_desktop: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=75',
    image_url_mobile: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=400&q=70',
    fallback_color: '#DBEAFE',
    alt_en: 'Clean municipal hospital clinic reception corridor open for daily care',
    alt_te: 'రోజువారీ వైద్య సేవల కోసం తెరిచి ఉన్న ఆసుపత్రి కారిడార్',
    alt_hi: 'दैनिक देखभाल के लिए खुला शांत अस्पताल क्लिनिक गलियारा',
    credit: 'EcoTriage Civic Archive',
    licence: 'CC0 Public Domain',
    updated_by: 'System Default',
    updated_at: 'Default',
  },
  {
    slot_key: 'tile_medical',
    slot_label: 'Service Tile: Medical Help',
    mode: 'emergency',
    image_url_desktop: 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=600&q=75',
    image_url_mobile: 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=400&q=70',
    fallback_color: '#FCE7F3',
    alt_en: 'Emergency response ambulance ready for rapid trauma dispatch on cleared road',
    alt_te: 'అత్యవసర వైద్య సహాయం కోసం సిద్ధంగా ఉన్న 108 అంబులెన్స్',
    alt_hi: 'त्वरित आपातकालीन चिकित्सा सहायता के लिए तैयार एम्बुलेंस',
    credit: 'EcoTriage Emergency Media',
    licence: 'CC0 Public Domain',
    updated_by: 'System Default',
    updated_at: 'Default',
  },
  // Service Tile 3: Precautions
  {
    slot_key: 'tile_precautions',
    slot_label: 'Service Tile: Safety Precautions',
    mode: 'daily',
    image_url_desktop: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=600&q=75',
    image_url_mobile: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=400&q=70',
    fallback_color: '#FEF3C7',
    alt_en: 'Family preparedness checklist, flashlight, and first-aid kit neatly organized',
    alt_te: 'కుటుంబ భద్రతా చెక్‌లిస్ట్, టార్చ్‌లైట్ మరియు ఫస్ట్-ఎయిడ్ కిట్',
    alt_hi: 'परिवार सुरक्षा चेकलिस्ट, टॉर्च और प्राथमिक उपचार किट',
    credit: 'EcoTriage Civic Archive',
    licence: 'CC0 Public Domain',
    updated_by: 'System Default',
    updated_at: 'Default',
  },
  {
    slot_key: 'tile_precautions',
    slot_label: 'Service Tile: Safety Precautions',
    mode: 'emergency',
    image_url_desktop: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=600&q=75',
    image_url_mobile: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=400&q=70',
    fallback_color: '#FFEDD5',
    alt_en: 'Heavy coastal storm wind warning sign advising citizens to stay indoors and avoid fallen wires',
    alt_te: 'తీవ్ర తుఫాను సమయంలో ఇంట్లోనే ఉండాలని మరియు విద్యుత్ తీగలకు దూరంగా ఉండాలని సూచించే హెచ్చరిక',
    alt_hi: 'तेज चक्रवाती हवाओं के दौरान घर के अंदर रहने और बिजली के तारों से बचने की चेतावनी',
    credit: 'EcoTriage Emergency Media',
    licence: 'CC0 Public Domain',
    updated_by: 'System Default',
    updated_at: 'Default',
  },
  // Service Tile 4: Our Heroes
  {
    slot_key: 'tile_heroes',
    slot_label: 'Service Tile: Our Heroes',
    mode: 'daily',
    image_url_desktop: 'https://images.unsplash.com/photo-1541888946425-d09bb18086f6?auto=format&fit=crop&w=600&q=75',
    image_url_mobile: 'https://images.unsplash.com/photo-1541888946425-d09bb18086f6?auto=format&fit=crop&w=400&q=70',
    fallback_color: '#E0E7FF',
    alt_en: 'Municipal field workers inspecting roadside greenery and drainage in daylight',
    alt_te: 'పగటిపూట రోడ్డు పక్కన చెట్లను మరియు డ్రైనేజీని తనిఖీ చేస్తున్న మున్సిపల్ సిబ్బంది',
    alt_hi: 'दिन के उजाले में सड़क किनारे हरियाली और नालियों का निरीक्षण करते नगर निगम कर्मी',
    credit: 'EcoTriage Civic Archive',
    licence: 'CC0 Public Domain',
    updated_by: 'System Default',
    updated_at: 'Default',
  },
  {
    slot_key: 'tile_heroes',
    slot_label: 'Service Tile: Our Heroes',
    mode: 'emergency',
    image_url_desktop: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=75',
    image_url_mobile: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=70',
    fallback_color: '#DBEAFE',
    alt_en: 'Emergency rescue squad in hard hats and reflective gear working in heavy rain to clear roads',
    alt_te: 'భారీ వర్షంలో రహదారులను క్లియర్ చేయడానికి శ్రమిస్తున్న అత్యవసర రెస్క్యూ బృందం',
    alt_hi: 'भारी बारिश में सड़कें साफ करने के लिए काम करता आपातकालीन बचाव दल',
    credit: 'EcoTriage Emergency Media',
    licence: 'CC0 Public Domain',
    updated_by: 'System Default',
    updated_at: 'Default',
  },
  // Precautions Thumbnail
  {
    slot_key: 'precautions_thumb',
    slot_label: 'Precautions Page Banner Thumbnail',
    mode: 'daily',
    image_url_desktop: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=900&q=75',
    image_url_mobile: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=500&q=70',
    fallback_color: '#EFF6FF',
    alt_en: 'Household emergency preparedness kit with drinking water, torch, battery radio, and medical supplies',
    alt_te: 'తాగునీరు, టార్చ్, రేడియో మరియు మందులతో కూడిన ఇంటి అత్యవసర సిద్ధత కిట్',
    alt_hi: 'पेयजल, टॉर्च, रेडियो और दवाओं के साथ घरेलू आपातकालीन तैयारी किट',
    credit: 'EcoTriage Preparedness Guide',
    licence: 'CC0 Public Domain',
    updated_by: 'System Default',
    updated_at: 'Default',
  },
  {
    slot_key: 'precautions_thumb',
    slot_label: 'Precautions Page Banner Thumbnail',
    mode: 'emergency',
    image_url_desktop: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=900&q=75',
    image_url_mobile: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=500&q=70',
    fallback_color: '#FEF2F2',
    alt_en: 'During-cyclone safety visual showing indoor shelter precautions and staying clear of downed power lines',
    alt_te: 'తుఫాను సమయంలో సురక్షిత ఆశ్రయం మరియు విద్యుత్ తీగలకు దూరంగా ఉండటాన్ని చూపే చిత్రం',
    alt_hi: 'चक्रवात के दौरान सुरक्षित आश्रय और गिरे बिजली के तारों से दूर रहने का दृश्य',
    credit: 'EcoTriage Emergency Guide',
    licence: 'CC0 Public Domain',
    updated_by: 'System Default',
    updated_at: 'Default',
  },
  // Share Card
  {
    slot_key: 'share_card',
    slot_label: 'Social Share Image for Links',
    mode: 'daily',
    image_url_desktop: '/assets/aistudio/EcoTriage_Emergency_Response_Dashboard_Showroom_7ce7172b.png',
    image_url_mobile: '/assets/aistudio/EcoTriage_Emergency_Response_Dashboard_Showroom_7ce7172b.png',
    fallback_color: '#EFF6FF',
    alt_en: 'EcoTriage. Safer roads, every day.',
    alt_te: 'ఎకోట్రయాజ్. ప్రతిరోజూ సురక్షితమైన రహదారులు.',
    alt_hi: 'इकोट्राइएज। हर दिन सुरक्षित सड़कें।',
    credit: 'EcoTriage Municipal Platform',
    licence: 'CC-BY 4.0',
    updated_by: 'System Default',
    updated_at: 'Default',
  },
  {
    slot_key: 'share_card',
    slot_label: 'Social Share Image for Links',
    mode: 'emergency',
    image_url_desktop: '/assets/aistudio/Gemini_Generated_Image_ubc9rmubc9rmubc9_a09387d6.png',
    image_url_mobile: '/assets/aistudio/Gemini_Generated_Image_ubc9rmubc9rmubc9_a09387d6.png',
    fallback_color: '#FEF2F2',
    alt_en: 'EMERGENCY MODE. Active alert in Visakhapatnam.',
    alt_te: 'ఎమర్జెన్సీ మోడ్. విశాఖపట్నంలో అత్యవసర హెచ్చరిక.',
    alt_hi: 'आपातकालीन मोड। विशाखापत्तनम में सक्रिय चेतावनी।',
    credit: 'EcoTriage Municipal Platform',
    licence: 'CC-BY 4.0',
    updated_by: 'System Default',
    updated_at: 'Default',
  },
];

export const DEFAULT_MODE_CONTENT: ModeContentRecord[] = [
  // DAILY MODE CONTENT
  { key: 'global_pill', label: 'Header Mode Pill', mode: 'daily', language: 'en', text: 'Daily mode', updated_by: 'Default', updated_at: 'Default' },
  { key: 'global_pill', label: 'Header Mode Pill', mode: 'daily', language: 'te', text: 'డైలీ మోడ్', updated_by: 'Default', updated_at: 'Default' },
  { key: 'global_pill', label: 'Header Mode Pill', mode: 'daily', language: 'hi', text: 'दैनिक मोड', updated_by: 'Default', updated_at: 'Default' },

  { key: 'hero_headline', label: 'Home Hero Headline', mode: 'daily', language: 'en', text: 'Safer roads, every day.', updated_by: 'Default', updated_at: 'Default' },
  { key: 'hero_headline', label: 'Home Hero Headline', mode: 'daily', language: 'te', text: 'ప్రతిరోజూ సురక్షితమైన రహదారులు.', updated_by: 'Default', updated_at: 'Default' },
  { key: 'hero_headline', label: 'Home Hero Headline', mode: 'daily', language: 'hi', text: 'हर दिन सुरक्षित सड़कें।', updated_by: 'Default', updated_at: 'Default' },

  { key: 'hero_subline', label: 'Home Hero Sub-line', mode: 'daily', language: 'en', text: 'Report road hazards. Find help nearby. Be prepared.', updated_by: 'Default', updated_at: 'Default' },
  { key: 'hero_subline', label: 'Home Hero Sub-line', mode: 'daily', language: 'te', text: 'రోడ్డు ప్రమాదాలను నివేదించండి. సమీపంలో సహాయం పొందండి. సిద్ధంగా ఉండండి.', updated_by: 'Default', updated_at: 'Default' },
  { key: 'hero_subline', label: 'Home Hero Sub-line', mode: 'daily', language: 'hi', text: 'सड़क खतरों की रिपोर्ट करें। पास में मदद खोजें। तैयार रहें।', updated_by: 'Default', updated_at: 'Default' },

  { key: 'primary_cta', label: 'Primary Action Button', mode: 'daily', language: 'en', text: 'Report Road Hazard', updated_by: 'Default', updated_at: 'Default' },
  { key: 'primary_cta', label: 'Primary Action Button', mode: 'daily', language: 'te', text: 'రోడ్డు సమస్యను నివేదించండి', updated_by: 'Default', updated_at: 'Default' },
  { key: 'primary_cta', label: 'Primary Action Button', mode: 'daily', language: 'hi', text: 'सड़क खतरे की रिपोर्ट करें', updated_by: 'Default', updated_at: 'Default' },

  { key: 'secondary_cta', label: 'Secondary Action Button', mode: 'daily', language: 'en', text: 'Find Help Nearby', updated_by: 'Default', updated_at: 'Default' },
  { key: 'secondary_cta', label: 'Secondary Action Button', mode: 'daily', language: 'te', text: 'సమీప సహాయం చూడండి', updated_by: 'Default', updated_at: 'Default' },
  { key: 'secondary_cta', label: 'Secondary Action Button', mode: 'daily', language: 'hi', text: 'पास में सहायता खोजें', updated_by: 'Default', updated_at: 'Default' },

  { key: 'banner_message', label: 'Mode Banner / Strip Text', mode: 'daily', language: 'en', text: 'Normal municipal road operations and preparedness directory.', updated_by: 'Default', updated_at: 'Default' },
  { key: 'banner_message', label: 'Mode Banner / Strip Text', mode: 'daily', language: 'te', text: 'సాధారణ మున్సిపల్ రోడ్డు నిర్వహణ మరియు భద్రతా సమాచారం.', updated_by: 'Default', updated_at: 'Default' },
  { key: 'banner_message', label: 'Mode Banner / Strip Text', mode: 'daily', language: 'hi', text: 'सामान्य नगर निगम सड़क संचालन और सुरक्षा निर्देशिका।', updated_by: 'Default', updated_at: 'Default' },

  { key: 'empty_reports_text', label: 'Empty State Text', mode: 'daily', language: 'en', text: 'No reports yet. Report a road problem.', updated_by: 'Default', updated_at: 'Default' },
  { key: 'empty_reports_text', label: 'Empty State Text', mode: 'daily', language: 'te', text: 'ఇంకా నివేదికలు లేవు. రోడ్డు సమస్యను నివేదించండి.', updated_by: 'Default', updated_at: 'Default' },
  { key: 'empty_reports_text', label: 'Empty State Text', mode: 'daily', language: 'hi', text: 'अभी कोई रिपोर्ट नहीं। सड़क समस्या की रिपोर्ट करें।', updated_by: 'Default', updated_at: 'Default' },

  { key: 'heroes_banner_text', label: 'Our Heroes Banner Text', mode: 'daily', language: 'en', text: 'Suggest a frontline worker or volunteer who helped keep Visakhapatnam safe.', updated_by: 'Default', updated_at: 'Default' },
  { key: 'heroes_banner_text', label: 'Our Heroes Banner Text', mode: 'daily', language: 'te', text: 'విశాఖపట్నం భద్రతకు సహాయపడిన సిబ్బందిని లేదా వాలంటీర్‌ను సూచించండి.', updated_by: 'Default', updated_at: 'Default' },
  { key: 'heroes_banner_text', label: 'Our Heroes Banner Text', mode: 'daily', language: 'hi', text: 'विशाखापत्तनम को सुरक्षित रखने में मदद करने वाले कर्मी या स्वयंसेवक का सुझाव दें।', updated_by: 'Default', updated_at: 'Default' },

  { key: 'share_tagline', label: 'Social Share Tagline', mode: 'daily', language: 'en', text: 'EcoTriage. Safer roads, every day.', updated_by: 'Default', updated_at: 'Default' },
  { key: 'share_tagline', label: 'Social Share Tagline', mode: 'daily', language: 'te', text: 'ఎకోట్రయాజ్. ప్రతిరోజూ సురక్షితమైన రహదారులు.', updated_by: 'Default', updated_at: 'Default' },
  { key: 'share_tagline', label: 'Social Share Tagline', mode: 'daily', language: 'hi', text: 'इकोट्राइएज। हर दिन सुरक्षित सड़कें।', updated_by: 'Default', updated_at: 'Default' },

  // EMERGENCY MODE CONTENT
  { key: 'global_pill', label: 'Header Mode Pill', mode: 'emergency', language: 'en', text: 'EMERGENCY MODE', updated_by: 'Default', updated_at: 'Default' },
  { key: 'global_pill', label: 'Header Mode Pill', mode: 'emergency', language: 'te', text: 'ఎమర్జెన్సీ మోడ్', updated_by: 'Default', updated_at: 'Default' },
  { key: 'global_pill', label: 'Header Mode Pill', mode: 'emergency', language: 'hi', text: 'आपातकालीन मोड', updated_by: 'Default', updated_at: 'Default' },

  { key: 'hero_headline', label: 'Home Hero Headline', mode: 'emergency', language: 'en', text: 'Help reaches blocked roads faster.', updated_by: 'Default', updated_at: 'Default' },
  { key: 'hero_headline', label: 'Home Hero Headline', mode: 'emergency', language: 'te', text: 'మూసుకుపోయిన రోడ్లకు సహాయం వేగంగా చేరుతుంది.', updated_by: 'Default', updated_at: 'Default' },
  { key: 'hero_headline', label: 'Home Hero Headline', mode: 'emergency', language: 'hi', text: 'बंद सड़कों तक मदद तेज़ी से पहुँचती है।', updated_by: 'Default', updated_at: 'Default' },

  { key: 'hero_subline', label: 'Home Hero Sub-line', mode: 'emergency', language: 'en', text: 'Report hazards. Find help. Stay safe.', updated_by: 'Default', updated_at: 'Default' },
  { key: 'hero_subline', label: 'Home Hero Sub-line', mode: 'emergency', language: 'te', text: 'ప్రమాదాలను నివేదించండి. సహాయం పొందండి. సురక్షితంగా ఉండండి.', updated_by: 'Default', updated_at: 'Default' },
  { key: 'hero_subline', label: 'Home Hero Sub-line', mode: 'emergency', language: 'hi', text: 'खतरों की रिपोर्ट करें। सहायता पाएं। सुरक्षित रहें।', updated_by: 'Default', updated_at: 'Default' },

  { key: 'primary_cta', label: 'Primary Action Button', mode: 'emergency', language: 'en', text: 'Report Hazard', updated_by: 'Default', updated_at: 'Default' },
  { key: 'primary_cta', label: 'Primary Action Button', mode: 'emergency', language: 'te', text: 'ప్రమాదాన్ని నివేదించండి', updated_by: 'Default', updated_at: 'Default' },
  { key: 'primary_cta', label: 'Primary Action Button', mode: 'emergency', language: 'hi', text: 'खतरे की रिपोर्ट करें', updated_by: 'Default', updated_at: 'Default' },

  { key: 'secondary_cta', label: 'Secondary Action Button', mode: 'emergency', language: 'en', text: 'Find Help Nearby', updated_by: 'Default', updated_at: 'Default' },
  { key: 'secondary_cta', label: 'Secondary Action Button', mode: 'emergency', language: 'te', text: 'సమీప సహాయం చూడండి', updated_by: 'Default', updated_at: 'Default' },
  { key: 'secondary_cta', label: 'Secondary Action Button', mode: 'emergency', language: 'hi', text: 'पास में सहायता खोजें', updated_by: 'Default', updated_at: 'Default' },

  { key: 'banner_message', label: 'Mode Banner / Strip Text', mode: 'emergency', language: 'en', text: 'Active emergency response: prioritize blocked hospital routes and live electrical hazards.', updated_by: 'Default', updated_at: 'Default' },
  { key: 'banner_message', label: 'Mode Banner / Strip Text', mode: 'emergency', language: 'te', text: 'అత్యవసర ప్రతిస్పందన: ఆసుపత్రి మార్గాలు మరియు విద్యుత్ ప్రమాదాలకు మొదటి ప్రాధాన్యత.', updated_by: 'Default', updated_at: 'Default' },
  { key: 'banner_message', label: 'Mode Banner / Strip Text', mode: 'emergency', language: 'hi', text: 'सक्रिय आपातकालीन प्रतिक्रिया: अस्पताल मार्गों और बिजली के खतरों को सर्वोच्च प्राथमिकता।', updated_by: 'Default', updated_at: 'Default' },

  { key: 'empty_reports_text', label: 'Empty State Text', mode: 'emergency', language: 'en', text: 'No blocked roads reported. Report a hazard.', updated_by: 'Default', updated_at: 'Default' },
  { key: 'empty_reports_text', label: 'Empty State Text', mode: 'emergency', language: 'te', text: 'మూసుకుపోయిన రోడ్లు నివేదించబడలేదు. ప్రమాదాన్ని నివేదించండి.', updated_by: 'Default', updated_at: 'Default' },
  { key: 'empty_reports_text', label: 'Empty State Text', mode: 'emergency', language: 'hi', text: 'कोई बंद सड़क रिपोर्ट नहीं की गई। खतरे की रिपोर्ट करें।', updated_by: 'Default', updated_at: 'Default' },

  { key: 'heroes_banner_text', label: 'Our Heroes Banner Text', mode: 'emergency', language: 'en', text: 'Thank you to everyone working right now across Visakhapatnam to clear roads and save lives!', updated_by: 'Default', updated_at: 'Default' },
  { key: 'heroes_banner_text', label: 'Our Heroes Banner Text', mode: 'emergency', language: 'te', text: 'రోడ్లను క్లియర్ చేయడానికి మరియు ప్రాణాలను కాపాడటానికి ప్రస్తుతం విశాఖపట్నంలో పనిచేస్తున్న ప్రతి ఒక్కరికీ ధన్యవాదాలు!', updated_by: 'Default', updated_at: 'Default' },
  { key: 'heroes_banner_text', label: 'Our Heroes Banner Text', mode: 'emergency', language: 'hi', text: 'सड़कें साफ करने और जीवन बचाने के लिए अभी विशाखापत्तनम में काम कर रहे सभी लोगों को धन्यवाद!', updated_by: 'Default', updated_at: 'Default' },

  { key: 'share_tagline', label: 'Social Share Tagline', mode: 'emergency', language: 'en', text: 'EMERGENCY MODE. Active alert.', updated_by: 'Default', updated_at: 'Default' },
  { key: 'share_tagline', label: 'Social Share Tagline', mode: 'emergency', language: 'te', text: 'ఎమర్జెన్సీ మోడ్. యాక్టివ్ హెచ్చరిక.', updated_by: 'Default', updated_at: 'Default' },
  { key: 'share_tagline', label: 'Social Share Tagline', mode: 'emergency', language: 'hi', text: 'आपातकालीन मोड। सक्रिय चेतावनी।', updated_by: 'Default', updated_at: 'Default' },
];

export const DEFAULT_VOLUNTEER_TASKS: VolunteerTaskRequest[] = [
  {
    id: 'vtask_1',
    title: 'Assist with drinking water & food packet distribution at RK Beach Primary School Relief Camp',
    area: 'Zone 2 (RK Beach / Coastal Corridor)',
    skillsNeeded: 'First Aid / Relief Distribution',
    postedBy: 'Ravi (Command Officer)',
    postedAt: '25 mins ago',
    volunteersResponded: [
      { name: 'Ch. Lavanya', phone: '+91 98480 12345', confirmed: true },
    ],
    status: 'Open',
  },
  {
    id: 'vtask_2',
    title: 'Chainsaw & light branch clearing support on MVP Colony Sector 4 internal roads',
    area: 'Zone 3 (MVP Colony / Maddilapalem)',
    skillsNeeded: 'Tree Cutting / Debris Support',
    postedBy: 'Ravi (Command Officer)',
    postedAt: '40 mins ago',
    volunteersResponded: [],
    status: 'Open',
  },
];

// Pure configuration helper functions (Section 14.1, 14.2, 14.4, 14.5, 14.6)

export function canUserSwitchMode(role: UserRole): boolean {
  return role === 'admin';
}

export function resolveEffectiveMode(
  globalMode: OperatingMode,
  previewMode: OperatingMode | null,
  role: UserRole
): OperatingMode {
  if (role === 'admin' && previewMode) {
    return previewMode;
  }
  return globalMode;
}

export function isModeFeatureEnabled(
  features: ModeFeatureRecord[],
  mode: OperatingMode,
  key: ModeFeatureKey
): boolean {
  const found = features.find((f) => f.feature_key === key);
  if (!found) return true;
  return mode === 'emergency' ? Boolean(found.emergency_enabled) : Boolean(found.daily_enabled);
}

export function getModeAssetForSlot(
  assets: ModeAssetRecord[],
  mode: OperatingMode,
  slot: ModeAssetSlotKey
): ModeAssetRecord {
  const found = assets.find((a) => a.slot_key === slot && a.mode === mode);
  if (found) return found;
  const fallback = DEFAULT_MODE_ASSETS.find((a) => a.slot_key === slot && a.mode === mode);
  return fallback || DEFAULT_MODE_ASSETS[0];
}

export function getModeAssetAlt(asset: ModeAssetRecord, language: Language): string {
  if (language === 'te') return asset.alt_te || asset.alt_en;
  if (language === 'hi') return asset.alt_hi || asset.alt_en;
  return asset.alt_en;
}

export function getModeContentText(
  contents: ModeContentRecord[],
  mode: OperatingMode,
  key: ModeContentKey,
  language: Language
): string {
  const found = contents.find((c) => c.key === key && c.mode === mode && c.language === language);
  if (found && found.text) return found.text;
  const fallbackEn = contents.find((c) => c.key === key && c.mode === mode && c.language === 'en');
  if (fallbackEn && fallbackEn.text) return fallbackEn.text;
  const defaultMatch = DEFAULT_MODE_CONTENT.find(
    (c) => c.key === key && c.mode === mode && c.language === language
  );
  return defaultMatch ? defaultMatch.text : '';
}

export function getStatusLabelForMode(
  status: 'Pending' | 'Assigned' | 'In Progress' | 'Cleared',
  mode: OperatingMode,
  language: Language = 'en'
): string {
  if (language === 'te') {
    if (mode === 'daily') {
      if (status === 'Pending') return 'తెరిచి ఉంది (Open)';
      if (status === 'Assigned' || status === 'In Progress') return 'షెడ్యూల్ చేయబడింది';
      return 'క్లియర్ చేయబడింది';
    }
    if (status === 'Pending') return 'పెండింగ్‌లో ఉంది';
    if (status === 'Assigned') return 'మార్గంలో ఉన్నారు';
    if (status === 'In Progress') return 'పని జరుగుతోంది';
    return 'క్లియర్ చేయబడింది';
  }
  if (language === 'hi') {
    if (mode === 'daily') {
      if (status === 'Pending') return 'खुला है (Open)';
      if (status === 'Assigned' || status === 'In Progress') return 'निर्धारित (Scheduled)';
      return 'साफ किया गया';
    }
    if (status === 'Pending') return 'लंबित (Pending)';
    if (status === 'Assigned') return 'रास्ते में (On the way)';
    if (status === 'In Progress') return 'कार्य प्रगति पर (Working)';
    return 'साफ किया गया';
  }
  return MODE_CONFIG[mode].statusWords[status] || status;
}

export const SAMPLE_EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: 'cnt_1',
    name: 'National Emergency Number',
    category: 'national_emergency',
    description: 'Unified emergency response for police, fire, and health services.',
    phone: '112',
    area: 'Pan India / Visakhapatnam',
    availability: '24 hours',
    languages: ['English', 'Telugu', 'Hindi'],
    verified: true,
    verifiedOn: '2026-01-15',
    source: 'National Emergency Response System',
    sample: false,
    status: 'Approved',
    updatedAt: 'Just now',
  },
  {
    id: 'cnt_2',
    name: 'Police Control Room',
    category: 'police',
    description: 'Vizag city police emergency dispatch and law enforcement.',
    phone: '100',
    whatsapp: '918331000100',
    area: 'Visakhapatnam City Commissionate',
    availability: '24 hours',
    languages: ['Telugu', 'English', 'Hindi'],
    verified: true,
    verifiedOn: '2026-01-20',
    source: 'AP Police HQ',
    sample: false,
    status: 'Approved',
    updatedAt: 'Just now',
  },
  {
    id: 'cnt_3',
    name: 'Fire and Rescue Services',
    category: 'fire_rescue',
    description: 'Emergency fire fighting, tree cutting rescue squads, and flood pumps.',
    phone: '101',
    area: 'Visakhapatnam District',
    availability: '24 hours',
    languages: ['Telugu', 'English'],
    verified: true,
    verifiedOn: '2026-01-18',
    source: 'State Fire Department',
    sample: false,
    status: 'Approved',
    updatedAt: 'Just now',
  },
  {
    id: 'cnt_4',
    name: 'Ambulance Emergency Medical Aid',
    category: 'medical',
    description: '108 emergency ambulance dispatch for trauma and hospital transport.',
    phone: '108',
    area: 'Andhra Pradesh',
    availability: '24 hours',
    languages: ['Telugu', 'English', 'Hindi'],
    verified: true,
    verifiedOn: '2026-01-10',
    source: 'AP Health Department',
    sample: false,
    status: 'Approved',
    updatedAt: 'Just now',
  },
  {
    id: 'cnt_5',
    name: 'Visakhapatnam District Disaster Control Room',
    category: 'control_room',
    description: 'Collectorate emergency operations center for cyclone relief and evacuation coordination.',
    phone: '0891-2590100',
    whatsapp: '918912590100',
    area: 'Visakhapatnam Urban & Rural',
    availability: '24 hours (Disaster Season)',
    languages: ['Telugu', 'English'],
    verified: true,
    verifiedOn: '2026-10-25',
    source: 'Collectorate Vizag',
    sample: false,
    status: 'Approved',
    updatedAt: 'Just now',
  },
  {
    id: 'cnt_6',
    name: 'APSDMA State Emergency Operation Centre',
    category: 'control_room',
    description: 'State disaster management authority 24/7 helpline.',
    phone: '1070',
    whatsapp: '918662488000',
    area: 'Andhra Pradesh State',
    availability: '24 hours',
    languages: ['Telugu', 'English', 'Hindi'],
    verified: true,
    verifiedOn: '2026-10-20',
    source: 'APSDMA',
    sample: false,
    status: 'Approved',
    updatedAt: 'Just now',
  },
  {
    id: 'cnt_7',
    name: 'King George Hospital (KGH) Emergency Trauma Bay',
    category: 'medical',
    description: 'Primary government tertiary care hospital emergency ward.',
    phone: '0891-2564891',
    area: 'Maharanipeta, Vizag',
    availability: '24 hours',
    languages: ['Telugu', 'English'],
    verified: true,
    verifiedOn: '2026-02-01',
    source: 'KGH Medical Superintendent',
    sample: false,
    status: 'Approved',
    updatedAt: 'Just now',
  },
  {
    id: 'cnt_8',
    name: 'APEPDCL Electricity Emergency & Power Breakdown',
    category: 'electricity_water',
    description: 'Report snapped power lines, transformer blasts, and grid faults.',
    phone: '1912',
    whatsapp: '919440811912',
    area: 'North Andhra Districts',
    availability: '24 hours',
    languages: ['Telugu', 'English'],
    verified: true,
    verifiedOn: '2026-02-10',
    source: 'APEPDCL',
    sample: false,
    status: 'Approved',
    updatedAt: 'Just now',
  },
  {
    id: 'cnt_9',
    name: 'Vizag Citizen Relief & Rescue Brigade (Sample)',
    category: 'volunteers_ngo',
    description: 'Local volunteer corps assisting with food distribution and debris clearance.',
    phone: '+91 98480 12345',
    area: 'MVP Colony & Seethammadhara',
    availability: '6:00 AM - 10:00 PM',
    languages: ['Telugu', 'English'],
    verified: false,
    verifiedOn: '2026-10-26',
    source: 'Community Submission',
    sample: true,
    status: 'Approved',
    updatedAt: 'Just now',
  },
  {
    id: 'cnt_10',
    name: 'Coastal Fishermen Distress Response Network (Sample)',
    category: 'volunteers_ngo',
    description: 'Assisting stranded boats and coastal evacuation support.',
    phone: '+91 98480 67890',
    area: 'RK Beach & Jodugullapalem',
    availability: '24 hours during storm',
    languages: ['Telugu'],
    verified: false,
    verifiedOn: '2026-10-26',
    source: 'Community Submission',
    sample: true,
    status: 'Approved',
    updatedAt: 'Just now',
  },
  {
    id: 'cnt_11',
    name: 'Vizag Animal Rescue & Stray Protection (Sample)',
    category: 'animal_wildlife',
    description: 'Emergency rescue for cattle, street animals, and injured birds during cyclones.',
    phone: '+91 99440 55555',
    area: 'Greater Visakhapatnam Municipal Corporation limits',
    availability: '8:00 AM - 8:00 PM',
    languages: ['English', 'Telugu'],
    verified: false,
    verifiedOn: '2026-10-25',
    source: 'Sample NGO Directory',
    sample: true,
    status: 'Approved',
    updatedAt: 'Just now',
  },
  {
    id: 'cnt_12',
    name: 'GVMC Drinking Water Tanker Dispatch',
    category: 'electricity_water',
    description: 'Emergency municipal water tanker delivery during pipeline disruptions.',
    phone: '0891-2755222',
    area: 'All 6 GVMC Zones',
    availability: '6:00 AM - 8:00 PM',
    languages: ['Telugu', 'English'],
    verified: true,
    verifiedOn: '2026-03-01',
    source: 'GVMC Waterworks Wing',
    sample: false,
    status: 'Approved',
    updatedAt: 'Just now',
  },
];
