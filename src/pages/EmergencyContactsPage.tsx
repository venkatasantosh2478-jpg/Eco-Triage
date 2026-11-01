import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { EmergencyContact } from '../utils/modeConfig.ts';
import { t } from '../utils/translations.ts';
import {
  Phone,
  Search,
  Plus,
  X,
  Building,
  Heart,
  AlertTriangle,
  CheckCircle2,
  Lock,
  MessageSquare,
  HandHelping,
  Pin,
} from 'lucide-react';

export const EmergencyContactsPage: React.FC = () => {
  const {
    emergencyContacts,
    volunteers,
    volunteerTasks,
    addEmergencyContact,
    updateContactStatus,
    registerVolunteer,
    postVolunteerTask,
    claimVolunteerTask,
    confirmVolunteerTask,
    currentRole,
    operatingMode,
    language,
    simpleWords,
    isFeatureOn,
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);
  const [isVolunteerModalOpen, setIsVolunteerModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [claimTaskId, setClaimTaskId] = useState<string | null>(null);
  const [claimVolunteerName, setClaimVolunteerName] = useState('');

  // Section 14.4: volunteer_signup_tasks feature flag
  const showVolunteerSignupAndTasks = isFeatureOn('volunteer_signup_tasks');

  useEffect(() => {
    setActiveCategory('all');
  }, [operatingMode]);

  // Suggest Contact Form State
  const [cName, setCName] = useState('');
  const [cCat, setCCat] = useState<EmergencyContact['category']>('volunteers_ngo');
  const [cDesc, setCDesc] = useState('');
  const [cPhone, setCPhone] = useState('');
  const [cArea, setCArea] = useState('');
  const [cAvail, setCAvail] = useState('24 hours');
  const [cLangs, setCLangs] = useState('Telugu, English');

  // Volunteer Form State
  const [vName, setVName] = useState('');
  const [vPhone, setVPhone] = useState('');
  const [vArea, setVArea] = useState('');
  const [vSkills, setVSkills] = useState<string[]>(['First aid', 'Tree cutting']);
  const [vAvail, setVAvail] = useState('Weekends & Evenings');
  const [vConsent, setVConsent] = useState(true);

  // Command Task Form State
  const [tTitle, setTTitle] = useState('');
  const [tArea, setTArea] = useState('MVP Colony');
  const [tSkill, setTSkill] = useState('Tree cutting');

  const categories = [
    { id: 'all', label: 'All Contacts' },
    { id: 'national_emergency', label: 'National Emergency' },
    { id: 'control_room', label: 'Disaster Control Rooms' },
    { id: 'medical', label: 'Medical & Hospitals' },
    { id: 'police', label: 'Police' },
    { id: 'fire_rescue', label: 'Fire & Rescue' },
    { id: 'electricity_water', label: 'Electricity & Water' },
    { id: 'volunteers_ngo', label: 'Volunteers & NGOs' },
    { id: 'animal_wildlife', label: 'Animal & Wildlife' },
  ];

  const approvedContacts = emergencyContacts.filter(
    (c) => c.status === 'Approved' || currentRole === 'admin' || currentRole === 'command'
  );

  // Section 14.6: Daily mode pins National numbers at top; Emergency mode pins Disaster Control Rooms & National numbers at top
  const filteredContacts = approvedContacts
    .filter((c) => {
      const matchesCat = activeCategory === 'all' || c.category === activeCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.area.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    })
    .sort((a, b) => {
      const scoreCategory = (cat: EmergencyContact['category']) => {
        if (operatingMode === 'emergency') {
          if (cat === 'control_room') return 0;
          if (cat === 'national_emergency') return 1;
          return 2;
        }
        if (cat === 'national_emergency') return 0;
        return 1;
      };
      return scoreCategory(a.category) - scoreCategory(b.category);
    });

  const handleSuggestContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cName.trim() || !cPhone.trim()) return;

    addEmergencyContact({
      name: cName.trim(),
      category: cCat,
      description: cDesc.trim() || 'Community emergency responder.',
      phone: cPhone.trim(),
      area: cArea.trim() || 'Visakhapatnam',
      availability: cAvail.trim() || '24 hours',
      languages: cLangs.split(',').map((s) => s.trim()),
      verified: false,
      verifiedOn: new Date().toISOString().split('T')[0],
      source: 'Citizen Suggestion',
      sample: true,
      status: 'Pending',
    });

    setIsSuggestModalOpen(false);
    setCName('');
    setCDesc('');
    setCPhone('');
    setCArea('');
  };

  const handleVolunteerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vName.trim() || !vPhone.trim()) return;

    registerVolunteer({
      name: vName.trim(),
      phone: vPhone.trim(),
      area: vArea.trim() || 'Visakhapatnam',
      skills: vSkills,
      availability: vAvail || 'Immediate',
      consentToShowPhone: vConsent,
    });

    setIsVolunteerModalOpen(false);
    setVName('');
    setVPhone('');
    setVArea('');
  };

  const handlePostTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tTitle.trim()) return;
    postVolunteerTask(tTitle.trim(), tArea.trim() || 'Visakhapatnam', tSkill);
    setIsTaskModalOpen(false);
    setTTitle('');
  };

  const toggleSkill = (skill: string) => {
    setVSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const approvedVolunteers = volunteers.filter((v) => v.status === 'Approved');

  return (
    <div className="space-y-8">
      {/* Top Fixed National Emergency Strip */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-blue-900/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded-full">
              {t('contactsBadge', language, simpleWords)}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {t('contactsTitle', language, simpleWords)}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              {operatingMode === 'emergency'
                ? 'Disaster Control Rooms and National Emergency numbers are pinned at the top.'
                : t('contactsSub', language, simpleWords)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {showVolunteerSignupAndTasks && (
              <button
                onClick={() => setIsVolunteerModalOpen(true)}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg active:scale-95 transition-all"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>{t('joinVolunteerBtn', language, simpleWords)}</span>
              </button>
            )}

            <button
              onClick={() => setIsSuggestModalOpen(true)}
              className="px-4 py-2.5 bg-[#2457C5] hover:bg-blue-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{t('suggestContactBtn', language, simpleWords)}</span>
            </button>
          </div>
        </div>

        {/* 4 Standard Top Fixed Numbers */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800">
          <a
            href="tel:112"
            className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-between transition-all group"
          >
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">National Emergency</span>
              <strong className="text-xl font-black text-white group-hover:text-cyan-300">112</strong>
            </div>
            <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center shadow">
              <Phone className="w-4 h-4" />
            </div>
          </a>

          <a
            href="tel:100"
            className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-between transition-all group"
          >
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Police Control</span>
              <strong className="text-xl font-black text-white group-hover:text-cyan-300">100</strong>
            </div>
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow">
              <Phone className="w-4 h-4" />
            </div>
          </a>

          <a
            href="tel:101"
            className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-between transition-all group"
          >
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Fire & Rescue</span>
              <strong className="text-xl font-black text-white group-hover:text-cyan-300">101</strong>
            </div>
            <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow">
              <Phone className="w-4 h-4" />
            </div>
          </a>

          <a
            href="tel:108"
            className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-between transition-all group"
          >
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Ambulance</span>
              <strong className="text-xl font-black text-white group-hover:text-cyan-300">108</strong>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow">
              <Phone className="w-4 h-4" />
            </div>
          </a>
        </div>
      </div>

      {/* Section 14.4 & 14.6: "Volunteers needed now" task request board (when volunteer_signup_tasks is ON) */}
      {showVolunteerSignupAndTasks && (
        <div className="bg-red-50/70 rounded-3xl p-6 border-2 border-red-200 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#D32F2F] text-white flex items-center justify-center shrink-0">
                <HandHelping className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#D32F2F] block">
                  Emergency Civic Mobilisation
                </span>
                <h2 className="text-lg font-black text-[#101A3A]">Volunteers Needed Now</h2>
                <p className="text-xs text-slate-600">
                  Command Officers post urgent neighbourhood tasks. Tap &ldquo;I can help&rdquo; to volunteer, or sign up for deployment.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {(currentRole === 'command' || currentRole === 'admin') && (
                <button
                  onClick={() => setIsTaskModalOpen(true)}
                  className="px-3.5 py-2 bg-[#101A3A] hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Post Volunteer Task</span>
                </button>
              )}
              <button
                onClick={() => setIsVolunteerModalOpen(true)}
                className="px-4 py-2 bg-[#D32F2F] hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow"
              >
                Join as Volunteer
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {volunteerTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-2xl p-4 border border-red-200 flex flex-col justify-between gap-3 shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-red-100 text-red-800">
                      {task.skillRequired}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        task.status === 'Confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : task.status === 'Claimed'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-sm text-[#101A3A]">{task.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Area: <strong className="text-slate-700">{task.area}</strong> • Posted {task.createdAt}
                  </p>
                  {task.claimedBy && (
                    <p className="text-xs text-emerald-700 font-bold mt-1">
                      Volunteer: {task.claimedBy}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  {task.status === 'Open' && (
                    claimTaskId === task.id ? (
                      <div className="flex items-center gap-1.5 w-full">
                        <input
                          type="text"
                          value={claimVolunteerName}
                          onChange={(e) => setClaimVolunteerName(e.target.value)}
                          placeholder="Your name & phone..."
                          className="flex-1 px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
                        />
                        <button
                          onClick={() => {
                            if (claimVolunteerName.trim()) {
                              claimVolunteerTask(task.id, claimVolunteerName.trim());
                              setClaimTaskId(null);
                              setClaimVolunteerName('');
                            }
                          }}
                          className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-lg text-xs"
                        >
                          Send
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setClaimTaskId(task.id)}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs"
                      >
                        I can help
                      </button>
                    )
                  )}

                  {task.status === 'Claimed' && (currentRole === 'command' || currentRole === 'admin') && (
                    <button
                      onClick={() => confirmVolunteerTask(task.id)}
                      className="px-3.5 py-1.5 bg-[#2457C5] hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs"
                    >
                      Command: Confirm Volunteer
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search & Category Chips */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contacts by name, description, or area..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#2457C5]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-[#101A3A] text-white shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contacts Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredContacts.map((c) => {
          const isPinned =
            operatingMode === 'emergency'
              ? c.category === 'control_room' || c.category === 'national_emergency'
              : c.category === 'national_emergency';

          return (
            <div
              key={c.id}
              className={`bg-white rounded-3xl p-5 border shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${
                c.status === 'Pending'
                  ? 'border-amber-300 bg-amber-50/20'
                  : isPinned
                  ? 'border-blue-300 ring-1 ring-blue-100'
                  : 'border-slate-200'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-blue-50 text-[#2457C5]">
                      <Building className="w-4 h-4" />
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 inline-block">
                        {c.category.replace('_', ' ')}
                      </span>
                      {isPinned && (
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-50 text-[#2457C5] inline-flex items-center gap-1">
                          <Pin className="w-2.5 h-2.5" />
                          <span>Pinned</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {c.sample ? (
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full" title="Unverified sample placeholder">
                        Sample
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Verified {c.verifiedOn}</span>
                      </span>
                    )}
                    {c.status === 'Pending' && (
                      <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                        Pending
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-extrabold text-base text-[#101A3A]">{c.name}</h3>
                  <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">{c.description}</p>
                </div>

                <div className="space-y-1 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Area:</span>
                    <strong className="text-slate-800">{c.area}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Availability:</span>
                    <strong className="text-slate-800">{c.availability}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Languages:</span>
                    <strong className="text-slate-800">{c.languages.join(', ')}</strong>
                  </div>
                </div>
              </div>

              {/* Call / WhatsApp actions */}
              <div className="pt-4 border-t border-slate-100 mt-4 flex items-center gap-2">
                <a
                  href={`tel:${c.phone}`}
                  className="flex-1 py-2.5 bg-[#2457C5] hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow transition-all"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {c.phone}</span>
                </a>

                {c.whatsapp && (
                  <a
                    href={`https://wa.me/${c.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 shadow transition-all"
                    title="WhatsApp Chat"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </a>
                )}

                {(currentRole === 'command' || currentRole === 'admin') && c.status === 'Pending' && (
                  <button
                    onClick={() => updateContactStatus(c.id, 'Approved')}
                    className="py-2.5 px-3 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold rounded-xl text-xs"
                  >
                    Approve
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Approved Community Volunteers List (Always visible in both modes per Section 14.4) */}
      {approvedVolunteers.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-[#101A3A]">
                Approved Community Volunteers ({approvedVolunteers.length})
              </h2>
              <p className="text-xs text-slate-500">
                Verified local citizens trained in first aid, chainsaw clearance, and relief logistics.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {approvedVolunteers.map((v) => (
              <div
                key={v.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
              >
                <div>
                  <strong className="text-xs font-extrabold text-[#101A3A] block">{v.name}</strong>
                  <span className="text-[11px] text-slate-500 block">{v.area}</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {v.skills.map((s) => (
                      <span
                        key={s}
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-[#2457C5]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                {(v.consentToShowPhone || currentRole === 'admin' || currentRole === 'command') && (
                  <a
                    href={`tel:${v.phone}`}
                    className="px-3 py-1.5 bg-white border border-slate-200 hover:border-[#2457C5] rounded-xl text-xs font-bold text-[#2457C5] flex items-center gap-1 shrink-0"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Call</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Command Post Volunteer Task Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-[#101A3A]">Post Volunteer Task Request</h3>
              <button onClick={() => setIsTaskModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handlePostTaskSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Task Description</label>
                <input
                  type="text"
                  value={tTitle}
                  onChange={(e) => setTTitle(e.target.value)}
                  placeholder="e.g. Need 3 chainsaw volunteers at MVP Colony Sector 4"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Area / Ward</label>
                <input
                  type="text"
                  value={tArea}
                  onChange={(e) => setTArea(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Skill Needed</label>
                <select
                  value={tSkill}
                  onChange={(e) => setTSkill(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                >
                  <option value="Tree cutting">Tree cutting</option>
                  <option value="First aid">First aid</option>
                  <option value="Food distribution">Food distribution</option>
                  <option value="Driving">Driving</option>
                  <option value="Translation">Translation</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#D32F2F] text-white rounded-xl shadow"
                >
                  Publish Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Suggest Contact Modal */}
      {isSuggestModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-[#101A3A]">Suggest Emergency Contact</h3>
              <button onClick={() => setIsSuggestModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSuggestContactSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Organization / Contact Name</label>
                <input
                  type="text"
                  value={cName}
                  onChange={(e) => setCName(e.target.value)}
                  placeholder="e.g. MVP Colony Relief Depot"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={cCat}
                  onChange={(e) => setCCat(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                >
                  <option value="volunteers_ngo">Volunteers & NGOs</option>
                  <option value="medical">Medical & Hospitals</option>
                  <option value="control_room">Disaster Control Room</option>
                  <option value="electricity_water">Electricity & Water</option>
                  <option value="animal_wildlife">Animal & Wildlife</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={cPhone}
                  onChange={(e) => setCPhone(e.target.value)}
                  placeholder="e.g. +91 98480 00000"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Area / Zone Covered</label>
                <input
                  type="text"
                  value={cArea}
                  onChange={(e) => setCArea(e.target.value)}
                  placeholder="e.g. MVP Colony, Sector 4"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={cDesc}
                  onChange={(e) => setCDesc(e.target.value)}
                  placeholder="What assistance do they provide?"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSuggestModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#2457C5] text-white rounded-xl shadow"
                >
                  Submit for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Join as Volunteer Modal */}
      {isVolunteerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-[#101A3A]">Join as Emergency Volunteer</h3>
              <button onClick={() => setIsVolunteerModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleVolunteerSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={vName}
                  onChange={(e) => setVName(e.target.value)}
                  placeholder="e.g. Rajesh Kumar"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={vPhone}
                  onChange={(e) => setVPhone(e.target.value)}
                  placeholder="e.g. +91 98480 12345"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Area / Neighborhood</label>
                <input
                  type="text"
                  value={vArea}
                  onChange={(e) => setVArea(e.target.value)}
                  placeholder="e.g. Maddilapalem / Seethammadhara"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Skills & Capabilities</label>
                <div className="grid grid-cols-2 gap-2">
                  {['First aid', 'Tree cutting', 'Driving', 'Medical', 'Food distribution', 'Translation'].map((skill) => (
                    <label key={skill} className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={vSkills.includes(skill)}
                        onChange={() => toggleSkill(skill)}
                        className="rounded text-[#2457C5] focus:ring-[#2457C5]"
                      />
                      <span>{skill}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2">
                <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>Your phone number is shown to municipal staff only, not to the public, unless you choose to share it.</span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsVolunteerModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow"
                >
                  Register as Volunteer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
