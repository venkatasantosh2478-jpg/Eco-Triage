import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { HeroProfile } from '../types.ts';
import {
  Heart,
  Plus,
  Shield,
  Sparkles,
  Users,
  X,
  Trash2,
  Edit,
  Upload,
  Search,
  Award,
  CheckCircle2,
} from 'lucide-react';

export const OurHeroesPage: React.FC = () => {
  const {
    heroes,
    toggleLikeHero,
    likedHeroIds,
    suggestHero,
    addHero,
    updateHero,
    deleteHero,
    currentRole,
  } = useApp();

  const [activeDept, setActiveDept] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);
  const [editingHero, setEditingHero] = useState<HeroProfile | null>(null);
  const [isAddHeroModalOpen, setIsAddHeroModalOpen] = useState(false);

  // Suggest Form State
  const [sugName, setSugName] = useState('');
  const [sugRole, setSugRole] = useState('');
  const [sugDept, setSugDept] = useState<HeroProfile['department']>('Municipal');
  const [sugStory, setSugStory] = useState('');

  // Admin Hero Form State
  const [heroFormName, setHeroFormName] = useState('');
  const [heroFormRole, setHeroFormRole] = useState('');
  const [heroFormDept, setHeroFormDept] = useState<HeroProfile['department']>('Municipal');
  const [heroFormStory, setHeroFormStory] = useState('');
  const [heroFormImage, setHeroFormImage] = useState('');

  const departments = [
    'All',
    'Municipal',
    'Electricity',
    'Fire and Rescue',
    'Medical',
    'Police',
    'Volunteers',
  ];

  const approvedHeroes = heroes.filter((h) => h.status === 'approved' || currentRole === 'admin');
  const heroOfMonth = approvedHeroes.find((h) => h.isHeroOfMonth) || approvedHeroes[0];

  const filteredHeroes = approvedHeroes.filter((h) => {
    const matchesDept = activeDept === 'All' || h.department === activeDept;
    const matchesSearch =
      !searchQuery.trim() ||
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.story.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const totalSalutes = heroes.reduce((acc, h) => acc + (h.thankCount || 0), 0);

  const handleSuggestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sugName || !sugStory) return;
    suggestHero(sugName, sugRole, sugDept, sugStory);
    setIsSuggestModalOpen(false);
    setSugName('');
    setSugRole('');
    setSugStory('');
  };

  const handleOpenAddModal = () => {
    setEditingHero(null);
    setHeroFormName('');
    setHeroFormRole('');
    setHeroFormDept('Municipal');
    setHeroFormStory('');
    setHeroFormImage('');
    setIsAddHeroModalOpen(true);
  };

  const handleOpenEditModal = (hero: HeroProfile) => {
    setEditingHero(hero);
    setHeroFormName(hero.name);
    setHeroFormRole(hero.role);
    setHeroFormDept(hero.department);
    setHeroFormStory(hero.story);
    setHeroFormImage(hero.imageUrl || '');
    setIsAddHeroModalOpen(true);
  };

  const handleSaveHeroAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroFormName || !heroFormStory) return;

    if (editingHero) {
      updateHero({
        ...editingHero,
        name: heroFormName,
        role: heroFormRole,
        department: heroFormDept,
        story: heroFormStory,
        imageUrl: heroFormImage || undefined,
      });
    } else {
      addHero({
        name: heroFormName,
        role: heroFormRole,
        department: heroFormDept,
        story: heroFormStory,
        sample: false,
        avatarSeed: heroFormName.toLowerCase().replace(/\s+/g, ''),
        imageUrl: heroFormImage || undefined,
        status: 'approved',
      });
    }
    setIsAddHeroModalOpen(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setFn: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) setFn(ev.target.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8">
      {/* Title & Stats Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wide">
            <Award className="w-3.5 h-3.5 text-yellow-300" />
            <span>Coastal Frontline Responders</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Our Heroes (Disaster Responders)
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            Every frontline worker, municipal worker, electrician, and volunteer risks their safety to clear roads and save lives. Tap any card below to send a salute!
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3 shrink-0">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl text-center min-w-[90px]">
            <span className="text-2xl font-black text-yellow-300 block">{heroes.length}</span>
            <span className="text-[10px] uppercase font-bold text-slate-300">Responders</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl text-center min-w-[90px]">
            <span className="text-2xl font-black text-red-400 block">{totalSalutes}</span>
            <span className="text-[10px] uppercase font-bold text-slate-300">Total Salutes</span>
          </div>

          <div className="flex flex-col gap-2">
            {currentRole === 'admin' && (
              <button
                onClick={handleOpenAddModal}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Admin: Add Hero Card</span>
              </button>
            )}

            <button
              onClick={() => setIsSuggestModalOpen(true)}
              className="px-4 py-2.5 bg-[#2457C5] hover:bg-blue-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Family / Responder Hero</span>
            </button>
          </div>
        </div>
      </div>

      {/* Featured "Hero of the Month" Card with 3D animation & per-user Salute toggle */}
      {heroOfMonth && (
        <div className="perspective-1000">
          <div className="hero-3d-card bg-gradient-to-r from-[#101A3A] via-[#1E40AF] to-[#2457C5] text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-6 transform transition-all duration-300 hover:scale-[1.01]">
            <div className="relative flex-shrink-0">
              {heroOfMonth.imageUrl ? (
                <img
                  src={heroOfMonth.imageUrl}
                  alt={heroOfMonth.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-yellow-400 shadow-2xl"
                />
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-blue-500/30 border-4 border-yellow-400/80 flex items-center justify-center text-4xl font-black text-yellow-300 shadow-2xl">
                  {heroOfMonth.name[0]}
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 p-1.5 bg-yellow-400 text-slate-900 rounded-full font-black text-[10px] uppercase shadow">
                ★ Top
              </span>
            </div>

            <div className="flex-1 text-center md:text-left space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 text-xs font-extrabold uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Featured Hero of the Month</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">{heroOfMonth.name}</h2>
              <div className="text-xs text-blue-200 font-semibold">
                {heroOfMonth.role} • {heroOfMonth.department} Unit
              </div>
              <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed font-medium">
                &ldquo;{heroOfMonth.story}&rdquo;
              </p>
            </div>

            <div className="flex-shrink-0">
              {(() => {
                const isLiked = likedHeroIds.includes(heroOfMonth.id);
                return (
                  <button
                    type="button"
                    onClick={() => toggleLikeHero(heroOfMonth.id)}
                    className={`px-6 py-3.5 rounded-2xl font-extrabold text-xs sm:text-sm shadow-xl flex items-center gap-2.5 transition-all active:scale-95 ${
                      isLiked
                        ? 'bg-red-500 text-white ring-4 ring-red-400/40 shadow-red-500/30'
                        : 'bg-white hover:bg-rose-50 text-slate-900 hover:text-red-600'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-white text-white animate-pulse' : 'text-red-500'}`} />
                    <span>{isLiked ? 'Saluted ❤️' : 'Send Salute'} ({heroOfMonth.thankCount})</span>
                  </button>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Search & Department Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search heroes by name, role, or squad..."
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

        {/* Department Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setActiveDept(dept)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeDept === dept
                  ? 'bg-[#101A3A] text-white shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Empty Search State */}
      {filteredHeroes.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <Users className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-extrabold text-slate-700">No heroes found</h3>
          <p className="text-xs text-slate-500">
            No responder matches active department filter &ldquo;{activeDept}&rdquo; or search query &ldquo;{searchQuery}&rdquo;.
          </p>
          <button
            onClick={() => {
              setActiveDept('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-[#2457C5] text-white font-bold rounded-xl text-xs inline-block"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Grid of 3D Tilt Hero Cards with Per-User 1-Like Toggle */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 perspective-1000">
        {filteredHeroes.map((hero) => {
          const isLiked = likedHeroIds.includes(hero.id);

          return (
            <div
              key={hero.id}
              className={`hero-3d-card bg-white rounded-2xl p-5 border transition-all duration-300 transform hover:-translate-y-1 hover:rotate-x-2 hover:rotate-y-1 flex flex-col justify-between relative group ${
                isLiked
                  ? 'border-red-300 bg-gradient-to-b from-white to-red-50/20 shadow-md'
                  : 'border-slate-200 shadow-xs hover:shadow-xl hover:border-[#2457C5]'
              }`}
            >
              {/* Admin Actions overlay on card */}
              {currentRole === 'admin' && (
                <div className="absolute top-3 right-3 flex items-center gap-1 z-10">
                  <button
                    onClick={() => handleOpenEditModal(hero)}
                    className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    title="Edit Hero"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteHero(hero.id)}
                    className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    title="Delete Hero"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {hero.imageUrl ? (
                      <img
                        src={hero.imageUrl}
                        alt={hero.name}
                        className="w-13 h-13 rounded-2xl object-cover border-2 border-blue-200 shadow-xs"
                      />
                    ) : (
                      <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-700 text-white font-black text-xl flex items-center justify-center shadow-xs">
                        {hero.name[0]}
                      </div>
                    )}
                    {isLiked && (
                      <span className="absolute -top-1 -right-1 p-0.5 bg-red-500 text-white rounded-full" title="Saluted by you">
                        <Heart className="w-3 h-3 fill-white" />
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-[#2457C5] inline-block mb-1">
                      {hero.department}
                    </span>
                    <h3 className="font-extrabold text-sm text-[#101A3A] truncate">{hero.name}</h3>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-[#2457C5] font-bold block">{hero.role}</span>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-3 mt-1">
                    &ldquo;{hero.story}&rdquo;
                  </p>
                </div>
              </div>

              {/* Bottom Salute / Like Button area on EVERY CARD */}
              <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between gap-2">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  <span>{hero.status === 'pending' ? 'Pending' : 'Verified'}</span>
                </span>

                <button
                  type="button"
                  onClick={() => toggleLikeHero(hero.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-xs ${
                    isLiked
                      ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/30'
                      : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                  }`}
                  title={isLiked ? 'Tap to remove salute' : 'Tap to send salute'}
                >
                  <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-white text-white animate-pulse' : 'fill-rose-500 text-rose-600'}`} />
                  <span>{isLiked ? 'Saluted ❤️' : 'Salute'}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isLiked ? 'bg-red-700 text-white' : 'bg-rose-100 text-rose-800'}`}>
                    {hero.thankCount}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Suggest Hero Modal */}
      {isSuggestModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-[#101A3A]">Add Family or Responder Hero Card</h3>
              <button onClick={() => setIsSuggestModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSuggestSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Responder Full Name</label>
                <input
                  type="text"
                  value={sugName}
                  onChange={(e) => setSugName(e.target.value)}
                  placeholder="e.g. K. Narayana"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Designation / Role</label>
                <input
                  type="text"
                  value={sugRole}
                  onChange={(e) => setSugRole(e.target.value)}
                  placeholder="e.g. Chainsaw Unit Operator"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Department Wing</label>
                <select
                  value={sugDept}
                  onChange={(e) => setSugDept(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                >
                  <option value="Municipal">Municipal Clearance Squad</option>
                  <option value="Electricity">State Electricity Board</option>
                  <option value="Fire and Rescue">Fire and Rescue</option>
                  <option value="Medical">Medical Hospital Aid</option>
                  <option value="Police">Traffic Police</option>
                  <option value="Volunteers">Community Volunteers</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Contribution Story</label>
                <textarea
                  rows={3}
                  value={sugStory}
                  onChange={(e) => setSugStory(e.target.value)}
                  placeholder="Describe how this responder cleared routes..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium"
                  required
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
                  Submit Hero Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Add/Edit Hero Modal */}
      {isAddHeroModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-[#101A3A]">
                {editingHero ? 'Admin: Edit Hero Profile' : 'Admin: Add New Hero Card'}
              </h3>
              <button onClick={() => setIsAddHeroModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveHeroAdmin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Hero Full Name</label>
                <input
                  type="text"
                  value={heroFormName}
                  onChange={(e) => setHeroFormName(e.target.value)}
                  placeholder="e.g. Captain V. Raman"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Designation / Role</label>
                <input
                  type="text"
                  value={heroFormRole}
                  onChange={(e) => setHeroFormRole(e.target.value)}
                  placeholder="e.g. Lead Fire Rescue Officer"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Department Wing</label>
                <select
                  value={heroFormDept}
                  onChange={(e) => setHeroFormDept(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                >
                  <option value="Municipal">Municipal</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Fire and Rescue">Fire and Rescue</option>
                  <option value="Medical">Medical</option>
                  <option value="Police">Police</option>
                  <option value="Volunteers">Volunteers</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Hero Image URL or Upload</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={heroFormImage}
                    onChange={(e) => setHeroFormImage(e.target.value)}
                    placeholder="https://... or upload photo"
                    className="flex-1 p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                  />
                  <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl cursor-pointer text-xs font-bold flex items-center gap-1 shrink-0">
                    <Upload className="w-3.5 h-3.5 text-slate-600" />
                    <span>File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, setHeroFormImage)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Hero Story</label>
                <textarea
                  rows={3}
                  value={heroFormStory}
                  onChange={(e) => setHeroFormStory(e.target.value)}
                  placeholder="Describe heroic action..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddHeroModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow"
                >
                  Save Hero Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
