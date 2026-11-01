import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import {
  DEFAULT_MODE_ASSETS,
  DEFAULT_MODE_CONTENT,
  DEFAULT_MODE_FEATURES,
  DEFAULT_MODE_HISTORY,
  DEFAULT_MODE_SETTINGS,
  isModeFeatureEnabled,
  MODE_CONFIG,
  ModeAssetRecord,
  ModeContentRecord,
  ModeFeatureKey,
  ModeFeatureRecord,
  ModeHistoryRecord,
  ModeSettingsTable,
  OperatingMode,
} from './src/utils/modeConfig.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '15mb' }));

// ============================================================================
// SECTION 14.8 SERVER-SIDE DUAL-MODE TABLES & SSE STREAM
// ============================================================================
let modeSettings: ModeSettingsTable = { ...DEFAULT_MODE_SETTINGS };
let modeHistory: ModeHistoryRecord[] = [...DEFAULT_MODE_HISTORY];
let modeFeatures: ModeFeatureRecord[] = DEFAULT_MODE_FEATURES.map((f) => ({ ...f }));
let modeAssets: ModeAssetRecord[] = DEFAULT_MODE_ASSETS.map((a) => ({ ...a }));
let modeContent: ModeContentRecord[] = DEFAULT_MODE_CONTENT.map((c) => ({ ...c }));

const sseClients = new Set<express.Response>();

function broadcastModeUpdate(eventType: string = 'mode_sync') {
  const payload = JSON.stringify({
    type: eventType,
    settings: modeSettings,
    features: modeFeatures,
    assets: modeAssets,
    content: modeContent,
    history: modeHistory.slice(0, 20),
    timestamp: new Date().toISOString(),
  });
  for (const client of sseClients) {
    try {
      client.write(`data: ${payload}\n\n`);
    } catch {
      sseClients.delete(client);
    }
  }
}

function getRequestRole(req: express.Request): string {
  const headerRole = req.headers['x-user-role'];
  if (typeof headerRole === 'string' && headerRole.trim()) {
    return headerRole.trim().toLowerCase();
  }
  if (req.body && typeof req.body.role === 'string') {
    return req.body.role.trim().toLowerCase();
  }
  if (req.query && typeof req.query.role === 'string') {
    return String(req.query.role).trim().toLowerCase();
  }
  return 'public';
}

function requireAdmin(req: express.Request, res: express.Response): boolean {
  const role = getRequestRole(req);
  if (role !== 'admin') {
    res.status(403).json({
      error: 'Forbidden (403): Only an Admin can change the operating mode, feature flags, images, or mode content.',
      roleAttempted: role,
    });
    return false;
  }
  return true;
}

function checkFeatureEnabledOrRefuse(
  featureKey: ModeFeatureKey,
  res: express.Response
): boolean {
  const enabled = isModeFeatureEnabled(modeFeatures, modeSettings.app_mode, featureKey);
  if (!enabled) {
    res.status(403).json({
      error: `Refused by server: Feature "${featureKey}" is currently disabled in ${modeSettings.app_mode.toUpperCase()} mode.`,
      featureKey,
      activeMode: modeSettings.app_mode,
    });
    return false;
  }
  return true;
}

function performServerModeSwitch(
  targetMode: OperatingMode,
  reason: string,
  switchedBy: string,
  disasterName?: string,
  expectedEnd?: string
) {
  const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const prevMode = modeSettings.app_mode;

  // Close previous history item
  if (modeHistory.length > 0 && modeHistory[0].ended_at === 'Active') {
    modeHistory[0] = {
      ...modeHistory[0],
      ended_at: nowTime,
      duration: 'Completed',
    };
  }

  const newEntry: ModeHistoryRecord = {
    id: `mh_${Date.now()}`,
    from_mode: prevMode,
    to_mode: targetMode,
    reason,
    disasterName: disasterName || modeSettings.disasterName,
    switched_by: switchedBy,
    switched_at: `Today, ${nowTime}`,
    ended_at: 'Active',
    duration: 'Active now',
  };

  modeHistory = [newEntry, ...modeHistory].slice(0, 20);

  modeSettings = {
    ...modeSettings,
    app_mode: targetMode,
    modeSince: nowTime,
    modeReason: reason,
    disasterName: disasterName !== undefined ? disasterName : modeSettings.disasterName,
    expectedEnd: expectedEnd !== undefined ? expectedEnd : modeSettings.expectedEnd,
    scheduledSwitch: null,
    lastUpdated: nowTime,
  };

  broadcastModeUpdate('mode_switched');
}

