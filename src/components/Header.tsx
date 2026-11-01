import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Language, TextSize } from '../types.ts';
import {
  AlertTriangle,
  ChevronDown,
  Globe,
  LogOut,
  MapPin,
  Menu,
  Shield,
  User,
  Wifi,
  WifiOff,
  Sparkles,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activePage,
    setActivePage,
    language,
    setLanguage,
    simpleWords,
    setSimpleWords,
    textSize,
    setTextSize,
    currentUser,
    currentRole,
    setIsAuthModalOpen,
    signOut,
    networkStatus,
    lastSyncedTime,
    hasPermission,
    queuedCount,
  } = useApp();

  const [opsDropdownOpen, setOpsDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'report', label: 'Report' },
    { id: 'map', label: 'Live Map' },
    { id: 'queue', label: 'Queue' },
    { id: 'help', label: 'Nearby Help' },
    { id: 'contacts', label: 'Emergency Contacts' },
    { id: 'precautions', label: 'Precautions' },
    { id: 'history', label: 'Cyclone History' },
    { id: 'heroes', label: 'Our Heroes' },
    { id: 'about', label: 'About' },
  ];

  const staffOpsLinks = [
    { id: 'dashboard', label: 'Dashboard', roles: ['viewer', 'field', 'command', 'admin'] },
    { id: 'my-reports', label: 'My Reports', roles: ['field', 'command', 'admin'] },
    { id: 'my-assignments', label: 'My Assignments', roles: ['field', 'command', 'admin'] },
    { id: 'verify-reports', label: 'Verify Reports', roles: ['command', 'admin'] },
    { id: 'alerts', label: 'Alerts Manager', roles: ['command', 'admin'] },
    { id: 'content-manager', label: 'Content Manager', roles: ['admin'] },
    { id: 'activity-log', label: 'Activity Log', roles: ['admin'] },
  ];

  const accessibleOpsLinks = staffOpsLinks.filter(
    (item) => currentUser && item.roles.includes(currentUser.role)
  );

  return (
    <header className="sticky top-10 z-40 bg-white border-b border-[#E2E7F0] shadow-xs">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between gap-4">
        {/* Brand: Logo + Name + Subtitle */}
        <button
          onClick={() => setActivePage('home')}
          className="flex items-center gap-3 text-left focus:outline-none group flex-shrink-0"
        >
          {/* Custom Pin-with-Leaf SVG logo */}
          <div className="w-10 h-10 rounded-xl bg-[#2457C5]/10 border border-[#2457C5]/20 flex items-center justify-center text-[#2457C5] group-hover:bg-[#2457C5] group-hover:text-white transition-all shadow-xs">
            <svg
              className="w-6 h-6"
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
              <span className="text-xl font-extrabold tracking-tight text-[#101A3A]">EcoTriage</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-[#2457C5]">
                Vizag
              </span>
            </div>
            <p className="text-[11px] font-medium text-[#657187] tracking-tight leading-none">
              Emergency Hazard Intelligence
            </p>
          </div>
        </button>

        {/* Center Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 py-2">
          {navLinks.map((link) => {
            const isActive = activePage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActivePage(link.id)}
                className={`px-2 xl:px-2.5 py-1 text-xs xl:text-sm font-semibold rounded-lg transition-all relative whitespace-nowrap ${
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
                className={`px-2 xl:px-2.5 py-1 text-xs xl:text-sm font-semibold rounded-lg transition-all flex items-center gap-1 whitespace-nowrap ${
                  staffOpsLinks.some((l) => l.id === activePage)
                    ? 'text-[#2457C5] bg-[#EAF0FF]'
                    : 'text-[#182338] hover:text-[#2457C5] hover:bg-slate-50'
                }`}
              >
                <span>Ops</span>
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

        {/* Right Controls: Language Selector, Text Size, Report Button */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Language Selector Dropdown */}
          <div className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200/80 rounded-xl px-2 py-1.5 border border-slate-200 text-xs font-bold transition-all">
            <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-transparent border-none text-xs font-bold text-slate-800 focus:outline-none cursor-pointer pr-1 py-0.5"
              aria-label="Select Language"
            >
              <option value="en">EN</option>
              <option value="te">తెలుగు</option>
              <option value="hi">हिन्दी</option>
            </select>
          </div>

          {/* Text Size Control */}
          <div className="hidden lg:flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setTextSize('normal')}
              className={`px-1.5 py-0.5 rounded transition-all text-xs ${
                textSize === 'normal' ? 'bg-white text-[#2457C5] shadow-xs' : 'text-slate-600'
              }`}
              title="Standard Text Size"
            >
              A
            </button>
            <button
              onClick={() => setTextSize('large')}
              className={`px-1.5 py-0.5 rounded transition-all text-sm font-semibold ${
                textSize === 'large' ? 'bg-white text-[#2457C5] shadow-xs' : 'text-slate-600'
              }`}
              title="Large Text Size"
            >
              A
            </button>
            <button
              onClick={() => setTextSize('xlarge')}
              className={`px-1.5 py-0.5 rounded transition-all text-base font-bold ${
                textSize === 'xlarge' ? 'bg-white text-[#2457C5] shadow-xs' : 'text-slate-600'
              }`}
              title="Extra Large Text Size"
            >
              A
            </button>
          </div>

          {/* MAIN ACTION: Solid Red "Report Hazard" button */}
          <button
            onClick={() => setActivePage('report')}
            className="flex items-center gap-1.5 sm:gap-2 bg-[#D32F2F] hover:bg-[#b71c1c] active:scale-[0.98] text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all whitespace-nowrap"
            aria-label="Report Hazard immediately"
          >
            <AlertTriangle className="w-4 h-4" />
            <span className="hidden sm:inline">Report Hazard</span>
            <span className="sm:hidden">Report</span>
          </button>
        </div>
      </div>
    </header>
  );
};
