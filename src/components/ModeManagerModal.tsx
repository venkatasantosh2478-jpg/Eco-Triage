import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { OperatingMode, MODE_CONFIG } from '../utils/modeConfig.ts';
import { Shield, Radio, CheckCircle2, AlertTriangle, Clock, RefreshCw, X } from 'lucide-react';

export const ModeManagerModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { operatingMode, setOperatingMode, modeSince, modeReason, disasterName, currentRole } = useApp();

  const [selectedMode, setSelectedMode] = useState<OperatingMode>(operatingMode);
  const [reason, setReason] = useState<string>('');
  const [disasterInput, setDisasterInput] = useState<string>(disasterName);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!isOpen) return null;

  const isAdmin = currentRole === 'admin';

  const handleInitiateSwitch = (targetMode: OperatingMode) => {
    if (targetMode === operatingMode) return;
    setSelectedMode(targetMode);
    setShowConfirm(true);
  };

  const handleConfirmSwitch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    setOperatingMode(selectedMode, reason.trim(), disasterInput.trim() || undefined);
    setShowConfirm(false);
    setReason('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-red-50 text-red-600">
              <Radio className="w-5 h-5 animate-pulse" />
            </span>
            <div>
              <h3 className="font-extrabold text-base text-[#101A3A]">System Operating Mode Control</h3>
              <span className="text-[11px] text-slate-500">Global setting across all open user sessions</span>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isAdmin && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Only Administrators can change the operating mode. You are currently viewing as [{currentRole}].</span>
          </div>
        )}

        {/* Current Status Banner */}
        <div className={`p-4 rounded-2xl border flex items-center justify-between ${
          operatingMode === 'emergency' ? 'bg-red-50 border-red-200 text-red-900' : 'bg-blue-50 border-blue-200 text-blue-900'
        }`}>
          <div>
            <span className="text-[10px] uppercase font-black tracking-wider block opacity-75">Active Global Mode</span>
            <strong className="text-lg font-black">{MODE_CONFIG[operatingMode].name}</strong>
            <p className="text-xs opacity-90 mt-0.5">Active since {modeSince} • Reason: "{modeReason}"</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
            operatingMode === 'emergency' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
          }`}>
            {operatingMode.toUpperCase()}
          </span>
        </div>

        {!showConfirm ? (
          <div className="space-y-4">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Select Operating Mode (Admin Control)
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Daily Mode Card */}
              <button
                type="button"
                disabled={!isAdmin}
                onClick={() => handleInitiateSwitch('daily')}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  operatingMode === 'daily'
                    ? 'border-blue-600 bg-blue-50/60 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                } ${!isAdmin ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-sm text-[#101A3A]">Daily Mode</span>
                  {operatingMode === 'daily' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {MODE_CONFIG.daily.name}: Normal operations. Everyday road problems, help directory and preparedness.
                </p>
              </button>

              {/* Emergency Mode Card */}
              <button
                type="button"
                disabled={!isAdmin}
                onClick={() => handleInitiateSwitch('emergency')}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  operatingMode === 'emergency'
                    ? 'border-red-600 bg-red-50/60 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                } ${!isAdmin ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-sm text-red-700">Emergency Mode</span>
                  {operatingMode === 'emergency' && <CheckCircle2 className="w-4 h-4 text-red-600" />}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {MODE_CONFIG.emergency.name}: Active cyclone or disaster. Fastest reporting, live blocked roads and relief camps first.
                </p>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleConfirmSwitch} className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 animate-in fade-in">
            <h4 className="font-extrabold text-sm text-[#101A3A]">
              Confirm Switch to {selectedMode === 'emergency' ? 'Emergency Mode' : 'Daily Mode'}
            </h4>

            {selectedMode === 'emergency' ? (
              <p className="text-xs text-slate-600">
                Switching to Emergency mode will immediately broadcast red alerts, prioritize blocked roads, and highlight relief camps for all active users.
              </p>
            ) : (
              <p className="text-xs text-slate-600">
                Returning to Daily mode restores standard everyday reporting and calming blue ticker styling. Open incidents will remain in the queue.
              </p>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Disaster Name / Event (Optional)
              </label>
              <input
                type="text"
                value={disasterInput}
                onChange={(e) => setDisasterInput(e.target.value)}
                placeholder="e.g. Cyclone, coastal Visakhapatnam"
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Reason for Switch <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Severe coastal storm alert issued by IMD"
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-5 py-2 text-xs font-bold text-white rounded-xl shadow ${
                  selectedMode === 'emergency' ? 'bg-[#D32F2F] hover:bg-red-700' : 'bg-[#2457C5] hover:bg-blue-700'
                }`}
              >
                {selectedMode === 'emergency' ? 'Switch to Emergency Mode' : 'Return to Daily Mode'}
              </button>
            </div>
          </form>
        )}

        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
