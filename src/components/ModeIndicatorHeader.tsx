import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { getModeBannerVisibility } from '../utils/rules.ts';
import { t } from '../utils/translations.ts';
import { ModeManagerModal } from './ModeManagerModal.tsx';
import { Radio, ShieldAlert, AlertTriangle } from 'lucide-react';

export const ModeIndicatorHeader: React.FC = () => {
  const { operatingMode, modeSince, disasterName, currentRole, language, simpleWords } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { showOfficerModeBar, showEmergencyAlertBanner, canManageMode } = getModeBannerVisibility(
    currentRole,
    operatingMode
  );
  const isEmergency = operatingMode === 'emergency';

  // Public users in Daily Mode do not see the Daily Mode indicator bar;
  // they only get notified when Emergency Mode is active.
  if (!showOfficerModeBar && !showEmergencyAlertBanner) {
    return null;
  }

  return (
    <>
      {/* Officer-Only Mode Control Bar (Visible to Officers in both Daily & Emergency modes) */}
      {showOfficerModeBar && (
        <div className="bg-slate-900 text-white px-4 py-2 text-xs flex flex-col sm:flex-row items-center justify-between gap-2 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className={`px-3 py-1 rounded-full font-black text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                isEmergency
                  ? 'bg-red-600 text-white animate-pulse hover:bg-red-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              title="Click to manage system operating mode"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>
                {isEmergency
                  ? t('emergencyModeActive', language, simpleWords)
                  : t('dailyModeOfficer', language, simpleWords)}
              </span>
            </button>

            <span className="text-slate-400 hidden md:inline">
              {isEmergency
                ? `Disaster: ${disasterName} • Active since ${modeSince}`
                : 'Officer View • All municipal systems operating normally.'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {canManageMode ? (
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-xs font-bold text-yellow-300 hover:underline flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg cursor-pointer"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Officer: Switch Mode</span>
              </button>
            ) : (
              <span className="text-[11px] text-slate-400 font-semibold">
                Observer View (Mode controlled by Officers)
              </span>
            )}
          </div>
        </div>
      )}

      {/* Emergency Red Notification Strip (Notifies ALL users & officers when Emergency Mode is active) */}
      {showEmergencyAlertBanner && (
        <div
          className="bg-red-600 text-white px-4 py-2.5 text-xs sm:text-sm font-bold flex items-center justify-between gap-3 shadow-md z-30"
          role="alert"
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <AlertTriangle className="w-5 h-5 text-yellow-300 shrink-0 animate-bounce" />
            <span className="truncate">
              <strong>{t('disasterEmergencyAlert', language, simpleWords)}</strong> {disasterName} —{' '}
              {t('emergencyBroadcastSub', language, simpleWords)}
            </span>
          </div>
          {showOfficerModeBar && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="shrink-0 px-3 py-1 bg-white text-red-700 hover:bg-red-50 rounded-lg text-xs font-black shadow cursor-pointer"
            >
              Manage Mode
            </button>
          )}
        </div>
      )}

      <ModeManagerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