// Background check for scheduled automatic mode switch
setInterval(() => {
  if (modeSettings.scheduledSwitch && modeSettings.scheduledSwitch.switchAt) {
    const targetTime = new Date(modeSettings.scheduledSwitch.switchAt).getTime();
    if (!Number.isNaN(targetTime) && Date.now() >= targetTime) {
      const sched = modeSettings.scheduledSwitch;
      performServerModeSwitch(
        sched.targetMode,
        `Scheduled switch: ${sched.reason}`,
        `${sched.createdBy} (Scheduled)`,
        sched.disasterName
      );
    }
  }
}, 5000);

// GET /api/events — Server-Sent Events stream for real-time (<5s) mode propagation
app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  // Send initial snapshot immediately
  const initialPayload = JSON.stringify({
    type: 'initial_sync',
    settings: modeSettings,
    features: modeFeatures,
    assets: modeAssets,
    content: modeContent,
    history: modeHistory.slice(0, 20),
    timestamp: new Date().toISOString(),
  });
  res.write(`data: ${initialPayload}\n\n`);

  sseClients.add(res);
  req.on('close', () => {
    sseClients.delete(res);
  });
});

// GET /api/mode — Public endpoint returning active mode, features, assets, content
app.get('/api/mode', (_req, res) => {
  return res.json({
    settings: modeSettings,
    features: modeFeatures,
    assets: modeAssets,
    content: modeContent,
    history: modeHistory.slice(0, 20),
  });
});

// PUT /api/mode — Admin only: switch between Daily and Emergency mode
app.put('/api/mode', (req, res) => {
  if (!requireAdmin(req, res)) return;

  const {
    mode,
    reason,
    disasterName,
    expectedEnd,
    switchedBy = 'Admin',
    emergencyBroadcastMessage,
    emergencyBroadcastExpiry,
  } = req.body;

  if (mode !== 'daily' && mode !== 'emergency') {
    return res.status(400).json({ error: 'Invalid mode. Must be "daily" or "emergency".' });
  }
  if (!reason || typeof reason !== 'string' || !reason.trim()) {
    return res.status(400).json({ error: 'A reason / closing note is required to switch modes.' });
  }

  if (emergencyBroadcastMessage !== undefined) {
    modeSettings.emergencyBroadcastMessage = emergencyBroadcastMessage;
  }
  if (emergencyBroadcastExpiry !== undefined) {
    modeSettings.emergencyBroadcastExpiry = emergencyBroadcastExpiry;
  }

  performServerModeSwitch(
    mode,
    reason.trim(),
    switchedBy,
    disasterName,
    expectedEnd
  );

  return res.json({
    success: true,
    settings: modeSettings,
    history: modeHistory.slice(0, 20),
  });
});

// POST /api/mode/schedule — Admin only: schedule or cancel automatic switch
app.post('/api/mode/schedule', (req, res) => {
  if (!requireAdmin(req, res)) return;

  const { cancel, targetMode, switchAt, reason, disasterName, createdBy = 'Admin' } = req.body;
  const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (cancel) {
    modeSettings = {
      ...modeSettings,
      scheduledSwitch: null,
      lastUpdated: nowTime,
    };
    broadcastModeUpdate('schedule_cancelled');
    return res.json({ success: true, settings: modeSettings });
  }

  if (!targetMode || !switchAt) {
    return res.status(400).json({ error: 'targetMode and switchAt are required to schedule a switch.' });
  }

  modeSettings = {
    ...modeSettings,
    scheduledSwitch: {
      targetMode,
      switchAt,
      reason: reason || `Scheduled switch to ${targetMode}`,
      disasterName,
      createdBy,
    },
    lastUpdated: nowTime,
  };

  broadcastModeUpdate('schedule_updated');
  return res.json({ success: true, settings: modeSettings });
});

// GET /api/mode/history — Admin only: returns last 20 mode switches
app.get('/api/mode/history', (req, res) => {
  if (!requireAdmin(req, res)) return;
  return res.json({ history: modeHistory.slice(0, 20) });
});

