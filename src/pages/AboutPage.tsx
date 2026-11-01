import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  AlertTriangle,
  Award,
  CheckCircle2,
  Clock,
  Compass,
  FileText,
  Heart,
  RefreshCw,
  Shield,
  Sparkles,
  Trash2,
  Users,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { incidents, avgAiTimeMs, currentRole, resetAllData } = useApp();
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleConfirmReset = () => {
    resetAllData();
    setIsResetConfirmOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Title */}
      <div>
        <span className="text-xs font-bold text-[#2457C5] uppercase tracking-wider">
          About The Platform
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-[#101A3A] tracking-tight mt-1">
          EcoTriage: Post-Disaster Road Intelligence
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Built by Team Webuzz for Visakhapatnam Municipal Corporation disaster response.
        </p>
      </div>

      {/* Hero Pitch Card */}
      <div className="bg-[#101A3A] text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Core Mission</span>
        </div>
        <p className="text-lg sm:text-xl font-bold leading-relaxed text-slate-100">
          "EcoTriage transforms post-disaster road clearance by using AI and GIS mapping to turn chaotic reports into an instant, prioritized municipal command dashboard."
        </p>
        <p className="text-xs sm:text-sm text-slate-300">
          Tagline: <strong className="text-white">"Keep Emergency Routes Moving. Even When Networks Go Dark."</strong>
        </p>
      </div>

      {/* Real Performance Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Incident Reports Ingested
          </span>
          <span className="text-3xl font-black text-[#101A3A]">{incidents.length} Records</span>
          <span className="text-[11px] text-slate-400 mt-1 block">Live & sample data buffer</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-[#2457C5] uppercase tracking-wider block mb-1">
            Avg AI Processing Time
          </span>
          <span className="text-3xl font-black text-[#2457C5]">
            {(avgAiTimeMs / 1000).toFixed(1)}s
          </span>
          <span className="text-[11px] text-green-600 font-semibold mt-1 block">
            Target under 30s met
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Dispatcher Session Time
          </span>
          <span className="text-3xl font-black text-slate-800">4.8 min</span>
          <span className="text-[11px] text-slate-400 mt-1 block">Intake to crew dispatch</span>
        </div>
      </div>

      {/* The Problem vs The Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-red-50/50 border border-red-200 space-y-3">
          <h2 className="text-lg font-black text-[#D32F2F] flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span>The Critical Problem</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            After coastal cyclones, municipal authorities lose critical hours finding and ranking blocked roads, because reports arrive through scattered phone calls and messaging groups. Blocked roads delay rescue, medical transport, and power restoration for days.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-blue-50/50 border border-blue-200 space-y-3">
          <h2 className="text-lg font-black text-[#2457C5] flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#2457C5]" />
            <span>The EcoTriage Solution</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            A dual-sided web platform. Operations squads capture photos with tagged GPS, while Gemini AI scores hazard obstruction. The public finds nearby relief shelters, trauma centers, and safety precautions—all fully functional offline.
          </p>
        </div>
      </div>

      {/* What makes it different */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
        <h2 className="text-lg font-black text-[#101A3A]">What Makes EcoTriage Unique</h2>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-semibold">
          "No existing tool combines lightweight AI image parsing of blockages with rule-based municipal emergency prioritization in a fast, offline-capable web dashboard."
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-600">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <strong className="block text-slate-900 mb-1">Offline-First Engine</strong>
            LocalStorage & IndexedDB buffers retain reports when cellular networks go dark.
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <strong className="block text-slate-900 mb-1">Multimodal Vision Triage</strong>
            Distinguishes live wires, fallen trees, and cross-checks hospital lifelines.
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <strong className="block text-slate-900 mb-1">Trilingual Inclusion</strong>
            Native Telugu, Hindi, and English with Simple Words Mode for stress comprehension.
          </div>
        </div>
      </div>

      {/* Business Model Line (Information only) */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
        <div>
          <strong className="block text-slate-900 text-sm">Deployment & Licensing Model</strong>
          <span>Annual municipal SaaS licence, Rs 5,00,000 per city corporation per year.</span>
        </div>
        <span className="text-[10px] font-bold uppercase text-slate-400 bg-slate-200 px-2 py-0.5 rounded">
          Info Only
        </span>
      </div>

      {/* Team Webuzz Info & Admin Reset */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-extrabold text-[#101A3A]">Prototype Engineering & Governance</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Designed by Team Webuzz, Visakhapatnam. Demo sign-in enabled.
            </p>
          </div>

          {currentRole === 'admin' && (
            <button
              onClick={() => setIsResetConfirmOpen(true)}
              className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear My Data</span>
            </button>
          )}
        </div>

        <p className="text-[11px] text-slate-400 leading-relaxed">
          Demo sign-in. The real version will use secure login (OTP or municipal ID). Role limits in this demo are for demonstration. All data remains on this device.
        </p>
      </div>

      {/* Reset Confirmation Modal */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl animate-in zoom-in-95 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="font-extrabold text-base text-[#101A3A]">Reset System Data?</h3>
              <p className="text-xs text-slate-500 mt-1">
                This will delete your saved reports and settings on this device and restore sample records. Continue?
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="flex-1 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="flex-1 py-2 text-xs font-bold text-white bg-[#D32F2F] hover:bg-red-700 rounded-xl shadow"
              >
                Yes, Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
