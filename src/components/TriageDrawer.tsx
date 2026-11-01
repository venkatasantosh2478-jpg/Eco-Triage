import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { getSeverityColors, calculateDistance } from '../utils/rules.ts';
import { SAMPLE_CREWS } from '../utils/storage.ts';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  HelpCircle,
  MapPin,
  Send,
  ShieldAlert,
  Sparkles,
  Truck,
  User,
  X,
  Zap,
  ArrowRight,
} from 'lucide-react';

export const TriageDrawer: React.FC = () => {
  const {
    selectedIncidentId,
    setSelectedIncidentId,
    incidents,
    helpPoints,
    currentRole,
    currentUser,
    dispatchCrew,
    updateIncidentStatus,
    overridePriority,
    setActivePage,
  } = useApp();

  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);
  const [overrideScore, setOverrideScore] = useState<number>(9.0);
  const [overrideReason, setOverrideReason] = useState<string>('');
  const [isCrewPickerOpen, setIsCrewPickerOpen] = useState(false);
  const [scoreTooltipOpen, setScoreTooltipOpen] = useState(false);

  const incident = incidents.find((i) => i.id === selectedIncidentId);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedIncidentId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSelectedIncidentId]);

  if (!incident) return null;

  const colors = getSeverityColors(incident.severity);

  // Compute nearest help points
  const camps = helpPoints
    .filter((h) => h.category === 'relief_camp')
    .map((h) => ({ ...h, dist: calculateDistance(incident.lat, incident.lng, h.lat, h.lng) }))
    .sort((a, b) => a.dist - b.dist);

  const hospitals = helpPoints
    .filter((h) => h.category === 'hospital')
    .map((h) => ({ ...h, dist: calculateDistance(incident.lat, incident.lng, h.lat, h.lng) }))
    .sort((a, b) => a.dist - b.dist);

  const depots = helpPoints
    .filter((h) => h.category === 'depot')
    .map((h) => ({ ...h, dist: calculateDistance(incident.lat, incident.lng, h.lat, h.lng) }))
    .sort((a, b) => a.dist - b.dist);

  const nearestCamp = camps[0];
  const nearestHospital = hospitals[0];
  const nearestDepot = depots[0];

  const handleApplyOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideReason.trim()) return;
    overridePriority(incident.id, overrideScore, overrideReason.trim());
    setIsOverrideModalOpen(false);
    setOverrideReason('');
  };

  const handleDispatch = (crewName: string) => {
    dispatchCrew(incident.id, crewName);
    setIsCrewPickerOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      {/* Drawer Container (Desktop 420px, Mobile 100% full screen / bottom sheet) */}
      <div className="w-full sm:w-[460px] bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
        {/* Top Header */}
        <div className="sticky top-0 bg-white border-b border-[#E2E7F0] px-5 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              {incident.id.toUpperCase()}
            </span>
            {incident.sample && (
              <span className="text-[10px] uppercase font-bold text-slate-500 border border-slate-200 px-1.5 py-0.2 rounded">
                Sample
              </span>
            )}
            {!incident.verified && (
              <span className="text-[10px] uppercase font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">
                Unverified
              </span>
            )}
          </div>
          <button
            onClick={() => setSelectedIncidentId(null)}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 space-y-5 flex-1">
          {/* Location Title */}
          <div>
            <h2 className="text-xl font-extrabold text-[#101A3A] tracking-tight">{incident.location}</h2>
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 mt-1">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {incident.lat.toFixed(4)}°N, {incident.lng.toFixed(4)}°E • {incident.zone}
                </span>
              </div>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${incident.lat},${incident.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#2457C5] bg-blue-50 px-2.5 py-1 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Google Maps Route</span>
              </a>
            </div>
          </div>

          {/* Photo */}
          {incident.photo ? (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 aspect-video bg-slate-100">
              <img
                src={incident.photo}
                alt={`Hazard photo at ${incident.location}`}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-2 left-2 text-[10px] font-bold bg-black/60 text-white px-2 py-0.5 rounded-md backdrop-blur-xs">
                Field Photo
              </span>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center bg-slate-50">
              <p className="text-xs text-slate-500">No field photo attached to this text/SMS report.</p>
            </div>
          )}

          {/* Score Card & Severity Badge */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Priority Score
                </span>
                <button
                  onClick={() => setScoreTooltipOpen(!scoreTooltipOpen)}
                  className="text-slate-400 hover:text-slate-600"
                  aria-label="Explain priority score calculation"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black tracking-tight text-[#101A3A]">
                  {incident.priority_score.toFixed(1)}
                </span>
                <span className="text-xs text-slate-500 font-medium">/ 10.0</span>
              </div>
              {scoreTooltipOpen && (
                <p className="text-[11px] text-slate-600 mt-2 p-2 bg-white rounded-lg border border-slate-200 leading-tight">
                  Scored using multimodal AI & civic rules: complete obstruction (+3.0), live electrical wires (+2.5), and hospital lifelines (+1.5).
                </p>
              )}
            </div>

            {/* Severity Badge with colour + word + icon */}
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-black uppercase tracking-wider ${colors.bg} ${colors.text} ${colors.border}`}
            >
              {incident.severity === 'Critical' ? (
                <AlertTriangle className="w-4 h-4" />
              ) : incident.severity === 'High' ? (
                <ShieldAlert className="w-4 h-4" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              <span>{incident.severity}</span>
            </div>
          </div>

          {/* LIVE WIRE DANGER BANNER */}
          {incident.hazard === 'live_electrical_wire' && (
            <div className="p-4 rounded-2xl bg-[#D32F2F] text-white flex items-start gap-3 shadow-md animate-pulse-subtle">
              <Zap className="w-6 h-6 flex-shrink-0 text-yellow-300 mt-0.5" />
              <div>
                <strong className="block text-sm font-extrabold tracking-wide">
                  DANGER: HIGH-VOLTAGE LIVE WIRE
                </strong>
                <p className="text-xs text-red-100 mt-0.5">
                  Keep citizens and vehicles away. Requires State Electricity Board wire-isolation clearance before mechanical cutting.
                </p>
              </div>
            </div>
          )}

          {/* AI Analysis & Recommendation */}
          <div className="p-4 rounded-2xl bg-[#EAF0FF] border border-[#2457C5]/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold uppercase text-[#2457C5] tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Hazard Triage</span>
              </span>
              <span className="text-[11px] font-bold text-slate-500">{incident.roadType}</span>
            </div>

            <p className="text-xs font-semibold text-slate-800 leading-relaxed mb-3">
              {incident.aiRecommendation || 'Clearance squad needed to chop and clear fallen debris.'}
            </p>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded-xl bg-white border border-blue-100">
                <span className="text-slate-400 block text-[10px]">Obstruction</span>
                <strong className="text-slate-800 font-bold capitalize">
                  {incident.obstruction.replace('_', ' ')}
                </strong>
              </div>
              <div className="p-2 rounded-xl bg-white border border-blue-100">
                <span className="text-slate-400 block text-[10px]">Electrical Hazard</span>
                <strong className="text-slate-800 font-bold capitalize">
                  {incident.hazard === 'live_electrical_wire' ? 'Live Cable Active' : 'None Detected'}
                </strong>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="border border-slate-200 rounded-2xl p-4 text-xs space-y-2">
            <h4 className="font-bold text-[#101A3A] uppercase tracking-wider text-[11px]">
              Incident Metadata
            </h4>
            <div className="grid grid-cols-2 gap-y-2 text-slate-600">
              <div>
                <span className="text-slate-400 block text-[10px]">Status</span>
                <span className="font-bold text-slate-800">{incident.status}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Report Source</span>
                <span className="font-bold text-slate-800">{incident.source}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Reported By</span>
                <span className="font-bold text-slate-800">{incident.reportedBy}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Assigned Unit</span>
                <span className="font-bold text-slate-800">{incident.assignedTo || 'Unassigned'}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block text-[10px]">Recommended Machinery</span>
                <span className="font-bold text-[#2457C5]">{incident.equipment}</span>
              </div>
            </div>
            {incident.note && (
              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-400 block text-[10px]">Field Notes</span>
                <p className="text-slate-700 italic text-[11px] mt-0.5">"{incident.note}"</p>
              </div>
            )}
          </div>

          {/* Nearest Help Points */}
          <div className="border border-slate-200 rounded-2xl p-4 space-y-2.5">
            <h4 className="font-bold text-[#101A3A] uppercase tracking-wider text-[11px]">
              Nearest Vital Facilities
            </h4>

            {nearestHospital && (
              <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50">
                <div>
                  <strong className="block text-slate-800">{nearestHospital.name}</strong>
                  <span className="text-[10px] text-slate-500">Hospital • {nearestHospital.dist} km away</span>
                </div>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${nearestHospital.lat},${nearestHospital.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#2457C5] font-bold flex items-center gap-1 hover:underline"
                >
                  <span>Google Maps Route</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            {nearestCamp && (
              <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50">
                <div>
                  <strong className="block text-slate-800">{nearestCamp.name}</strong>
                  <span className="text-[10px] text-slate-500">Relief Camp • {nearestCamp.dist} km away</span>
                </div>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${nearestCamp.lat},${nearestCamp.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#2457C5] font-bold flex items-center gap-1 hover:underline"
                >
                  <span>Google Maps Route</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            {nearestDepot && (
              <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50">
                <div>
                  <strong className="block text-slate-800">{nearestDepot.name}</strong>
                  <span className="text-[10px] text-slate-500">Depot • {nearestDepot.dist} km away</span>
                </div>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${nearestDepot.lat},${nearestDepot.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#2457C5] font-bold flex items-center gap-1 hover:underline"
                >
                  <span>Google Maps Route</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>

          {/* Status Timeline */}
          <div className="border border-slate-200 rounded-2xl p-4">
            <h4 className="font-bold text-[#101A3A] uppercase tracking-wider text-[11px] mb-3">
              Status Timeline
            </h4>
            <div className="space-y-3 relative pl-4 border-l-2 border-slate-200 ml-2 text-xs">
              {incident.history.map((event, idx) => (
                <div key={idx} className="relative">
                  <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#2457C5] ring-4 ring-white" />
                  <div className="font-bold text-slate-800">{event.status}</div>
                  <div className="text-[10px] text-slate-400">
                    By {event.by} • {event.time}
                  </div>
                  {event.note && <div className="text-[11px] text-slate-600 mt-0.5">{event.note}</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Priority Override History if exists */}
          {incident.priorityHistory.length > 0 && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
              <strong className="block font-bold mb-1">Priority Override Log</strong>
              {incident.priorityHistory.map((h, i) => (
                <div key={i} className="text-[11px]">
                  Changed by {h.by} (was {h.from}, now {h.to}): "{h.reason}" • {h.time}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons Toolbar at bottom of drawer */}
        <div className="sticky bottom-0 bg-white border-t border-[#E2E7F0] p-4 space-y-2">
          {currentRole === 'public' || currentRole === 'viewer' ? (
            <div className="text-center p-2 rounded-xl bg-slate-100 text-xs text-slate-500 font-medium">
              Read-only view. Sign in as Field Officer or Command to dispatch crews.
            </div>
          ) : (
            <>
              {/* Row 1: Primary Dispatch */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setIsCrewPickerOpen(true)}
                  className="bg-[#D32F2F] hover:bg-red-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
                >
                  <Truck className="w-4 h-4" />
                  <span>Send Crew</span>
                </button>

                <button
                  onClick={() => dispatchCrew(incident.id, 'State Electricity Board Squad A')}
                  className="border-2 border-[#2457C5] text-[#2457C5] hover:bg-blue-50 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                >
                  <Zap className="w-4 h-4" />
                  <span>Send Elec. Board</span>
                </button>
              </div>

              {/* Row 2: Status transition & Override */}
              <div className="grid grid-cols-2 gap-2">
                {incident.status !== 'Cleared' ? (
                  <button
                    onClick={() => updateIncidentStatus(incident.id, 'Cleared', 'Hazard fully cleared by on-site team.')}
                    className="bg-[#16834A] hover:bg-green-700 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mark Cleared</span>
                  </button>
                ) : (
                  <button
                    onClick={() => updateIncidentStatus(incident.id, 'Working', 'Reopened for inspection.')}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-2 px-3 rounded-xl text-xs active:scale-95 transition-all"
                  >
                    <span>Reopen Hazard</span>
                  </button>
                )}

                {(currentRole === 'command' || currentRole === 'admin') && (
                  <button
                    onClick={() => setIsOverrideModalOpen(true)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1"
                  >
                    <span>Change Priority</span>
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Crew Dispatch Picker Modal */}
      {isCrewPickerOpen && (
        <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h3 className="font-extrabold text-base text-[#101A3A]">Dispatch Available Crew</h3>
              <button onClick={() => setIsCrewPickerOpen(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Select an available squad from the Visakhapatnam municipal depot pool:
            </p>
            <div className="space-y-2 mb-4">
              {SAMPLE_CREWS.map((crew) => (
                <button
                  key={crew.id}
                  onClick={() => handleDispatch(crew.name)}
                  className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-[#2457C5] hover:bg-blue-50/50 flex items-center justify-between text-xs"
                >
                  <div>
                    <strong className="block font-bold text-slate-800">{crew.name}</strong>
                    <span className="text-[10px] text-slate-500">{crew.type}</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      crew.status === 'Free' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {crew.status}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Priority Override Modal */}
      {isOverrideModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h3 className="font-extrabold text-base text-[#101A3A]">Override Priority Score</h3>
              <button onClick={() => setIsOverrideModalOpen(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleApplyOverride}>
              <div className="mb-3">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  New Score (Current: {incident.priority_score})
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="10"
                  value={overrideScore}
                  onChange={(e) => setOverrideScore(parseFloat(e.target.value) || 1)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Reason for Override (Required for audit log)
                </label>
                <textarea
                  rows={2}
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  placeholder="e.g. Next to hospital entrance gate / child shelter"
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800"
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOverrideModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold bg-[#2457C5] text-white rounded-xl shadow"
                >
                  Save Override
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