// PUT /api/mode/features — Admin only: update feature flag matrix
app.put('/api/mode/features', (req, res) => {
  if (!requireAdmin(req, res)) return;

  const { features, updatedBy = 'Admin' } = req.body;
  if (!Array.isArray(features)) {
    return res.status(400).json({ error: 'features array is required.' });
  }

  const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  modeFeatures = modeFeatures.map((existing) => {
    const incoming = features.find((f: ModeFeatureRecord) => f.feature_key === existing.feature_key);
    if (!incoming) return existing;
    return {
      ...existing,
      daily_enabled: Boolean(incoming.daily_enabled),
      emergency_enabled: Boolean(incoming.emergency_enabled),
      updated_by: updatedBy,
      updated_at: nowTime,
    };
  });

  modeSettings.lastUpdated = nowTime;
  broadcastModeUpdate('features_updated');
  return res.json({ success: true, features: modeFeatures });
});

// PUT /api/mode/assets — Admin only: update or reset mode image slot
app.put('/api/mode/assets', (req, res) => {
  if (!requireAdmin(req, res)) return;

  const {
    slot_key,
    mode,
    resetToDefault,
    image_url_desktop,
    image_url_mobile,
    alt_en,
    alt_te,
    alt_hi,
    credit,
    licence,
    rightsConfirmed,
    updatedBy = 'Admin',
  } = req.body;

  const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (resetToDefault) {
    const defaultAsset = DEFAULT_MODE_ASSETS.find(
      (a) => a.slot_key === slot_key && a.mode === mode
    );
    if (!defaultAsset) {
      return res.status(404).json({ error: 'Default asset slot not found.' });
    }
    modeAssets = modeAssets.map((a) =>
      a.slot_key === slot_key && a.mode === mode ? { ...defaultAsset, updated_at: nowTime } : a
    );
    modeSettings.lastUpdated = nowTime;
    broadcastModeUpdate('assets_updated');
    return res.json({ success: true, assets: modeAssets });
  }

  if (!rightsConfirmed) {
    return res.status(400).json({ error: 'You must confirm "I have the right to use this image."' });
  }
  if (!alt_en?.trim() || !alt_te?.trim() || !alt_hi?.trim()) {
    return res.status(400).json({ error: 'Alt text is required in English, Telugu, and Hindi.' });
  }

  modeAssets = modeAssets.map((a) => {
    if (a.slot_key === slot_key && a.mode === mode) {
      return {
        ...a,
        image_url_desktop: image_url_desktop || a.image_url_desktop,
        image_url_mobile: image_url_mobile || image_url_desktop || a.image_url_mobile,
        alt_en: alt_en.trim(),
        alt_te: alt_te.trim(),
        alt_hi: alt_hi.trim(),
        credit: credit?.trim() || a.credit,
        licence: licence?.trim() || a.licence,
        updated_by: updatedBy,
        updated_at: nowTime,
      };
    }
    return a;
  });

  modeSettings.lastUpdated = nowTime;
  broadcastModeUpdate('assets_updated');
  return res.json({ success: true, assets: modeAssets });
});

// PUT /api/mode/content — Admin only: update per-mode, per-language strings & broadcast banner
app.put('/api/mode/content', (req, res) => {
  if (!requireAdmin(req, res)) return;

  const {
    contentUpdates,
    emergencyBroadcastMessage,
    emergencyBroadcastExpiry,
    updatedBy = 'Admin',
  } = req.body;

  const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (Array.isArray(contentUpdates)) {
    modeContent = modeContent.map((existing) => {
      const incoming = contentUpdates.find(
        (c: ModeContentRecord) =>
          c.key === existing.key && c.mode === existing.mode && c.language === existing.language
      );
      if (!incoming || typeof incoming.text !== 'string') return existing;
      return {
        ...existing,
        text: incoming.text,
        updated_by: updatedBy,
        updated_at: nowTime,
      };
    });
  }

  if (emergencyBroadcastMessage !== undefined) {
    modeSettings.emergencyBroadcastMessage = emergencyBroadcastMessage;
  }
  if (emergencyBroadcastExpiry !== undefined) {
    modeSettings.emergencyBroadcastExpiry = emergencyBroadcastExpiry;
  }

  modeSettings.lastUpdated = nowTime;
  broadcastModeUpdate('content_updated');
  return res.json({
    success: true,
    content: modeContent,
    settings: modeSettings,
  });
});

