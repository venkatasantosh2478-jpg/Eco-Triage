import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { SAMPLE_CREWS, VISAKHAPATNAM_ZONES } from '../../utils/storage.ts';
import { CheckCircle2, Heart, Shield, Trash2, Users, Wrench } from 'lucide-react';

export const ContentManagerView: React.FC = () => {
  const { heroes, thankHero, currentRole, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'heroes' | 'crews' | 'zones'>('heroes');

  const pendingHeroes = heroes.filter((h) => h.status === 'pending');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
          System Administration
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-[#101A3A] tracking-tight mt-1">
          Municipal Operations & Content Manager
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Configure response squads, municipal zones, and approve citizen-suggested responder stories.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
        <button
          onClick={() => setActiveTab('heroes')}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === 'heroes' ? 'bg-white text-[#101A3A] shadow-xs' : 'text-slate-500'
          }`}
        >
          Hero Suggestions ({pendingHeroes.length})
        </button>
        <button
          onClick={() => setActiveTab('crews')}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === 'crews' ? 'bg-white text-[#101A3A] shadow-xs' : 'text-slate-500'
          }`}
        >
          Clearance Crews ({SAMPLE_CREWS.length})
        </button>
        <button
          onClick={() => setActiveTab('zones')}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === 'zones' ? 'bg-white text-[#101A3A] shadow-xs' : 'text-slate-500'
          }`}
        >
          Municipal Zones ({VISAKHAPATNAM_ZONES.length})
        </button>
      </div>

      {/* Hero Suggestions Review */}
      {activeTab === 'heroes' && (
        <div className="space-y-4">
          {pendingHeroes.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
              <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-bold text-slate-800">No pending hero suggestions</h3>
              <p className="text-xs text-slate-400 mt-1">
                New citizen suggestions will appear here for verification.
              </p>
            </div>
          ) : (
            pendingHeroes.map((h) => (
              <div
                key={h.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-start justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-extrabold text-base text-[#101A3A]">{h.name}</h3>
                    <span className="text-[10px] font-bold uppercase bg-blue-100 text-[#2457C5] px-2 py-0.5 rounded">
                      {h.department}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-semibold block mb-2">{h.role}</span>
                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    "{h.story}"
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      h.status = 'approved';
                      showToast(`Approved hero story for ${h.name}!`);
                    }}
                    className="px-4 py-2 bg-[#16834A] hover:bg-green-700 text-white font-bold rounded-xl text-xs"
                  >
                    Approve
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Crews list */}
      {activeTab === 'crews' && (
        <div className="space-y-3">
          {SAMPLE_CREWS.map((c) => (
            <div
              key={c.id}
              className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between text-xs"
            >
              <div>
                <strong className="block text-slate-900 font-bold text-sm">{c.name}</strong>
                <span className="text-slate-500">{c.type}</span>
              </div>
              <span
                className={`font-bold px-2.5 py-1 rounded-full ${
                  c.status === 'Free' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                }`}
              >
                {c.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Zones list */}
      {activeTab === 'zones' && (
        <div className="space-y-2">
          {VISAKHAPATNAM_ZONES.map((z, i) => (
            <div
              key={i}
              className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-3"
            >
              <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#2457C5] flex items-center justify-center text-xs">
                {i + 1}
              </span>
              <span>{z}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
