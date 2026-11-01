import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  ActivityLogItem,
  AlertItem,
  HelpPoint,
  HeroProfile,
  Incident,
  Language,
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
  saveAlerts,
  saveHelpPoints,
  saveHeroes,
  saveIncidents,
} from '../utils/storage.ts';
import { calculateRuleScore, getSeverity, toggleHeroSaluteState } from '../utils/rules.ts';
import {
  DEFAULT_MODE_ASSETS,
  DEFAULT_MODE_CONTENT,
  DEFAULT_MODE_FEATURES,
  DEFAULT_MODE_HISTORY,
  DEFAULT_MODE_SETTINGS,
  DEFAULT_VOLUNTEER_TASKS,
  EmergencyContact,
  getModeAssetForSlot,
  getModeContentText,
  isModeFeatureEnabled,
  ModeAssetRecord,
  ModeAssetSlotKey,
  ModeContentKey,
  ModeContentRecord,
  ModeFeatureKey,
  ModeFeatureRecord,
  ModeHistoryRecord,
  ModeSettingsTable,
  OperatingMode,
  resolveEffectiveMode,
  SAMPLE_EMERGENCY_CONTACTS,
  VolunteerRegistration,
  VolunteerTaskRequest,
} from '../utils/modeConfig.ts';

interface AppContextType {
  // Navigation
  activePage: string;
  setActivePage: (page: string) => void;
  selectedIncidentId: string | null;
  setSelectedIncidentId: (id: string | null) => void;

  // Dual Operating Mode (Section 14)
  operatingMode: OperatingMode; // Effective mode (respects Admin Preview-As)
  globalServerMode: OperatingMode; // Underlying server mode
  previewMode: OperatingMode | null;
  setPreviewMode: (mode: OperatingMode | null) => void;
  modeSince: string;
  modeReason: string;
  disasterName: string;
  expectedEnd: string;
  emergencyBroadcastMessage: string;
  emergencyBroadcastExpiry: string;
  scheduledSwitch: ModeSettingsTable['scheduledSwitch'];
  modeHistory: ModeHistoryRecord[];
  modeFeatures: ModeFeatureRecord[];
  modeAssets: ModeAssetRecord[];
  modeContent: ModeContentRecord[];
  usingCachedMode: boolean;
  lastModeUpdatedTime: string;
  modeSwitchError: string | null;
  clearModeSwitchError: () => void;
  ariaLiveAnnouncement: string;
  hasActiveWarningPrompt: boolean;
  dismissWarningPrompt: () => void;

  // Mode Actions & Helpers
  setOperatingMode: (
    mode: OperatingMode,
    reason: string,
    disasterName?: string,
    expectedEnd?: string
  ) => Promise<boolean>;
  scheduleModeSwitch: (
    targetMode: OperatingMode,
    switchAt: string,
    reason: string,
    disasterName?: string
  ) => Promise<boolean>;
  cancelScheduledSwitch: () => Promise<boolean>;
  saveModeFeatures: (updated: ModeFeatureRecord[]) => Promise<boolean>;
  saveModeAsset: (payload: {
    slot_key: ModeAssetSlotKey;
    mode: OperatingMode;
    resetToDefault?: boolean;
    image_url_desktop?: string;
    image_url_mobile?: string;
    alt_en?: string;
    alt_te?: string;
    alt_hi?: string;
    credit?: string;
    licence?: string;
    rightsConfirmed?: boolean;
  }) => Promise<{ ok: boolean; error?: string }>;
  saveModeContent: (
    updates: ModeContentRecord[],
    broadcastMessage?: string,
    broadcastExpiry?: string
  ) => Promise<boolean>;
  isFeatureOn: (key: ModeFeatureKey) => boolean;
  getAsset: (slot: ModeAssetSlotKey) => ModeAssetRecord;
  getContent: (key: ModeContentKey) => string;
  isModeModalOpen: boolean;
  setIsModeModalOpen: (open: boolean) => void;

  // Emergency Contacts & Volunteers & Tasks
  emergencyContacts: EmergencyContact[];
  volunteers: VolunteerRegistration[];
  volunteerTasks: VolunteerTaskRequest[];
  addEmergencyContact: (contact: Omit<EmergencyContact, 'id' | 'updatedAt'>) => void;
  updateContactStatus: (id: string, status: EmergencyContact['status']) => void;
  registerVolunteer: (vol: Omit<VolunteerRegistration, 'id' | 'createdAt' | 'status'>) => void;
  updateVolunteerStatus: (id: string, status: VolunteerRegistration['status']) => void;
  postVolunteerTask: (title: string, area: string, skillsNeeded: string) => void;
  respondToVolunteerTask: (taskId: string, name: string, phone: string) => void;
  confirmVolunteerForTask: (taskId: string, phone: string) => void;

  // Sound/Vibration, Low-data & Citizen Feedback (Section 14.4)
  soundVibrationEnabled: boolean;
  setSoundVibrationEnabled: (enabled: boolean) => void;
  lowDataMode: boolean;
  setLowDataMode: (enabled: boolean) => void;
  submitRoadClearFeedback: (incidentId: string, isClear: boolean) => void;

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
  const [isModeModalOpen, setIsModeModalOpen] = useState<boolean>(false);

