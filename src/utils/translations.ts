import { Language } from '../types.ts';

export interface TranslationDictionary {
  [key: string]: {
    en: string;
    te: string;
    hi: string;
    simple_en?: string;
    simple_te?: string;
    simple_hi?: string;
  };
}

export const translations: TranslationDictionary = {
  // Brand & Tagline
  appName: {
    en: 'EcoTriage',
    te: 'ఎకోట్రయాజ్',
    hi: 'इकोट्रायाज',
  },
  vizagBadge: {
    en: 'Vizag',
    te: 'వైజాగ్',
    hi: 'विज़ाग',
  },
  subtitle: {
    en: 'Emergency Hazard Intelligence',
    te: 'అత్యవసర ముప్పు సమాచార వ్యవస్థ',
    hi: 'आपातकालीन खतरा आसूचना प्रणाली',
  },
  tagline: {
    en: 'Keep Emergency Routes Moving. Even When Networks Go Dark.',
    te: 'నెట్‌వర్క్ ఆగిపోయినా అత్యవసర మార్గాలు ఆగకుండా చూడండి.',
    hi: 'नेटवर्क बंद होने पर भी आपातकालीन रास्ते चालू रखें।',
  },
  vizagResponseBadge: {
    en: 'Visakhapatnam Emergency Response',
    te: 'విశాఖపట్నం అత్యవసర స్పందన',
    hi: 'विशाखापत्तनम आपातकालीन प्रतिक्रिया',
  },
  homeHeadline: {
    en: 'Help reaches blocked roads faster.',
    te: 'మూసుకుపోయిన రోడ్లకు సాయం త్వరగా చేరుతుంది.',
    hi: 'बंद सड़कों तक मदद तेज़ी से पहुंचती है।',
  },
  homeSubline: {
    en: 'Report hazards. Find help. Stay safe.',
    te: 'ముప్పును నివేదించండి. సాయం పొందండి. సురక్షితంగా ఉండండి.',
    hi: 'खतरे की सूचना दें। सहायता पाएं। सुरक्षित रहें।',
  },

  // Actions
  reportHazard: {
    en: 'Report Hazard',
    te: 'ముప్పు నివేదించండి',
    hi: 'खतरा रिपोर्ट करें',
  },
  findHelpNearby: {
    en: 'Find Help Nearby',
    te: 'సమీప సాయం కనుగొనండి',
    hi: 'नज़दीकी सहायता खोजें',
  },
  submitReport: {
    en: 'Submit Report',
    te: 'నివేదికను పంపండి',
    hi: 'रिपोर्ट भेजें',
  },
  reportAnother: {
    en: 'Report Another Hazard',
    te: 'మరొక ముప్పును నివేదించండి',
    hi: 'दूसरा खतरा दर्ज करें',
  },
  viewOnMap: {
    en: 'View on Live Map',
    te: 'లైవ్ మ్యాప్‌లో చూడండి',
    hi: 'लाइव मैप पर देखें',
  },
  reportNow: {
    en: 'Report Now',
    te: 'వెంటనే నివేదించండి',
    hi: 'अभी रिपोर्ट करें',
  },

  // Navigation (Compact & Clear)
  home: { en: 'Home', te: 'హోమ్', hi: 'होम' },
  report: { en: 'Report', te: 'నివేదిక', hi: 'रिपोर्ट' },
  liveMap: { en: 'Live Map', te: 'లైవ్ మ్యాప్', hi: 'लाइव मैप' },
  queue: { en: 'Queue', te: 'క్యూ', hi: 'कतार' },
  nearbyHelp: { en: 'Nearby Help', te: 'సమీప సాయం', hi: 'सहायता केंद्र' },
  emergencyContacts: { en: 'Contacts', te: 'అత్యవసర నంబర్లు', hi: 'आपातकालीन नंबर' },
  emergencyContactsFull: { en: 'Emergency Contacts', te: 'అత్యవసర నంబర్లు', hi: 'आपातकालीन संपर्क' },
  precautions: { en: 'Precautions', te: 'జాగ్రత్తలు', hi: 'सावधानियां' },
  cycloneHistory: { en: 'History', te: 'తుఫాను చరిత్ర', hi: 'इतिहास' },
  cycloneHistoryFull: { en: 'Cyclone History', te: 'తుఫాను చరిత్ర', hi: 'चक्रवात इतिहास' },
  ourHeroes: { en: 'Our Heroes', te: 'మన హీరోలు', hi: 'हमारे नायक' },
  alerts: { en: 'Alerts & Warnings', te: 'హెచ్చరికలు', hi: 'अलर्ट व चेतावनियां' },
  alertsShort: { en: 'Alerts', te: 'హెచ్చరికలు', hi: 'अलर्ट' },
  dashboard: { en: 'Dashboard', te: 'డ్యాష్‌బోర్డ్', hi: 'डैशबोर्ड' },
  about: { en: 'About', te: 'మా గురించి', hi: 'परिचय' },
  more: { en: 'More', te: 'మరిన్ని', hi: 'अधिक' },
  ops: { en: 'Ops', te: 'విధులు', hi: 'ऑप्स' },

  // Role screens
  myReports: { en: 'My Reports', te: 'నా నివేదికలు', hi: 'मेरी रिपोर्ट्स' },
  myAssignments: { en: 'My Assignments', te: 'నా పనులు', hi: 'मेरे कार्य' },
  verifyReports: { en: 'Verify Reports', te: 'నివేదికల తనిఖీ', hi: 'रिपोर्ट सत्यापन' },
  contentManager: { en: 'Content Manager', te: 'విషయ నిర్వహణ', hi: 'सामग्री प्रबंधक' },
  activityLog: { en: 'Activity Log', te: 'కార్యకలాపాల లాగ్', hi: 'गतिविधि लॉग' },

  // Trust points
  worksOffline: {
    en: 'Works offline',
    te: 'ఆఫ్‌లైన్‌లోనూ పనిచేస్తుంది',
    hi: 'ऑफ़लाइन भी काम करता है',
  },
  multilingual: {
    en: 'Telugu, Hindi and English',
    te: 'తెలుగు, హిందీ మరియు ఇంగ్లీష్',
    hi: 'तेलुगु, हिंदी और अंग्रेजी',
  },
  priorityAi: {
    en: 'Priority sorted by AI',
    te: 'AI ద్వారా ప్రాధాన్యత వర్గీకరణ',
    hi: 'AI द्वारा प्राथमिकता तय',
  },

  // Home Quick Access Card
  quickAccessTitle: {
    en: 'Quick Access. Real Help.',
    te: 'త్వరిత సేవలు. తక్షణ సాయం.',
    hi: 'त्वरित पहुंच। वास्तविक मदद।',
  },
  directBadge: {
    en: 'Direct',
    te: 'నేరుగా',
    hi: 'सीधा',
  },
  quickEmergencyContacts: {
    en: 'Emergency Contacts (112, 108)',
    te: 'అత్యవసర నంబర్లు (112, 108)',
    hi: 'आपातकालीन संपर्क (112, 108)',
  },
  quickLiveMap: {
    en: 'Live Operational Map',
    te: 'లైవ్ ఆపరేషనల్ మ్యాప్',
    hi: 'लाइव ऑपरेशनल मैप',
  },
  quickReliefCamps: {
    en: 'Relief Camps & Free Beds',
    te: 'పునరావాస శిబిరాలు & పడకలు',
    hi: 'राहत शिविर और खाली बेड',
  },
  quickAlerts: {
    en: 'Alerts & Warnings',
    te: 'హెచ్చరికలు & సూచనలు',
    hi: 'अलर्ट और चेतावनियां',
  },
  quickStaffSignIn: {
    en: 'Staff Sign In / Roles',
    te: 'సిబ్బంది లాగిన్ / పాత్రలు',
    hi: 'अधिकारी लॉगिन / भूमिकाएं',
  },

  // Home 4 Overlapping Service Cards
  cardReliefTitle: {
    en: 'Nearby Relief Camps',
    te: 'సమీప పునరావాస శిబిరాలు',
    hi: 'नज़दीकी राहत शिविर',
  },
  cardReliefDesc: {
    en: 'Find safe shelters & free bed capacities near you',
    te: 'మీ దగ్గరలోని సురక్షిత షెల్టర్లు & ఖాళీ పడకల వివరాలు',
    hi: 'अपने पास सुरक्षित आश्रय और खाली बेड की जानकारी पाएं',
  },
  cardReliefAction: {
    en: 'Check Capacity',
    te: 'పడకల వివరాలు చూడండి',
    hi: 'क्षमता जांचें',
  },
  cardMedicalTitle: {
    en: 'Medical Help',
    te: 'వైద్య సహాయం',
    hi: 'चिकित्सा सहायता',
  },
  cardMedicalDesc: {
    en: 'Emergency hospital trauma bays & ambulance lines',
    te: 'అత్యవసర ఆసుపత్రులు & అంబులెన్స్ సేవలు',
    hi: 'आपातकालीन अस्पताल ट्रॉमा सेंटर और एम्बुलेंस सेवाएं',
  },
  cardMedicalAction: {
    en: 'Get Assistance',
    te: 'సహాయం పొందండి',
    hi: 'सहायता प्राप्त करें',
  },
  cardPrecautionsTitle: {
    en: 'Safety Precautions',
    te: 'భద్రతా జాగ్రత్తలు',
    hi: 'सुरक्षा सावधानियां',
  },
  cardPrecautionsDesc: {
    en: 'Before, during, and after storm safety guidelines',
    te: 'తుఫానుకు ముందు, సమయంలో మరియు తర్వాత తీసుకోవాల్సిన జాగ్రత్తలు',
    hi: 'तूफ़ान से पहले, दौरान और बाद के सुरक्षा दिशानिर्देश',
  },
  cardPrecautionsAction: {
    en: 'Stay Prepared',
    te: 'సిద్ధంగా ఉండండి',
    hi: 'तैयार रहें',
  },
  cardHeroesTitle: {
    en: 'Our Heroes',
    te: 'మన హీరోలు',
    hi: 'हमारे नायक',
  },
  cardHeroesDesc: {
    en: 'Salute the frontline municipal & electrical workers',
    te: 'మున్సిపల్, విద్యుత్ మరియు రెస్క్యూ సిబ్బందికి సెల్యూట్ చేయండి',
    hi: 'फ्रंटलाइन नगर निगम और बिजली कर्मियों को सलाम करें',
  },
  cardHeroesAction: {
    en: 'Send a Salute',
    te: 'సెల్యూట్ పంపండి',
    hi: 'सलाम भेजें',
  },

  // Home 4 Live Stats
  statTotalReports: {
    en: 'Total Reports',
    te: 'మొత్తం నివేదికలు',
    hi: 'कुल रिपोर्ट्स',
  },
  statSampleActive: {
    en: 'Sample records active',
    te: 'నమూనా రికార్డులు అందుబాటులో ఉన్నాయి',
    hi: 'सैंपल रिकॉर्ड सक्रिय',
  },
  statCriticalHazards: {
    en: 'Critical Hazards',
    te: 'తీవ్రమైన ప్రమాదాలు',
    hi: 'गंभीर खतरे',
  },
  statCriticalSub: {
    en: 'Live wire & lifeline blocks',
    te: 'కరెంట్ తీగలు & ప్రధాన రోడ్ల బ్లాక్‌లు',
    hi: 'बिजली के तार और मुख्य मार्ग अवरोध',
  },
  statResponseCrews: {
    en: 'Response Crews',
    te: 'స్పందన బృందాలు',
    hi: 'राहत दस्ते',
  },
  statCrewsSub: {
    en: 'PWD, Electricity & Rescue',
    te: 'PWD, విద్యుత్ & రెస్క్యూ సిబ్బంది',
    hi: 'PWD, बिजली और बचाव दल',
  },
  statHazardsCleared: {
    en: 'Hazards Cleared',
    te: 'తొలగించిన అడ్డంకులు',
    hi: 'हटाए गए खतरे',
  },
  statClearedSub: {
    en: 'Roads reopened safely',
    te: 'సురక్షితంగా తెరవబడిన రోడ్లు',
    hi: 'सुरक्षित रूप से खोली गई सड़कें',
  },

  // Home Emergency Strip
  emergencyStripHeading: {
    en: 'Live wire or fully blocked road?',
    te: 'విద్యుత్ తీగ పడిందా లేదా రోడ్డు పూర్తిగా మూసుకుపోయిందా?',
    hi: 'बिजली का तार गिरा है या सड़क पूरी तरह बंद है?',
  },
  emergencyStripBody: {
    en: 'Report it first. It gets the highest automated priority in the municipal command queue.',
    te: 'వెంటనే నివేదించండి. మున్సిపల్ కమాండ్ క్యూలో దీనికి అత్యధిక ప్రాధాన్యత లభిస్తుంది.',
    hi: 'तुरंत रिपोर्ट करें। नगर निगम कमांड कतार में इसे सर्वोच्च प्राथमिकता मिलती है।',
  },

  // Home Priority Open Incidents
  priorityIncidentsTitle: {
    en: 'Priority Open Incidents',
    te: 'ముఖ్యమైన పెండింగ్ ఘటనలు',
    hi: 'प्राथमिकता वाली खुली घटनाएं',
  },
  priorityIncidentsSub: {
    en: 'Ranked in real time by the EcoTriage priority model',
    te: 'ఎకోట్రయాజ్ ప్రాధాన్యత మోడల్ ద్వారా నిజ సమయంలో ర్యాంక్ చేయబడినవి',
    hi: 'इकोट्रायाज प्राथमिकता मॉडल द्वारा रियल-टाइम में क्रमबद्ध',
  },
  viewFullQueue: {
    en: 'View full queue',
    te: 'పూర్తి క్యూ చూడండి',
    hi: 'पूरी कतार देखें',
  },
  liveCorridorMap: {
    en: 'Live Corridor Map (OSM)',
    te: 'లైవ్ కారిడార్ మ్యాప్ (OSM)',
    hi: 'लाइव कॉरिडोर मैप (OSM)',
  },
  fullMap: {
    en: 'Full Map',
    te: 'పూర్తి మ్యాప్',
    hi: 'पूरा मैप',
  },
  mapClickHint: {
    en: 'Click any hazard pin on the map to inspect live priority and details.',
    te: 'వివరాలు మరియు ప్రాధాన్యత చూడటానికి మ్యాప్‌లోని ఏదైనా పిన్‌పై క్లిక్ చేయండి.',
    hi: 'लाइव प्राथमिकता और विवरण देखने के लिए मैप पर किसी भी पिन पर क्लिक करें।',
  },
  scoreLabel: {
    en: 'Score',
    te: 'స్కోరు',
    hi: 'स्कोर',
  },

  // Home How It Works
  workflowBadge: {
    en: 'Operational Workflow',
    te: 'కార్యనిర్వహణ విధానం',
    hi: 'कार्यप्रणाली',
  },
  howItWorksTitle: {
    en: 'How EcoTriage Works',
    te: 'ఎకోట్రయాజ్ ఎలా పనిచేస్తుంది',
    hi: 'इकोट्रायाज कैसे काम करता है',
  },
  howItWorksSub: {
    en: 'Accelerating road clearance by combining mobile field reporting, AI image inspection, and priority dispatch.',
    te: 'మొబైల్ రిపోర్టింగ్, AI ఫోటో విశ్లేషణ మరియు వేగవంతమైన సిబ్బంది కేటాయింపుతో రోడ్ల పునరుద్ధరణ.',
    hi: 'मोबाइल रिपोर्टिंग, AI फोटो जांच और त्वरित दल तैनाती के साथ सड़कें साफ़ करने की तेज़ प्रक्रिया।',
  },
  step1Title: {
    en: 'Take a photo',
    te: 'ఫోటో తీయండి',
    hi: 'फ़ोटो लें',
  },
  step1Desc: {
    en: 'Field squad captures obstruction on-site. GPS coordinates are automatically tagged, even with zero network.',
    te: 'సిబ్బంది లేదా ప్రజలు అడ్డంకి ఫోటో తీస్తారు. నెట్‌వర్క్ లేకపోయినా GPS లొకేషన్ ఆటోమేటిక్‌గా జతచేయబడుతుంది.',
    hi: 'फील्ड टीम मौके पर बाधा की फोटो लेती है। नेटवर्क न होने पर भी GPS लोकेशन अपने-आप जुड़ जाती है।',
  },
  step2Title: {
    en: 'AI scores hazard',
    te: 'AI ప్రమాదాన్ని అంచనా వేస్తుంది',
    hi: 'AI खतरे का स्कोर तय करता है',
  },
  step2Desc: {
    en: 'Gemini model reads tree blockage, detects live electrical wires, cross-checks hospital routes, and assigns 0-10 priority.',
    te: 'AI మోడల్ పడిపోయిన చెట్లు, కరెంట్ తీగలు మరియు ఆసుపత్రి మార్గాలను గుర్తించి 0-10 ప్రాధాన్యత స్కోరు ఇస్తుంది.',
    hi: 'AI मॉडल गिरे पेड़, बिजली के तार और अस्पताल मार्गों की जांच कर 0-10 प्राथमिकता स्कोर देता है।',
  },
  step3Title: {
    en: 'Crew is sent',
    te: 'సిబ్బందిని పంపుతారు',
    hi: 'राहत दस्ता भेजा जाता है',
  },
  step3Desc: {
    en: 'Command assigns heavy bulldozers or wire isolators instantly. Critical lifelines open hours ahead of standard schedules.',
    te: 'కమాండ్ సెంటర్ వెంటనే భారీ యంత్రాలు లేదా విద్యుత్ సిబ్బందిని పంపుతుంది. ముఖ్యమైన రోడ్లు గంటల ముందే తెరుచుకుంటాయి.',
    hi: 'कमांड सेंटर तुरंत बुलडोज़र या बिजली टीम भेजता है। महत्वपूर्ण रास्ते तय समय से घंटों पहले खुल जाते हैं।',
  },

  // Home Why It Matters
  whyMattersBadge: {
    en: 'Verified Impact Research',
    te: 'పరిశోధన గణాంకాలు',
    hi: 'सत्यापित प्रभाव अनुसंधान',
  },
  whyMattersTitle: {
    en: 'Why Micro-Triage Matters',
    te: 'మైక్రో-ట్రయాజ్ ఎందుకు ముఖ్యం',
    hi: 'माइक्रो-ट्रायाज क्यों ज़रूरी है',
  },

  // Our Heroes Page
  heroesBadge: {
    en: 'Coastal Frontline Responders',
    te: 'తీరప్రాంత ఫ్రంట్‌లైన్ యోధులు',
    hi: 'तटीय फ्रंटलाइन रक्षक',
  },
  heroesTitle: {
    en: 'Our Heroes (Disaster Responders)',
    te: 'మన హీరోలు (విపత్తు స్పందన సిబ్బంది)',
    hi: 'हमारे नायक (आपदा राहत कर्मी)',
  },
  heroesSub: {
    en: 'Every frontline worker, municipal worker, electrician, and volunteer risks their safety to clear roads and save lives. Tap any card below to send a salute!',
    te: 'ప్రతి మున్సిపల్ కార్మికుడు, ఎలక్ట్రీషియన్ మరియు వాలంటీర్ తమ ప్రాణాలను పణంగా పెట్టి రోడ్లను క్లియర్ చేస్తున్నారు. సెల్యూట్ పంపడానికి ఏదైనా కార్డుపై నొక్కండి!',
    hi: 'हर नगर निगम कर्मी, इलेक्ट्रीशियन और स्वयंसेवक अपनी जान जोखिम में डालकर सड़कें साफ़ करते हैं। सलाम भेजने के लिए किसी भी कार्ड पर टैप करें!',
  },
  respondersCount: {
    en: 'Responders',
    te: 'సిబ్బంది',
    hi: 'रक्षक',
  },
  totalSalutes: {
    en: 'Total Salutes',
    te: 'మొత్తం సెల్యూట్‌లు',
    hi: 'कुल सलाम',
  },
  addHeroBtn: {
    en: 'Add Family / Responder Hero',
    te: 'హీరో పేరును చేర్చండి',
    hi: 'नायक प्रोफ़ाइल जोड़ें',
  },
  featuredHeroBadge: {
    en: 'Featured Hero of the Month',
    te: 'ఈ నెల ఆదర్శ హీరో',
    hi: 'इस महीने के प्रमुख नायक',
  },
  sendSalute: {
    en: 'Send Salute',
    te: 'సెల్యూట్ పంపండి',
    hi: 'सलाम भेजें',
  },
  saluteBtn: {
    en: 'Salute',
    te: 'సెల్యూట్',
    hi: 'सलाम',
  },
  salutedBtn: {
    en: 'Saluted ❤️',
    te: 'సెల్యూట్ చేశారు ❤️',
    hi: 'सलाम किया ❤️',
  },
  searchHeroesPlaceholder: {
    en: 'Search heroes by name, role, or squad...',
    te: 'పేరు, విభాగం లేదా హోదా ద్వారా హీరోలను వెతకండి...',
    hi: 'नाम, भूमिका या विभाग से नायकों को खोजें...',
  },

  // Emergency Contacts Page
  contactsBadge: {
    en: 'Standard National Lifelines',
    te: 'జాతీయ అత్యవసర హెల్ప్‌లైన్లు',
    hi: 'राष्ट्रीय आपातकालीन हेल्पलाइन',
  },
  contactsTitle: {
    en: 'Emergency Contacts Directory',
    te: 'అత్యవసర ఫోన్ నంబర్ల జాబితా',
    hi: 'आपातकालीन संपर्क निर्देशिका',
  },
  contactsSub: {
    en: 'Verified control rooms, medical trauma centers, and disaster response units for Visakhapatnam.',
    te: 'విశాఖపట్నం కంట్రోల్ రూమ్‌లు, ఆసుపత్రులు మరియు విపత్తు సహాయక విభాగాల ఫోన్ నంబర్లు.',
    hi: 'विशाखापत्तनम के सत्यापित कंट्रोल रूम, अस्पताल और आपदा राहत केंद्रों के नंबर।',
  },
  joinVolunteerBtn: {
    en: 'Join as Volunteer',
    te: 'వాలంటీర్‌గా చేరండి',
    hi: 'स्वयंसेवक बनें',
  },
  suggestContactBtn: {
    en: 'Suggest Contact',
    te: 'నంబర్ సూచించండి',
    hi: 'संपर्क सुझाएं',
  },

  // Obstruction terms (with simple words mode)
  complete_block: {
    en: 'Complete Block',
    te: 'పూర్తిగా దిగ్బంధం',
    hi: 'पूर्ण रूप से बंद',
    simple_en: 'Road fully blocked',
    simple_te: 'రోడ్డు పూర్తిగా మూసుకుపోయింది',
    simple_hi: 'सड़क पूरी तरह बंद है',
  },
  single_lane: {
    en: 'Single Lane Blocked',
    te: 'ఒక వైపు మాత్రమే బ్లాక్',
    hi: 'एक लेन बंद',
    simple_en: 'One lane blocked',
    simple_te: 'ఒక లేన్ మాత్రమే మూసుకుంది',
    simple_hi: 'एक लेन बंद है',
  },
  clear: {
    en: 'Clear / Open',
    te: 'క్లియర్ / తెరిచి ఉంది',
    hi: 'साफ़ / खुला',
    simple_en: 'Road is open',
    simple_te: 'రోడ్డు తెరిచి ఉంది',
    simple_hi: 'सड़क खुली है',
  },

  // Hazard terms
  live_electrical_wire: {
    en: 'Live Electrical Wire',
    te: 'కరెంట్ ప్రవహిస్తున్న వైరు',
    hi: 'बिजली का खुला तार',
    simple_en: 'Danger: electric wire',
    simple_te: 'ప్రమాదం: విద్యుత్ తీగ',
    simple_hi: 'खतरा: बिजली का तार',
  },
  hazard_none: {
    en: 'No Wire Hazard',
    te: 'విద్యుత్ తీగ సమస్య లేదు',
    hi: 'बिजली का कोई तार नहीं',
    simple_en: 'Safe from electric wire',
    simple_te: 'విద్యుత్ తీగ ప్రమాదం లేదు',
    simple_hi: 'बिजली के तार का खतरा नहीं',
  },

  // Statuses
  Queued: {
    en: 'Queued (Offline)',
    te: 'క్యూలో ఉంది (ఆఫ్‌లైన్)',
    hi: 'कतार में (ऑफ़लाइन)',
    simple_en: 'Saved. Will send when network returns',
    simple_te: 'భద్రపరచబడింది. నెట్ రాగానే పంపబడుతుంది',
    simple_hi: 'सेव किया। नेटवर्क आने पर भेजा जाएगा',
  },
  Pending: {
    en: 'Pending Review',
    te: 'సమీక్ష పెండింగ్',
    hi: 'समीक्षा लंबित',
    simple_en: 'Waiting for team',
    simple_te: 'బృందం కోసం ఎదురుచూస్తోంది',
    simple_hi: 'टीम की प्रतीक्षा में',
  },
  Assigned: {
    en: 'Crew Assigned',
    te: 'సిబ్బంది కేటాయించబడింది',
    hi: 'दस्ता तैनात',
    simple_en: 'Team assigned',
    simple_te: 'సిబ్బందికి అప్పగించబడింది',
    simple_hi: 'टीम को सौंपा गया',
  },
  'On the way': {
    en: 'On the Way',
    te: 'దారిలో ఉన్నారు',
    hi: 'रास्ते में हैं',
    simple_en: 'Team traveling to site',
    simple_te: 'సిబ్బంది అక్కడికి బయలుదేరారు',
    simple_hi: 'टीम मौके पर जा रही है',
  },
  Working: {
    en: 'Clearance in Progress',
    te: 'పని జరుగుతోంది',
    hi: 'कार्य प्रगति पर है',
    simple_en: 'Team working now',
    simple_te: 'సిబ్బంది పని చేస్తున్నారు',
    simple_hi: 'टीम अभी काम कर रही है',
  },
  Cleared: {
    en: 'Road Cleared',
    te: 'రోడ్డు క్లియర్ చేయబడింది',
    hi: 'सड़क साफ़ हो गई',
    simple_en: 'Road clear and safe',
    simple_te: 'రోడ్డు ఇప్పుడు క్లియర్ అయ్యింది',
    simple_hi: 'सड़क अब साफ़ व सुरक्षित है',
  },

  // Severities
  Critical: { en: 'Critical', te: 'అత్యవసరం', hi: 'अत्यंत गंभीर' },
  High: { en: 'High', te: 'ఎక్కువ', hi: 'उच्च' },
  Medium: { en: 'Medium', te: 'మధ్యస్థం', hi: 'मध्यम' },
  Low: { en: 'Low', te: 'తక్కువ', hi: 'कम' },

  // Emergency strip & Help
  emergencyStripText: {
    en: 'Live wire or fully blocked road? Report it first. It gets the highest priority.',
    te: 'విద్యుత్ తీగ పడిందా లేదా రోడ్డు పూర్తిగా మూసుకుపోయిందా? వెంటనే నివేదించండి. దీనికే అత్యధిక ప్రాధాన్యత.',
    hi: 'बिजली का तार गिरा हो या सड़क पूरी तरह बंद हो? तुरंत रिपोर्ट करें। इसे सबसे पहले प्राथमिकता मिलेगी।',
  },
  call112: { en: 'Call 112 (Emergency)', te: '112 కు కాల్ చేయండి', hi: '112 पर कॉल करें' },
  call108: { en: 'Call 108 (Ambulance)', te: '108 కు కాల్ చేయండి', hi: '108 एम्बुलेंस' },
  call101: { en: 'Call 101 (Fire)', te: '101 అగ్నిమాపక', hi: '101 दमकल' },

  // Role names
  publicRole: { en: 'Public Visitor', te: 'ప్రజలు / సందర్శకుడు', hi: 'नागरिक / आगंतुक' },
  viewerRole: { en: 'Viewer / Observer', te: 'పరిశీలకుడు', hi: 'पर्यवेक्षक' },
  fieldRole: { en: 'Field Officer', te: 'ఫీల్డ్ ఆఫీసర్', hi: 'फ़ील्ड ऑफ़िसर' },
  commandRole: { en: 'Command Officer', te: 'కమాండ్ ఆఫీసర్', hi: 'कमांड ऑफ़िसर' },
  adminRole: { en: 'System Admin', te: 'సిస్టమ్ అడ్మిన్', hi: 'सिस्टम एडमिन' },
  staffSignIn: { en: 'Staff sign in', te: 'సిబ్బంది లాగిన్', hi: 'कर्मचारी लॉगिन' },
  officerLoginShort: { en: 'Officer', te: 'ఆఫీసర్', hi: 'अधिकारी' },
  signOut: { en: 'Switch / Sign out', te: 'సైన్ అవుట్', hi: 'साइन आउट' },

  // Mode Banners
  emergencyModeActive: {
    en: 'EMERGENCY MODE ACTIVE',
    te: 'అత్యవసర మోడ్ ఆన్‌లో ఉంది',
    hi: 'आपातकालीन मोड सक्रिय',
  },
  dailyModeOfficer: {
    en: 'Officer Daily Mode (Normal)',
    te: 'ఆఫీసర్ డైలీ మోడ్ (సాధారణం)',
    hi: 'अधिकारी दैनिक मोड (सामान्य)',
  },
  disasterEmergencyAlert: {
    en: 'DISASTER EMERGENCY:',
    te: 'విపత్తు అత్యవసర హెచ్చరిక:',
    hi: 'आपदा आपातकालीन चेतावनी:',
  },
  emergencyBroadcastSub: {
    en: 'All response squads active. Emergency reporting priority engaged.',
    te: 'అన్ని సహాయక బృందాలు రంగంలో ఉన్నాయి. అత్యవసర నివేదికలకు మొదటి ప్రాధాన్యత.',
    hi: 'सभी राहत दस्ते सक्रिय हैं। आपातकालीन रिपोर्टिंग को सर्वोच्च प्राथमिकता।',
  },

  // Simple words toggle
  simpleWordsMode: {
    en: 'Simple Words Mode',
    te: 'సులభ పదాల మోడ్',
    hi: 'सरल भाषा मोड',
  },

  // HomePage & Section 14 UI Strings
  aiSorted: {
    en: 'Priority sorted by AI',
    te: 'AI ద్వారా ప్రాధాన్యత వర్గీకరణ',
    hi: 'AI द्वारा प्राथमिकता तय',
  },
  quickAccessSub: {
    en: 'One-tap links to emergency contacts, live map, and relief shelters',
    te: 'అత్యవసర నంబర్లు, లైవ్ మ్యాప్ మరియు పునరావాస కేంద్రాలకు తక్షణ లింకులు',
    hi: 'आपातकालीन नंबर, लाइव मैप और राहत शिविरों के लिए एक-टैप लिंक',
  },
  emergencyContacts112: {
    en: 'Emergency Contacts (112, 108)',
    te: 'అత్యవసర నంబర్లు (112, 108)',
    hi: 'आपातकालीन संपर्क (112, 108)',
  },
  emergencyContactsSub: {
    en: 'National emergency, control rooms & medical lines',
    te: 'జాతీయ అత్యవసర నంబర్లు, కంట్రోల్ రూమ్ & వైద్య సహాయం',
    hi: 'राष्ट्रीय आपातकाल, कंट्रोल रूम और मेडिकल हेल्पलाइन',
  },
  liveOperationalMap: {
    en: 'Live Operational Map',
    te: 'లైవ్ ఆపరేషనల్ మ్యాప్',
    hi: 'लाइव ऑपरेशनल मैप',
  },
  activeHazardsPinned: {
    en: 'active road hazards pinned',
    te: 'యాక్టివ్ రోడ్డు ప్రమాదాలు',
    hi: 'सक्रिय सड़क खतरे दर्ज',
  },
  reliefCampsFreeBeds: {
    en: 'Relief Camps & Shelters',
    te: 'పునరావాస శిబిరాలు & ఆశ్రయాలు',
    hi: 'राहत शिविर और आश्रय',
  },
  verifiedSheltersFood: {
    en: 'Verified shelters, food & drinking water',
    te: 'ధృవీకరించబడిన షెల్టర్లు, ఆహారం & తాగునీరు',
    hi: 'सत्यापित आश्रय, भोजन और पेयजल',
  },
  staffSignInRoles: {
    en: 'Staff Sign In / Roles',
    te: 'సిబ్బంది లాగిన్ / పాత్రలు',
    hi: 'अधिकारी लॉगिन / भूमिकाएं',
  },
  fieldCommandAdminAccess: {
    en: 'Field, Command & Admin access',
    te: 'ఫీల్డ్, కమాండ్ & అడ్మిన్ యాక్సెస్',
    hi: 'फ़ील्ड, कमांड और एडमिन एक्सेस',
  },
  totalReportsMetric: {
    en: 'Total Reports',
    te: 'మొత్తం నివేదికలు',
    hi: 'कुल रिपोर्ट्स',
  },
  acrossZones: {
    en: 'Across all 6 GVMC coastal zones',
    te: 'అన్ని 6 GVMC తీరప్రాంత జోన్‌లలో',
    hi: 'सभी 6 GVMC तटीय ज़ोन में',
  },
  criticalHazardsMetric: {
    en: 'Critical Hazards',
    te: 'తీవ్రమైన ప్రమాదాలు',
    hi: 'गंभीर खतरे',
  },
  liveWiresHospitalBlocks: {
    en: 'Live wires & hospital route blocks',
    te: 'కరెంట్ తీగలు & ఆసుపత్రి రోడ్డు బ్లాక్‌లు',
    hi: 'बिजली के तार और अस्पताल मार्ग अवरोध',
  },
  responseCrewsMetric: {
    en: 'Response Crews',
    te: 'స్పందన బృందాలు',
    hi: 'राहत दस्ते',
  },
  activeTeams: {
    en: 'Active PWD, Electricity & Rescue teams',
    te: 'యాక్టివ్ PWD, విద్యుత్ & రెస్క్యూ బృందాలు',
    hi: 'सक्रिय PWD, बिजली और बचाव दल',
  },
  hazardsClearedMetric: {
    en: 'Hazards Cleared',
    te: 'తొలగించిన అడ్డంకులు',
    hi: 'हटाए गए खतरे',
  },
  restoredEmergencyRoutes: {
    en: 'Restored emergency & civic routes',
    te: 'పునరుద్ధరించబడిన అత్యవసర రహదారులు',
    hi: 'बहाल किए गए आपातकालीन मार्ग',
  },
  nearbyReliefCampsCard: {
    en: 'Nearby Relief Camps',
    te: 'సమీప పునరావాస శిబిరాలు',
    hi: 'नज़दीकी राहत शिविर',
  },
  nearbyReliefCampsDesc: {
    en: 'Find safe shelters, drinking water, and bed availability near you.',
    te: 'మీ దగ్గరలోని సురక్షిత షెల్టర్లు, తాగునీరు & పడకల వివరాలు.',
    hi: 'अपने पास सुरक्षित आश्रय, पेयजल और खाली बेड की जानकारी पाएं।',
  },
  checkCapacity: {
    en: 'Check Shelters',
    te: 'షెల్టర్లు చూడండి',
    hi: 'आश्रय देखें',
  },
  medicalHelpCard: {
    en: 'Medical Help',
    te: 'వైద్య సహాయం',
    hi: 'चिकित्सा सहायता',
  },
  medicalHelpDesc: {
    en: 'Emergency hospital trauma bays, clinics, and 108 ambulance lines.',
    te: 'అత్యవసర ఆసుపత్రులు, క్లినిక్‌లు & 108 అంబులెన్స్ సేవలు.',
    hi: 'आपातकालीन अस्पताल ट्रॉमा सेंटर, क्लिनिक और 108 एम्बुलेंस सेवाएं।',
  },
  getAssistance: {
    en: 'Get Assistance',
    te: 'సహాయం పొందండి',
    hi: 'सहायता प्राप्त करें',
  },
  safetyPrecautionsCard: {
    en: 'Safety Precautions',
    te: 'భద్రతా జాగ్రత్తలు',
    hi: 'सुरक्षा सावधानियां',
  },
  safetyPrecautionsDesc: {
    en: 'Before, during, and after cyclone checklists and preparedness kits.',
    te: 'తుఫానుకు ముందు, సమయంలో మరియు తర్వాత తీసుకోవాల్సిన జాగ్రత్తలు.',
    hi: 'चक्रवात से पहले, दौरान और बाद के सुरक्षा दिशानिर्देश व किट।',
  },
  stayPrepared: {
    en: 'Stay Prepared',
    te: 'సిద్ధంగా ఉండండి',
    hi: 'तैयार रहें',
  },
  ourHeroesCard: {
    en: 'Our Heroes',
    te: 'మన హీరోలు',
    hi: 'हमारे नायक',
  },
  ourHeroesDesc: {
    en: 'Salute the frontline municipal, electrical, and rescue workers.',
    te: 'మున్సిపల్, విద్యుత్ మరియు రెస్క్యూ సిబ్బందికి సెల్యూట్ చేయండి.',
    hi: 'फ्रंटलाइन नगर निगम, बिजली और बचाव कर्मियों को सलाम करें।',
  },
  priorityOpenIncidents: {
    en: 'Priority Open Road Reports',
    te: 'ముఖ్యమైన పెండింగ్ రోడ్డు నివేదికలు',
    hi: 'प्राथमिकता वाली खुली सड़क रिपोर्ट्स',
  },
  priorityOpenSub: {
    en: 'Ranked in real time by the EcoTriage AI & rule priority model',
    te: 'ఎకోట్రయాజ్ AI ప్రాధాన్యత మోడల్ ద్వారా ర్యాంక్ చేయబడినవి',
    hi: 'इकोट्रायाज AI प्राथमिकता मॉडल द्वारा रियल-टाइम में क्रमबद्ध',
  },
  emergencyNumbersTitle: {
    en: '24/7 Toll-Free Disaster Lifelines',
    te: '24/7 అత్యవసర విపత్తు హెల్ప్‌లైన్లు',
    hi: '24/7 टोल-फ्री आपदा हेल्पलाइन',
  },
  vizagControlRoom: {
    en: 'Visakhapatnam Disaster Control Room',
    te: 'విశాఖపట్నం విపత్తు కంట్రోల్ రూమ్',
    hi: 'विशाखापत्तनम आपदा कंट्रोल रूम',
  },
  police: {
    en: 'Police',
    te: 'పోలీసు',
    hi: 'पुलिस',
  },
  ambulance: {
    en: 'Ambulance',
    te: 'అంబులెన్స్',
    hi: 'एम्बुलेंस',
  },
  fireRescue: {
    en: 'Fire & Rescue',
    te: 'ఫైర్ & రెస్క్యూ',
    hi: 'फायर व बचाव',
  },
  ndrfHelp: {
    en: 'National Emergency',
    te: 'జాతీయ అత్యవసరం',
    hi: 'राष्ट्रीय आपातकाल',
  },
  civicWorkflowBadge: {
    en: 'Operational Workflow',
    te: 'కార్యనిర్వహణ విధానం',
    hi: 'कार्यप्रणाली',
  },
  howWorksTitle: {
    en: 'How EcoTriage Works',
    te: 'ఎకోట్రయాజ్ ఎలా పనిచేస్తుంది',
    hi: 'इकोट्रायाज कैसे काम करता है',
  },
  howWorksSub: {
    en: 'Combining citizen hazard reporting, AI priority triage, and rapid municipal crew dispatch.',
    te: 'ప్రజల రిపోర్టింగ్, AI ప్రాధాన్యత విశ్లేషణ మరియు వేగవంతమైన మున్సిపల్ సిబ్బంది కేటాయింపు.',
    hi: 'नागरिक रिपोर्टिंग, AI प्राथमिकता जांच और त्वरित नगर निगम दल तैनाती।',
  },
};

export function t(key: string, lang: Language = 'en', simpleWords: boolean = true): string {
  const item = translations[key];
  if (!item) return key;

  if (simpleWords) {
    if (lang === 'te' && item.simple_te) return item.simple_te;
    if (lang === 'hi' && item.simple_hi) return item.simple_hi;
    if (lang === 'en' && item.simple_en) return item.simple_en;
  }

  return item[lang] || item.en || key;
}
