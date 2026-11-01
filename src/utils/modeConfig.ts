import { UserRole } from '../types.ts';

export type OperatingMode = 'daily' | 'emergency';

export interface ModeState {
  mode: OperatingMode;
  modeSince: string;
  modeReason: string;
  disasterName?: string;
  scheduledSwitch?: {
    mode: OperatingMode;
    switchAt: string;
  };
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
    badgeBg: 'bg-blue-100 text-[#2457C5]',
    tickerStyle: 'calm blue',
    heroHeadline: 'Safer roads, every day.',
    heroSubline: 'Report road hazards. Find help nearby. Be prepared.',
    primaryButtonText: 'Report Road Hazard',
    secondaryButtonText: 'Find Help Nearby',
    homeSectionOrder: ['help', 'precautions', 'clearances', 'alerts', 'heroes', 'workflow'],
    reportDefaultUrgency: 'low',
    mapDefaultFilter: 'All open',
    helpDefaultChip: 'All',
    precautionsTab: 'Before Cyclone',
    dashboardView: '7-day trend, average clearance time & crew availability',
    notificationStyle: 'In-app toasts only',
  },
  emergency: {
    name: 'Emergency mode',
    badgeText: 'EMERGENCY MODE',
    badgeBg: 'bg-red-600 text-white animate-pulse',
    tickerStyle: 'urgent red strip',
    heroHeadline: 'Help reaches blocked roads faster.',
    heroSubline: 'Report hazards. Find help. Stay safe.',
    primaryButtonText: 'Report Hazard',
    secondaryButtonText: 'Find Help Nearby',
    homeSectionOrder: ['reportButtons', 'contacts', 'blockedRoads', 'reliefCamps', 'alerts', 'precautions', 'workflow', 'whyItMatters'],
    reportDefaultUrgency: 'critical',
    mapDefaultFilter: 'Critical and Pending',
    helpDefaultChip: 'Relief Camps',
    precautionsTab: 'During Cyclone',
    dashboardView: 'Live panel: open critical count, free/busy crews, average time & relief camp capacity',
    notificationStyle: 'In-app toasts + sound/vibration + critical banner',
    priorityBoost: 0.5,
  },
};

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
