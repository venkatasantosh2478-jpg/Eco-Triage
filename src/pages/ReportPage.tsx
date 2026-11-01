import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { HazardFlag, Incident, ObstructionType, RoadType } from '../types.ts';
import { calculateRuleScore, getRecommendedEquipment, getSeverity, getSeverityColors } from '../utils/rules.ts';
import { VISAKHAPATNAM_ZONES } from '../utils/storage.ts';
import { LeafletMap } from '../components/LeafletMap.tsx';
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  HelpCircle,
  MapPin,
  Mic,
  MicOff,
  Navigation,
  RefreshCw,
  Send,
  Sparkles,
  TreePine,
  Upload,
  WifiOff,
  X,
  Zap,
} from 'lucide-react';

export const ReportPage: React.FC = () => {
  const {
    addIncident,
    setActivePage,
    setSelectedIncidentId,
    language,
    networkStatus,
    currentUser,
    showToast,
    recordAiLatency,
  } = useApp();

  // Active Tab: 'photo' | 'sms'
  const [reportTab, setReportTab] = useState<'photo' | 'sms'>('photo');

  // Form Fields
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [photoMime, setPhotoMime] = useState<string>('image/jpeg');
  const [photoName, setPhotoName] = useState<string>('');

  const [locationName, setLocationName] = useState<string>('Maddilapalem Highway, Vizag');
  const [lat, setLat] = useState<number>(17.7385);
  const [lng, setLng] = useState<number>(83.3150);
  const [isGpsLoading, setIsGpsLoading] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const [obstruction, setObstruction] = useState<ObstructionType>('complete_block');
  const [hasLiveWire, setHasLiveWire] = useState<boolean>(true);
  const [hasTree, setHasTree] = useState<boolean>(true);
  const [hasPole, setHasPole] = useState<boolean>(false);
  const [hasWater, setHasWater] = useState<boolean>(false);

  const [roadType, setRoadType] = useState<RoadType>('Hospital Route');
  const [zone, setZone] = useState<string>(VISAKHAPATNAM_ZONES[2]);
  const [note, setNote] = useState<string>('Large tree down near hospital gate with sparking wires.');
  const [isListening, setIsListening] = useState<boolean>(false);

  // SMS text
  const [smsRawText, setSmsRawText] = useState<string>(
    'Big banyan tree fallen near Maddilapalem hospital junction. High voltage electrical wire snapped across both lanes.'
  );

  // Submission & AI Result State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedIncident, setSubmittedIncident] = useState<Incident | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Auto-detect GPS on mount if available
  useEffect(() => {
    handleRequestGps();
  }, []);

  const handleRequestGps = () => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      setIsGpsLoading(true);
      setGpsError(null);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(pos.coords.latitude);
          setLng(pos.coords.longitude);
          setIsGpsLoading(false);
        },
        (err) => {
          setGpsError('We could not find your location automatically. Select zone or tap map.');
          setIsGpsLoading(false);
        },
        { timeout: 5000 }
      );
    }
  };

  // Photo File Input Handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setValidationError('Selected file is not an image. Please choose a JPG or PNG.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setValidationError('File is larger than 10MB. Please take or choose a smaller image.');
      return;
    }

    setValidationError(null);
    setPhotoName(file.name);
    setPhotoMime(file.type);

    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoBase64(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Voice speech-to-text recognition with Web Speech API
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [interimTranscript, setInterimTranscript] = useState<string>('');

  const toggleSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError('Web Speech API is not supported in this browser. Please type notes manually.');
      showToast('Web Speech API not supported in this browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      setInterimTranscript('');
      return;
    }

    setSpeechError(null);
    setInterimTranscript('');

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        showToast('Microphone active. Speak hazard details hands-free.');
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        setInterimTranscript('');
        if (event.error === 'not-allowed') {
          setSpeechError('Microphone permission denied. Please allow microphone access.');
          showToast('Microphone access denied');
        } else if (event.error === 'no-speech') {
          showToast('No speech detected. Mic timed out.');
        } else {
          setSpeechError(`Voice input error: ${event.error}`);
        }
      };

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        let finalChunk = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalChunk += event.results[i][0].transcript;
          } else {
            currentInterim += event.results[i][0].transcript;
          }
        }

        if (finalChunk) {
          const textToAppend = finalChunk.trim();
          if (textToAppend) {
            if (reportTab === 'sms') {
              setSmsRawText((prev) => (prev ? `${prev} ${textToAppend}` : textToAppend));
            } else {
              setNote((prev) => (prev ? `${prev} ${textToAppend}` : textToAppend));
            }
          }
        }
        setInterimTranscript(currentInterim);
      };

      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
      setSpeechError('Could not start microphone.');
    }
  };

  // SMS text parser
  const handleParseSms = () => {
    if (!smsRawText.trim()) return;
    const lower = smsRawText.toLowerCase();

    // Detect obstruction
    if (lower.includes('single') || lower.includes('one lane') || lower.includes('partial')) {
      setObstruction('single_lane');
    } else {
      setObstruction('complete_block');
    }

    // Detect live wire
    if (
      lower.includes('wire') ||
      lower.includes('current') ||
      lower.includes('electric') ||
      lower.includes('voltage') ||
      lower.includes('shock')
    ) {
      setHasLiveWire(true);
    }

    // Detect tree & pole
    if (lower.includes('tree') || lower.includes('branch')) setHasTree(true);
    if (lower.includes('pole') || lower.includes('transformer')) setHasPole(true);
    if (lower.includes('water') || lower.includes('flood')) setHasWater(true);

    // Detect location words
    if (lower.includes('maddilapalem')) {
      setLocationName('Maddilapalem Junction');
      setRoadType('Hospital Route');
      setZone(VISAKHAPATNAM_ZONES[2]);
    } else if (lower.includes('beach road') || lower.includes('rk beach')) {
      setLocationName('Beach Road, RK Beach');
      setRoadType('Residential');
      setZone(VISAKHAPATNAM_ZONES[1]);
    } else if (lower.includes('gajuwaka')) {
      setLocationName('Gajuwaka Industrial Corridor');
      setRoadType('Industrial Lifeline');
      setZone(VISAKHAPATNAM_ZONES[4]);
    }

    setNote(smsRawText);
    showToast('SMS message parsed into report fields!');
  };

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validation
    if (reportTab === 'photo' && !photoBase64) {
      setValidationError('No photo yet. Tap the red button to take or choose one.');
      return;
    }
    if (!locationName.trim()) {
      setValidationError('Please specify the road location.');
      return;
    }

    setIsSubmitting(true);
    const isOffline = networkStatus === 'Offline';

    const hazardFlag: HazardFlag = hasLiveWire ? 'live_electrical_wire' : 'none';
    const equipment = getRecommendedEquipment(obstruction, hazardFlag);

    // If offline, use instant rule calculation and mark as Queued
    if (isOffline) {
      const ruleScore = calculateRuleScore({ obstruction, hazard: hazardFlag, roadType });
      const newIncident: Incident = {
        id: `inc_${Date.now().toString().slice(-4)}`,
        location: locationName.trim(),
        lat,
        lng,
        obstruction,
        hazard: hazardFlag,
        priority_score: ruleScore,
        severity: getSeverity(ruleScore),
        roadType,
        zone,
        status: 'Queued',
        source: reportTab === 'photo' ? 'Photo' : 'SMS',
        equipment,
        createdAt: 'Just now',
        updatedAt: 'Just now',
        photo: photoBase64 || undefined,
        note,
        reportedBy: currentUser ? currentUser.name : 'Officer On-Site',
        verified: currentUser ? currentUser.role === 'command' || currentUser.role === 'admin' : false,
        pinnedToMap: false,
        approvedByGovernance: false,
        lastUpdatedBy: 'Device Buffer',
        history: [
          {
            status: 'Queued',
            by: currentUser ? currentUser.name : 'Officer',
            time: 'Just now',
            note: 'Saved offline on device. Will auto-sync when network returns.',
          },
        ],
        priorityHistory: [],
        sample: false,
        aiRecommendation:
          hasLiveWire
            ? 'Danger: electric wire. Keep away. Send heavy machine team.'
            : 'Send municipal clearance squad to clear obstruction.',
      };

      addIncident(newIncident);
      setSubmittedIncident(newIncident);
      setIsSubmitting(false);
      showToast('Saved offline. Will send when network returns.');
      return;
    }

    // Call server-side /api/analyse-hazard
    try {
      const resp = await fetch('/api/analyse-hazard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photoBase64: photoBase64 || '',
          mimeType: photoMime,
          note,
          roadType,
          language,
        }),
      });

      const data = await resp.json();
      recordAiLatency(data.processingTimeMs || 1200);

      const finalScore = data.priority_score || calculateRuleScore({ obstruction, hazard: hazardFlag, roadType });
      const finalSeverity = getSeverity(finalScore);

      const newIncident: Incident = {
        id: `inc_${Date.now().toString().slice(-4)}`,
        location: locationName.trim(),
        lat,
        lng,
        obstruction: data.obstruction || obstruction,
        hazard: data.hazard || hazardFlag,
        priority_score: finalScore,
        severity: finalSeverity,
        roadType,
        zone,
        status: 'Pending',
        source: reportTab === 'photo' ? 'Photo' : 'SMS',
        equipment,
        createdAt: 'Just now',
        updatedAt: 'Just now',
        photo: photoBase64 || undefined,
        note,
        reportedBy: currentUser ? currentUser.name : 'Field Squad',
        verified: currentUser ? currentUser.role === 'command' || currentUser.role === 'admin' : false,
        pinnedToMap: false,
        approvedByGovernance: false,
        lastUpdatedBy: 'System AI',
        history: [
          {
            status: 'Pending',
            by: currentUser ? currentUser.name : 'Field Squad',
            time: 'Just now',
            note: `Triage completed via ${data.modelUsed || 'AI'}. Priority score: ${finalScore}.`,
          },
        ],
        priorityHistory: [],
        sample: false,
        aiRecommendation: data.recommendation,
        aiScore: data.priority_score,
      };

      addIncident(newIncident);
      setSubmittedIncident(newIncident);
      setIsSubmitting(false);
      showToast('Hazard reported and ranked by AI!');
    } catch (err) {
      console.warn('API error, falling back to rule scoring', err);
      const ruleScore = calculateRuleScore({ obstruction, hazard: hazardFlag, roadType });
      const newIncident: Incident = {
        id: `inc_${Date.now().toString().slice(-4)}`,
        location: locationName.trim(),
        lat,
        lng,
        obstruction,
        hazard: hazardFlag,
        priority_score: ruleScore,
        severity: getSeverity(ruleScore),
        roadType,
        zone,
        status: 'Pending',
        source: reportTab === 'photo' ? 'Photo' : 'SMS',
        equipment,
        createdAt: 'Just now',
        updatedAt: 'Just now',
        photo: photoBase64 || undefined,
        note,
        reportedBy: currentUser ? currentUser.name : 'Officer',
        verified: false,
        pinnedToMap: false,
        approvedByGovernance: false,
        lastUpdatedBy: 'Rule Engine',
        history: [
          { status: 'Pending', by: 'Rule Engine', time: 'Just now', note: 'Processed via rule engine.' },
        ],
        priorityHistory: [],
        sample: false,
        aiRecommendation: 'Deploy municipal squad with chainsaw and wood chipper.',
      };

      addIncident(newIncident);
      setSubmittedIncident(newIncident);
      setIsSubmitting(false);
      showToast('Report created using rule-based scoring engine.');
    }
  };

  // Reset for another report
  const handleReportAnother = () => {
    setSubmittedIncident(null);
    setPhotoBase64(null);
    setNote('');
    setLocationName('Maddilapalem Highway, Vizag');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Step Indicator */}
      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2 text-[#2457C5]">
          <span className="w-6 h-6 rounded-full bg-[#2457C5] text-white flex items-center justify-center text-xs">
            1
          </span>
          <span>Photo / Details</span>
        </div>
        <div className="h-0.5 w-12 bg-slate-200" />
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs">
            2
          </span>
          <span>Location</span>
        </div>
        <div className="h-0.5 w-12 bg-slate-200" />
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs">
            3
          </span>
          <span>Send</span>
        </div>
      </div>

      {/* AI RESULT CARD (Shown after submission) */}
      {submittedIncident && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#2457C5] shadow-2xl space-y-6 animate-in zoom-in-95">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-blue-50 text-[#2457C5]">
                <Sparkles className="w-6 h-6" />
              </span>
              <div>
                <h2 className="text-xl font-black text-[#101A3A]">Hazard Analyzed & Prioritized</h2>
                <span className="text-xs text-slate-500">
                  Incident ID: {submittedIncident.id.toUpperCase()} • {submittedIncident.location}
                </span>
              </div>
            </div>

            <div
              className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border ${
                getSeverityColors(submittedIncident.severity).bg
              } ${getSeverityColors(submittedIncident.severity).text} ${
                getSeverityColors(submittedIncident.severity).border
              }`}
            >
              {submittedIncident.severity}
            </div>
          </div>

          {/* Score Ring Display */}
          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 p-6 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="text-center sm:text-left">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Calculated Priority Score
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-[#101A3A] tracking-tight">
                  {submittedIncident.priority_score.toFixed(1)}
                </span>
                <span className="text-sm font-semibold text-slate-400">/ 10.0</span>
              </div>
              <span className="text-xs text-slate-500 mt-1 block">
                {submittedIncident.status === 'Queued'
                  ? 'Saved offline (Rule Score)'
                  : 'Computed with multimodal AI vision'}
              </span>
            </div>

            <div className="space-y-1.5 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Obstruction:</span>
                <span className="font-bold text-slate-900 capitalize">
                  {submittedIncident.obstruction.replace('_', ' ')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Wire Hazard:</span>
                <span
                  className={`font-bold ${
                    submittedIncident.hazard === 'live_electrical_wire' ? 'text-red-600' : 'text-slate-900'
                  }`}
                >
                  {submittedIncident.hazard === 'live_electrical_wire' ? 'Live Wire Danger' : 'None'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Road Type:</span>
                <span className="font-bold text-[#2457C5]">{submittedIncident.roadType}</span>
              </div>
            </div>
          </div>

          {/* Live Wire Banner if applicable */}
          {submittedIncident.hazard === 'live_electrical_wire' && (
            <div className="p-4 rounded-2xl bg-[#D32F2F] text-white flex items-center gap-3 shadow-md">
              <Zap className="w-6 h-6 flex-shrink-0 text-yellow-300" />
              <div>
                <strong className="block text-sm font-extrabold">Danger: electric wire. Keep away.</strong>
                <span className="text-xs text-red-100">
                  Priority boosted to critical. State Electricity Board team notified.
                </span>
              </div>
            </div>
          )}

          {/* AI Recommendation in selected language */}
          <div className="p-4 rounded-2xl bg-[#EAF0FF] border border-[#2457C5]/30">
            <span className="text-xs font-extrabold uppercase text-[#2457C5] tracking-wider block mb-1">
              AI Action Recommendation
            </span>
            <p className="text-sm font-bold text-slate-900 leading-relaxed">
              {submittedIncident.aiRecommendation}
            </p>
            <div className="mt-2 text-xs text-slate-600">
              Machinery to dispatch: <strong className="text-slate-900">{submittedIncident.equipment}</strong>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={() => {
                setSelectedIncidentId(submittedIncident.id);
                setActivePage('map');
              }}
              className="w-full sm:w-1/2 py-3 bg-[#2457C5] hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow transition-all flex items-center justify-center gap-2"
            >
              <Navigation className="w-4 h-4" />
              <span>View on Live Map</span>
            </button>

            <button
              onClick={handleReportAnother}
              className="w-full sm:w-1/2 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Report Another Hazard</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Report Form (Hidden when result is showing) */}
      {!submittedIncident && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tabs: Photo Report vs SMS Text Report */}
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => setReportTab('photo')}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                reportTab === 'photo'
                  ? 'bg-white text-[#101A3A] shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Camera className="w-4 h-4 text-red-600" />
              <span>Photo Report</span>
            </button>

            <button
              type="button"
              onClick={() => setReportTab('sms')}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                reportTab === 'sms'
                  ? 'bg-white text-[#101A3A] shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Send className="w-4 h-4 text-[#2457C5]" />
              <span>SMS Text Report</span>
            </button>
          </div>

          {/* TAB 1: PHOTO REPORT */}
          {reportTab === 'photo' && (
            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                1. Field Photo Evidence
              </label>

              {/* Big Red Camera / Upload Button or Preview */}
              {!photoBase64 ? (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#D32F2F] hover:border-red-700 bg-red-50/20 hover:bg-red-50/40 rounded-3xl p-8 cursor-pointer transition-all group min-h-[220px]">
                  <div className="w-16 h-16 rounded-full bg-[#D32F2F] text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform mb-3">
                    <Camera className="w-8 h-8" />
                  </div>
                  <strong className="text-base font-extrabold text-[#D32F2F]">
                    Take or choose photo
                  </strong>
                  <span className="text-xs text-slate-500 mt-1 text-center">
                    Tap to open phone camera or select image file (JPG, PNG up to 10MB)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 aspect-video bg-slate-900">
                  <img
                    src={photoBase64}
                    alt="Captured hazard preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-between p-4 text-white">
                    <span className="text-xs font-semibold">{photoName || 'Captured Field Photo'}</span>
                    <button
                      type="button"
                      onClick={() => setPhotoBase64(null)}
                      className="px-3 py-1 bg-white/20 hover:bg-white/30 backdrop-blur-xs rounded-lg text-xs font-bold"
                    >
                      Retake Photo
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SMS TEXT REPORT */}
          {reportTab === 'sms' && (
            <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Paste, Type, or Dictate SMS Text
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleSpeechRecognition}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                      isListening
                        ? 'bg-red-600 text-white animate-pulse'
                        : 'bg-blue-50 hover:bg-blue-100 text-[#2457C5]'
                    }`}
                  >
                    {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    <span>{isListening ? 'Stop' : 'Voice Dictate'}</span>
                  </button>
                  <span className="text-[11px] text-[#2457C5] font-semibold hidden sm:inline">
                    Works with SMS text from field
                  </span>
                </div>
              </div>
              <textarea
                rows={3}
                value={smsRawText}
                onChange={(e) => setSmsRawText(e.target.value)}
                placeholder="e.g. Big tree down at Maddilapalem, wires hanging"
                className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-[#2457C5]"
              />
              <button
                type="button"
                onClick={handleParseSms}
                className="px-4 py-2 bg-[#2457C5] hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Read & Extract Message</span>
              </button>
            </div>
          )}

          {/* 2. PLACE & LOCATION */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                2. Location & GPS
              </label>
              <button
                type="button"
                onClick={handleRequestGps}
                className="text-xs font-bold text-[#2457C5] hover:underline flex items-center gap-1"
              >
                <Navigation className="w-3 h-3" />
                <span>{isGpsLoading ? 'Locating...' : 'Refresh GPS'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Road Name / Landmark
                </label>
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="e.g. Maddilapalem Highway, Near Apollo"
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#2457C5]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Municipal Zone
                </label>
                <select
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#2457C5]"
                >
                  {VISAKHAPATNAM_ZONES.map((z) => (
                    <option key={z} value={z}>
                      {z}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* GPS Coordinates pill */}
            <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
              <MapPin className="w-4 h-4 text-[#2457C5]" />
              <span>
                Coordinates: <strong>{lat.toFixed(4)}°N, {lng.toFixed(4)}°E</strong>
              </span>
              {gpsError && <span className="text-amber-600 ml-auto text-[11px] font-semibold">{gpsError}</span>}
            </div>

            {/* Live Leaflet Map Pin Preview */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Plotted Location on Live Leaflet Map
              </span>
              <LeafletMap
                incidents={[
                  {
                    id: 'NEW_REPORT',
                    location: locationName || 'Selected Location',
                    lat,
                    lng,
                    obstruction,
                    hazard: hasLiveWire ? 'live_electrical_wire' : 'none',
                    priority_score: 8.5,
                    severity: 'Critical',
                    roadType,
                    zone,
                    status: 'Pending',
                    source: 'Photo',
                    equipment: 'Chainsaw',
                    createdAt: 'Just now',
                    updatedAt: 'Just now',
                    reportedBy: 'Field Reporter',
                    verified: false,
                    pinnedToMap: true,
                    lastUpdatedBy: 'User',
                    history: [],
                    priorityHistory: [],
                    sample: false,
                  },
                ]}
                height="220px"
                center={[lat, lng]}
                zoom={14}
              />
            </div>
          </div>

          {/* 3. HAZARD DETAILS WITH BIG ONE-TAP ICON BUTTONS */}
          <div className="space-y-4">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              3. Hazard Severity & Obstruction Flags
            </label>

            {/* Obstruction Toggle */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setObstruction('complete_block')}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  obstruction === 'complete_block'
                    ? 'border-[#D32F2F] bg-red-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <strong className="block text-sm font-black text-slate-900">Road fully blocked</strong>
                <span className="text-xs text-slate-500">No vehicles can pass (+3.0 score)</span>
              </button>

              <button
                type="button"
                onClick={() => setObstruction('single_lane')}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  obstruction === 'single_lane'
                    ? 'border-[#2457C5] bg-blue-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <strong className="block text-sm font-black text-slate-900">One lane blocked</strong>
                <span className="text-xs text-slate-500">Narrow pass available (+1.5 score)</span>
              </button>
            </div>

            {/* Hazard quick toggles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                type="button"
                onClick={() => setHasLiveWire(!hasLiveWire)}
                className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                  hasLiveWire
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <Zap className="w-4 h-4 text-red-600" />
                <span>Live Wire</span>
              </button>

              <button
                type="button"
                onClick={() => setHasTree(!hasTree)}
                className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                  hasTree
                    ? 'border-green-500 bg-green-50 text-green-800'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <TreePine className="w-4 h-4 text-green-700" />
                <span>Fallen Tree</span>
              </button>

              <button
                type="button"
                onClick={() => setHasPole(!hasPole)}
                className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                  hasPole
                    ? 'border-amber-500 bg-amber-50 text-amber-800'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Snapped Pole</span>
              </button>

              <button
                type="button"
                onClick={() => setHasWater(!hasWater)}
                className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                  hasWater
                    ? 'border-blue-500 bg-blue-50 text-[#2457C5]'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Waterlogged</span>
              </button>
            </div>

            {/* Road Type Priority */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Road Lifeline Classification
              </label>
              <select
                value={roadType}
                onChange={(e) => setRoadType(e.target.value as RoadType)}
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#2457C5]"
              >
                <option value="Hospital Route">Hospital Route (Highest Priority Lifeline)</option>
                <option value="Emergency Shelter">Emergency Shelter Access Road</option>
                <option value="Major Artery">Major Artery / Highway</option>
                <option value="Industrial Lifeline">Industrial Lifeline (Oxygen / Fuel)</option>
                <option value="Transit Route">Transit Route / Bus Corridor</option>
                <option value="Standard Road">Standard Secondary Road</option>
                <option value="Commercial">Commercial Market Road</option>
                <option value="Residential">Residential Colony Lane</option>
              </select>
            </div>

            {/* Hands-free Voice Input & Notes Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 border border-slate-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs uppercase tracking-wider text-[#2457C5]">
                      Hands-Free Voice Input (Web Speech API)
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-[#2457C5]">
                      {language === 'te' ? 'Telugu (te-IN)' : language === 'hi' ? 'Hindi (hi-IN)' : 'English (en-IN)'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Field officers can speak hazard details directly without typing.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={toggleSpeechRecognition}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
                    isListening
                      ? 'bg-red-600 text-white animate-pulse shadow-red-500/30'
                      : 'bg-[#2457C5] hover:bg-blue-700 text-white'
                  }`}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-4 h-4 animate-bounce" />
                      <span>Stop Voice Recording</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" />
                      <span>Start Voice Description</span>
                    </>
                  )}
                </button>
              </div>

              {/* Listening Active Wave Indicator */}
              {isListening && (
                <div className="p-3 bg-red-500/10 border border-red-300 rounded-xl flex items-center justify-between gap-3 text-red-700 animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                    </span>
                    <span className="text-xs font-extrabold">Listening live... Speak clearly now</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1 h-3 bg-red-500 animate-pulse" />
                    <span className="w-1 h-5 bg-red-600 animate-pulse delay-75" />
                    <span className="w-1 h-2 bg-red-400 animate-pulse delay-150" />
                    <span className="w-1 h-4 bg-red-500 animate-pulse delay-100" />
                  </div>
                </div>
              )}

              {/* Interim Real-Time Transcript Preview */}
              {interimTranscript && (
                <div className="p-2.5 bg-white border border-blue-200 rounded-xl text-xs font-semibold text-[#2457C5] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 flex-shrink-0 animate-spin" />
                  <span>Hearing: &ldquo;{interimTranscript}&rdquo;</span>
                </div>
              )}

              {/* Speech Error Banner */}
              {speechError && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs font-semibold text-amber-800 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-600" />
                  <span>{speechError}</span>
                </div>
              )}

              {/* Field Notes Textarea */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Field Notes & Voice Description
                </label>
                <textarea
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Describe obstruction, electrical risk, or vehicle access notes (or tap Start Voice Description above)..."
                  className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-[#2457C5] shadow-inner"
                />
              </div>
            </div>
          </div>

          {/* Validation Error Message */}
          {validationError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Loading Skeleton during submission */}
          {isSubmitting && (
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-3 animate-pulse">
              <div className="w-10 h-10 border-4 border-[#2457C5] border-t-transparent rounded-full animate-spin mx-auto" />
              <strong className="block text-base font-extrabold text-[#101A3A]">
                Analysing hazard with Gemini AI...
              </strong>
              <p className="text-xs text-slate-500">
                Evaluating tree blockage, wire hazards, and calculating priority score.
              </p>
            </div>
          )}

          {/* 4. FULL-WIDTH RED SUBMIT BUTTON (56px tall) */}
          {!isSubmitting && (
            <button
              type="submit"
              className="w-full h-14 bg-[#D32F2F] hover:bg-red-700 active:scale-[0.99] text-white font-extrabold text-base rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <AlertTriangle className="w-5 h-5" />
              <span>Submit report</span>
            </button>
          )}

          {/* Offline notice */}
          {networkStatus === 'Offline' && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                Offline Mode Active: Report will be saved to device buffer and synced automatically when network returns.
              </span>
            </div>
          )}
        </form>
      )}
    </div>
  );
};