// POST /api/feature-check — Enforces server-side refusal when a feature is turned off (Section 14.8)
app.post('/api/feature-check', (req, res) => {
  const { featureKey } = req.body;
  if (!checkFeatureEnabledOrRefuse(featureKey, res)) return;
  return res.json({
    allowed: true,
    featureKey,
    activeMode: modeSettings.app_mode,
  });
});

// ============================================================================
// GEMINI AI & INCIDENT ENDPOINTS (Mode-Aware)
// ============================================================================
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// POST /api/analyse-hazard endpoint
app.post('/api/analyse-hazard', async (req, res) => {
  // Refuse if report_hazard feature is turned off in active mode
  if (!checkFeatureEnabledOrRefuse('report_hazard', res)) return;

  const startTime = Date.now();
  const {
    photoBase64,
    mimeType = 'image/jpeg',
    note = '',
    roadType = 'Standard Road',
    language = 'en',
    isOneTapUrgent = false,
  } = req.body;

  if (isOneTapUrgent && !checkFeatureEnabledOrRefuse('urgent_one_tap_report', res)) {
    return;
  }

  const activeMode = modeSettings.app_mode;
  const emergencyBoost =
    activeMode === 'emergency' &&
    (roadType === 'Hospital Route' || roadType === 'Emergency Shelter')
      ? MODE_CONFIG.emergency.priorityBoost
      : 0;

  const langNames: Record<string, string> = {
    en: 'English',
    te: 'Telugu',
    hi: 'Hindi',
  };
  const targetLanguage = langNames[language] || 'English';

  const getRuleFallback = () => {
    const noteLower = note.toLowerCase();
    let obstruction: 'complete_block' | 'single_lane' | 'clear' = 'complete_block';
    let hazard: 'live_electrical_wire' | 'none' = 'none';
    let baseScore = 4.5;

    if (
      noteLower.includes('single lane') ||
      noteLower.includes('one lane') ||
      noteLower.includes('partial') ||
      noteLower.includes('side') ||
      noteLower.includes('branch')
    ) {
      obstruction = 'single_lane';
      baseScore = 3.5;
    } else if (noteLower.includes('clear') || noteLower.includes('open') || noteLower.includes('minor')) {
      obstruction = 'clear';
      baseScore = 2.0;
    } else {
      obstruction = 'complete_block';
      baseScore = 5.5;
    }

    if (
      noteLower.includes('wire') ||
      noteLower.includes('electric') ||
      noteLower.includes('pole') ||
      noteLower.includes('current') ||
      noteLower.includes('shock') ||
      noteLower.includes('spark')
    ) {
      hazard = 'live_electrical_wire';
      baseScore += 2.5;
    }

    if (roadType === 'Hospital Route' || roadType === 'Emergency Shelter') {
      baseScore += 1.5 + emergencyBoost;
    } else if (roadType === 'Major Artery' || roadType === 'Industrial Lifeline') {
      baseScore += 1.0;
    } else if (roadType === 'Transit Route') {
      baseScore += 0.5;
    }

    const priorityScore = Math.min(10, Math.max(1, Math.round(baseScore * 10) / 10));
    const recs: Record<string, Record<string, string>> = {
      en: {
        wire: 'Danger: live wire reported. Isolate electrical grid and dispatch heavy loader with wire team.',
        clear: 'Send municipal clearance squad to cut tree branches and restore lane access.',
        lane: 'Send light clearance unit to sweep side debris and open second lane.',
      },
      te: {
        wire: 'ప్రమాదం: విద్యుత్ తీగ పడింది. విద్యుత్ లైన్ ఆపి లైన్‌మెన్ల బృందాన్ని పంపండి.',
        clear: 'చెట్టు కొమ్మలను తొలగించి రోడ్డును క్లియర్ చేయడానికి బృందాన్ని పంపండి.',
        lane: 'రోడ్డు పక్కన ఉన్న చెత్తను క్లియర్ చేయడానికి సిబ్బందిని పంపండి.',
      },
      hi: {
        wire: 'खतरा: बिजली का तार गिरा है। बिजली बंद करें और राहत दस्ता भेजें।',
        clear: 'पेड़ की टहनियां काटकर रास्ता खोलने के लिए दस्ता रवाना करें।',
        lane: 'सड़क किनारे से मलबा हटाने के लिए टीम भेजें।',
      },
    };

    const recLang = recs[language] || recs.en;
    const recommendation =
      hazard === 'live_electrical_wire'
        ? recLang.wire
        : obstruction === 'single_lane'
        ? recLang.lane
        : recLang.clear;

    return {
      obstruction,
      hazard,
      priority_score: priorityScore,
      recommendation,
      processingTimeMs: Date.now() - startTime,
      modelUsed: 'rule_fallback',
      activeMode,
    };
  };

  if (aiClient) {
    try {
      const promptText = `You are an emergency road-clearance triage assistant for a municipal corporation in Visakhapatnam, India.
Analyze this hazard ${photoBase64 ? 'photo and ' : ''}report details: "${note}". Road Type: "${roadType}". Operating Mode: "${activeMode}".
Reply ONLY with valid JSON in this shape:
{
  "obstruction": "complete_block" | "single_lane" | "clear",
  "hazard": "live_electrical_wire" | "none",
  "priority_score": number from 1.0 to 10.0,
  "recommendation": "one short simple sentence in ${targetLanguage}"
}
Compute priority_score accurately:
- complete_block + live_electrical_wire + Hospital Route = 9.0 to 10.0
- complete_block + no wire + Major Artery = 6.5 to 8.5
- single_lane + no wire + Residential = 3.0 to 5.0
- clear = 1.0 to 2.5
Write recommendation in simple ${targetLanguage}. Keep JSON keys in English.`;

      const parts: any[] = [{ text: promptText }];

      if (photoBase64) {
        const cleanedBase64 = photoBase64.includes(',') ? photoBase64.split(',')[1] : photoBase64;
        parts.unshift({
          inlineData: {
            mimeType: mimeType || 'image/jpeg',
            data: cleanedBase64,
          },
        });
      }

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: { parts },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              obstruction: { type: Type.STRING },
              hazard: { type: Type.STRING },
              priority_score: { type: Type.NUMBER },
              recommendation: { type: Type.STRING },
            },
            required: ['obstruction', 'hazard', 'priority_score', 'recommendation'],
          },
        },
      });

      const text = response.text?.trim() || '';
      const parsed = JSON.parse(text);

      if (!['complete_block', 'single_lane', 'clear'].includes(parsed.obstruction)) {
        parsed.obstruction = 'complete_block';
      }
      if (!['live_electrical_wire', 'none'].includes(parsed.hazard)) {
        parsed.hazard = 'none';
      }
      if (typeof parsed.priority_score !== 'number' || Number.isNaN(parsed.priority_score)) {
        parsed.priority_score = 6.5;
      }

      const rawBoosted = parsed.priority_score + emergencyBoost;
      const finalScore = Math.min(10, Math.max(1, Math.round(rawBoosted * 10) / 10));

      return res.json({
        obstruction: parsed.obstruction,
        hazard: parsed.hazard,
        priority_score: finalScore,
        recommendation: parsed.recommendation,
        processingTimeMs: Date.now() - startTime,
        modelUsed: 'gemini-3.8-flash',
        activeMode,
      });
    } catch (apiErr) {
      console.warn('Gemini API call failed, falling back to rule score:', apiErr);
      return res.json(getRuleFallback());
    }
  }

  return res.json(getRuleFallback());
});

