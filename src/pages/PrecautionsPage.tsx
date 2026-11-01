import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ModeImage } from '../components/ModeImage.tsx';
import {
  AlertTriangle,
  CheckCircle2,
  Compass,
  Droplet,
  Home,
  Package,
  Radio,
  Shield,
  ShieldAlert,
  Wind,
  Zap,
} from 'lucide-react';

export const PrecautionsPage: React.FC = () => {
  const { setActivePage, operatingMode, isFeatureOn } = useApp();
  const [activeTab, setActiveTab] = useState<'before' | 'during' | 'after'>(
    operatingMode === 'emergency' ? 'during' : 'before'
  );

  // Section 14.6: Precautions default tab is "Before Cyclone" in Daily mode, "During Cyclone" in Emergency mode
  useEffect(() => {
    setActiveTab(operatingMode === 'emergency' ? 'during' : 'before');
  }, [operatingMode]);

  const showPreparednessKit = isFeatureOn('precautions_preparedness_kit');
  const showEvacuationGuide = isFeatureOn('evacuation_safe_route_guide');

  const beforePrecautions = [
    {
      icon: Home,
      title: 'Secure Roof & Loose Objects',
      desc: 'Anchor tin sheets, trim weak tree branches touching electric cables, and secure balcony items.',
    },
    {
      icon: Package,
      title: 'Assemble 72-Hour Emergency Kit',
      desc: 'Store 5 liters of drinking water per person, dry foods, battery torch, first-aid kit, and power banks.',
    },
    {
      icon: Radio,
      title: 'Monitor Official Weather Bulletins',
      desc: 'Keep battery-powered transistor radios tuned to All India Radio or local coastal district disaster cells.',
    },
    {
      icon: CheckCircle2,
      title: 'Identify Nearest Elevated Cyclone Shelter',
      desc: 'Memorize the nearest municipal relief school or reinforced community center for rapid family relocation.',
    },
  ];

  const duringPrecautions = [
    {
      icon: Wind,
      title: 'Stay Completely Indoors',
      desc: 'Do not venture out during the storm eye calm period; violent gale winds reverse abruptly with heavy squalls.',
    },
    {
      icon: ShieldAlert,
      title: 'Disconnect Main Power Breaker',
      desc: 'Switch off the household main MCB to shield internal wiring against high voltage grid surges and electrocution.',
    },
    {
      icon: Home,
      title: 'Stay Away From Glass Windows',
      desc: 'Seek shelter in the strongest inner room or hallway away from windward glass balconies and skylights.',
    },
    {
      icon: Radio,
      title: 'Conserve Mobile Phone Battery',
      desc: 'Use voice calls strictly for acute emergencies; rely on short SMS texts to inform relatives of safety.',
    },
  ];

  const afterPrecautions = [
    {
      icon: Zap,
      title: 'Assume All Downed Wires Are Live',
      desc: 'Never step into puddle water near sagging cables. Keep at least 10 meters distance and alert EcoTriage.',
    },
    {
      icon: Droplet,
      title: 'Drink Strictly Boiled Water',
      desc: 'Contaminated flood lines cause cholera outbreaks. Boil municipal tap water for 10 minutes before drinking.',
    },
    {
      icon: AlertTriangle,
      title: 'Do Not Drive Through Flooded Roads',
      desc: 'Moving waters conceal open manholes and washed-out road bridges. Wait for clearance team verification.',
    },
    {
      icon: Shield,
      title: 'Check on Vulnerable Neighbors',
      desc: 'Assist elderly citizens, pregnant mothers, and infants stranded by uprooted compound wall debris.',
    },
  ];

  const currentCards =
    activeTab === 'before'
      ? beforePrecautions
      : activeTab === 'during'
      ? duringPrecautions
      : afterPrecautions;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Title + Section 14.5 ModeImage banner */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="h-44 sm:h-56 relative">
          <ModeImage slot="precautions_thumb" className="w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-900/30 to-transparent flex items-end p-6">
            <div className="text-white">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Life-Saving Guidelines
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-0.5">
                Cyclone Safety Precautions
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 mt-0.5">
                Step-by-step verified action checklist for Visakhapatnam coastal households.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Before / During / After */}
      <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
        <button
          onClick={() => setActiveTab('before')}
          className={`flex-1 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            activeTab === 'before'
              ? 'bg-white text-[#101A3A] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Before Cyclone (Preparation)
        </button>
        <button
          onClick={() => setActiveTab('during')}
          className={`flex-1 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            activeTab === 'during'
              ? 'bg-white text-[#101A3A] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          During Cyclone (Shelter)
        </button>
        <button
          onClick={() => setActiveTab('after')}
          className={`flex-1 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            activeTab === 'after'
              ? 'bg-white text-[#101A3A] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          After Cyclone (Recovery)
        </button>
      </div>

      {/* PROMINENT RED LIVE WIRE WARNING ON EVERY TAB */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#FFF1F0] border-2 border-[#D32F2F] text-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#D32F2F] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
            <Zap className="w-6 h-6 text-yellow-300" />
          </div>
          <div>
            <strong className="block text-base font-black text-[#D32F2F]">
              Stay away from fallen electric wires.
            </strong>
            <p className="text-xs sm:text-sm text-slate-700 font-medium mt-0.5">
              Report electrical hazards immediately. Live wires in floodwater cause lethal electrocution.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActivePage('report')}
          className="w-full sm:w-auto flex-shrink-0 px-6 py-3 bg-[#D32F2F] hover:bg-red-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
        >
          Report Hazard
        </button>
      </div>

      {/* Section 14.4: Evacuation and Safe-Route Guide (Emergency mode feature) */}
      {showEvacuationGuide && (
        <div className="bg-amber-50 rounded-3xl p-6 border-2 border-amber-300 space-y-3 shadow-xs">
          <div className="flex items-center gap-2.5 text-amber-900">
            <Compass className="w-5 h-5 text-amber-700" />
            <h2 className="text-base font-black">Evacuation & Safe-Route Guide (Active Cyclone)</h2>
          </div>
          <p className="text-xs text-amber-900 leading-relaxed">
            Low-lying coastal wards (RK Beach, Lawson&apos;s Bay, Fishing Harbour, Bheemili) must use designated inland corridors via Maddilapalem and NH-16 elevated overpasses. Avoid Beach Road during storm surge warnings.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={() => setActivePage('help')}
              className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl text-xs shadow"
            >
              Find Nearest Relief Camp
            </button>
            <button
              onClick={() => setActivePage('map')}
              className="px-4 py-2 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold rounded-xl text-xs"
            >
              Check Blocked Roads on Map
            </button>
          </div>
        </div>
      )}

      {/* Precaution Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {currentCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0 mt-1">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-[#101A3A] mb-1">{card.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{card.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Section 14.4: Household Preparedness Kit List (precautions_preparedness_kit flag) */}
      {showPreparednessKit && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <Package className="w-5 h-5 text-[#2457C5]" />
            <h2 className="text-base font-extrabold text-[#101A3A]">
              Household 72-Hour Preparedness Kit Checklist
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700 font-semibold">
            {[
              '15 Litres sealed drinking water + chlorine tablets',
              'Dry non-perishable rations, biscuits, and ORS packets',
              'Charged 20,000mAh power bank & LED torch with spare cells',
              'Waterproof pouch with Aadhaar, property deeds & medical prescriptions',
              'First-aid box: antiseptic, bandages, paracetamol, inhalers',
              'Emergency whistle, rope, and battery transistor radio',
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-[#16834A] shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer note */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
        Sample guidance. Always follow official advice from the District Disaster Management Authority (DDMA Visakhapatnam) and state disaster control cells.
      </div>
    </div>
  );
};
