import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Language, TextSize } from '../types.ts';
import { t } from '../utils/translations.ts';
import {
  AlertTriangle,
  ChevronDown,
  Globe,
  Shield,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activePage,
    setActivePage,
    language,
    setLanguage,
    simpleWords,
    textSize,
    setTextSize,
    currentUser,
    currentRole,
    setIsAuthModalOpen,
  } = useApp();

  const [opsDropdownOpen, setOpsDropdownOpen] = useState(false);

  // "Home" link removed because clicking the EcoTriage brand logo redirects directly to Home
  const navLinks = [
    { id: 'report', label: t('report', language, simpleWords) },
    { id: 'map', label: t('liveMap', language, simpleWords) },
    { id: 'queue', label: t('queue', language, simpleWords) },
    { id: 'help', label: t('nearbyHelp', language, simpleWords) },
    { id: 'contacts', label: t('emergencyContacts', language, simpleWords) },
    { id: 'precautions', label: t('precautions', language, simpleWords) },
    { id: 'history', label: t('cycloneHistory', language, simpleWords) },
    { id: 'heroes', label: t('ourHeroes', language, simpleWords) },
    { id: 'about', label: t('about', language, simpleWords) },
  ];

  const staffOpsLinks = [
    { id: 'dashboard', label: t('dashboard', language, simpleWords), roles: ['viewer', 'field', 'command', 'admin'] },
    { id: 'my-reports', label: t('myReports', language, simpleWords), roles: ['field', 'command', 'admin'] },
    { id: 'my-assignments', label: t('myAssignments', language, simpleWords), roles: ['field', 'command', 'admin'] },
    { id: 'verify-reports', label: t('verifyReports', language, simpleWords), roles: ['command', 'admin'] },
    { id: 'alerts', label: t('alertsShort', language, simpleWords), roles: ['command', 'admin'] },
    { id: 'content-manager', label: t('contentManager', language, simpleWords), roles: ['admin'] },
    { id: 'activity-log', label: t('activityLog', language, simpleWords), roles: ['admin'] },
  ];

  const accessibleOpsLinks = staffOpsLinks.filter(
    (item) => currentUser && item.roles.includes(currentUser.role)
  );

  const cycleTextSize = () => {
    const order: TextSize[] = ['normal', 'large', 'xlarge'];
    const nextIdx = (order.indexOf(textSize) + 1) % order.length;
    setTextSize(order[nextIdx]);
  };

  return (
    <header className="sticky top-10 z-40 bg-white border-b border-[#E2E7F0] shadow-xs">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-5 h-[68px] flex items-center justify-between gap-2">
        {/* Brand: Logo + Name + Subtitle (Clicking redirects to Home) */}
        <button
          onClick={() => setActivePage('home')}
          title="Return to EcoTriage Home"
          aria-label="EcoTriage Home"
          className="flex items-center gap-2.5 text-left focus:outline-none group flex-shrink-0 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-[#2457C5]/10 border border-[#2457C5]/20 flex items-center justify-center text-[#2457C5] group-hover:bg-[#2457C5] group-hover:text-white transition-all shadow-xs">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
              <path d="M12 7c-1.5 0-3 1.5-3 3 0 2 3 4 3 4s3-2 3-4c0-1.5-1.5-3-3-3" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-extrabold tracking-tight text-[#101A3A]">
                {t('appName', language, simpleWords)}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-[#2457C5]">
                {t('vizagBadge', language, simpleWords)}
              </span>
            </div>
            <p className="text-[10px] font-medium text-[#657187] tracking-tight leading-none hidden sm:block">
              {t('subtitle', language, simpleWords)}
            </p>
          </div>
        </button>

        {/* Center Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center justify-center gap-0.5 xl:gap-1 py-1.5 flex-1 min-w-0">
          {navLinks.map((link) => {
            const isActive = activePage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActivePage(link.id)}
                className={`px-2 xl:px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all relative whitespace-nowrap ${
                  isActive
                    ? 'text-[#2457C5] bg-[#EAF0FF]'
                    : 'text-[#182338] hover:text-[#2457C5] hover:bg-slate-50'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#2457C5] rounded-full" />
                )}
              </button>
            );
          })}

          {/* Operations Dropdown for Staff */}
          {accessibleOpsLinks.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setOpsDropdownOpen(!opsDropdownOpen)}
                className={`px-2 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 whitespace-nowrap ${
                  staffOpsLinks.some((l) => l.id === activePage)
                    ? 'text-[#2457C5] bg-[#EAF0FF]'
                    : 'text-[#182338] hover:text-[#2457C5] hover:bg-slate-50'
                }`}
              >
                <span>{t('ops', language, simpleWords)}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {opsDropdownOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-[#E2E7F0] py-2 z-50 animate-in fade-in-50 zoom-in-95"
                  onMouseLeave={() => setOpsDropdownOpen(false)}
                >
                  <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Role Operations
                  </div>
                  {accessibleOpsLinks.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActivePage(item.id);
                        setOpsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-semibold hover:bg-slate-50 flex items-center justify-between ${
                        activePage === item.id ? 'text-[#2457C5] bg-blue-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span>{item.label}</span>
                      {activePage === item.id && <span className="w-1.5 h-1.5 rounded-full bg-[#2457C5]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Right Controls: Minimized Language Switcher, Compact Text Size, Officer Role Button, Report Button */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {/* Minimized Language Selector */}
          <div className="flex items-center bg-slate-100 hover:bg-slate-200/80 rounded-lg px-1.5 py-1 border border-slate-200 transition-all">
            <Globe className="w-3 h-3 text-slate-500 shrink-0 mr-0.5" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-transparent border-none text-[11px] font-extrabold text-slate-800 focus:outline-none cursor-pointer py-0"
              aria-label="Select Language"
              title="Switch Language (English / తెలుగు / हिन्दी)"
            >
              <option value="en">EN</option>
              <option value="te">తె</option>
              <option value="hi">हि</option>
            </select>
          </div>

          {/* Minimized Single-Tap Text Size Button */}
          <button
            onClick={cycleTextSize}
            className="hidden xl:flex items-center justify-center w-7 h-7 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 text-[11px] font-extrabold text-slate-700 transition-all"
            title={`Text Size: ${textSize} (Click to cycle)`}
            aria-label="Cycle Text Size"
          >
            {textSize === 'normal' ? 'A' : textSize === 'large' ? 'A+' : 'A++'}
          </button>

          {/* Compact Officer / Role Access Button */}
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className={`hidden sm:flex items-center gap-1 px-2 py-1.5 rounded-lg border text-[11px] font-bold transition-all whitespace-nowrap ${
              currentRole !== 'public'
                ? 'bg-blue-50 border-blue-200 text-[#2457C5]'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
            }`}
            title="Officer Sign In / Switch Role"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>
              {currentRole !== 'public'
                ? currentRole.toUpperCase()
                : t('officerLoginShort', language, simpleWords)}
            </span>
          </button>

          {/* MAIN ACTION: Solid Red "Report Hazard" button */}
          <button
            onClick={() => setActivePage('report')}
            className="flex items-center gap-1.5 bg-[#D32F2F] hover:bg-[#b71c1c] active:scale-[0.98] text-white px-2.5 sm:px-3.5 py-2 rounded-xl font-bold text-xs shadow-md hover:shadow-lg transition-all whitespace-nowrap"
            aria-label="Report Hazard immediately"
          >
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">{t('reportHazard', language, simpleWords)}</span>
            <span className="sm:hidden">{t('report', language, simpleWords)}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