// POST /api/notify-incident endpoint
app.post('/api/notify-incident', (req, res) => {
  if (!checkFeatureEnabledOrRefuse('report_hazard', res)) return;
  const { incidentId, location, priority_score, severity, status, action = 'REPORTED', reportedBy } = req.body;
  console.log(
    `[DISASTER SERVER NOTIFICATION] Incident ${incidentId} (${action}) at ${location} | Score: ${priority_score} | Severity: ${severity} | Status: ${status} | By: ${reportedBy || 'System'}`
  );
  return res.json({
    success: true,
    message: `Immediate server alert logged for ${incidentId}`,
    action,
    activeMode: modeSettings.app_mode,
    timestamp: new Date().toISOString(),
  });
});

// POST /api/ai-assistant endpoint
app.post('/api/ai-assistant', async (req, res) => {
  const { message = '', language = 'en' } = req.body;

  const langNames: Record<string, string> = {
    en: 'English',
    te: 'Telugu',
    hi: 'Hindi',
  };
  const targetLanguage = langNames[language] || 'English';

  const getSmartFallbackReply = (msg: string, lang: string): string => {
    const q = msg.toLowerCase();
    if (q.includes('camp') || q.includes('shelter') || q.includes('రహదారి') || q.includes('క్యాంప్') || q.includes('शिविर')) {
      if (lang === 'te') return 'విశాఖపట్నంలో ఆర్కే బీచ్ ప్రైమరీ స్కూల్ మరియు గాజువాక హైస్కూల్ వద్ద ఉచిత వసతి మరియు భోజనం గల పునరావాస కేంద్రాలు తెరిచి ఉన్నాయి.';
      if (lang === 'hi') return 'विशाखापत्तनम में आरके बीच प्राइमरी स्कूल और गाजूवाका हाई स्कूल में मुफ्त भोजन और चिकित्सा के साथ राहत शिविर खुले हैं।';
      return 'Relief camps with free food, medical aid, and beds are open at RK Beach Primary School and Gajuwaka Community Hall.';
    }
    if (q.includes('wire') || q.includes('electric') || q.includes('current') || q.includes('వైర్') || q.includes('तार')) {
      if (lang === 'te') return 'అలర్ట్: పడిపోయిన విద్యుత్ తీగలకు కనీసం 10 మీటర్ల దూరంలో ఉండండి. సహాయం కోసం 101 లేదా 112 కు డయల్ చేయండి.';
      if (lang === 'hi') return 'सावधान: गिरे हुए बिजली के तारों से कम से कम 10 मीटर दूर रहें। 101 या 112 पर तुरंत कॉल करें।';
      return 'DANGER: Stay at least 10 meters away from snapped power cables. Electrical isolation crews have been notified.';
    }
    if (q.includes('phone') || q.includes('number') || q.includes('helpline') || q.includes('నంబర్') || q.includes('नंबर')) {
      if (lang === 'te') return 'అత్యవసర నంబర్లు: వైజాగ్ కంట్రోల్ రూమ్: 1800-425-0001 | పోలీసు: 100 | అంబులెన్స్: 108 | ఫైర్: 101 | అత్యవసర: 112';
      if (lang === 'hi') return 'आपतकालीन नंबर: वाइज़ैग कंट्रोल रूम: 1800-425-0001 | पुलिस: 100 | एम्बुलेंस: 108 | फायर: 101 | इमरजेंसी: 112';
      return 'Emergency Helpline Numbers: Vizag Control Room: 1800-425-0001 | Police: 100 | Ambulance: 108 | Fire: 101 | National Emergency: 112';
    }
    if (lang === 'te') return 'ఎకోట్రయాజ్ వైజాగ్ ఎమర్జెన్సీ అసిస్టెంట్. మద్దిలపాలెం, బీచ్ రోడ్డు మరియు గాజువాకలో రోడ్డు క్లియరెన్స్ పనులు శీఘ్రగతిన జరుగుతున్నాయి.';
    if (lang === 'hi') return 'इकोट्राइएज वाइज़ैग आपातकालीन सहायक। मद्दिपलेम, बीच रोड और गाजूवाका में राहत कार्य तेज़ी से जारी है।';
    return 'EcoTriage Vizag Assistant: Emergency clearance crews are actively deployed across Beach Road, Maddilapalem, and Gajuwaka corridors.';
  };

  if (aiClient && message.trim()) {
    try {
      const systemInstruction = `You are the EcoTriage AI Floating Emergency Assistant for Visakhapatnam Municipal Corporation. Provide a helpful, direct, reassuring answer in ${targetLanguage} addressing the user's specific question. Include practical information about road clearance, relief camps, emergency numbers (1800-425-0001, 112, 108), or safety advice. Always reply in ${targetLanguage}. Keep it 2-3 short sentences.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            role: 'user',
            parts: [{ text: message }],
          },
        ],
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text?.trim() || getSmartFallbackReply(message, language);
      return res.json({ reply: replyText, modelUsed: 'gemini-3.8-flash' });
    } catch (err) {
      console.warn('AI Assistant Gemini call error:', err);
      return res.json({ reply: getSmartFallbackReply(message, language), modelUsed: 'fallback' });
    }
  }

  return res.json({ reply: getSmartFallbackReply(message, language), modelUsed: 'smart_fallback' });
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`EcoTriage server listening on http://0.0.0.0:${port}`);
  });
}

if (!process.env.VERCEL) {
  startServer().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
}

export default app;
