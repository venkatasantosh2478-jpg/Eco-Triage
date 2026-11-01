import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ActivityLogItem,
  AlertItem,
  HelpPoint,
  HeroProfile,
  Incident,
  Language,
  SeverityLevel,
  TextSize,
  UserProfile,
  UserRole,
} from '../types.ts';
import {
  addActivityLog,
  loadActivityLogs,
  loadAlerts,
  loadHelpPoints,
  loadHeroes,
  loadIncidents,
  resetAllDataToDefault,
  SAMPLE_CREWS,
  SAMPLE_USERS,
  saveActivityLogs,
  saveAlerts,
  saveHelpPoints,
  saveHeroes,
  saveIncidents,
} from '../utils/storage.ts';
import { calculateRuleScore, getSeverity } from '../utils/rules.ts';
import { OperatingMode, EmergencyContact, VolunteerRegistration, SAMPLE_EMERGENCY_CONTACTS } from '../utils/modeConfig.ts';

interface AppContextType {
  // Navigation
  activePage: string;
  setActivePage: (page: string) => void;
  selectedIncidentId: string | null;
  setSelectedIncidentId: (id: string | null) => void;

  // Dual Operating Mode
  operatingMode: OperatingMode;
  modeSince: string;
  modeReason: string;
  disasterName: string;
  setOperatingMode: (mode: OperatingMode, reason: string, disasterName?: string) => void;

  // Emergency Contacts & Volunteers
  emergencyContacts: EmergencyContact[];
  volunteers: VolunteerRegistration[];
  addEmergencyContact: (contact: Omit<EmergencyContact, 'id' | 'updatedAt'>) => void;
  updateContactStatus: (id: string, status: EmergencyContact['status']) => void;
  registerVolunteer: (vol: Omit<VolunteerRegistration, 'id' | 'createdAt' | 'status'>) => void;
  updateVolunteerStatus: (id: string, status: VolunteerRegistration['status']) => void;

  // Language & Accessibility
  language: Language;
  setLanguage: (lang: Language) => void;
  simpleWords: boolean;
  setSimpleWords: (val: boolean) => void;
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;

  // User & Roles
  currentUser: UserProfile | null;
  currentRole: UserRole;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  signIn: (user: UserProfile) => void;
  signOut: () => void;
  hasPermission: (action: string) => boolean;

  // Connectivity
  networkStatus: 'Online' | '2G' | 'Offline';
  setNetworkStatus: (status: 'Online' | '2G' | 'Offline') => void;
  lastSyncedTime: string;

  // Data
  incidents: Incident[];
  helpPoints: HelpPoint[];
  alerts: AlertItem[];
  heroes: HeroProfile[];
  activityLogs: ActivityLogItem[];
  queuedCount: number;

  // Actions
  addIncident: (incident: Incident) => void;
  updateIncidentStatus: (id: string, status: Incident['status'], note?: string) => void;
  overridePriority: (id: string, newScore: number, reason: string) => void;
  dispatchCrew: (incidentId: string, crewName: string) => void;
  verifyIncident: (id: string, verified: boolean, reason?: string) => void;
  approveAndPinIncident: (id: string, officerName?: string) => void;
  updateHelpPointCapacity: (id: string, freeBeds: number, status?: HelpPoint['status']) => void;
  addHelpPoint: (hp: Omit<HelpPoint, 'id' | 'updatedAt'>) => void;
  deleteHelpPoint: (id: string) => void;
  deleteIncident: (id: string) => void;
  publishAlert: (alert: Omit<AlertItem, 'id'>) => void;
  expireAlert: (id: string) => void;
  thankHero: (heroId: string) => void;
  toggleLikeHero: (heroId: string) => void;
  likedHeroIds: string[];
  suggestHero: (name: string, role: string, department: HeroProfile['department'], story: string) => void;
  addHero: (heroData: Omit<HeroProfile, 'id' | 'thankCount'>) => void;
  updateHero: (hero: HeroProfile) => void;
  deleteHero: (id: string) => void;
  resetAllData: () => void;

  // AI Metrics
  avgAiTimeMs: number;
  recordAiLatency: (ms: number) => void;

