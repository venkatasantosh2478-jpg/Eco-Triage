import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { t } from '../utils/translations.ts';
import {
  AlertTriangle,
  Home,
  Map,
  LifeBuoy,
  Bell,
  MoreHorizontal,
  X,
  Shield,
  FileText,
  Clock,
  Heart,
  Info,
  LogOut,
  Sparkles,
  Phone,
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activePage, setActivePage, currentUser, currentRole, setIsAuthModalOpen, signOut, simpleWords, setSimpleWords, language } = useApp();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: t('home', language, simpleWords), icon: Home },
    { id: 'map', label: t('liveMap', language, simpleWords), icon: Map },
    { id: 'help', label: t('nearbyHelp', language, simpleWords), icon: LifeBuoy },
    { id: 'alerts', label: t('alertsShort', language, simpleWords), icon: Bell },
  ];

  return (
    <>
      {/* Mobile Floating Red "Report" button above the bottom bar */}
      <div className="xl:hidden fixed bottom-20 right-4 z-40">
        <button
          onClick={() => setActivePage('report')}
          className="flex items-center gap-2 bg-[#D32F2F] text-white px-4 py-3 rounded-full font-bold shadow-xl active:scale-95 transition-all text-sm border-2 border-white"
          aria-label="Report Hazard immediately"
        >
          <AlertTriangle className="w-5 h-5" />
          <span>{t('reportHazard', language, simpleWords)}</span>
        </button>
      </div>

      {/* Mobile Bottom Tab Bar (Height: ~64px) */}
      <nav
        className="xl:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E2E7F0] px-2 py-1.5 flex items-center justify-around z-40 shadow-lg"
        aria-label="Mobile Navigation"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActivePage(item.id);
                setIsMoreMenuOpen(false);
              }}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-2 rounded-xl transition-all ${
                isActive ? 'text-[#2457C5] font-bold' : 'text-[#657187]'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[11px] leading-tight">{item.label}</span>
            </button>
          );
        })}

        {/* More Tab */}
        <button
          onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-2 rounded-xl transition-all ${
            isMoreMenuOpen ? 'text-[#2457C5] font-bold' : 'text-[#657187]'
          }`}
        >
          <MoreHorizontal className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] leading-tight">{t('more', language, simpleWords)}</span>
        </button>
      </nav>

      {/* Mobile "More" Full Screen / Bottom Sheet Menu */}
      {isMoreMenuOpen && (
        <div className="xl:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex flex-col justify-end">
          <div className="bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto p-5 shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#2457C5]" />
                <span className="font-extrabold text-lg text-[#101A3A]">EcoTriage Menu</span>
              </div>
              <button
                onClick={() => setIsMoreMenuOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User status card */}
            <div className="my-4 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block">Signed in as</span>
                <span className="font-bold text-slate-800">
                  {currentUser ? currentUser.name : t('publicRole', language, simpleWords)}
                </span>
                <span className="ml-2 text-[10px] uppercase font-bold text-[#2457C5] bg-blue-100 px-1.5 py-0.5 rounded">
                  {currentRole}
                </span>
              </div>
              {currentUser ? (
                <button
                  onClick={() => {
                    signOut();
                    setIsMoreMenuOpen(false);
                  }}
                  className="text-xs text-red-600 font-bold px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{t('signOut', language, simpleWords)}</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsAuthModalOpen(true);
                    setIsMoreMenuOpen(false);
                  }}
                  className="text-xs text-[#2457C5] font-bold px-3 py-1.5 rounded-lg border border-blue-200 bg-white hover:bg-blue-50"
                >
                  {t('staffSignIn', language, simpleWords)}
                </button>
              )}
            </div>

            {/* Links list */}
            <div className="grid grid-cols-2 gap-2 text-sm font-semibold text-slate-700 mb-4">
              <button
                onClick={() => {
                  setActivePage('report');
                  setIsMoreMenuOpen(false);
                }}
                className="p-3 text-left rounded-xl bg-red-50 text-red-700 border border-red-200 flex items-center gap-2 font-bold"
              >
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>{t('reportHazard', language, simpleWords)}</span>
              </button>

              <button
                onClick={() => {
                  setActivePage('contacts');
                  setIsMoreMenuOpen(false);
                }}
                className="p-3 text-left rounded-xl hover:bg-slate-50 border border-slate-200 flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-red-600" />
                <span>{t('emergencyContactsFull', language, simpleWords)}</span>
              </button>

              <button
                onClick={() => {
                  setActivePage('queue');
                  setIsMoreMenuOpen(false);
                }}
                className="p-3 text-left rounded-xl hover:bg-slate-50 border border-slate-200 flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-blue-600" />
                <span>{t('queue', language, simpleWords)}</span>
              </button>

              <button
                onClick={() => {
                  setActivePage('precautions');
                  setIsMoreMenuOpen(false);
                }}
                className="p-3 text-left rounded-xl hover:bg-slate-50 border border-slate-200 flex items-center gap-2"
              >
                <Shield className="w-4 h-4 text-amber-600" />
                <span>{t('precautions', language, simpleWords)}</span>
              </button>

              <button
                onClick={() => {
                  setActivePage('history');
                  setIsMoreMenuOpen(false);
                }}
                className="p-3 text-left rounded-xl hover:bg-slate-50 border border-slate-200 flex items-center gap-2"
              >
                <Clock className="w-4 h-4 text-slate-600" />
                <span>{t('cycloneHistoryFull', language, simpleWords)}</span>
              </button>

              <button
                onClick={() => {
                  setActivePage('heroes');
                  setIsMoreMenuOpen(false);
                }}
                className="p-3 text-left rounded-xl hover:bg-slate-50 border border-slate-200 flex items-center gap-2"
              >
                <Heart className="w-4 h-4 text-pink-600" />
                <span>{t('ourHeroes', language, simpleWords)}</span>
              </button>

              <button
                onClick={() => {
                  setActivePage('about');
                  setIsMoreMenuOpen(false);
                }}
                className="p-3 text-left rounded-xl hover:bg-slate-50 border border-slate-200 flex items-center gap-2"
              >
                <Info className="w-4 h-4 text-slate-600" />
                <span>{t('about', language, simpleWords)}</span>
              </button>

              {/* Staff specific items */}
              {currentUser && (
                <>
                  <button
                    onClick={() => {
                      setActivePage('dashboard');
                      setIsMoreMenuOpen(false);
                    }}
                    className="p-3 text-left rounded-xl bg-blue-50 text-[#2457C5] border border-blue-200 flex items-center gap-2"
                  >
                    <span>Dashboard</span>
                  </button>
                  <button
                    onClick={() => {
                      setActivePage('my-reports');
                      setIsMoreMenuOpen(false);
                    }}
                    className="p-3 text-left rounded-xl hover:bg-slate-50 border border-slate-200 flex items-center gap-2"
                  >
                    <span>My Reports</span>
                  </button>
                  <button
                    onClick={() => {
                      setActivePage('my-assignments');
                      setIsMoreMenuOpen(false);
                    }}
                    className="p-3 text-left rounded-xl hover:bg-slate-50 border border-slate-200 flex items-center gap-2"
                  >
                    <span>My Assignments</span>
                  </button>
                </>
              )}
            </div>

            {/* Simple words mode toggle */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#2457C5]" />
                <span className="text-xs font-semibold text-slate-700">Simple Words Mode</span>
              </div>
              <button
                onClick={() => setSimpleWords(!simpleWords)}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  simpleWords ? 'bg-[#2457C5]' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`block w-5 h-5 bg-white rounded-full shadow-md transition-transform transform ${
                    simpleWords ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
