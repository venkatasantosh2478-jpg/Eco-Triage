export type UserRole = 'public' | 'viewer' | 'field' | 'command' | 'admin';

export type Language = 'en' | 'te' | 'hi';
export type TextSize = 'normal' | 'large' | 'xlarge';

export type ObstructionType = 'complete_block' | 'single_lane' | 'clear';
export type HazardFlag = 'live_electrical_wire' | 'none';
export type SeverityLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export type RoadType =
  | 'Hospital Route'
  | 'Major Artery'
  | 'Emergency Shelter'
  | 'Industrial Lifeline'
  | 'Transit Route'
  | 'Standard Road'
  | 'Commercial'
  | 'Residential';

export type IncidentStatus =
  | 'Queued'
  | 'Pending'
  | 'Assigned'
  | 'On the way'
  | 'Working'
  | 'Cleared';

export interface TimelineEvent {
  status: IncidentStatus;
  by: string;
  time: string;
  note?: string;
}

export interface PriorityOverride {
  from: number;
  to: number;
  by: string;
  reason: string;
  time: string;
}

export interface Incident {
  id: string;
  location: string;
  lat: number;
  lng: number;
  obstruction: ObstructionType;
  hazard: HazardFlag;
  priority_score: number;
  severity: SeverityLevel;
  roadType: RoadType;
  zone: string;
  status: IncidentStatus;
  source: 'Photo' | 'SMS' | 'Sample';
  equipment: string;
  createdAt: string;
  updatedAt: string;
  photo?: string;
  note?: string;
  reportedBy: string;
  verified: boolean;
  pinnedToMap: boolean;
  approvedByGovernance?: boolean;
  governanceOfficerName?: string;
  assignedTo?: string;
  lastUpdatedBy: string;
  history: TimelineEvent[];
  priorityHistory: PriorityOverride[];
  sample: boolean;
  aiRecommendation?: string;
  aiScore?: number;
}

export type HelpCategory =
  | 'relief_camp'
  | 'hospital'
  | 'first_aid'
  | 'ambulance'
  | 'fire_station'
  | 'water_food'
  | 'depot';

export interface HelpPoint {
  id: string;
  name: string;
  category: HelpCategory;
  lat: number;
  lng: number;
  address: string;
  phone: string;
  status: 'Open' | 'Almost full' | 'Full' | 'Closed';
  capacity?: number;
  capacityFree?: number;
  facilities?: string[];
  updatedAt: string;
  sample: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  pin: string;
  zone?: string;
  department?: string;
  description: string;
}

export interface AlertItem {
  id: string;
  type: 'weather' | 'flood' | 'road' | 'other';
  severity: 'Warning' | 'Advisory' | 'Info';
  message: string;
  messageTe?: string;
  messageHi?: string;
  issuedAt: string;
  expiresAt: string;
  source: string;
  active: boolean;
}

export interface CycloneRecord {
  id: string;
  name: string;
  year: number;
  impact: string;
  affectedArea: string;
  lessonsLearned: string;
  source: string;
  wikiUrl?: string;
}

export interface ArticleRecord {
  id: string;
  title: string;
  source: string;
  date: string;
  summary: string;
  link: string;
}

export interface HeroProfile {
  id: string;
  name: string;
  role: string;
  department: 'Municipal' | 'Electricity' | 'Fire and Rescue' | 'Medical' | 'Police' | 'Volunteers';
  story: string;
  thankCount: number;
  sample: boolean;
  isHeroOfMonth?: boolean;
  avatarSeed: string;
  imageUrl?: string;
  status: 'approved' | 'pending';
}

export interface ActivityLogItem {
  id: string;
  who: string;
  what: string;
  when: string;
  timestamp: number;
}

export interface Crew {
  id: string;
  name: string;
  type: 'PWD Heavy Unit' | 'State Electricity Board' | 'Fire and Rescue' | 'Medical Ambulance';
  status: 'Free' | 'Busy';
  assignedIncidentId?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}
