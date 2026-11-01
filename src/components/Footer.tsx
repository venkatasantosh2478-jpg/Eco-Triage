import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Language, TextSize } from '../types.ts';
import { ChevronDown, ChevronUp, Phone, Shield, ExternalLink, X } from 'lucide-react';

export const Footer: React.FC = () => {
  const {
    setActivePage,
    language,
    setLanguage,
    textSize,
    setTextSize,
    networkStatus,
    lastSyncedTime,
    currentUser,
    setIsAuthModalOpen,
    signOut,
  } = useApp();

  const [exploreOpen, setExploreOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{ title: string; content: string } | null>(null);

  const openPrivacyNote = () => {
    setModalContent({
      title: 'Privacy Note (Demo)',
      content:
        'All reported incident data, uploaded photos, and device preferences in this demo are stored strictly in your browser (LocalStorage and IndexedDB). No private citizen data or real municipal credentials are transmitted to third-party databases. Server-side AI processing only parses the field image and note to calculate emergency priority scores without persistent user tracking.',
    });
  };

  const openAccessibilityNote = () => {
    setModalContent({
      title: 'Accessibility & Inclusion',
      content:
        'EcoTriage is engineered to WCAG 2.1 AA standards: high contrast visual ratios, non-color dependent status indicators (color + word + icon), minimum 48px touch targets, full keyboard navigability with visible focus indicators, multi-script typography (English, Telugu, Hindi), and Simple Words Mode for high-stress emergency comprehension.',
    });
  };

  return (
    <>
      <footer className="bg-[#F4F6FA] border-t border-[#E2E7F0] text-[#182338] pt-12 pb-24 xl:pb-12 mt-16 text-sm">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          {/* Mobile Emergency Strip First */}
          <div className="xl:hidden mb-8 bg-[#101A3A] text-white p-5 rounded-2xl shadow-md">
            <h3 className="font-extrabold text-base mb-1 flex items-center gap-2">
              <Phone className="w-4 h-4 text-red-400" />
              <span>Immediate Emergency Lines</span>
            </h3>
            <p className="text-xs text-slate-300 mb-4">In acute life danger or injury, call 112 first.</p>
            <div className="grid grid-cols-3 gap-2">
              <a
                href="tel:112"
                className="bg-[#D32F2F] text-white py-3 px-2 rounded-xl font-bold text-center text-sm shadow hover:bg-red-700 active:scale-95 flex flex-col items-center justify-center"
              >
                <span className="text-xs opacity-80">National</span>
                <span>112</span>
              </a>
              <a
                href="tel:108"
                className="bg-white/10 text-white border border-white/20 py-3 px-2 rounded-xl font-bold text-center text-sm hover:bg-white/20 active:scale-95 flex flex-col items-center justify-center"
              >
                <span className="text-xs opacity-80">Ambulance</span>
                <span>108</span>
              </a>
              <a
                href="tel:101"
                className="bg-white/10 text-white border border-white/20 py-3 px-2 rounded-xl font-bold text-center text-sm hover:bg-white/20 active:scale-95 flex flex-col items-center justify-center"
              >
                <span className="text-xs opacity-80">Fire</span>
                <span>101</span>
              </a>
            </div>
          </div>

          {/* Desktop 4-Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-12">
            {/* Column 1: Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#2457C5] text-white flex items-center justify-center">
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
                  <span className="text-lg font-black text-[#101A3A] tracking-tight">EcoTriage</span>
                  <span className="block text-[11px] text-[#657187] font-semibold -mt-0.5">
                    Emergency Hazard Intelligence
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#657187] leading-relaxed mb-4">
                "Keep Emergency Routes Moving. Even When Networks Go Dark."
              </p>
              <div className="inline-block px-2.5 py-1 rounded bg-slate-200/70 text-slate-700 text-xs font-semibold">
                Built by Team Webuzz, Visakhapatnam
              </div>
            </div>

            {/* Column 2: Explore */}
            <div>
              <button
                onClick={() => setExploreOpen(!exploreOpen)}
                className="xl:pointer-events-none w-full flex items-center justify-between font-bold text-[#101A3A] text-sm uppercase tracking-wider mb-3 py-2 border-b border-slate-200 xl:border-none"
              >
                <span>Explore</span>
                <span className="xl:hidden">
                  {exploreOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </span>
              </button>

              <ul className={`space-y-2 text-xs font-medium text-[#657187] ${exploreOpen ? 'block' : 'hidden xl:block'}`}>
                <li>
                  <button onClick={() => setActivePage('home')} className="hover:text-[#2457C5] transition-colors">
                    Home Overview
                  </button>
                </li>
                <li>
                  <button onClick={() => setActivePage('report')} className="hover:text-[#2457C5] transition-colors">
                    Report a Hazard
                  </button>
                </li>
                <li>
                  <button onClick={() => setActivePage('map')} className="hover:text-[#2457C5] transition-colors">
                    Live Operational Map
                  </button>
                </li>
                <li>
                  <button onClick={() => setActivePage('queue')} className="hover:text-[#2457C5] transition-colors">
                    Priority Triage Queue
                  </button>
                </li>
                <li>
                  <button onClick={() => setActivePage('about')} className="hover:text-[#2457C5] transition-colors">
                    About Project & Webuzz
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Get Help */}
            <div>
              <button
                onClick={() => setHelpOpen(!helpOpen)}
                className="xl:pointer-events-none w-full flex items-center justify-between font-bold text-[#101A3A] text-sm uppercase tracking-wider mb-3 py-2 border-b border-slate-200 xl:border-none"
              >
                <span>Get Help</span>
                <span className="xl:hidden">
                  {helpOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </span>
              </button>

              <ul className={`space-y-2 text-xs font-medium text-[#657187] ${helpOpen ? 'block' : 'hidden xl:block'}`}>
                <li>
                  <button onClick={() => setActivePage('help')} className="hover:text-[#2457C5] transition-colors">
                    Nearby Relief Camps & Shelters
                  </button>
                </li>
                <li>
                  <button onClick={() => setActivePage('help')} className="hover:text-[#2457C5] transition-colors">
                    Hospitals & Medical Aid
                  </button>
                </li>
                <li>
                  <button onClick={() => setActivePage('precautions')} className="hover:text-[#2457C5] transition-colors">
                    Cyclone Safety Precautions
                  </button>
                </li>
                <li>
                  <button onClick={() => setActivePage('history')} className="hover:text-[#2457C5] transition-colors">
                    Cyclone History & Archive
                  </button>
                </li>
                <li>
                  <button onClick={() => setActivePage('heroes')} className="hover:text-[#2457C5] transition-colors">
                    Our Heroes (Responders)
                  </button>
                </li>
                <li>
                  <button onClick={() => setActivePage('alerts')} className="hover:text-[#2457C5] transition-colors">
                    Active Weather & Road Alerts
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Emergency Card (Desktop) */}
            <div className="hidden xl:block bg-[#101A3A] text-white p-5 rounded-2xl shadow-md">
              <h4 className="font-extrabold text-sm uppercase tracking-wider text-slate-200 mb-2">
                Emergency Assistance
              </h4>
              <p className="text-xs text-slate-300 mb-4">In acute danger? Always dial national emergency first.</p>

              <a
                href="tel:112"
                className="w-full bg-[#D32F2F] text-white py-2.5 px-3 rounded-xl font-bold text-center text-sm shadow hover:bg-red-700 transition-all flex items-center justify-center gap-2 mb-3"
              >
                <Phone className="w-4 h-4" />
                <span>Call 112 (National Emergency)</span>
              </a>

              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <a
                  href="tel:108"
                  className="bg-white/10 hover:bg-white/20 py-2 rounded-lg font-bold transition-colors"
                >
                  108 Ambulance
                </a>
                <a
                  href="tel:101"
                  className="bg-white/10 hover:bg-white/20 py-2 rounded-lg font-bold transition-colors"
                >
                  101 Fire Dept
                </a>
              </div>
              <span className="block text-[11px] text-slate-400 text-center mt-3">
                Vizag Municipal Control: 0891-2568241 (Sample)
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-[#E2E7F0] w-full my-6" />

          {/* Bottom Bar: Language switch, connection, legal demo line */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#657187]">
            {/* Left: Language & Text Size */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1 bg-white border border-[#E2E7F0] rounded-lg p-0.5">
                {(['en', 'te', 'hi'] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      language === lang ? 'bg-[#2457C5] text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {lang === 'en' ? 'EN' : lang === 'te' ? 'తెలుగు' : 'हिन्दी'}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1 bg-white border border-[#E2E7F0] rounded-lg p-0.5 font-bold text-[11px]">
                <button
                  onClick={() => setTextSize('normal')}
                  className={`px-1.5 py-0.5 rounded ${textSize === 'normal' ? 'bg-[#2457C5] text-white' : 'text-slate-600'}`}
                >
                  A
                </button>
                <button
                  onClick={() => setTextSize('large')}
                  className={`px-1.5 py-0.5 rounded ${textSize === 'large' ? 'bg-[#2457C5] text-white' : 'text-slate-600'}`}
                >
                  A
                </button>
                <button
                  onClick={() => setTextSize('xlarge')}
                  className={`px-1.5 py-0.5 rounded ${textSize === 'xlarge' ? 'bg-[#2457C5] text-white' : 'text-slate-600'}`}
                >
                  A
                </button>
              </div>

              <span className="text-[11px] bg-slate-200/80 px-2 py-0.5 rounded text-slate-700">
                Network: <strong className="text-slate-900">{networkStatus}</strong> (Synced {lastSyncedTime})
              </span>
            </div>

            {/* Right: Disclaimer and Meta Links */}
            <div className="text-center md:text-right text-[11px] leading-relaxed max-w-xl">
              <p className="font-medium text-slate-500">
                Demo version. Sample data. Connection states and priority scores are simulated for demonstration. Not an official government service.
              </p>
              <div className="flex items-center justify-center md:justify-end gap-3 mt-1.5 font-semibold text-slate-600">
                {currentUser ? (
                  <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg text-xs font-bold text-[#2457C5]">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>{currentUser.name} ({currentUser.role.toUpperCase()})</span>
                    <button onClick={signOut} className="text-red-600 hover:underline ml-1">
                      Sign out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2457C5] hover:bg-blue-700 text-white font-bold rounded-lg text-xs shadow-2xs transition-all"
                  >
                    <span>Staff Sign In / Role Profile</span>
                  </button>
                )}
                <span>•</span>
                <button onClick={openPrivacyNote} className="hover:text-slate-900">
                  Privacy note
                </button>
                <span>•</span>
                <button onClick={openAccessibilityNote} className="hover:text-slate-900">
                  Accessibility
                </button>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center text-[11px] text-slate-400 mt-6 font-medium">
            © 2026 Team Webuzz. EcoTriage prototype for Visakhapatnam Municipal Corporation disaster response.
          </div>
        </div>
      </footer>

      {/* Info Dialog Modal */}
      {modalContent && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h3 className="font-extrabold text-lg text-[#101A3A]">{modalContent.title}</h3>
              <button
                onClick={() => setModalContent(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">{modalContent.content}</p>
            <button
              onClick={() => setModalContent(null)}
              className="w-full py-2.5 bg-[#2457C5] text-white font-bold rounded-xl text-sm"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </>
  );
};