  // Feedback Toasts
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<string>('home');
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);

  // Dual Operating Mode state
  const [operatingMode, setOperatingModeState] = useState<OperatingMode>(() => {
    return (localStorage.getItem('ecotriage_operating_mode') as OperatingMode) || 'daily';
  });
  const [modeSince, setModeSince] = useState<string>(() => {
    return localStorage.getItem('ecotriage_mode_since') || '10:42 AM';
  });
  const [modeReason, setModeReason] = useState<string>(() => {
    return localStorage.getItem('ecotriage_mode_reason') || 'Normal operations';
  });
  const [disasterName, setDisasterName] = useState<string>(() => {
    return localStorage.getItem('ecotriage_disaster_name') || 'Cyclone, coastal Visakhapatnam';
  });

  const setOperatingMode = (mode: OperatingMode, reason: string, name?: string) => {
    setOperatingModeState(mode);
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setModeSince(nowStr);
    setModeReason(reason);
    if (name) setDisasterName(name);

    localStorage.setItem('ecotriage_operating_mode', mode);
    localStorage.setItem('ecotriage_mode_since', nowStr);
    localStorage.setItem('ecotriage_mode_reason', reason);
    if (name) localStorage.setItem('ecotriage_disaster_name', name);

    const announcement = mode === 'emergency' ? 'Emergency mode is now on.' : 'Daily mode is now on.';
    showToast(announcement);
    addActivityLog(currentUser ? currentUser.name : 'Admin', `Switched global system mode to ${mode.toUpperCase()}: ${reason}`);
  };

  // Emergency Contacts & Volunteers state
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>(() => {
    try {
      const raw = localStorage.getItem('ecotriage_emergency_contacts');
      return raw ? JSON.parse(raw) : SAMPLE_EMERGENCY_CONTACTS;
    } catch {
      return SAMPLE_EMERGENCY_CONTACTS;
    }
  });

  const [volunteers, setVolunteers] = useState<VolunteerRegistration[]>(() => {
    try {
      const raw = localStorage.getItem('ecotriage_volunteers');
      return raw ? JSON.parse(raw) : [
        {
          id: 'vol_1',
          name: 'K. V. Rao',
          phone: '+91 98480 11111',
          area: 'MVP Colony',
          skills: ['First aid', 'Tree cutting'],
          availability: 'Weekends & Evenings',
          status: 'Approved',
          createdAt: '2 days ago',
          consentToShowPhone: true,
        },
      ];
    } catch {
      return [];
    }
  });

  const addEmergencyContact = (contactData: Omit<EmergencyContact, 'id' | 'updatedAt'>) => {
    const newContact: EmergencyContact = {
      ...contactData,
      id: 'cnt_' + Date.now(),
      updatedAt: 'Just now',
    };
    const updated = [newContact, ...emergencyContacts];
    setEmergencyContacts(updated);
    try {
      localStorage.setItem('ecotriage_emergency_contacts', JSON.stringify(updated));
    } catch {}
    showToast(`Emergency contact "${newContact.name}" suggested (Pending Approval)`);
    addActivityLog(currentUser ? currentUser.name : 'Citizen', `Suggested emergency contact: ${newContact.name}`);
  };

  const updateContactStatus = (id: string, status: EmergencyContact['status']) => {
    const updated = emergencyContacts.map((c) => (c.id === id ? { ...c, status, updatedAt: 'Just now' } : c));
    setEmergencyContacts(updated);
    try {
      localStorage.setItem('ecotriage_emergency_contacts', JSON.stringify(updated));
    } catch {}
    showToast(`Contact status updated to ${status}`);
  };

  const registerVolunteer = (volData: Omit<VolunteerRegistration, 'id' | 'createdAt' | 'status'>) => {
    const newVol: VolunteerRegistration = {
      ...volData,
      id: 'vol_' + Date.now(),
      status: 'Pending',
      createdAt: 'Just now',
    };
    const updated = [newVol, ...volunteers];
    setVolunteers(updated);
    try {
      localStorage.setItem('ecotriage_volunteers', JSON.stringify(updated));
    } catch {}
    showToast('Volunteer registration submitted for review!');
    addActivityLog(newVol.name, `Registered as emergency volunteer in ${newVol.area}`);
  };

  const updateVolunteerStatus = (id: string, status: VolunteerRegistration['status']) => {
    const updated = volunteers.map((v) => (v.id === id ? { ...v, status } : v));
    setVolunteers(updated);
    try {
      localStorage.setItem('ecotriage_volunteers', JSON.stringify(updated));
    } catch {}
    showToast(`Volunteer status updated to ${status}`);
  };

  // Language & Accessibility
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('ecotriage_lang') as Language) || 'en';
  });
  const [simpleWords, setSimpleWordsState] = useState<boolean>(() => {
    const val = localStorage.getItem('ecotriage_simple_words');
    return val !== null ? val === 'true' : true; // Default true per prompt
  });
  const [textSize, setTextSizeState] = useState<TextSize>(() => {
    return (localStorage.getItem('ecotriage_text_size') as TextSize) || 'normal';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('ecotriage_lang', lang);
  };
  const setSimpleWords = (val: boolean) => {
    setSimpleWordsState(val);
    localStorage.setItem('ecotriage_simple_words', String(val));
  };
  const setTextSize = (size: TextSize) => {
    setTextSizeState(size);
    localStorage.setItem('ecotriage_text_size', size);
    document.body.classList.remove('text-size-normal', 'text-size-large', 'text-size-xlarge');
    document.body.classList.add(`text-size-${size}`);
  };

  useEffect(() => {
    document.body.classList.add(`text-size-${textSize}`);
  }, [textSize]);

  // User Profile & Roles
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const raw = localStorage.getItem('ecotriage_user');
    return raw ? JSON.parse(raw) : null;
  });
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return currentUser ? currentUser.role : 'public';
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const signIn = (user: UserProfile) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    localStorage.setItem('ecotriage_user', JSON.stringify(user));
    setIsAuthModalOpen(false);
    showToast(`Signed in as ${user.name} (${user.role})`);
    addActivityLog(user.name, `Staff signed in with role [${user.role}]`);
  };

  const signOut = () => {
    if (currentUser) {
      addActivityLog(currentUser.name, `User logged out.`);
    }
    setCurrentUser(null);
    setCurrentRole('public');
    localStorage.removeItem('ecotriage_user');
    showToast('Signed out. Public mode active.');
  };

  // Connectivity
  const [networkStatus, setNetworkStatus] = useState<'Online' | '2G' | 'Offline'>(() => {
    return typeof navigator !== 'undefined' && !navigator.onLine ? 'Offline' : 'Online';
  });
  const [lastSyncedTime, setLastSyncedTime] = useState<string>('Just now');

  useEffect(() => {
    const handleOnline = () => {
      setNetworkStatus('Online');
      setLastSyncedTime('Just now');
      syncQueuedReports();
    };
    const handleOffline = () => {
      setNetworkStatus('Offline');
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Data states
  const [incidents, setIncidents] = useState<Incident[]>(() => loadIncidents());
  const [helpPoints, setHelpPoints] = useState<HelpPoint[]>(() => loadHelpPoints());
  const [alerts, setAlerts] = useState<AlertItem[]>(() => loadAlerts());
  const [heroes, setHeroes] = useState<HeroProfile[]>(() => loadHeroes());
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>(() => loadActivityLogs());
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [avgAiTimeMs, setAvgAiTimeMs] = useState<number>(1420);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  const recordAiLatency = (ms: number) => {
    setAvgAiTimeMs((prev) => Math.round((prev + ms) / 2));
  };

  // Permissions gate
  const hasPermission = (action: string): boolean => {
    switch (action) {
      case 'view_map':
      case 'view_queue':
      case 'view_dashboard':
        return currentRole !== 'public';
      case 'report_hazard':
      case 'view_my_reports':
      case 'update_my_assignment':
        return currentRole === 'field' || currentRole === 'command' || currentRole === 'admin';
      case 'verify_report':
      case 'dispatch_crew':
      case 'mark_cleared':
      case 'override_priority':
      case 'manage_alerts':
      case 'update_camp':
      case 'export_data':
      case 'switch_mode':
        return currentRole === 'command' || currentRole === 'admin';
      case 'manage_users':
      case 'manage_crews':
      case 'manage_zones':
      case 'edit_content':
      case 'clear_data':
        return currentRole === 'admin';
      default:
        return true;
    }
  };

  // Actions
  const notifyServerIncident = (incident: Incident, action: string) => {
    fetch('/api/notify-incident', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        incidentId: incident.id,
        location: incident.location,
        priority_score: incident.priority_score,
        severity: incident.severity,
        status: incident.status,
        action,
        reportedBy: currentUser ? currentUser.name : incident.reportedBy,
      }),
    }).catch((err) => console.warn('Incident notification error:', err));
  };

  const addIncident = (newIncident: Incident) => {
    let finalScore = newIncident.priority_score;
    if (operatingMode === 'emergency') {
      if (newIncident.roadType === 'Hospital Route' || newIncident.roadType === 'Emergency Shelter') {
        finalScore = Math.min(10, finalScore + 0.5);
      }
    }
    const incidentWithBoost = { ...newIncident, priority_score: finalScore };
    const updated = [incidentWithBoost, ...incidents];
    setIncidents(updated);
    saveIncidents(updated);
    notifyServerIncident(incidentWithBoost, 'REPORTED');
    addActivityLog(incidentWithBoost.reportedBy, `Reported hazard at ${incidentWithBoost.location}`);
  };

  const syncQueuedReports = () => {
    try {
      const raw = localStorage.getItem('ecotriage_queued_reports');
      if (!raw) return;
      const queued: Incident[] = JSON.parse(raw);
      if (queued.length > 0) {
        const merged = [...queued, ...incidents];
        setIncidents(merged);
        saveIncidents(merged);
        localStorage.removeItem('ecotriage_queued_reports');
        showToast(`Synced ${queued.length} offline report(s) successfully!`);
        addActivityLog('System Sync', `Auto-synced ${queued.length} offline buffered reports.`);
      }
    } catch (err) {
      console.warn('Failed to sync queue:', err);
    }
  };

  const queuedCount = (() => {
    try {
      const raw = localStorage.getItem('ecotriage_queued_reports');
      return raw ? (JSON.parse(raw) as Incident[]).length : 0;
    } catch {
      return 0;
    }
  })();

  const overridePriority = (id: string, newScore: number, reason: string) => {
    const officerName = currentUser ? currentUser.name : 'Command Officer';
    const updated = incidents.map((inc) => {
      if (inc.id === id) {
        const oldScore = inc.priority_score;
        const clamped = Math.min(10, Math.max(1, Math.round(newScore * 10) / 10));
        const override = {
          from: oldScore,
          to: clamped,
          by: officerName,
          reason,
          time: 'Just now',
        };
        const newSeverity = getSeverity(clamped);
        return {
          ...inc,
          priority_score: clamped,
          severity: newSeverity,
          updatedAt: 'Just now',
          priorityHistory: [override, ...inc.priorityHistory],
          history: [
            {
              status: inc.status,
              by: officerName,
              time: 'Just now',
              note: `Priority score overridden from ${oldScore.toFixed(1)} to ${clamped.toFixed(1)}. Reason: ${reason}`,
            },
            ...inc.history,
          ],
        };
      }
      return inc;
    });
    setIncidents(updated);
    saveIncidents(updated);
    showToast(`Priority score overridden to ${newScore.toFixed(1)}`);
    addActivityLog(officerName, `Overrode priority for incident ${id} to ${newScore.toFixed(1)}. Reason: ${reason}`);
  };

  const dispatchCrew = (incidentId: string, crewName: string) => {
    const updated = incidents.map((inc) => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          status: 'Assigned' as const,
          assignedTo: crewName,
          updatedAt: 'Just now',
          history: [
            {
              status: 'Assigned' as const,
              by: currentUser ? currentUser.name : 'Command',
              time: 'Just now',
              note: `Dispatched ${crewName}`,
            },
            ...inc.history,
          ],
        };
      }
      return inc;
    });
    setIncidents(updated);
    saveIncidents(updated);
    showToast(`Dispatched ${crewName}. Queue updated.`);
    addActivityLog(currentUser ? currentUser.name : 'Command', `Dispatched ${crewName} to incident ${incidentId}`);
  };

  const verifyIncident = (id: string, verified: boolean, reason?: string) => {
    const updated = incidents.map((inc) => {
      if (inc.id === id) {
        return {
          ...inc,
          verified,
          updatedAt: 'Just now',
          history: [
            {
              status: inc.status,
              by: currentUser ? currentUser.name : 'Command',
              time: 'Just now',
              note: verified ? 'Report verified by command' : `Report rejected: ${reason || 'unsubstantiated'}`,
            },
            ...inc.history,
          ],
        };
      }
      return inc;
    });
    setIncidents(updated);
    saveIncidents(updated);
    showToast(verified ? 'Report verified' : 'Report rejected');
    addActivityLog(
      currentUser ? currentUser.name : 'Command',
      `${verified ? 'Verified' : 'Rejected'} report ${id}`
    );
  };

  const approveAndPinIncident = (id: string, officerName?: string) => {
    const nameToUse = officerName || (currentUser ? currentUser.name : 'Governance Officer');
    let targetInc: Incident | undefined;
    const updated = incidents.map((inc) => {
      if (inc.id === id) {
        targetInc = {
          ...inc,
          verified: true,
          approvedByGovernance: true,
          pinnedToMap: true,
          governanceOfficerName: nameToUse,
          updatedAt: 'Just now',
          history: [
            {
              status: inc.status,
              by: nameToUse,
              time: 'Just now',
              note: 'Approved by Governance Officer & pinned to live map',
            },
            ...inc.history,
          ],
        };
        return targetInc;
      }
      return inc;
    });
    setIncidents(updated);
    saveIncidents(updated);
    if (targetInc) {
      notifyServerIncident(targetInc, 'GOVERNANCE_APPROVED_AND_PINNED');
    }
    showToast(`Hazard ${id} approved & pinned to map by ${nameToUse}`);
    addActivityLog(nameToUse, `Approved hazard report ${id} and pinned to live map.`);
  };

  const updateIncidentStatus = (id: string, status: Incident['status'], note?: string) => {
    let updatedInc: Incident | undefined;
    const updated = incidents.map((inc) => {
      if (inc.id === id) {
        const event = {
          status,
          by: currentUser ? currentUser.name : 'Officer',
          time: 'Just now',
          note,
        };
        updatedInc = {
          ...inc,
          status,
          updatedAt: 'Just now',
          lastUpdatedBy: currentUser ? currentUser.name : 'Officer',
          history: [event, ...inc.history],
        };
        return updatedInc;
      }
      return inc;
    });
    setIncidents(updated);
    saveIncidents(updated);
    if (updatedInc) {
      notifyServerIncident(updatedInc, `STATUS_CHANGED_TO_${status}`);
    }
    showToast(`Status updated to ${status}`);
    addActivityLog(currentUser ? currentUser.name : 'Officer', `Updated incident ${id} status to ${status}`);
  };

  const updateHelpPointCapacity = (id: string, freeBeds: number, status?: HelpPoint['status']) => {
    const updated = helpPoints.map((hp) => {
      if (hp.id === id) {
        return {
          ...hp,
          capacityFree: freeBeds,
          status: status || (freeBeds === 0 ? 'Full' : freeBeds < 20 ? 'Almost full' : 'Open'),
          updatedAt: 'Just now',
        };
      }
      return hp;
    });
    setHelpPoints(updated);
    saveHelpPoints(updated);
    showToast(`Updated capacity: ${freeBeds} free beds`);
    addActivityLog(currentUser ? currentUser.name : 'Staff', `Updated shelter capacity at ${id}: ${freeBeds} free beds`);
  };

  const addHelpPoint = (hpData: Omit<HelpPoint, 'id' | 'updatedAt'>) => {
    const newHp: HelpPoint = {
      ...hpData,
      id: 'hp_' + Date.now(),
      updatedAt: 'Just now',
    };
    const updated = [newHp, ...helpPoints];
    setHelpPoints(updated);
    saveHelpPoints(updated);
    showToast(`Added facility "${newHp.name}"`);
    addActivityLog(currentUser ? currentUser.name : 'Officer', `Added facility: ${newHp.name}`);
  };

  const deleteHelpPoint = (id: string) => {
    const target = helpPoints.find((h) => h.id === id);
    const updated = helpPoints.filter((h) => h.id !== id);
    setHelpPoints(updated);
    saveHelpPoints(updated);
    showToast(`Facility removed`);
    if (target) {
      addActivityLog(currentUser ? currentUser.name : 'Admin', `Deleted facility: ${target.name}`);
    }
  };

  const deleteIncident = (id: string) => {
    const updated = incidents.filter((i) => i.id !== id);
    setIncidents(updated);
    saveIncidents(updated);
    showToast(`Incident ${id} deleted`);
    addActivityLog(currentUser ? currentUser.name : 'Admin', `Deleted incident record ${id}`);
  };

  const publishAlert = (alertData: Omit<AlertItem, 'id'>) => {
    const newAlert: AlertItem = {
      ...alertData,
      id: 'alert_' + Date.now(),
    };
    const updated = [newAlert, ...alerts];
    setAlerts(updated);
    saveAlerts(updated);
    showToast('New alert published to live ticker');
    addActivityLog(currentUser ? currentUser.name : 'Command', `Published emergency alert: ${newAlert.message}`);
  };

  const expireAlert = (id: string) => {
    const updated = alerts.map((a) => (a.id === id ? { ...a, active: false } : a));
    setAlerts(updated);
    saveAlerts(updated);
    showToast('Alert deactivated');
    addActivityLog(currentUser ? currentUser.name : 'Command', `Deactivated alert ${id}`);
  };

  const [likedHeroIds, setLikedHeroIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('ecotriage_liked_heroes');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const toggleLikeHero = (heroId: string) => {
    let heroName = 'Hero';
    const isAlreadyLiked = likedHeroIds.includes(heroId);
    const nextLiked = isAlreadyLiked
      ? likedHeroIds.filter((id) => id !== heroId)
      : [...likedHeroIds, heroId];

    setLikedHeroIds(nextLiked);
    try {
      localStorage.setItem('ecotriage_liked_heroes', JSON.stringify(nextLiked));
    } catch {}

    const updated = heroes.map((h) => {
      if (h.id === heroId) {
        heroName = h.name;
        const newCount = isAlreadyLiked ? Math.max(0, h.thankCount - 1) : h.thankCount + 1;
        return { ...h, thankCount: newCount };
      }
      return h;
    });

    setHeroes(updated);
    saveHeroes(updated);

    if (isAlreadyLiked) {
      showToast(`Removed salute for ${heroName}`);
    } else {
      showToast(`Salute sent to ${heroName}! ❤️`);
    }
  };

  const thankHero = (heroId: string) => {
    toggleLikeHero(heroId);
  };

  const suggestHero = (name: string, role: string, department: HeroProfile['department'], story: string) => {
    const newHero: HeroProfile = {
      id: 'hero_' + Date.now(),
      name,
      role,
      department,
      story,
      thankCount: 1,
      sample: false,
      avatarSeed: name.toLowerCase().replace(/\s+/g, ''),
      status: 'approved',
    };
    const updated = [newHero, ...heroes];
    setHeroes(updated);
    saveHeroes(updated);
    showToast(`Hero card "${name}" added and published!`);
    addActivityLog(currentUser ? currentUser.name : 'Citizen', `Added hero responder: ${name}`);
  };

  const addHero = (heroData: Omit<HeroProfile, 'id' | 'thankCount'>) => {
    const newHero: HeroProfile = {
      ...heroData,
      id: 'hero_' + Date.now(),
      thankCount: 0,
    };
    const updated = [newHero, ...heroes];
    setHeroes(updated);
    saveHeroes(updated);
    showToast(`Added hero profile "${newHero.name}"`);
    addActivityLog(currentUser ? currentUser.name : 'Admin', `Added hero profile: ${newHero.name}`);
  };

  const updateHero = (hero: HeroProfile) => {
    const updated = heroes.map((h) => (h.id === hero.id ? hero : h));
    setHeroes(updated);
    saveHeroes(updated);
    showToast(`Updated hero "${hero.name}"`);
  };

  const deleteHero = (id: string) => {
    const updated = heroes.filter((h) => h.id !== id);
    setHeroes(updated);
    saveHeroes(updated);
    showToast('Hero profile deleted');
  };

  const resetAllData = () => {
    resetAllDataToDefault();
    setIncidents(loadIncidents());
    setHelpPoints(loadHelpPoints());
    setAlerts(loadAlerts());
    setHeroes(loadHeroes());
    setActivityLogs(loadActivityLogs());
    showToast('All system data reset to sample state.');
  };

  return (
    <AppContext.Provider
      value={{
        activePage,
        setActivePage,
        selectedIncidentId,
        setSelectedIncidentId,
        operatingMode,
        modeSince,
        modeReason,
        disasterName,
        setOperatingMode,
        emergencyContacts,
        volunteers,
        addEmergencyContact,
        updateContactStatus,
        registerVolunteer,
        updateVolunteerStatus,
        language,
        setLanguage,
        simpleWords,
        setSimpleWords,
        textSize,
        setTextSize,
        currentUser,
        currentRole,
        isAuthModalOpen,
        setIsAuthModalOpen,
        signIn,
        signOut,
        hasPermission,
        networkStatus,
        setNetworkStatus,
        lastSyncedTime,
        incidents,
        helpPoints,
        alerts,
        heroes,
        activityLogs,
        queuedCount,
        addIncident,
        updateIncidentStatus,
        overridePriority,
        dispatchCrew,
        verifyIncident,
        updateHelpPointCapacity,
        addHelpPoint,
        deleteHelpPoint,
        deleteIncident,
        publishAlert,
        expireAlert,
        thankHero,
        toggleLikeHero,
        likedHeroIds,
        suggestHero,
        addHero,
        updateHero,
        deleteHero,
        approveAndPinIncident,
        resetAllData,
        avgAiTimeMs,
        recordAiLatency,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
