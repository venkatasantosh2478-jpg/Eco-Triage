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
    te: 'ముప్పును నివేదించండి',
    hi: 'खतरे की सूचना दें',
  },
  findHelpNearby: {
    en: 'Find Help Nearby',
    te: 'సమీపంలోని సాయం కనుగొనండి',
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

  // Navigation
  home: { en: 'Home', te: 'హోమ్', hi: 'होम' },
  report: { en: 'Report', te: 'నివేదిక', hi: 'रिपोर्ट' },
  liveMap: { en: 'Live Map', te: 'లైవ్ మ్యాప్', hi: 'लाइव मैप' },
  queue: { en: 'Queue', te: 'వరస క్రమం', hi: 'कतार' },
  nearbyHelp: { en: 'Nearby Help', te: 'సమీప సాయం', hi: 'नज़दीकी सहायता' },
  precautions: { en: 'Precautions', te: 'ముందస్తు జాగ్రత్తలు', hi: 'सावधानियां' },
  cycloneHistory: { en: 'Cyclone History', te: 'తుఫాను చరిత్ర', hi: 'चक्रवात इतिहास' },
  ourHeroes: { en: 'Our Heroes', te: 'మన హీరోలు', hi: 'हमारे नायक' },
  alerts: { en: 'Alerts & Warnings', te: 'హెచ్చరికలు', hi: 'अलर्ट व चेतावनियां' },
  dashboard: { en: 'Dashboard', te: 'డ్యాష్‌బోర్డ్', hi: 'डैशबोर्ड' },
  about: { en: 'About', te: 'మా గురించి', hi: 'परिचय' },
  more: { en: 'More', te: 'మరిన్ని', hi: 'अधिक' },

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
  signOut: { en: 'Switch / Sign out', te: 'సైన్ అవుట్', hi: 'साइन आउट' },

  // Simple words toggle
  simpleWordsMode: {
    en: 'Simple Words Mode',
    te: 'సులభ పదాల మోడ్',
    hi: 'सरल भाषा मोड',
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