  // User Profile & Roles
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const raw = localStorage.getItem('ecotriage_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return currentUser ? currentUser.role : 'public';
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Language & Accessibility
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('ecotriage_lang') as Language) || 'en';
  });
  const [simpleWords, setSimpleWordsState] = useState<boolean>(() => {
    const val = localStorage.getItem('ecotriage_simple_words');
    return val !== null ? val === 'true' : true;
  });
  const [textSize, setTextSizeState] = useState<TextSize>(() => {
    return (localStorage.getItem('ecotriage_text_size') as TextSize) || 'normal';
  });

  // Connectivity
  const [networkStatus, setNetworkStatusState] = useState<'Online' | '2G' | 'Offline'>(() => {
    return typeof navigator !== 'undefined' && !navigator.onLine ? 'Offline' : 'Online';
  });
  const [lastSyncedTime, setLastSyncedTime] = useState<string>('Just now');

  // Dual Mode State (Section 14)
  const [globalServerMode, setGlobalServerMode] = useState<OperatingMode>(() => {
    return (localStorage.getItem('ecotriage_operating_mode') as OperatingMode) || DEFAULT_MODE_SETTINGS.app_mode;
  });
  const [previewMode, setPreviewMode] = useState<OperatingMode | null>(null);
  const [modeSince, setModeSince] = useState<string>(() => {
    return localStorage.getItem('ecotriage_mode_since') || DEFAULT_MODE_SETTINGS.modeSince;
  });
  const [modeReason, setModeReason] = useState<string>(() => {
    return localStorage.getItem('ecotriage_mode_reason') || DEFAULT_MODE_SETTINGS.modeReason;
  });
  const [disasterName, setDisasterName] = useState<string>(() => {
    return localStorage.getItem('ecotriage_disaster_name') || DEFAULT_MODE_SETTINGS.disasterName;
  });
  const [expectedEnd, setExpectedEnd] = useState<string>(() => {
    return localStorage.getItem('ecotriage_expected_end') || '';
  });
  const [emergencyBroadcastMessage, setEmergencyBroadcastMessage] = useState<string>(() => {
    return (
      localStorage.getItem('ecotriage_broadcast_msg') ||
      DEFAULT_MODE_SETTINGS.emergencyBroadcastMessage ||
      ''
    );
  });
  const [emergencyBroadcastExpiry, setEmergencyBroadcastExpiry] = useState<string>(() => {
    return (
      localStorage.getItem('ecotriage_broadcast_exp') ||
      DEFAULT_MODE_SETTINGS.emergencyBroadcastExpiry ||
      '23:59 IST'
    );
  });
  const [scheduledSwitch, setScheduledSwitch] = useState<ModeSettingsTable['scheduledSwitch']>(null);
  const [modeHistory, setModeHistory] = useState<ModeHistoryRecord[]>(() => {
    try {
      const raw = localStorage.getItem('ecotriage_mode_history');
      return raw ? JSON.parse(raw) : DEFAULT_MODE_HISTORY;
    } catch {
      return DEFAULT_MODE_HISTORY;
    }
  });
  const [modeFeatures, setModeFeatures] = useState<ModeFeatureRecord[]>(() => {
    try {
      const raw = localStorage.getItem('ecotriage_mode_features');
      return raw ? JSON.parse(raw) : DEFAULT_MODE_FEATURES;
    } catch {
      return DEFAULT_MODE_FEATURES;
    }
  });
  const [modeAssets, setModeAssets] = useState<ModeAssetRecord[]>(() => {
    try {
      const raw = localStorage.getItem('ecotriage_mode_assets_v2');
      return raw ? JSON.parse(raw) : DEFAULT_MODE_ASSETS;
    } catch {
      return DEFAULT_MODE_ASSETS;
    }
  });
  const [modeContent, setModeContent] = useState<ModeContentRecord[]>(() => {
    try {
      const raw = localStorage.getItem('ecotriage_mode_content');
      return raw ? JSON.parse(raw) : DEFAULT_MODE_CONTENT;
    } catch {
      return DEFAULT_MODE_CONTENT;
    }
  });

  const [usingCachedMode, setUsingCachedMode] = useState<boolean>(false);
  const [lastModeUpdatedTime, setLastModeUpdatedTime] = useState<string>(() => {
    return localStorage.getItem('ecotriage_mode_last_updated') || '10:42';
  });
  const [modeSwitchError, setModeSwitchError] = useState<string | null>(null);
  const [ariaLiveAnnouncement, setAriaLiveAnnouncement] = useState<string>('');
  const [warningPromptDismissed, setWarningPromptDismissed] = useState<boolean>(false);

  // Sound/vibration & Low-data state (Section 14.4)
  const [soundVibrationEnabled, setSoundVibrationEnabled] = useState<boolean>(false);
  const [lowDataMode, setLowDataMode] = useState<boolean>(false);

  // Effective Operating Mode (supports Admin "Preview as" bar)
  const operatingMode = resolveEffectiveMode(globalServerMode, previewMode, currentRole);

  // Data states
  const [incidents, setIncidents] = useState<Incident[]>(() => loadIncidents());
  const [helpPoints, setHelpPoints] = useState<HelpPoint[]>(() => loadHelpPoints());
  const [alerts, setAlerts] = useState<AlertItem[]>(() => loadAlerts());
  const [heroes, setHeroes] = useState<HeroProfile[]>(() => loadHeroes());
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>(() => loadActivityLogs());
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [avgAiTimeMs, setAvgAiTimeMs] = useState<number>(1420);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  }, []);

  const appendLog = useCallback((who: string, what: string) => {
    addActivityLog(who, what);
    setActivityLogs(loadActivityLogs());
  }, []);

  // Preload essential images for both modes so offline mode switching is instant (Section 14.5 & 14.8)
  useEffect(() => {
    const heroDaily = DEFAULT_MODE_ASSETS.find((a) => a.slot_key === 'home_hero' && a.mode === 'daily');
    const heroEmerg = DEFAULT_MODE_ASSETS.find((a) => a.slot_key === 'home_hero' && a.mode === 'emergency');
    [heroDaily?.image_url_desktop, heroEmerg?.image_url_desktop].forEach((url) => {
      if (url && typeof Image !== 'undefined') {
        const img = new Image();
        img.src = url;
      }
    });
  }, []);

  // Apply server mode payload to state & localStorage cache
  const applyServerModePayload = useCallback(
    (data: {
      settings?: ModeSettingsTable;
      features?: ModeFeatureRecord[];
      assets?: ModeAssetRecord[];
      content?: ModeContentRecord[];
      history?: ModeHistoryRecord[];
    }) => {
      if (data.settings) {
        const s = data.settings;
        setGlobalServerMode((prev) => {
          if (prev !== s.app_mode) {
            const msg =
              s.app_mode === 'emergency' ? 'Emergency mode is now on.' : 'Daily mode is now on.';
            setAriaLiveAnnouncement(msg);
          }
          return s.app_mode;
        });
        setModeSince(s.modeSince);
        setModeReason(s.modeReason);
        if (s.disasterName) setDisasterName(s.disasterName);
        if (s.expectedEnd !== undefined) setExpectedEnd(s.expectedEnd || '');
        if (s.emergencyBroadcastMessage !== undefined) {
          setEmergencyBroadcastMessage(s.emergencyBroadcastMessage);
        }
        if (s.emergencyBroadcastExpiry !== undefined) {
          setEmergencyBroadcastExpiry(s.emergencyBroadcastExpiry);
        }
        setScheduledSwitch(s.scheduledSwitch || null);
        const updatedClock =
          s.lastUpdated || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setLastModeUpdatedTime(updatedClock);

        try {
          localStorage.setItem('ecotriage_operating_mode', s.app_mode);
          localStorage.setItem('ecotriage_mode_since', s.modeSince);
          localStorage.setItem('ecotriage_mode_reason', s.modeReason);
          localStorage.setItem('ecotriage_disaster_name', s.disasterName || '');
          localStorage.setItem('ecotriage_mode_last_updated', updatedClock);
        } catch {}
      }
      if (Array.isArray(data.features)) {
        setModeFeatures(data.features);
        try {
          localStorage.setItem('ecotriage_mode_features', JSON.stringify(data.features));
        } catch {}
      }
      if (Array.isArray(data.assets)) {
        setModeAssets(data.assets);
        try {
          localStorage.setItem('ecotriage_mode_assets_v2', JSON.stringify(data.assets));
        } catch {}
      }
      if (Array.isArray(data.content)) {
        setModeContent(data.content);
        try {
          localStorage.setItem('ecotriage_mode_content', JSON.stringify(data.content));
        } catch {}
      }
      if (Array.isArray(data.history)) {
        setModeHistory(data.history);
        try {
          localStorage.setItem('ecotriage_mode_history', JSON.stringify(data.history));
        } catch {}
      }
      setUsingCachedMode(false);
    },
    []
  );

  // Sync mode from server at start + SSE (/api/events) + 15-second fallback polling (Section 14.2 & 14.8)
  useEffect(() => {
    let isMounted = true;

    const fetchModeFromServer = async () => {
      if (networkStatus === 'Offline') {
        setUsingCachedMode(true);
        return;
      }
      try {
        const res = await fetch('/api/mode');
        if (!res.ok) throw new Error('Mode fetch failed');
        const data = await res.json();
        if (isMounted) {
          applyServerModePayload(data);
        }
      } catch {
        if (isMounted) {
          setUsingCachedMode(true);
        }
      }
    };

    fetchModeFromServer();

    // SSE real-time subscription (<5s update to all open tabs)
    let es: EventSource | null = null;
    if (typeof EventSource !== 'undefined' && networkStatus !== 'Offline') {
      try {
        es = new EventSource('/api/events');
        es.onmessage = (ev) => {
          try {
            const parsed = JSON.parse(ev.data);
            if (isMounted) applyServerModePayload(parsed);
          } catch {}
        };
        es.onerror = () => {
          if (isMounted) setUsingCachedMode(true);
        };
      } catch {}
    }

    // 15-second fallback polling
    const pollTimer = setInterval(fetchModeFromServer, 15000);

    return () => {
      isMounted = false;
      es?.close();
      clearInterval(pollTimer);
    };
  }, [networkStatus, applyServerModePayload]);

  // Automatic Low-data mode when connection is 2G or Offline in Emergency mode (Section 14.4)
  useEffect(() => {
    const lowDataFeatureAllowed = isModeFeatureEnabled(modeFeatures, operatingMode, 'low_data_mode');
    if (lowDataFeatureAllowed && (networkStatus === '2G' || networkStatus === 'Offline')) {
      setLowDataMode(true);
    } else if (networkStatus === 'Online') {
      setLowDataMode(false);
    }
  }, [networkStatus, operatingMode, modeFeatures]);

  // Switch operating mode (Admin only; Section 14.2)
  const setOperatingMode = async (
    targetMode: OperatingMode,
    reason: string,
    newDisasterName?: string,
    newExpectedEnd?: string
  ): Promise<boolean> => {
    setModeSwitchError(null);
    const actorName = currentUser ? currentUser.name : 'Admin';
    const prevMode = globalServerMode;

    // Enforce Admin-only on client and server
    if (currentRole !== 'admin') {
      const errMsg = 'Forbidden (403): Only an Admin can change the operating mode.';
      setModeSwitchError(errMsg);
      showToast(errMsg);
      return false;
    }

    if (!reason || !reason.trim()) {
      setModeSwitchError('We could not change the mode. A reason is required.');
      return false;
    }

    try {
      const res = await fetch('/api/mode', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': currentRole,
        },
        body: JSON.stringify({
          mode: targetMode,
          reason: reason.trim(),
          disasterName: newDisasterName,
          expectedEnd: newExpectedEnd,
          switchedBy: actorName,
        }),
      });

      if (!res.ok) {
        if (res.status === 403) {
          setModeSwitchError('Forbidden (403): Only an Admin can change the mode.');
          return false;
        }
        throw new Error('Server error');
      }

      const data = await res.json();
      applyServerModePayload(data);
      setPreviewMode(null);

      const announcement =
        targetMode === 'emergency' ? 'Emergency mode is now on.' : 'Daily mode is now on.';
      setAriaLiveAnnouncement(announcement);
      showToast(announcement);
      appendLog(
        actorName,
        `Switched mode from ${prevMode.toUpperCase()} to ${targetMode.toUpperCase()}. Reason: "${reason.trim()}"`
      );
      return true;
    } catch {
      // Offline fallback if Admin switches while offline (Section 14.8 / 14.10 #9)
      if (networkStatus === 'Offline') {
        const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setGlobalServerMode(targetMode);
        setModeSince(nowStr);
        setModeReason(reason.trim());
        if (newDisasterName) setDisasterName(newDisasterName);
        if (newExpectedEnd !== undefined) setExpectedEnd(newExpectedEnd);
        setPreviewMode(null);
        const newEntry: ModeHistoryRecord = {
          id: `mh_${Date.now()}`,
          from_mode: prevMode,
          to_mode: targetMode,
          reason: reason.trim(),
          disasterName: newDisasterName || disasterName,
          switched_by: `${actorName} (Offline)`,
          switched_at: `Today, ${nowStr}`,
          ended_at: 'Active',
          duration: 'Active now',
        };
        const updatedHist = [newEntry, ...modeHistory].slice(0, 20);
        setModeHistory(updatedHist);
        try {
          localStorage.setItem('ecotriage_operating_mode', targetMode);
          localStorage.setItem('ecotriage_mode_since', nowStr);
          localStorage.setItem('ecotriage_mode_reason', reason.trim());
          localStorage.setItem('ecotriage_mode_history', JSON.stringify(updatedHist));
        } catch {}
        const announcement =
          targetMode === 'emergency' ? 'Emergency mode is now on.' : 'Daily mode is now on.';
        setAriaLiveAnnouncement(announcement);
        showToast(announcement);
        appendLog(
          actorName,
          `Switched mode (Offline) from ${prevMode.toUpperCase()} to ${targetMode.toUpperCase()}. Reason: "${reason.trim()}"`
        );
        return true;
      }

      setModeSwitchError('We could not change the mode. Try again.');
      return false;
    }
  };

  const clearModeSwitchError = () => setModeSwitchError(null);

  const scheduleModeSwitch = async (
    targetMode: OperatingMode,
    switchAt: string,
    reason: string,
    schedDisasterName?: string
  ): Promise<boolean> => {
    if (currentRole !== 'admin') {
      showToast('Forbidden (403): Only an Admin can schedule a mode switch.');
      return false;
    }
    const actorName = currentUser ? currentUser.name : 'Admin';
    try {
      const res = await fetch('/api/mode/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': currentRole,
        },
        body: JSON.stringify({
          targetMode,
          switchAt,
          reason,
          disasterName: schedDisasterName,
          createdBy: actorName,
        }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      applyServerModePayload(data);
      appendLog(
        actorName,
        `Scheduled automatic switch to ${targetMode.toUpperCase()} at ${switchAt}. Reason: "${reason}"`
      );
      showToast(`Scheduled automatic switch to ${targetMode.toUpperCase()} at ${switchAt}`);
      return true;
    } catch {
      return false;
    }
  };

  const cancelScheduledSwitch = async (): Promise<boolean> => {
    if (currentRole !== 'admin') return false;
    const actorName = currentUser ? currentUser.name : 'Admin';
    try {
      const res = await fetch('/api/mode/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': currentRole,
        },
        body: JSON.stringify({ cancel: true }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      applyServerModePayload(data);
      appendLog(actorName, 'Cancelled scheduled automatic mode switch.');
      showToast('Scheduled mode switch cancelled.');
      return true;
    } catch {
      setScheduledSwitch(null);
      return true;
    }
  };

  const saveModeFeatures = async (updated: ModeFeatureRecord[]): Promise<boolean> => {
    if (currentRole !== 'admin') {
      showToast('Forbidden (403): Only an Admin can edit feature flags.');
      return false;
    }
    const actorName = currentUser ? currentUser.name : 'Admin';
    // Diff changes for activity log
    updated.forEach((u) => {
      const old = modeFeatures.find((f) => f.feature_key === u.feature_key);
      if (
        old &&
        (old.daily_enabled !== u.daily_enabled || old.emergency_enabled !== u.emergency_enabled)
      ) {
        appendLog(
          actorName,
          `Updated feature [${u.feature_key}]: Daily ${old.daily_enabled ? 'ON' : 'OFF'}→${
            u.daily_enabled ? 'ON' : 'OFF'
          }, Emergency ${old.emergency_enabled ? 'ON' : 'OFF'}→${
            u.emergency_enabled ? 'ON' : 'OFF'
          }`
        );
      }
    });

    try {
      const res = await fetch('/api/mode/features', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': currentRole,
        },
        body: JSON.stringify({ features: updated, updatedBy: actorName }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      applyServerModePayload(data);
      showToast('Mode feature flags saved and broadcast to all users.');
      return true;
    } catch {
      setModeFeatures(updated);
      try {
        localStorage.setItem('ecotriage_mode_features', JSON.stringify(updated));
      } catch {}
      showToast('Mode feature flags saved locally.');
      return true;
    }
  };

  const saveModeAsset = async (payload: {
    slot_key: ModeAssetSlotKey;
    mode: OperatingMode;
    resetToDefault?: boolean;
    image_url_desktop?: string;
    image_url_mobile?: string;
    alt_en?: string;
    alt_te?: string;
    alt_hi?: string;
    credit?: string;
    licence?: string;
    rightsConfirmed?: boolean;
  }): Promise<{ ok: boolean; error?: string }> => {
    if (currentRole !== 'admin') {
      return { ok: false, error: 'Forbidden (403): Only an Admin can change mode images.' };
    }
    const actorName = currentUser ? currentUser.name : 'Admin';
    try {
      const res = await fetch('/api/mode/assets', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': currentRole,
        },
        body: JSON.stringify({ ...payload, updatedBy: actorName }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { ok: false, error: data.error || 'Could not update image slot.' };
      }
      applyServerModePayload(data);
      appendLog(
        actorName,
        payload.resetToDefault
          ? `Reset image slot [${payload.slot_key}] (${payload.mode}) to default.`
          : `Updated image slot [${payload.slot_key}] (${payload.mode}) with alt text & licence.`
      );
      showToast(
        payload.resetToDefault
          ? 'Image slot reset to default.'
          : 'Mode image updated and broadcast to all users!'
      );
      return { ok: true };
    } catch {
      return { ok: false, error: 'Network error while saving image.' };
    }
  };

  const saveModeContent = async (
    updates: ModeContentRecord[],
    broadcastMsg?: string,
    broadcastExp?: string
  ): Promise<boolean> => {
    if (currentRole !== 'admin') {
      showToast('Forbidden (403): Only an Admin can edit mode content.');
      return false;
    }
    const actorName = currentUser ? currentUser.name : 'Admin';
    updates.forEach((u) => {
      const old = modeContent.find(
        (c) => c.key === u.key && c.mode === u.mode && c.language === u.language
      );
      if (old && old.text !== u.text) {
        appendLog(
          actorName,
          `Edited mode content [${u.key}] (${u.mode}/${u.language}): "${old.text}" → "${u.text}"`
        );
      }
    });

    try {
      const res = await fetch('/api/mode/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': currentRole,
        },
        body: JSON.stringify({
          contentUpdates: updates,
          emergencyBroadcastMessage: broadcastMsg,
          emergencyBroadcastExpiry: broadcastExp,
          updatedBy: actorName,
        }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      applyServerModePayload(data);
      showToast('Mode wording & content saved across all sessions.');
      return true;
    } catch {
      setModeContent(updates);
      showToast('Mode content saved locally.');
      return true;
    }
  };

  const isFeatureOn = useCallback(
    (key: ModeFeatureKey): boolean => {
      return isModeFeatureEnabled(modeFeatures, operatingMode, key);
    },
    [modeFeatures, operatingMode]
  );

  const getAsset = useCallback(
    (slot: ModeAssetSlotKey): ModeAssetRecord => {
      return getModeAssetForSlot(modeAssets, operatingMode, slot);
    },
    [modeAssets, operatingMode]
  );

  const getContent = useCallback(
    (key: ModeContentKey): string => {
      return getModeContentText(modeContent, operatingMode, key, language);
    },
    [modeContent, operatingMode, language]
  );

  // Emergency Contacts, Volunteers & Tasks
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
      return raw
        ? JSON.parse(raw)
        : [
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

  const [volunteerTasks, setVolunteerTasks] = useState<VolunteerTaskRequest[]>(() => {
    try {
      const raw = localStorage.getItem('ecotriage_volunteer_tasks');
      return raw ? JSON.parse(raw) : DEFAULT_VOLUNTEER_TASKS;
    } catch {
      return DEFAULT_VOLUNTEER_TASKS;
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
    appendLog(currentUser ? currentUser.name : 'Citizen', `Suggested emergency contact: ${newContact.name}`);
  };

  const updateContactStatus = (id: string, status: EmergencyContact['status']) => {
    const updated = emergencyContacts.map((c) =>
      c.id === id ? { ...c, status, updatedAt: 'Just now' } : c
    );
    setEmergencyContacts(updated);
    try {
      localStorage.setItem('ecotriage_emergency_contacts', JSON.stringify(updated));
    } catch {}
    showToast(`Contact status updated to ${status}`);
  };

  const registerVolunteer = (volData: Omit<VolunteerRegistration, 'id' | 'createdAt' | 'status'>) => {
    if (!isFeatureOn('volunteer_signup_tasks')) {
      showToast('Volunteer sign-up is only active when enabled in Mode Settings.');
      return;
    }
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
    appendLog(newVol.name, `Registered as emergency volunteer in ${newVol.area}`);
  };

  const updateVolunteerStatus = (id: string, status: VolunteerRegistration['status']) => {
    const updated = volunteers.map((v) => (v.id === id ? { ...v, status } : v));
    setVolunteers(updated);
    try {
      localStorage.setItem('ecotriage_volunteers', JSON.stringify(updated));
    } catch {}
    showToast(`Volunteer status updated to ${status}`);
  };

  const postVolunteerTask = (title: string, area: string, skillsNeeded: string) => {
    const newTask: VolunteerTaskRequest = {
      id: 'vtask_' + Date.now(),
      title,
      area,
      skillsNeeded,
      postedBy: currentUser ? currentUser.name : 'Command Officer',
      postedAt: 'Just now',
      volunteersResponded: [],
      status: 'Open',
    };
    const updated = [newTask, ...volunteerTasks];
    setVolunteerTasks(updated);
    try {
      localStorage.setItem('ecotriage_volunteer_tasks', JSON.stringify(updated));
    } catch {}
    showToast('Volunteer task posted to Emergency Contacts & Volunteers board!');
    appendLog(newTask.postedBy, `Posted urgent volunteer task: "${title}" in ${area}`);
  };

  const respondToVolunteerTask = (taskId: string, name: string, phone: string) => {
    const updated = volunteerTasks.map((t) => {
      if (t.id === taskId) {
        return {
          ...t,
          volunteersResponded: [
            ...t.volunteersResponded,
            { name, phone, confirmed: false },
          ],
        };
      }
      return t;
    });
    setVolunteerTasks(updated);
    try {
      localStorage.setItem('ecotriage_volunteer_tasks', JSON.stringify(updated));
    } catch {}
    showToast('Thank you! Command Officer has been notified of your offer to help.');
    appendLog(name, `Tapped "I can help" on volunteer task ${taskId}`);
  };

  const confirmVolunteerForTask = (taskId: string, phone: string) => {
    const updated = volunteerTasks.map((t) => {
      if (t.id === taskId) {
        return {
          ...t,
          volunteersResponded: t.volunteersResponded.map((v) =>
            v.phone === phone ? { ...v, confirmed: true } : v
          ),
        };
      }
      return t;
    });
    setVolunteerTasks(updated);
    try {
      localStorage.setItem('ecotriage_volunteer_tasks', JSON.stringify(updated));
    } catch {}
    showToast('Volunteer confirmed for task!');
    appendLog(currentUser ? currentUser.name : 'Command', `Confirmed volunteer (${phone}) for task ${taskId}`);
  };

  const submitRoadClearFeedback = (incidentId: string, isClear: boolean) => {
    if (!isFeatureOn('citizen_road_clear_feedback')) {
      showToast('Citizen road feedback is disabled in current mode.');
      return;
    }
    const updated = incidents.map((inc) => {
      if (inc.id === incidentId) {
        const noteText = isClear
          ? 'Citizen feedback: Road appears CLEAR now.'
          : 'Citizen feedback: Road is STILL BLOCKED.';
        return {
          ...inc,
          updatedAt: 'Just now',
          history: [
            {
              status: inc.status,
              by: 'Citizen Report',
              time: 'Just now',
              note: noteText,
            },
            ...inc.history,
          ],
        };
      }
      return inc;
    });
    setIncidents(updated);
    saveIncidents(updated);
    showToast(
      isClear
        ? 'Thank you! Marked citizen feedback: Road appears clear.'
        : 'Thank you! Confirmed road is still blocked for crews.'
    );
    appendLog('Citizen Feedback', `Submitted "Is this road clear?" (${isClear ? 'Yes' : 'No'}) for ${incidentId}`);
  };

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

  const signIn = (user: UserProfile) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    localStorage.setItem('ecotriage_user', JSON.stringify(user));
    setIsAuthModalOpen(false);
    if (user.role !== 'admin') {
      setPreviewMode(null);
    }
    showToast(`Signed in as ${user.name} (${user.role})`);
    appendLog(user.name, `Staff signed in with role [${user.role}]`);
  };

  const signOut = () => {
    if (currentUser) {
      appendLog(currentUser.name, `User logged out.`);
    }
    setCurrentUser(null);
    setCurrentRole('public');
    setPreviewMode(null);
    localStorage.removeItem('ecotriage_user');
    showToast('Signed out. Public mode active.');
  };

  // Sync offline reports using the scoring rules of the mode active at the time of syncing (Section 14.8)
  const syncQueuedReports = useCallback(() => {
    try {
      const raw = localStorage.getItem('ecotriage_queued_reports');
      if (!raw) return;
      const queued: Incident[] = JSON.parse(raw);
      if (queued.length > 0) {
        const rescored = queued.map((inc) => {
          const syncedScore = calculateRuleScore({
            obstruction: inc.obstruction,
            hazard: inc.hazard,
            roadType: inc.roadType,
            mode: globalServerMode,
          });
          return {
            ...inc,
            priority_score: syncedScore,
            severity: getSeverity(syncedScore),
            source: 'Web' as const,
            updatedAt: 'Synced just now',
          };
        });
        setIncidents((prev) => {
          const merged = [...rescored, ...prev];
          saveIncidents(merged);
          return merged;
        });
        localStorage.removeItem('ecotriage_queued_reports');
        showToast(
          `Synced ${rescored.length} offline report(s) using active ${globalServerMode.toUpperCase()} mode scoring!`
        );
        appendLog(
          'System Sync',
          `Auto-synced ${rescored.length} offline reports with ${globalServerMode.toUpperCase()} mode scoring rules.`
        );
      }
    } catch (err) {
      console.warn('Failed to sync queue:', err);
    }
  }, [globalServerMode, showToast, appendLog]);

  const setNetworkStatus = (status: 'Online' | '2G' | 'Offline') => {
    setNetworkStatusState(status);
    if (status === 'Online') {
      setLastSyncedTime('Just now');
      syncQueuedReports();
    }
  };

  useEffect(() => {
    const handleOnline = () => {
      setNetworkStatusState('Online');
      setLastSyncedTime('Just now');
      syncQueuedReports();
    };
    const handleOffline = () => {
      setNetworkStatusState('Offline');
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncQueuedReports]);

  const recordAiLatency = (ms: number) => {
    setAvgAiTimeMs((prev) => Math.round((prev + ms) / 2));
  };

  // Permissions gate (Section 14.2: ONLY Admin can switch_mode or edit mode settings)
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
        return currentRole === 'command' || currentRole === 'admin';
      case 'switch_mode':
      case 'manage_mode':
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

  const triggerCriticalSoundAndVibration = () => {
    if (!soundVibrationEnabled || !isFeatureOn('sound_vibration_alerts')) return;
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
      }
      if (typeof window !== 'undefined' && 'AudioContext' in window) {
        const ctx = new window.AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 880;
        gain.gain.value = 0.08;
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      }
    } catch {}
  };

  const addIncident = (newIncident: Incident) => {
    if (!isFeatureOn('report_hazard')) {
      showToast('Reporting is currently disabled in active mode settings.');
      return;
    }
    let finalScore = newIncident.priority_score;
    if (operatingMode === 'emergency') {
      if (newIncident.roadType === 'Hospital Route' || newIncident.roadType === 'Emergency Shelter') {
        finalScore = Math.min(10, Math.round((finalScore + 0.5) * 10) / 10);
      }
    }
    const finalSeverity = getSeverity(finalScore);
    const incidentWithBoost: Incident = {
      ...newIncident,
      priority_score: finalScore,
      severity: finalSeverity,
    };
    const updated = [incidentWithBoost, ...incidents];
    setIncidents(updated);
    saveIncidents(updated);
    notifyServerIncident(incidentWithBoost, 'REPORTED');
    appendLog(incidentWithBoost.reportedBy, `Reported hazard at ${incidentWithBoost.location} (Score: ${finalScore})`);
    if (finalSeverity === 'Critical') {
      triggerCriticalSoundAndVibration();
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
    appendLog(officerName, `Overrode priority for incident ${id} to ${newScore.toFixed(1)}. Reason: ${reason}`);
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
    appendLog(currentUser ? currentUser.name : 'Command', `Dispatched ${crewName} to incident ${incidentId}`);
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
    appendLog(
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
    appendLog(nameToUse, `Approved hazard report ${id} and pinned to live map.`);
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
    appendLog(currentUser ? currentUser.name : 'Officer', `Updated incident ${id} status to ${status}`);
  };

  const updateHelpPointCapacity = (id: string, freeBeds: number, status?: HelpPoint['status']) => {
    if (!isFeatureOn('live_relief_camp_capacity')) {
      showToast('Live relief camp capacity updates are only enabled in Emergency Mode.');
      return;
    }
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
    appendLog(currentUser ? currentUser.name : 'Staff', `Updated shelter capacity at ${id}: ${freeBeds} free beds`);
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
    appendLog(currentUser ? currentUser.name : 'Officer', `Added facility: ${newHp.name}`);
  };

  const deleteHelpPoint = (id: string) => {
    const target = helpPoints.find((h) => h.id === id);
    const updated = helpPoints.filter((h) => h.id !== id);
    setHelpPoints(updated);
    saveHelpPoints(updated);
    showToast(`Facility removed`);
    if (target) {
      appendLog(currentUser ? currentUser.name : 'Admin', `Deleted facility: ${target.name}`);
    }
  };

  const deleteIncident = (id: string) => {
    const updated = incidents.filter((i) => i.id !== id);
    setIncidents(updated);
    saveIncidents(updated);
    showToast(`Incident ${id} deleted`);
    appendLog(currentUser ? currentUser.name : 'Admin', `Deleted incident record ${id}`);
  };

  const publishAlert = (alertData: Omit<AlertItem, 'id'>) => {
    const newAlert: AlertItem = {
      ...alertData,
      id: 'alert_' + Date.now(),
    };
    const updated = [newAlert, ...alerts];
    setAlerts(updated);
    saveAlerts(updated);
    if (alertData.severity === 'Warning') {
      setWarningPromptDismissed(false);
    }
    showToast('New alert published to live ticker');
    appendLog(currentUser ? currentUser.name : 'Command', `Published ${alertData.severity} alert: ${newAlert.message}`);
  };

  const expireAlert = (id: string) => {
    const updated = alerts.map((a) => (a.id === id ? { ...a, active: false } : a));
    setAlerts(updated);
    saveAlerts(updated);
    showToast('Alert deactivated');
    appendLog(currentUser ? currentUser.name : 'Command', `Deactivated alert ${id}`);
  };

  // Optional prompt: when a Command Officer publishes an alert of severity "Warning", every Admin sees a banner (Section 14.2)
  const hasActiveWarningPrompt =
    globalServerMode === 'daily' &&
    !warningPromptDismissed &&
    alerts.some((a) => a.active && a.severity === 'Warning');

  const dismissWarningPrompt = () => setWarningPromptDismissed(true);

  const [likedHeroIds, setLikedHeroIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('ecotriage_liked_heroes');
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const toggleLikeHero = (heroId: string) => {
    if (!heroId) return;
    const { updatedHeroes, updatedLikedIds, isNowLiked, heroName } = toggleHeroSaluteState(
      heroes,
      likedHeroIds,
      heroId
    );

    setLikedHeroIds(updatedLikedIds);
    try {
      localStorage.setItem('ecotriage_liked_heroes', JSON.stringify(updatedLikedIds));
    } catch {}

    setHeroes(updatedHeroes);
    saveHeroes(updatedHeroes);

    if (!isNowLiked) {
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
    appendLog(currentUser ? currentUser.name : 'Citizen', `Added hero responder: ${name}`);
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
    appendLog(currentUser ? currentUser.name : 'Admin', `Added hero profile: ${newHero.name}`);
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
        globalServerMode,
        previewMode,
        setPreviewMode,
        modeSince,
        modeReason,
        disasterName,
        expectedEnd,
        emergencyBroadcastMessage,
        emergencyBroadcastExpiry,
        scheduledSwitch,
        modeHistory,
        modeFeatures,
        modeAssets,
        modeContent,
        usingCachedMode,
        lastModeUpdatedTime,
        modeSwitchError,
        clearModeSwitchError,
        ariaLiveAnnouncement,
        hasActiveWarningPrompt,
        dismissWarningPrompt,
        setOperatingMode,
        scheduleModeSwitch,
        cancelScheduledSwitch,
        saveModeFeatures,
        saveModeAsset,
        saveModeContent,
        isFeatureOn,
        getAsset,
        getContent,
        isModeModalOpen,
        setIsModeModalOpen,
        emergencyContacts,
        volunteers,
        volunteerTasks,
        addEmergencyContact,
        updateContactStatus,
        registerVolunteer,
        updateVolunteerStatus,
        postVolunteerTask,
        respondToVolunteerTask,
        confirmVolunteerForTask,
        soundVibrationEnabled,
        setSoundVibrationEnabled,
        lowDataMode,
        setLowDataMode,
        submitRoadClearFeedback,
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
      {/* Section 14.9: Aria-live region announcing every mode switch */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {ariaLiveAnnouncement}
      </div>
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
