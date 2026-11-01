import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { getSeverityColors } from '../utils/rules.ts';
import { getStatusLabelForMode, MODE_CONFIG } from '../utils/modeConfig.ts';
import { LeafletMap } from '../components/LeafletMap.tsx';
import { ModeImage } from '../components/ModeImage.tsx';
import { t } from '../utils/translations.ts';
import {
  AlertTriangle,
  ArrowRight,
  Camera,
  CheckCircle2,
  ChevronRight,
  CloudSun,
  Compass,
  Heart,
  LifeBuoy,
  MapPin,
  Navigation,
  Phone,
  Shield,
  Sparkles,
  Sun,
  Truck,
  Users,
  Wind,
  Zap,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const {
    setActivePage,
    setSelectedIncidentId,
    incidents,
    helpPoints,
    alerts,
    heroes,
    language,
    simpleWords,
    setIsAuthModalOpen,
    operatingMode,
    disasterName,
    modeSince,
    isFeatureOn,
    getContent,
    submitRoadClearFeedback,
  } = useApp();

  const isEmergency = operatingMode === 'emergency';
  const modeCfg = MODE_CONFIG[operatingMode];

  const [hoveredIncidentId, setHoveredIncidentId] = useState<string | null>(null);

  // Animated count-up effect
  const [counts, setCounts] = useState({
    reports: 0,
    critical: 0,
    crews: 0,
    cleared: 0,
  });

  const totalReportsCount = 1248 + incidents.length;
  const criticalCount = 86 + incidents.filter((i) => i.severity === 'Critical').length;
  const crewsCount = 112;
  const clearedCount = 1162 + incidents.filter((i) => i.status === 'Cleared').length;

  useEffect(() => {
    const duration = 600;
    const steps = 12;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setCounts({
        reports: Math.floor(progress * totalReportsCount),
        critical: Math.floor(progress * criticalCount),
        crews: Math.floor(progress * crewsCount),
        cleared: Math.floor(progress * clearedCount),
      });
      if (step >= steps) {
        clearInterval(timer);
        setCounts({
          reports: totalReportsCount,
          critical: criticalCount,
          crews: crewsCount,
          cleared: clearedCount,
        });
      }
    }, interval);

    return () => clearInterval(timer);
  }, [totalReportsCount, criticalCount, crewsCount, clearedCount]);

  // Top 5 priority open incidents
  const topOpenIncidents = incidents
    .filter((i) => i.status !== 'Cleared')
    .sort((a, b) => b.priority_score - a.priority_score)
    .slice(0, 5);

  // Recently cleared incidents (last 7 days — Daily mode feature)
  const recentlyClearedIncidents = incidents.filter((i) => i.status === 'Cleared').slice(0, 4);

  // Relief camps
  const reliefCamps = helpPoints.filter((hp) => hp.type === 'Shelter');

  // Section renderers configured from modeConfig (Section 14.1 & 14.6)
  const renderEmergencyContactsStrip = () => {
    if (!isFeatureOn('emergency_contacts')) return null;
    return (
      <section
        key="contacts"
        data-testid="home-section-contacts"
        className="bg-[#101A3A] text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-6"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 flex-shrink-0">
            <Phone className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-400 block">
              {t('emergencyNumbersTitle', language, simpleWords)}
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold tracking-tight">
              {t('vizagControlRoom', language, simpleWords)}:{' '}
              <a href="tel:18004250001" className="text-yellow-300 underline hover:text-yellow-200">
                1800-425-0001
              </a>
            </h3>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-start lg:justify-end">
          {[
            { label: t('police', language, simpleWords), num: '100', color: 'bg-blue-600/30 border-blue-400/30 text-blue-200' },
            { label: t('ambulance', language, simpleWords), num: '108', color: 'bg-red-600/30 border-red-400/30 text-red-200' },
            { label: t('fireRescue', language, simpleWords), num: '101', color: 'bg-amber-600/30 border-amber-400/30 text-amber-200' },
            { label: t('ndrfHelp', language, simpleWords), num: '112', color: 'bg-emerald-600/30 border-emerald-400/30 text-emerald-200' },
          ].map((item, i) => (
            <a
              key={i}
              href={`tel:${item.num}`}
              className={`px-4 py-2.5 rounded-xl border ${item.color} font-bold text-xs sm:text-sm flex items-center gap-2 hover:scale-105 transition-transform`}
            >
              <span>{item.label}:</span>
              <span className="text-base font-black text-white">{item.num}</span>
            </a>
          ))}
        </div>
      </section>
    );
  };

  const renderNearbyHelpAndTiles = () => (
    <section key="help" data-testid="home-section-help" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#101A3A] tracking-tight">
            {isEmergency ? 'Active Relief & Response Services' : 'Everyday Civic Services & Nearby Help'}
          </h2>
          <p className="text-xs sm:text-sm text-[#657187]">
            {isEmergency
              ? 'Fast access to relief camps, trauma ambulances, storm safety, and responder teams.'
              : 'Find standby shelters, medical clinics, preparedness checklists, and municipal teams.'}
          </p>
        </div>
        <button
          onClick={() => setActivePage('help')}
          className="text-xs sm:text-sm font-bold text-[#2457C5] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>{t('findHelpNearby', language, simpleWords)}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 4 Service Cards with Section 14.5 ModeImage thumbnails */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          {
            slot: 'tile_help' as const,
            title: t('nearbyReliefCampsCard', language, simpleWords),
            desc: t('nearbyReliefCampsDesc', language, simpleWords),
            icon: LifeBuoy,
            color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
            page: 'help',
            cta: t('checkCapacity', language, simpleWords),
          },
          {
            slot: 'tile_medical' as const,
            title: t('medicalHelpCard', language, simpleWords),
            desc: t('medicalHelpDesc', language, simpleWords),
            icon: Phone,
            color: 'text-red-600 bg-red-50 border-red-100',
            page: 'help',
            cta: t('getAssistance', language, simpleWords),
          },
          {
            slot: 'tile_precautions' as const,
            title: t('safetyPrecautionsCard', language, simpleWords),
            desc: t('safetyPrecautionsDesc', language, simpleWords),
            icon: Shield,
            color: 'text-amber-600 bg-amber-50 border-amber-100',
            page: 'precautions',
            cta: t('stayPrepared', language, simpleWords),
          },
          {
            slot: 'tile_heroes' as const,
            title: t('ourHeroesCard', language, simpleWords),
            desc: t('ourHeroesDesc', language, simpleWords),
            icon: Heart,
            color: 'text-blue-600 bg-blue-50 border-blue-100',
            page: 'heroes',
            cta: t('sendSalute', language, simpleWords),
          },
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <button
              key={idx}
              onClick={() => setActivePage(card.page)}
              className="group bg-white rounded-2xl overflow-hidden border border-[#E2E7F0] shadow-xs hover:shadow-xl hover:border-[#2457C5] transition-all text-left flex flex-col justify-between cursor-pointer"
            >
              <div>
                <ModeImage slot={card.slot} className="h-36 w-full" />
                <div className="p-5">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div
                      className={`w-8 h-8 rounded-xl border ${card.color} flex items-center justify-center shrink-0`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-extrabold text-[#101A3A] group-hover:text-[#2457C5] transition-colors">
                      {card.title}
                    </h3>
                  </div>
                  <p className="text-xs text-[#657187] leading-relaxed">{card.desc}</p>
                </div>
              </div>
              <div className="px-5 pb-4 flex items-center gap-1.5 text-xs font-bold text-[#2457C5]">
                <span>{card.cta}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );

  const renderLiveBlockedRoadsSection = () => (
    <section key="blockedRoads" data-testid="home-section-blockedRoads" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl font-black text-[#101A3A] tracking-tight">
            {isEmergency ? 'Live Blocked Roads (Top 5 Critical)' : t('priorityOpenIncidents', language, simpleWords)}
          </h2>
          <p className="text-xs sm:text-sm text-[#657187]">
            {t('priorityOpenSub', language, simpleWords)}
          </p>
        </div>
        <button
          onClick={() => setActivePage('queue')}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-[#2457C5] hover:underline cursor-pointer"
        >
          <span>{t('viewFullQueue', language, simpleWords)} ({incidents.length})</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {topOpenIncidents.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 space-y-3">
          <AlertTriangle
            className={`w-10 h-10 mx-auto ${isEmergency ? 'text-red-500' : 'text-slate-400'}`}
          />
          <p className="text-sm font-extrabold text-[#101A3A]">
            {getContent('empty_reports_text')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Top 5 List */}
          <div className="lg:col-span-7 space-y-3">
            {topOpenIncidents.map((inc) => {
              const colors = getSeverityColors(inc.severity);
              return (
                <div
                  key={inc.id}
                  onMouseEnter={() => setHoveredIncidentId(inc.id)}
                  onMouseLeave={() => setHoveredIncidentId(null)}
                  className={`w-full text-left bg-white rounded-2xl p-4 sm:p-5 border transition-all flex flex-col gap-3 ${
                    hoveredIncidentId === inc.id
                      ? 'border-[#2457C5] shadow-md ring-2 ring-[#2457C5]/10'
                      : 'border-[#E2E7F0] hover:border-[#2457C5]/50 shadow-xs'
                  }`}
                >
                  <div
                    onClick={() => setSelectedIncidentId(inc.id)}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-2xl ${colors.bg} ${colors.border} border flex flex-col items-center justify-center flex-shrink-0`}
                      >
                        <span className={`text-sm font-black ${colors.text}`}>
                          {inc.priority_score.toFixed(1)}
                        </span>
                        <span className="text-[9px] font-bold uppercase text-slate-400">
                          {t('scoreLabel', language, simpleWords)}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-extrabold text-base text-[#101A3A]">
                            {inc.location}
                          </span>
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}
                          >
                            {t(inc.severity.toLowerCase(), language, simpleWords)}
                          </span>
                          {inc.hazard === 'live_electrical_wire' && (
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 flex items-center gap-1">
                              <Zap className="w-3 h-3" /> {t('liveWireBadge', language, simpleWords)}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-[#657187] line-clamp-1">
                          {inc.note || `${t(inc.obstruction, language, simpleWords)} • ${inc.roadType}`}
                        </p>

                        <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-400 pt-0.5">
                          <span>{inc.zone.split('(')[0]}</span>
                          <span>•</span>
                          <span>{inc.createdAt}</span>
                          <span>•</span>
                          <span className="text-[#2457C5]">
                            {getStatusLabelForMode(inc.status, operatingMode, language)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <span className="text-xs font-bold text-[#2457C5] bg-[#EAF0FF] px-3 py-1.5 rounded-lg">
                        {t('inspectBtn', language, simpleWords)}
                      </span>
                    </div>
                  </div>

                  {/* Section 14.4: Citizen "Is this road clear?" feedback in Emergency Mode */}
                  {isFeatureOn('citizen_road_clear_feedback') && (
                    <div className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="font-bold text-slate-600">
                        Citizen check: Is this road clear right now?
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => submitRoadClearFeedback(inc.id, true)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-[11px] cursor-pointer"
                        >
                          Yes, road is clear
                        </button>
                        <button
                          type="button"
                          onClick={() => submitRoadClearFeedback(inc.id, false)}
                          className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-[11px] cursor-pointer"
                        >
                          Still blocked
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right: Interactive Mini Map Preview */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-3 border border-[#E2E7F0] shadow-xs sticky top-24">
            <div className="flex items-center justify-between px-2 pb-2.5">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isEmergency ? 'bg-red-600 animate-ping' : 'bg-green-500 animate-pulse'
                  }`}
                />
                <span className="text-xs font-extrabold text-[#101A3A] uppercase tracking-wider">
                  {t('liveVizagHazardRadar', language, simpleWords)}
                </span>
              </div>
              <button
                onClick={() => setActivePage('map')}
                className="text-xs font-bold text-[#2457C5] hover:underline cursor-pointer"
              >
                {t('expandMap', language, simpleWords)} →
              </button>
            </div>
            <div
              className={`h-[380px] rounded-xl overflow-hidden border ${
                isEmergency ? 'border-red-300 contrast-125' : 'border-slate-200'
              }`}
            >
              <LeafletMap
                incidents={incidents.filter((i) => i.status !== 'Cleared' && i.pinnedToMap !== false)}
                selectedId={hoveredIncidentId}
                onSelectIncident={(id) => setSelectedIncidentId(id)}
                height="380px"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );

  const renderReliefCampsSection = () => {
    if (!isFeatureOn('live_relief_camp_capacity')) return null;
    return (
      <section
        key="reliefCamps"
        data-testid="home-section-reliefCamps"
        className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-[#101A3A]">
              Nearby Relief Camps (Live Bed Capacity)
            </h2>
            <p className="text-xs text-slate-500">
              Verified municipal shelters with food, drinking water, and medical teams.
            </p>
          </div>
          <button
            onClick={() => setActivePage('help')}
            className="text-xs font-bold text-[#2457C5] hover:underline cursor-pointer"
          >
            All Shelters →
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reliefCamps.slice(0, 3).map((camp) => (
            <div
              key={camp.id}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-3"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                    {camp.status}
                  </span>
                  <span className="text-xs font-extrabold text-emerald-700">
                    {camp.capacityFree} beds free
                  </span>
                </div>
                <h3 className="text-sm font-extrabold text-[#101A3A] mt-1.5">{camp.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{camp.address}</p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200/70">
                <a
                  href={`tel:${camp.phone}`}
                  className="text-xs font-bold text-[#2457C5] hover:underline"
                >
                  Call {camp.phone}
                </a>
                <button
                  onClick={() => setActivePage('help')}
                  className="text-xs font-bold text-slate-700 hover:text-[#2457C5] cursor-pointer"
                >
                  Directions →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderRecentlyClearedSection = () => {
    if (!isFeatureOn('recently_cleared_list')) return null;
    return (
      <section
        key="clearances"
        data-testid="home-section-clearances"
        className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-[#101A3A]">
              Recently Cleared Roads (Last 7 Days)
            </h2>
            <p className="text-xs text-slate-500">
              Everyday road obstructions resolved by GVMC municipal squads.
            </p>
          </div>
          <button
            onClick={() => setActivePage('queue')}
            className="text-xs font-bold text-[#2457C5] hover:underline cursor-pointer"
          >
            View Queue →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentlyClearedIncidents.map((inc) => (
            <div
              key={inc.id}
              onClick={() => setSelectedIncidentId(inc.id)}
              className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200 hover:shadow-md transition-all cursor-pointer space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Cleared
                </span>
                <span className="text-[11px] font-semibold text-slate-500">{inc.updatedAt}</span>
              </div>
              <h3 className="text-sm font-extrabold text-[#101A3A]">{inc.location}</h3>
              <p className="text-xs text-slate-600 line-clamp-2">{inc.note}</p>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderWeatherAndAlertsSection = () => (
    <section
      key="alerts"
      data-testid="home-section-alerts"
      className="grid grid-cols-1 lg:grid-cols-12 gap-6"
    >
      {/* Left: Weather Widget (Daily) OR Active Warning Card (Emergency) per Section 14.4 */}
      <div className="lg:col-span-5">
        {isFeatureOn('active_warning_card') ? (
          <div
            data-testid="active-warning-card"
            className="h-full bg-red-50 border-2 border-[#D32F2F] rounded-3xl p-6 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D32F2F] text-white text-xs font-black uppercase">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Active Cyclone Warning</span>
              </div>
              <h3 className="text-xl font-black text-red-950">{disasterName}</h3>
              <p className="text-xs sm:text-sm text-red-900 font-medium leading-relaxed">
                Gale-force squalls (75–90 km/h) and heavy coastal rainfall active along RK Beach, Bheemili, and Maddilapalem corridors. Avoid coastal roads and downed wires.
              </p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-red-200 text-xs font-bold text-red-900">
              <span>Active since {modeSince}</span>
              <button
                onClick={() => setActivePage('alerts')}
                className="px-3 py-1.5 bg-[#D32F2F] text-white rounded-xl font-extrabold cursor-pointer"
              >
                Full Bulletins →
              </button>
            </div>
          </div>
        ) : isFeatureOn('weather_widget') ? (
          <div
            data-testid="daily-weather-widget"
            className="h-full bg-gradient-to-br from-blue-50 to-sky-100 border border-blue-200 rounded-3xl p-6 flex flex-col justify-between space-y-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-extrabold uppercase text-[#2457C5] tracking-wider">
                  Visakhapatnam Coastal Weather
                </span>
                <h3 className="text-2xl font-black text-[#101A3A] mt-1">29°C • Partly Sunny</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white text-[#2457C5] flex items-center justify-center shadow-xs">
                <CloudSun className="w-7 h-7" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs bg-white/80 p-3 rounded-2xl border border-blue-100">
              <div>
                <span className="text-slate-400 block text-[10px] font-bold">WIND</span>
                <strong className="text-slate-800">14 km/h E</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold">HUMIDITY</span>
                <strong className="text-slate-800">72%</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold">SEA STATE</span>
                <strong className="text-emerald-700">Calm / Normal</strong>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Right: Alerts Feed (Blue info style in Daily, Red warning style in Emergency — Section 14.5) */}
      <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-[#101A3A]">
            {isEmergency ? 'Active Emergency Bulletins' : 'Municipal Advisories & Updates'}
          </h3>
          <button
            onClick={() => setActivePage('alerts')}
            className="text-xs font-bold text-[#2457C5] hover:underline cursor-pointer"
          >
            View All →
          </button>
        </div>
        <div className="space-y-2.5">
          {alerts
            .filter((a) => a.active)
            .slice(0, 3)
            .map((a) => (
              <div
                key={a.id}
                className={`p-3.5 rounded-2xl border flex items-start gap-3 ${
                  isEmergency
                    ? 'bg-red-50/70 border-red-200 text-red-950'
                    : 'bg-blue-50/60 border-blue-200 text-slate-800'
                }`}
              >
                <AlertTriangle
                  className={`w-4 h-4 shrink-0 mt-0.5 ${
                    isEmergency ? 'text-[#D32F2F]' : 'text-[#2457C5]'
                  }`}
                />
                <div className="text-xs space-y-0.5">
                  <div className="font-extrabold">{a.message}</div>
                  <div className="text-[11px] opacity-75">
                    {a.area} • {a.issuedAt}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );

  const renderPrecautionsSection = () => (
    <section
      key="precautions"
      data-testid="home-section-precautions"
      className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6"
    >
      <div className="space-y-2 max-w-xl">
        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
            isEmergency ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-[#2457C5]'
          }`}
        >
          {isEmergency ? 'During-Cyclone Safety Protocol' : 'Before-Cyclone Preparedness Checklist'}
        </span>
        <h3 className="text-xl font-black text-[#101A3A]">
          {isEmergency
            ? 'Stay Indoors, Avoid Snapped Wires & Use Safe Evacuation Routes'
            : 'Keep Your Household Emergency Kit & Readiness Checklist Ready'}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600">
          {isEmergency
            ? 'Check verified safe evacuation corridors and indoor shelter rules during active squalls.'
            : 'Review the 3-day water, torch, power bank, and first-aid preparedness checklist.'}
        </p>
      </div>
      <button
        onClick={() => setActivePage('precautions')}
        className="px-5 py-3 bg-[#2457C5] hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-extrabold shrink-0 cursor-pointer"
      >
        {isEmergency ? 'Open During-Cyclone Guide →' : 'Open Preparedness Checklist →'}
      </button>
    </section>
  );

  const renderHeroesSection = () => {
    if (!isFeatureOn('our_heroes')) return null;
    return (
      <section
        key="heroes"
        data-testid="home-section-heroes"
        className="bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div className="space-y-1">
          <span className="text-xs font-extrabold uppercase text-yellow-300">
            Our Heroes ({heroes.length} Responders)
          </span>
          <h3 className="text-lg sm:text-xl font-black">{getContent('heroes_banner_text')}</h3>
        </div>
        <button
          onClick={() => setActivePage('heroes')}
          className="px-5 py-2.5 bg-white text-[#101A3A] hover:bg-blue-50 rounded-xl text-xs font-black shrink-0 cursor-pointer"
        >
          {t('sendSalute', language, simpleWords)} →
        </button>
      </section>
    );
  };

  const renderWorkflowSection = () => (
    <section
      key="workflow"
      data-testid="home-section-workflow"
      className="bg-slate-50 rounded-3xl p-8 border border-[#E2E7F0]"
    >
      <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
        <span className="text-xs font-extrabold uppercase tracking-wider text-[#2457C5] bg-blue-100 px-3 py-1 rounded-full">
          {t('civicWorkflowBadge', language, simpleWords)}
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-[#101A3A]">
          {t('howWorksTitle', language, simpleWords)}
        </h2>
        <p className="text-xs sm:text-sm text-[#657187]">
          {t('howWorksSub', language, simpleWords)}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            step: '01',
            title: t('step1Title', language, simpleWords),
            desc: t('step1Desc', language, simpleWords),
          },
          {
            step: '02',
            title: t('step2Title', language, simpleWords),
            desc: t('step2Desc', language, simpleWords),
          },
          {
            step: '03',
            title: t('step3Title', language, simpleWords),
            desc: t('step3Desc', language, simpleWords),
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-6 border border-[#E2E7F0] shadow-xs relative"
          >
            <span className="text-4xl font-black text-[#2457C5]/15 absolute top-4 right-5 select-none">
              {item.step}
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#EAF0FF] text-[#2457C5] font-black text-sm flex items-center justify-center mb-4">
              {item.step}
            </div>
            <h3 className="text-lg font-extrabold text-[#101A3A] mb-2">{item.title}</h3>
            <p className="text-xs sm:text-sm text-[#657187] leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );

  const sectionRenderMap: Record<string, () => React.ReactNode> = {
    contacts: renderEmergencyContactsStrip,
    blockedRoads: renderLiveBlockedRoadsSection,
    reliefCamps: renderReliefCampsSection,
    help: renderNearbyHelpAndTiles,
    precautions: renderPrecautionsSection,
    clearances: renderRecentlyClearedSection,
    alerts: renderWeatherAndAlertsSection,
    heroes: renderHeroesSection,
    workflow: renderWorkflowSection,
  };

  return (
    <div className="space-y-10" data-testid={`home-page-${operatingMode}`}>
      {/* 1. HERO SECTION (Section 14.5 & 14.6: Daily soft white fade + navy text vs Emergency stronger white fade + red top border) */}
      <section
        data-testid="home-hero-section"
        className={`relative rounded-3xl overflow-hidden shadow-xl border ${modeCfg.heroBorderClass} min-h-[480px] flex items-center bg-slate-100`}
      >
        <ModeImage
          slot="home_hero"
          priority
          showCreditBadge
          className="absolute inset-0 w-full h-full"
        />

        {/* Section 14.5: Soft white fade in Daily vs Slightly stronger white fade in Emergency, navy text */}
        <div
          className={`absolute inset-0 bg-gradient-to-r ${modeCfg.heroOverlayClass} lg:w-4/5 pointer-events-none`}
        />

        {/* Content Container */}
        <div className="relative z-10 max-w-[1440px] mx-auto w-full px-6 py-10 lg:py-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-5 text-[#101A3A]">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold tracking-wide uppercase ${
                isEmergency
                  ? 'bg-red-100 border border-red-300 text-[#D32F2F]'
                  : 'bg-blue-100 border border-blue-200 text-[#2457C5]'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isEmergency ? 'bg-[#D32F2F] animate-ping' : 'bg-[#2457C5]'
                }`}
              />
              <span>{getContent('global_pill')} • {t('vizagResponseBadge', language, simpleWords)}</span>
            </div>

            <h1
              data-testid="home-hero-headline"
              className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] max-w-xl text-[#101A3A]"
            >
              {getContent('hero_headline')}
            </h1>

            <p
              data-testid="home-hero-subline"
              className="text-base sm:text-lg text-slate-700 font-semibold max-w-lg leading-relaxed"
            >
              {getContent('hero_subline')}
            </p>

            {/* Primary & Secondary Action Buttons + Optional Urgent One-Tap Shortcut (Section 14.4 & 14.6) */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                data-testid="home-primary-cta"
                onClick={() => setActivePage('report')}
                className="flex items-center justify-center gap-2 bg-[#D32F2F] hover:bg-[#b71c1c] active:scale-[0.98] text-white px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                <AlertTriangle className="w-5 h-5" />
                <span>{getContent('primary_cta')}</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </button>

              <button
                data-testid="home-secondary-cta"
                onClick={() => setActivePage('help')}
                className="flex items-center justify-center gap-2 bg-white hover:bg-blue-50 text-[#2457C5] border-2 border-[#2457C5] active:scale-[0.98] px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base shadow-sm transition-all cursor-pointer"
              >
                <MapPin className="w-5 h-5 text-[#2457C5]" />
                <span>{getContent('secondary_cta')}</span>
              </button>

              {isFeatureOn('urgent_one_tap_report') && (
                <button
                  type="button"
                  data-testid="urgent-one-tap-shortcut-btn"
                  onClick={() => setActivePage('report')}
                  className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-yellow-300 px-4 py-3.5 rounded-xl font-extrabold text-xs sm:text-sm shadow-md cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>1-Tap Camera + GPS Report</span>
                </button>
              )}
            </div>

            {/* Three Trust Points */}
            <div className="flex flex-wrap items-center gap-5 pt-2 text-xs sm:text-sm font-bold text-slate-700">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{t('worksOffline', language, simpleWords)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{t('multilingual', language, simpleWords)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{t('aiSorted', language, simpleWords)}</span>
              </div>
            </div>
          </div>

          {/* Right Quick-Access Card */}
          <div className="lg:col-span-5">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-lg font-extrabold text-[#101A3A]">
                    {t('quickAccessTitle', language, simpleWords)}
                  </h2>
                  <p className="text-xs text-[#657187]">
                    {t('quickAccessSub', language, simpleWords)}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-[#2457C5]">
                  {t('directBadge', language, simpleWords)}
                </span>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    label: t('emergencyContacts112', language, simpleWords),
                    sub: t('emergencyContactsSub', language, simpleWords),
                    icon: Phone,
                    color: 'text-red-600 bg-red-50',
                    onClick: () => setActivePage('contacts'),
                  },
                  {
                    label: t('liveOperationalMap', language, simpleWords),
                    sub: `${incidents.filter((i) => i.status !== 'Cleared').length} ${t('activeHazardsPinned', language, simpleWords)}`,
                    icon: Compass,
                    color: 'text-[#2457C5] bg-blue-50',
                    onClick: () => setActivePage('map'),
                  },
                  {
                    label: t('reliefCampsFreeBeds', language, simpleWords),
                    sub: t('verifiedSheltersFood', language, simpleWords),
                    icon: LifeBuoy,
                    color: 'text-emerald-600 bg-emerald-50',
                    onClick: () => setActivePage('help'),
                  },
                  {
                    label: t('staffSignInRoles', language, simpleWords),
                    sub: t('fieldCommandAdminAccess', language, simpleWords),
                    icon: Users,
                    color: 'text-purple-600 bg-purple-50',
                    onClick: () => setIsAuthModalOpen(true),
                  },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={item.onClick}
                      className="w-full flex items-center justify-between gap-2 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div
                          className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-bold text-[#182338] group-hover:text-[#2457C5] transition-colors truncate">
                            {item.label}
                          </div>
                          <div className="text-xs text-[#657187] truncate">{item.sub}</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#2457C5] group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FOUR LIVE METRIC CARDS */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#E2E7F0] shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-[#657187]">
            {t('totalReportsMetric', language, simpleWords)}
          </span>
          <div className="text-2xl sm:text-3xl font-black text-[#101A3A] mt-1">
            {counts.reports.toLocaleString()}
          </div>
          <p className="text-xs text-[#657187] mt-1">
            {t('acrossZones', language, simpleWords)}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-red-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-[#D32F2F]">
            {t('criticalHazardsMetric', language, simpleWords)}
          </span>
          <div className="text-2xl sm:text-3xl font-black text-[#D32F2F] mt-1">
            {counts.critical}
          </div>
          <p className="text-xs text-[#657187] mt-1">
            {t('liveWiresHospitalBlocks', language, simpleWords)}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E2E7F0] shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-[#657187]">
            {t('responseCrewsMetric', language, simpleWords)}
          </span>
          <div className="text-2xl sm:text-3xl font-black text-[#2457C5] mt-1">
            {counts.crews}
          </div>
          <p className="text-xs text-[#657187] mt-1">
            {t('activeTeams', language, simpleWords)}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-emerald-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-[#16834A]">
            {t('hazardsClearedMetric', language, simpleWords)}
          </span>
          <div className="text-2xl sm:text-3xl font-black text-[#16834A] mt-1">
            {counts.cleared.toLocaleString()}
          </div>
          <p className="text-xs text-[#657187] mt-1">
            {t('restoredEmergencyRoutes', language, simpleWords)}
          </p>
        </div>
      </section>

      {/* 3. DYNAMIC SECTION ORDER CONFIGURED BY MODE (Section 14.1 & 14.6) */}
      <div className="space-y-10" data-testid="home-ordered-sections">
        {modeCfg.homeSectionOrder.map((secKey) => {
          const fn = sectionRenderMap[secKey];
          return fn ? fn() : null;
        })}
      </div>
    </div>
  );
};
