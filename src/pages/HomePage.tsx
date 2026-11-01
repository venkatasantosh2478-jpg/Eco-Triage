import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { getSeverityColors } from '../utils/rules.ts';
import { LeafletMap } from '../components/LeafletMap.tsx';
import { t } from '../utils/translations.ts';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Compass,
  FileText,
  Heart,
  LifeBuoy,
  MapPin,
  Phone,
  Shield,
  Sparkles,
  Truck,
  Users,
  Wifi,
  Zap,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const {
    setActivePage,
    setSelectedIncidentId,
    incidents,
    networkStatus,
    setLanguage,
    language,
    simpleWords,
    setIsAuthModalOpen,
  } = useApp();

  // Highlight hovered incident on mini map
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
    const duration = 1200;
    const steps = 24;
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

  // 5 highest-priority open incidents
  const topIncidents = incidents
    .filter((i) => i.status !== 'Cleared')
    .sort((a, b) => b.priority_score - a.priority_score)
    .slice(0, 5);

  return (
    <div className="space-y-12">
      {/* 1. HERO SECTION */}
      <section className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 min-h-[500px] flex items-center bg-slate-900">
        {/* Background photo of municipal clearance squad from attachment */}
        <img
          src="/assets/aistudio/Gemini_Generated_Image_ubc9rmubc9rmubc9_a09387d6.png"
          alt="Municipal clearance crew removing fallen tree on coastal road in Visakhapatnam after storm"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-85"
        />

        {/* Soft white-to-transparent fade on left to guarantee text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/80 to-transparent lg:w-3/4" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent lg:hidden" />

        {/* Content Container */}
        <div className="relative z-10 max-w-[1440px] mx-auto w-full px-6 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span>{t('vizagResponseBadge', language, simpleWords)}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] max-w-xl">
              {t('homeHeadline', language, simpleWords)}
            </h1>

            <p className="text-base sm:text-lg text-slate-200 font-medium max-w-lg leading-relaxed">
              {t('homeSubline', language, simpleWords)}
            </p>

            {/* Two Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                onClick={() => setActivePage('report')}
                className="flex items-center justify-center gap-2.5 bg-[#D32F2F] hover:bg-[#b71c1c] active:scale-[0.98] text-white px-6 py-3.5 rounded-xl font-bold text-base shadow-lg hover:shadow-xl transition-all"
              >
                <AlertTriangle className="w-5 h-5" />
                <span>{t('reportHazard', language, simpleWords)}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={() => setActivePage('help')}
                className="flex items-center justify-center gap-2.5 bg-white/95 hover:bg-white text-[#2457C5] border border-[#2457C5] active:scale-[0.98] px-6 py-3.5 rounded-xl font-bold text-base shadow-md hover:shadow-lg transition-all"
              >
                <MapPin className="w-5 h-5 text-[#2457C5]" />
                <span>{t('findHelpNearby', language, simpleWords)}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>

            {/* Three Trust Points */}
            <div className="flex flex-wrap items-center gap-6 pt-3 text-xs sm:text-sm font-semibold text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span>{t('worksOffline', language, simpleWords)}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span>{t('multilingual', language, simpleWords)}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span>{t('priorityAi', language, simpleWords)}</span>
              </div>
            </div>
          </div>

          {/* Right Floating Card: "Quick Access. Real Help." */}
          <div className="lg:col-span-5 flex justify-end">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-2xl border border-white/40 w-full max-w-sm text-slate-800">
              <div className="pb-3 border-b border-slate-100 mb-3 flex items-center justify-between">
                <h3 className="font-extrabold text-base text-[#101A3A] tracking-tight">
                  {t('quickAccessTitle', language, simpleWords)}
                </h3>
                <span className="text-[10px] font-bold uppercase bg-blue-100 text-[#2457C5] px-2 py-0.5 rounded-full">
                  {t('directBadge', language, simpleWords)}
                </span>
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => setActivePage('contacts')}
                  className="w-full p-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-700 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Phone className="w-4 h-4" />
                    </div>
                    <span>{t('quickEmergencyContacts', language, simpleWords)}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  onClick={() => setActivePage('map')}
                  className="w-full p-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-700 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2457C5] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Compass className="w-4 h-4" />
                    </div>
                    <span>{t('quickLiveMap', language, simpleWords)}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  onClick={() => setActivePage('help')}
                  className="w-full p-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-700 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-50 text-green-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <LifeBuoy className="w-4 h-4" />
                    </div>
                    <span>{t('quickReliefCamps', language, simpleWords)}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  onClick={() => setActivePage('alerts')}
                  className="w-full p-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-700 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <span>{t('quickAlerts', language, simpleWords)}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="w-full p-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-700 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Users className="w-4 h-4" />
                    </div>
                    <span>{t('quickStaffSignIn', language, simpleWords)}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. OVERLAPPING FOUR SERVICE CARDS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 -mt-6 sm:-mt-10 relative z-20">
        {/* Nearby Relief Camps */}
        <div
          onClick={() => setActivePage('help')}
          className="bg-white rounded-2xl p-5 border border-[#E2E7F0] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-green-50 text-green-700 flex items-center justify-center mb-3 group-hover:bg-green-600 group-hover:text-white transition-colors">
            <LifeBuoy className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-sm text-[#101A3A] group-hover:text-[#2457C5] transition-colors">
            {t('cardReliefTitle', language, simpleWords)}
          </h3>
          <p className="text-xs text-slate-500 mt-1 mb-3">
            {t('cardReliefDesc', language, simpleWords)}
          </p>
          <div className="flex items-center text-xs font-bold text-green-700 group-hover:translate-x-1 transition-transform">
            <span>{t('cardReliefAction', language, simpleWords)}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </div>

        {/* Medical Help */}
        <div
          onClick={() => setActivePage('help')}
          className="bg-white rounded-2xl p-5 border border-[#E2E7F0] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-3 group-hover:bg-red-600 group-hover:text-white transition-colors">
            <Phone className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-sm text-[#101A3A] group-hover:text-[#2457C5] transition-colors">
            {t('cardMedicalTitle', language, simpleWords)}
          </h3>
          <p className="text-xs text-slate-500 mt-1 mb-3">
            {t('cardMedicalDesc', language, simpleWords)}
          </p>
          <div className="flex items-center text-xs font-bold text-red-600 group-hover:translate-x-1 transition-transform">
            <span>{t('cardMedicalAction', language, simpleWords)}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </div>

        {/* Safety Precautions */}
        <div
          onClick={() => setActivePage('precautions')}
          className="bg-white rounded-2xl p-5 border border-[#E2E7F0] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3 group-hover:bg-amber-600 group-hover:text-white transition-colors">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-sm text-[#101A3A] group-hover:text-[#2457C5] transition-colors">
            {t('cardPrecautionsTitle', language, simpleWords)}
          </h3>
          <p className="text-xs text-slate-500 mt-1 mb-3">
            {t('cardPrecautionsDesc', language, simpleWords)}
          </p>
          <div className="flex items-center text-xs font-bold text-amber-700 group-hover:translate-x-1 transition-transform">
            <span>{t('cardPrecautionsAction', language, simpleWords)}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </div>

        {/* Our Heroes */}
        <div
          onClick={() => setActivePage('heroes')}
          className="bg-white rounded-2xl p-5 border border-[#E2E7F0] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2457C5] flex items-center justify-center mb-3 group-hover:bg-[#2457C5] group-hover:text-white transition-colors">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-sm text-[#101A3A] group-hover:text-[#2457C5] transition-colors">
            {t('cardHeroesTitle', language, simpleWords)}
          </h3>
          <p className="text-xs text-slate-500 mt-1 mb-3">
            {t('cardHeroesDesc', language, simpleWords)}
          </p>
          <div className="flex items-center text-xs font-bold text-[#2457C5] group-hover:translate-x-1 transition-transform">
            <span>{t('cardHeroesAction', language, simpleWords)}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </div>
      </section>

      {/* 3. FOUR LIVE STATISTIC CARDS WITH SPARKLINES */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Reports */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2E7F0] shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-bold uppercase tracking-wider text-[11px]">
              {t('statTotalReports', language, simpleWords)}
            </span>
            <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full">↑ 12%</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-[#101A3A]">
              {counts.reports.toLocaleString()}
            </span>
            {/* SVG Sparkline */}
            <svg className="w-20 h-7 text-blue-500" viewBox="0 0 100 30" fill="none">
              <path
                d="M0 25 Q20 20 40 18 T80 8 T100 5"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {t('statSampleActive', language, simpleWords)}
          </span>
        </div>

        {/* Critical Hazards */}
        <div className="bg-white p-5 rounded-2xl border border-red-200 bg-red-50/20 shadow-xs">
          <div className="flex items-center justify-between text-xs text-red-600 mb-1">
            <span className="font-bold uppercase tracking-wider text-[11px]">
              {t('statCriticalHazards', language, simpleWords)}
            </span>
            <span className="text-red-700 font-bold bg-red-100 px-2 py-0.5 rounded-full">↑ 5%</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-[#D32F2F]">
              {counts.critical.toLocaleString()}
            </span>
            <svg className="w-20 h-7 text-red-500" viewBox="0 0 100 30" fill="none">
              <path
                d="M0 20 Q30 25 50 10 T80 5 T100 2"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="text-[11px] text-red-500/80 mt-1 block">
            {t('statCriticalSub', language, simpleWords)}
          </span>
        </div>

        {/* Response Crews */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2E7F0] shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-bold uppercase tracking-wider text-[11px]">
              {t('statResponseCrews', language, simpleWords)}
            </span>
            <span className="text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full">↑ 8%</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-[#101A3A]">
              {counts.crews.toLocaleString()}
            </span>
            <svg className="w-20 h-7 text-[#2457C5]" viewBox="0 0 100 30" fill="none">
              <path
                d="M0 22 Q25 24 50 15 T75 12 T100 7"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {t('statCrewsSub', language, simpleWords)}
          </span>
        </div>

        {/* Hazards Cleared */}
        <div className="bg-white p-5 rounded-2xl border border-green-200 bg-green-50/20 shadow-xs">
          <div className="flex items-center justify-between text-xs text-green-700 mb-1">
            <span className="font-bold uppercase tracking-wider text-[11px]">
              {t('statHazardsCleared', language, simpleWords)}
            </span>
            <span className="text-green-800 font-bold bg-green-100 px-2 py-0.5 rounded-full">↑ 15%</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-[#16834A]">
              {counts.cleared.toLocaleString()}
            </span>
            <svg className="w-20 h-7 text-green-600" viewBox="0 0 100 30" fill="none">
              <path
                d="M0 26 Q30 18 55 12 T85 6 T100 2"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="text-[11px] text-green-700/80 mt-1 block">
            {t('statClearedSub', language, simpleWords)}
          </span>
        </div>
      </section>

      {/* 4. EMERGENCY RED STRIP */}
      <section className="bg-[#FFF1F0] border-l-4 border-[#D32F2F] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#D32F2F] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
            <Zap className="w-5 h-5 text-yellow-300" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm sm:text-base text-[#101A3A]">
              {t('emergencyStripHeading', language, simpleWords)}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              {t('emergencyStripBody', language, simpleWords)}
            </p>
          </div>
        </div>

        <button
          onClick={() => setActivePage('report')}
          className="w-full sm:w-auto flex-shrink-0 bg-[#D32F2F] hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow hover:shadow-md transition-all active:scale-95"
        >
          {t('reportNow', language, simpleWords)}
        </button>
      </section>

      {/* 5. LATEST INCIDENTS WITH MINI MAP */}
      <section className="bg-white rounded-3xl p-6 border border-[#E2E7F0] shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div>
            <h2 className="text-xl font-extrabold text-[#101A3A] tracking-tight">
              {t('priorityIncidentsTitle', language, simpleWords)}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t('priorityIncidentsSub', language, simpleWords)}
            </p>
          </div>
          <button
            onClick={() => setActivePage('queue')}
            className="text-xs font-bold text-[#2457C5] hover:underline flex items-center gap-1"
          >
            <span>{t('viewFullQueue', language, simpleWords)}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: 5 Rows */}
          <div className="lg:col-span-7 space-y-2.5">
            {topIncidents.map((inc) => {
              const colors = getSeverityColors(inc.severity);
              const isHovered = hoveredIncidentId === inc.id;

              return (
                <div
                  key={inc.id}
                  onMouseEnter={() => setHoveredIncidentId(inc.id)}
                  onMouseLeave={() => setHoveredIncidentId(null)}
                  onClick={() => setSelectedIncidentId(inc.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isHovered
                      ? 'border-[#2457C5] bg-blue-50/40 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Severity colored bar */}
                    <div className={`w-1.5 h-10 rounded-full flex-shrink-0 ${colors.dot}`} />

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <strong className="text-sm font-extrabold text-[#101A3A] truncate">
                          {inc.location}
                        </strong>
                        {inc.hazard === 'live_electrical_wire' && (
                          <span className="p-0.5 bg-red-100 text-red-600 rounded" title="Live Wire Hazard">
                            <Zap className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>{inc.roadType}</span>
                        <span>•</span>
                        <span>{inc.createdAt}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    {/* Score */}
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block text-[10px] uppercase font-bold">
                        {t('scoreLabel', language, simpleWords)}
                      </span>
                      <span className="text-base font-black text-[#101A3A]">
                        {inc.priority_score.toFixed(1)}
                      </span>
                    </div>

                    {/* Status Pill */}
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${colors.bg} ${colors.text} ${colors.border}`}
                    >
                      {t(inc.status, language, simpleWords)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Leaflet Map Preview */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-4 border border-slate-200 relative flex flex-col justify-between overflow-hidden space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#101A3A] flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#2457C5]" />
                <span>{t('liveCorridorMap', language, simpleWords)}</span>
              </span>
              <button
                onClick={() => setActivePage('map')}
                className="text-xs font-bold text-[#2457C5] hover:underline flex items-center gap-1"
              >
                <span>{t('fullMap', language, simpleWords)}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <LeafletMap
              incidents={topIncidents}
              selectedId={hoveredIncidentId}
              onSelectIncident={(id) => {
                setSelectedIncidentId(id);
                setActivePage('map');
              }}
              height="280px"
              showHelpPoints={true}
            />

            <div className="text-[11px] font-medium text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-200 text-center">
              {t('mapClickHint', language, simpleWords)}
            </div>
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS (3 steps joined by thin blue line) */}
      <section className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#2457C5]">
            {t('workflowBadge', language, simpleWords)}
          </span>
          <h2 className="text-2xl font-black text-[#101A3A] tracking-tight mt-1">
            {t('howItWorksTitle', language, simpleWords)}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t('howItWorksSub', language, simpleWords)}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Connector line for desktop */}
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-blue-200 z-0" />

          {/* Step 1 */}
          <div className="relative z-10 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF0FF] text-[#2457C5] font-black text-lg flex items-center justify-center mb-4 shadow-xs">
              1
            </div>
            <h3 className="font-extrabold text-sm text-[#101A3A] mb-1">
              {t('step1Title', language, simpleWords)}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {t('step1Desc', language, simpleWords)}
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative z-10 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF0FF] text-[#2457C5] font-black text-lg flex items-center justify-center mb-4 shadow-xs">
              2
            </div>
            <h3 className="font-extrabold text-sm text-[#101A3A] mb-1">
              {t('step2Title', language, simpleWords)}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {t('step2Desc', language, simpleWords)}
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative z-10 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF0FF] text-[#2457C5] font-black text-lg flex items-center justify-center mb-4 shadow-xs">
              3
            </div>
            <h3 className="font-extrabold text-sm text-[#101A3A] mb-1">
              {t('step3Title', language, simpleWords)}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {t('step3Desc', language, simpleWords)}
            </p>
          </div>
        </div>
      </section>

      {/* 7. WHY IT MATTERS (3 Research Stat Cards) */}
      <section className="space-y-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#2457C5]">
            {t('whyMattersBadge', language, simpleWords)}
          </span>
          <h2 className="text-2xl font-black text-[#101A3A] tracking-tight">
            {t('whyMattersTitle', language, simpleWords)}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-3xl font-black text-[#2457C5] block mb-2">40,000+</span>
              <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                "Coastal storms in Visakhapatnam cause widespread tree uprooting and severe road disruption."
              </p>
            </div>
            <span className="text-[10px] font-bold text-slate-400 mt-4 block">
              Source: Times of India
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-3xl font-black text-[#D32F2F] block mb-2">72 Hours</span>
              <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                "Blocked roads cripple post-disaster transport and rescue logistics for days without spatial priority queues."
              </p>
            </div>
            <span className="text-[10px] font-bold text-slate-400 mt-4 block">
              Source: NIDM Research Report
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-3xl font-black text-green-700 block mb-2">100% Civic</span>
              <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                "National emergency geo-portals lack micro-level civic crowdsourced workflow tools for municipal squads."
              </p>
            </div>
            <span className="text-[10px] font-bold text-slate-400 mt-4 block">
              Source: NDEM / NRSC Bulletin
            </span>
          </div>
        </div>
      </section>

      {/* 8. CONNECTION STATUS PANEL (Section 4.E) */}
      <section className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5 text-blue-600" />
            <span>Connection Architecture Simulation</span>
          </h4>
          <span className="text-[11px] text-slate-400">
            Connection states are simulated in this demo unless real hardware is connected.
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-lg text-xs font-bold bg-green-100 text-green-800 border border-green-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
            <span>Cellular: 2G / LTE Ready</span>
          </span>

          <span
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 border ${
              networkStatus === 'Online'
                ? 'bg-blue-100 text-[#2457C5] border-blue-200'
                : 'bg-red-100 text-red-700 border-red-200'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                networkStatus === 'Online' ? 'bg-[#2457C5]' : 'bg-red-600'
              }`}
            />
            <span>Internet: {networkStatus}</span>
          </span>

          <span className="px-3 py-1 rounded-lg text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
            <span>SMS Gateway: Demo Active</span>
          </span>

          <span className="px-3 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
            <span>BLE Mesh: Demo Active</span>
          </span>

          <span className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-200 text-slate-800 border border-slate-300 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
            <span>Local Map: Cached Offline</span>
          </span>
        </div>
      </section>
    </div>
  );
};
