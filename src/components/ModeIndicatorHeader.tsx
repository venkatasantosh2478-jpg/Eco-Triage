import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { MODE_CONFIG } from '../utils/modeConfig.ts';
import { ModeManagerModal } from './ModeManagerModal.tsx';
import { Radio, ShieldAlert, AlertTriangle } from 'lucide-react';

export const ModeIndicatorHeader: React.FC = () => {
  const { operatingMode, modeSince, disasterName, currentRole } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isAdmin = currentRole === 'admin';
  const isEmergency = operatingMode === 'emergency';

  return (
    <>
      {/* Top mode indicator pill in Header / Ticker area */}
      <div className="bg-slate-900 text-white px-4 py-2 text-xs flex flex-col sm:flex-row items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className={`px-3 py-1 rounded-full font-black text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
              isEmergency
                ? 'bg-red-600 text-white animate-pulse hover:bg-red-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            title={isAdmin ? 'Click to manage system operating mode' : 'Current system operating mode'}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>{isEmergency ? 'EMERGENCY MODE ACTIVE' : 'Daily Mode (Normal)'}</span>
          </button>

          <span className="text-slate-400 hidden md:inline">
            {isEmergency ? `Disaster: ${disasterName} • Active since ${modeSince}` : 'All municipal systems operating normally.'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin ? (
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-xs font-bold text-yellow-300 hover:underline flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Admin: Switch Mode</span>
            </button>
          ) : (
            <span className="text-[11px] text-slate-400 font-semibold">
              Mode controlled by Admin
            </span>
          )}
        </div>
      </div>

      {/* Emergency Red Banner Strip under header if in Emergency mode */}
      {isEmergency && (
        <div className="bg-red-600 text-white px-4 py-2.5 text-xs sm:text-sm font-bold flex items-center justify-between gap-3 shadow-md z-30 sticky top-[72px]">
          <div className="flex items-center gap-2 overflow-hidden">
            <AlertTriangle className="w-5 h-5 text-yellow-300 shrink-0 animate-bounce" />
            <span className="truncate">
              <strong>DISASTER EMERGENCY:</strong> {disasterName} — All response squads active. Emergency reporting priority engaged.
            </span>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="shrink-0 px-3 py-1 bg-white text-red-700 hover:bg-red-50 rounded-lg text-xs font-black shadow"
          >
            Manage Mode
          </button>
        </div>
      )}

      <ModeManagerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
