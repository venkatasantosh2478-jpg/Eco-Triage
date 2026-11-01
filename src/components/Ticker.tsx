import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { getStatusLabelForMode } from '../utils/modeConfig.ts';
import { t } from '../utils/translations.ts';
import { AlertTriangle, CheckCircle2, Pause, Play, Wifi, WifiOff } from 'lucide-react';

export const Ticker: React.FC = () => {
  const {
    alerts,
    networkStatus,
    setNetworkStatus,
    setActivePage,
    setSelectedIncidentId,
    incidents,
    language,
    simpleWords,
    operatingMode,
  } = useApp();
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const isEmergency = operatingMode === 'emergency';

  // Section 14.6: Daily mode shows calm updates (cleared roads, weather, tips).
  // Emergency mode leads with critical items and warnings.
  const activeAlerts = alerts
    .filter((a) => a.active)
    .sort((a, b) => {
      if (isEmergency) {
        return a.severity === 'Warning' ? -1 : b.severity === 'Warning' ? 1 : 0;
      }
      return a.severity === 'Info' ? -1 : 1;
    });

  const sortedIncidents = isEmergency
    ? [...incidents]
        .filter((i) => i.status !== 'Cleared')
        .sort((a, b) => b.priority_score - a.priority_score)
        .slice(0, 4)
    : [...incidents]
        .sort((a, b) => (a.status === 'Cleared' ? -1 : b.status === 'Cleared' ? 1 : 0))
        .slice(0, 4);

  const recentUpdates = sortedIncidents.map((inc) => ({
    id: inc.id,
    severity: inc.severity,
    status: inc.status,
    text: `${inc.location}: ${t(inc.obstruction, language, simpleWords)} (${getStatusLabelForMode(
      inc.status,
      operatingMode,
      language
    )})`,
    time: inc.createdAt,
    isIncident: true,
  }));

  const handleAlertClick = (item: any) => {
    if (item.isIncident) {
      setSelectedIncidentId(item.id);
    } else {
      setActivePage('alerts');
    }
  };

  const toggleNetwork = () => {
    if (networkStatus === 'Online') setNetworkStatus('2G');
    else if (networkStatus === '2G') setNetworkStatus('Offline');
    else setNetworkStatus('Online');
  };

  return (
    <div
      data-testid="global-ticker"
      className={`${
        isEmergency ? 'bg-[#101A3A] border-[#D32F2F]/50' : 'bg-[#101A3A] border-[#24335c]'
      } text-white h-10 px-3 sm:px-6 flex items-center justify-between text-xs sm:text-sm font-medium border-b select-none z-40 sticky top-0`}
      role="region"
      aria-label="Live Emergency Alert Ticker"
    >
      {/* Left: Mode-aware indicator */}
      <div className="flex items-center gap-2 flex-shrink-0 pr-3 border-r border-[#24335c]">
        {isEmergency ? (
          <>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D32F2F] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#D32F2F]"></span>
            </span>
            <span className="font-bold tracking-wider text-xs uppercase text-red-400">
              LIVE CRITICAL
            </span>
          </>
        ) : (
          <>
            <span className="inline-flex rounded-full h-2.5 w-2.5 bg-blue-400"></span>
            <span className="font-bold tracking-wider text-xs uppercase text-blue-300">
              DAILY UPDATES
            </span>
          </>
        )}
      </div>

      {/* Middle: Scrolling Ticker */}
      <div className="overflow-hidden whitespace-nowrap flex-1 mx-3 sm:mx-6 cursor-pointer relative">
        <div
          className={`flex items-center gap-8 ${isPaused ? '' : 'animate-marquee'}`}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* In Emergency mode, lead with Critical Incidents first, then Alerts */}
          {isEmergency &&
            recentUpdates.map((u) => (
              <button
                key={u.id}
                onClick={() => handleAlertClick(u)}
                className="inline-flex items-center gap-2 hover:text-[#90b8ff] transition-colors focus:outline-none focus:underline cursor-pointer"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span className="font-bold text-white">{u.text}</span>
                <span className="text-white/50 text-[11px]">• {u.time}</span>
              </button>
            ))}

          {activeAlerts.map((a) => {
            const localizedMsg =
              language === 'te' && a.messageTe
                ? a.messageTe
                : language === 'hi' && a.messageHi
                ? a.messageHi
                : a.message;
            return (
              <button
                key={a.id}
                onClick={() => setActivePage('alerts')}
                className="inline-flex items-center gap-2 hover:text-[#90b8ff] transition-colors focus:outline-none focus:underline cursor-pointer"
              >
                <span
                  className={`inline-block w-2 h-2 rounded-full ${
                    isEmergency && a.severity === 'Warning'
                      ? 'bg-[#D32F2F]'
                      : 'bg-blue-400'
                  }`}
                />
                <span className="font-semibold text-white/90">
                  {a.type.toUpperCase()}: {localizedMsg}
                </span>
                <span className="text-white/50 text-[11px]">
                  • {a.issuedAt.split('•')[1] || 'Recent'}
                </span>
              </button>
            );
          })}

          {!isEmergency &&
            recentUpdates.map((u) => (
              <button
                key={u.id}
                onClick={() => handleAlertClick(u)}
                className="inline-flex items-center gap-2 hover:text-[#90b8ff] transition-colors focus:outline-none focus:underline cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-white/85">{u.text}</span>
                <span className="text-white/50 text-[11px]">• {u.time}</span>
              </button>
            ))}
        </div>
      </div>

      {/* Right: Network status & Pause/Play */}
      <div className="flex items-center gap-2 flex-shrink-0 pl-3 border-l border-[#24335c]">
        <button
          data-testid="network-status-toggle"
          onClick={toggleNetwork}
          title="Click to toggle network state (Online / 2G / Offline)"
          className={`px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
            networkStatus === 'Online'
              ? 'bg-[#16834A]/30 text-green-300 border border-green-500/30'
              : networkStatus === '2G'
              ? 'bg-[#F2A900]/30 text-amber-300 border border-amber-500/30'
              : 'bg-[#D32F2F]/30 text-red-300 border border-red-500/30'
          }`}
        >
          {networkStatus === 'Offline' ? (
            <WifiOff className="w-3 h-3" />
          ) : (
            <Wifi className="w-3 h-3" />
          )}
          <span>{networkStatus}</span>
        </button>

        <button
          onClick={() => setIsPaused(!isPaused)}
          aria-label={isPaused ? 'Resume ticker scroll' : 'Pause ticker scroll'}
          className="text-white/70 hover:text-white p-1 rounded hover:bg-white/10 transition-colors cursor-pointer"
        >
          {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};
