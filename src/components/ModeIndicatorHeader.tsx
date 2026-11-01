import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { getModeBannerVisibility } from '../utils/rules.ts';
import { ModeManagerModal } from './ModeManagerModal.tsx';
import {
  AlertTriangle,
  Eye,
  Radio,
  ShieldAlert,
  Volume2,
  VolumeX,
  WifiOff,
} from 'lucide-react';

export const ModeIndicatorHeader: React.FC = () => {
  const {
    operatingMode,
    globalServerMode,
    previewMode,
    setPreviewMode,
    modeSince,
    disasterName,
    expectedEnd,
    emergencyBroadcastMessage,
    emergencyBroadcastExpiry,
    usingCachedMode,
    lastModeUpdatedTime,
    hasActiveWarningPrompt,
    dismissWarningPrompt,
    currentRole,
    isFeatureOn,
    getContent,
    isModeModalOpen,
    setIsModeModalOpen,
    setActivePage,
    soundVibrationEnabled,
    setSoundVibrationEnabled,
    lowDataMode,
    setLowDataMode,
  } = useApp();

  const { showOfficerModeBar, showEmergencyAlertBanner, canManageMode } = getModeBannerVisibility(
    currentRole,
    operatingMode
  );
  const isEmergency = operatingMode === 'emergency';

  return (
    <>
      {/* 1. Admin "Preview as" Banner (Section 14.7) */}
      {currentRole === 'admin' && previewMode && (
        <div
          data-testid="preview-only-banner"
          className="bg-amber-400 text-slate-950 px-4 py-2 text-xs sm:text-sm font-black flex flex-wrap items-center justify-between gap-2 border-b border-amber-500 z-50"
        >
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 shrink-0" />
            <span>
              Preview only ({previewMode.toUpperCase()} MODE). Users do not see this — live site is still in {globalServerMode.toUpperCase()} mode.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setPreviewMode(null);
                setActivePage('mode-settings');
              }}
              className="px-3 py-1 bg-slate-900 text-white rounded-lg text-xs font-extrabold cursor-pointer"
            >
              Open Mode Settings to Apply
            </button>
            <button
              type="button"
              data-testid="exit-preview-bar-btn"
              onClick={() => setPreviewMode(null)}
              className="px-3 py-1 bg-white/90 hover:bg-white text-slate-900 rounded-lg text-xs font-extrabold border border-slate-900/20 cursor-pointer"
            >
              Exit Preview
            </button>
          </div>
        </div>
      )}

      {/* 2. Cached Mode Notice when Server Unreachable / Offline (Section 14.8) */}
      {usingCachedMode && (
        <div
          data-testid="last-known-mode-banner"
          className="bg-slate-800 text-amber-200 px-4 py-1.5 text-[11px] font-bold flex items-center justify-center gap-2 border-b border-slate-700"
        >
          <WifiOff className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Showing last known mode. Last updated {lastModeUpdatedTime}.</span>
        </div>
      )}

      {/* 3. Severe Warning Alert Prompt for Admins (Section 14.2) */}
      {currentRole === 'admin' && hasActiveWarningPrompt && (
        <div
          data-testid="header-warning-prompt-banner"
          className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-black flex flex-wrap items-center justify-between gap-2 border-b border-amber-600"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>A severe warning is active. Switch to Emergency mode?</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              data-testid="one-tap-warning-switch-btn"
              onClick={() => setIsModeModalOpen(true)}
              className="px-3 py-1 bg-[#D32F2F] text-white rounded-lg text-xs font-black shadow cursor-pointer"
            >
              Switch to Emergency mode
            </button>
            <button
              type="button"
              onClick={dismissWarningPrompt}
              className="px-2.5 py-1 bg-black/10 hover:bg-black/20 rounded-lg text-xs font-bold cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* 4. Officer / Admin Top Control Bar */}
      {showOfficerModeBar && (
        <div
          data-testid="officer-mode-bar"
          className="bg-slate-900 text-white px-4 py-2 text-xs flex flex-col sm:flex-row items-center justify-between gap-2 border-b border-slate-800"
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsModeModalOpen(true)}
              className={`px-3 py-1 rounded-full font-black text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                isEmergency
                  ? 'bg-red-600 text-white animate-pulse hover:bg-red-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              title="View or manage system operating mode"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>{getContent('global_pill')}</span>
            </button>

            <span className="text-slate-300 hidden md:inline">
              {isEmergency
                ? `${disasterName} • Active since ${modeSince}${expectedEnd ? ` • Expected end: ${expectedEnd}` : ''}`
                : `Active since ${modeSince} • ${getContent('banner_message')}`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {canManageMode ? (
              <>
                <button
                  type="button"
                  data-testid="open-mode-settings-page-btn"
                  onClick={() => setActivePage('mode-settings')}
                  className="text-xs font-bold text-blue-300 hover:underline px-2 py-1 rounded-lg cursor-pointer"
                >
                  Full Mode Settings (4 Tabs)
                </button>
                <button
                  type="button"
                  data-testid="open-mode-manager-btn"
                  onClick={() => setIsModeModalOpen(true)}
                  className="text-xs font-bold text-yellow-300 hover:underline flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg cursor-pointer"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Admin: Switch Mode</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsModeModalOpen(true)}
                className="text-[11px] text-slate-400 hover:text-white font-semibold cursor-pointer"
              >
                Read-Only Mode Status (Admin Controlled)
              </button>
            )}
          </div>
        </div>
      )}

      {/* 5. Emergency Mode Red Strip under Header with Disaster Name & Active Since (Section 14.6 & 14.9) */}
      {showEmergencyAlertBanner && isFeatureOn('red_emergency_strip') && (
        <div
          data-testid="emergency-public-banner"
          className="bg-[#D32F2F] text-white px-4 py-2.5 text-xs sm:text-sm font-bold flex flex-wrap items-center justify-between gap-3 shadow-md z-30"
          role="alert"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <AlertTriangle className="w-5 h-5 text-yellow-300 shrink-0 animate-bounce" />
            <span className="leading-snug">
              <strong className="uppercase tracking-wide mr-1.5">{getContent('global_pill')}:</strong>
              <span>{disasterName}</span>
              <span className="mx-2 opacity-80">•</span>
              <span className="underline decoration-white/60">Active since {modeSince}</span>
              {expectedEnd && <span className="ml-2 opacity-90">(Expected end: {expectedEnd})</span>}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Sound & Vibration Opt-in Toggle in Emergency Mode (Section 14.4) */}
            {isFeatureOn('sound_vibration_alerts') && (
              <button
                type="button"
                data-testid="sound-vibration-toggle"
                onClick={() => setSoundVibrationEnabled(!soundVibrationEnabled)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold flex items-center gap-1 border transition-all cursor-pointer ${
                  soundVibrationEnabled
                    ? 'bg-yellow-300 text-slate-950 border-yellow-200'
                    : 'bg-red-800/70 text-white border-red-400/40 hover:bg-red-800'
                }`}
                title="Opt-in sound and vibration alerts for new Critical incidents"
              >
                {soundVibrationEnabled ? (
                  <Volume2 className="w-3.5 h-3.5" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5" />
                )}
                <span>{soundVibrationEnabled ? 'Sound Alerts: ON' : 'Sound Alerts: OFF'}</span>
              </button>
            )}

            {/* Low-Data Mode Toggle when feature is active */}
            {isFeatureOn('low_data_mode') && (
              <button
                type="button"
                data-testid="low-data-toggle"
                onClick={() => setLowDataMode(!lowDataMode)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold border transition-all cursor-pointer ${
                  lowDataMode
                    ? 'bg-amber-300 text-slate-950 border-amber-200'
                    : 'bg-red-800/70 text-white border-red-400/40 hover:bg-red-800'
                }`}
              >
                {lowDataMode ? 'Low-Data: ON' : 'Low-Data: Auto'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* 6. Command Full-Width Emergency Broadcast Banner (Section 14.4) */}
      {isEmergency && isFeatureOn('emergency_broadcast_banner') && emergencyBroadcastMessage && (
        <div
          data-testid="emergency-broadcast-strip"
          className="bg-slate-950 text-amber-300 px-4 py-2 text-xs font-bold flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/30"
        >
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
              Command Broadcast
            </span>
            <span className="text-white">{emergencyBroadcastMessage}</span>
          </div>
          {emergencyBroadcastExpiry && (
            <span className="text-[11px] text-slate-400">
              Expires: {emergencyBroadcastExpiry}
            </span>
          )}
        </div>
      )}

      <ModeManagerModal isOpen={isModeModalOpen} onClose={() => setIsModeModalOpen(false)} />
    </>
  );
};
