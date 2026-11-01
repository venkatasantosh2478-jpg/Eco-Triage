import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '15mb' }));

// Initialize GoogleGenAI if key is available
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
  const startTime = Date.now();
  const { photoBase64, mimeType = 'image/jpeg', note = '', roadType = 'Standard Road', language = 'en' } = req.body;

  const langNames: Record<string, string> = {
    en: 'English',
    te: 'Telugu',
    hi: 'Hindi',
  };
  const targetLanguage = langNames[language] || 'English';

  // Rule-based dynamic fallback calculation
  const getRuleFallback = () => {
    const noteLower = note.toLowerCase();
    let obstruction: 'complete_block' | 'single_lane' | 'clear' = 'complete_block';
    let hazard: 'live_electrical_wire' | 'none' = 'none';
    let baseScore = 4.5;

    if (noteLower.includes('single lane') || noteLower.includes('one lane') || noteLower.includes('partial') || noteLower.includes('side')) {
      obstruction = 'single_lane';
      baseScore = 3.5;
    } else if (noteLower.includes('clear') || noteLower.includes('open') || noteLower.includes('minor')) {
      obstruction = 'clear';
      baseScore = 2.0;
    } else {
      obstruction = 'complete_block';
      baseScore = 5.5;
    }

    if (noteLower.includes('wire') || noteLower.includes('electric') || noteLower.includes('pole') || noteLower.includes('current') || noteLower.includes('shock') || noteLower.includes('spark')) {
      hazard = 'live_electrical_wire';
      baseScore += 2.5;
    }

    if (roadType === 'Hospital Route' || roadType === 'Emergency Shelter') {
      baseScore += 1.5;
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
    const recommendation = hazard === 'live_electrical_wire' ? recLang.wire : obstruction === 'single_lane' ? recLang.lane : recLang.clear;

    return {
      obstruction,
      hazard,
      priority_score: priorityScore,
      recommendation,
      processingTimeMs: Date.now() - startTime,
      modelUsed: 'rule_fallback',
    };
  };

  // Try calling Gemini 3.8 Flash if client is available
  if (aiClient) {
    try {
      const promptText = `You are an emergency road-clearance triage assistant for a municipal corporation in Visakhapatnam, India.
Analyze this hazard ${photoBase64 ? 'photo and ' : ''}report details: "${note}". Road Type: "${roadType}".
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

      let parts: any[] = [{ text: promptText }];

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
      let parsed = JSON.parse(text);

      if (!['complete_block', 'single_lane', 'clear'].includes(parsed.obstruction)) {
        parsed.obstruction = 'complete_block';
      }
      if (!['live_electrical_wire', 'none'].includes(parsed.hazard)) {
        parsed.hazard = 'none';
      }
      if (typeof parsed.priority_score !== 'number' || isNaN(parsed.priority_score)) {
        parsed.priority_score = 6.5;
      }

      let finalScore = Math.min(10, Math.max(1, Math.round(parsed.priority_score * 10) / 10));

      return res.json({
        obstruction: parsed.obstruction,
        hazard: parsed.hazard,
        priority_score: finalScore,
        recommendation: parsed.recommendation,
        processingTimeMs: Date.now() - startTime,
        modelUsed: 'gemini-3.8-flash',
      });
    } catch (apiErr) {
      console.warn('Gemini API call failed, falling back to rule score:', apiErr);
      return res.json(getRuleFallback());
    }
  }

  return res.json(getRuleFallback());
});

// POST /api/notify-incident endpoint (Immediate server & dispatch notification)
app.post('/api/notify-incident', (req, res) => {
  const { incidentId, location, priority_score, severity, status, action = 'REPORTED', reportedBy } = req.body;
  console.log(`[DISASTER SERVER NOTIFICATION] Incident ${incidentId} (${action}) at ${location} | Score: ${priority_score} | Severity: ${severity} | Status: ${status} | By: ${reportedBy || 'System'}`);
  return res.json({
    success: true,
    message: `Immediate server alert logged for ${incidentId}`,
    action,
    timestamp: new Date().toISOString(),
  });
});

// POST /api/ai-assistant endpoint (Gemini Emergency Triage Q&A)
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

// Setup Vite middleware in dev or static files in production
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

// Only start the standalone HTTP server when not running inside Vercel serverless runtime
if (!process.env.VERCEL) {
  startServer().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
}

export default app;

