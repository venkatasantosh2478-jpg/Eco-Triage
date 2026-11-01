import React, { useState } from 'react';
import { SAMPLE_ARTICLES, SAMPLE_CYCLONES } from '../utils/storage.ts';
import { CycloneRecord } from '../types.ts';
import { useApp } from '../context/AppContext.tsx';
import { Calendar, ExternalLink, Globe, Plus, Trash2, Edit, X } from 'lucide-react';

export const CycloneHistoryPage: React.FC = () => {
  const { currentRole, showToast } = useApp();
  const [cyclones, setCyclones] = useState<CycloneRecord[]>(SAMPLE_CYCLONES);
  const [selectedYear, setSelectedYear] = useState<string>('all');

  // Admin Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCyc, setEditingCyc] = useState<CycloneRecord | null>(null);
  const [formName, setFormName] = useState('');
  const [formYear, setFormYear] = useState(2024);
  const [formImpact, setFormImpact] = useState('');
  const [formArea, setFormArea] = useState('');
  const [formLesson, setFormLesson] = useState('');
  const [formSource, setFormSource] = useState('');
  const [formWikiUrl, setFormWikiUrl] = useState('');

  const years = ['all', '2023', '2022', '2021', '2014'];

  const filteredCyclones = cyclones.filter((c) => {
    if (selectedYear === 'all') return true;
    return c.year.toString() === selectedYear;
  });

  const handleOpenAddModal = () => {
    setEditingCyc(null);
    setFormName('');
    setFormYear(2024);
    setFormImpact('');
    setFormArea('Visakhapatnam Coast');
    setFormLesson('');
    setFormSource('Official IMD Bulletin');
    setFormWikiUrl('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cyc: CycloneRecord) => {
    setEditingCyc(cyc);
    setFormName(cyc.name);
    setFormYear(cyc.year);
    setFormImpact(cyc.impact);
    setFormArea(cyc.affectedArea);
    setFormLesson(cyc.lessonsLearned);
    setFormSource(cyc.source);
    setFormWikiUrl(cyc.wikiUrl || '');
    setIsModalOpen(true);
  };

  const handleSaveCyclone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formImpact) return;

    if (editingCyc) {
      const updated = cyclones.map((c) =>
        c.id === editingCyc.id
          ? {
              ...c,
              name: formName,
              year: formYear,
              impact: formImpact,
              affectedArea: formArea,
              lessonsLearned: formLesson,
              source: formSource,
              wikiUrl: formWikiUrl || `https://en.wikipedia.org/wiki/Search?search=${encodeURIComponent(formName)}`,
            }
          : c
      );
      setCyclones(updated);
      showToast(`Updated "${formName}"`);
    } else {
      const newCyc: CycloneRecord = {
        id: 'cyc_' + Date.now(),
        name: formName,
        year: formYear,
        impact: formImpact,
        affectedArea: formArea,
        lessonsLearned: formLesson,
        source: formSource,
        wikiUrl: formWikiUrl || `https://en.wikipedia.org/wiki/Search?search=${encodeURIComponent(formName)}`,
      };
      setCyclones([newCyc, ...cyclones]);
      showToast(`Added new cyclone record "${formName}"`);
    }
    setIsModalOpen(false);
  };

  const handleDeleteCyclone = (id: string) => {
    setCyclones(cyclones.filter((c) => c.id !== id));
    showToast('Cyclone record removed');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Title & Admin Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#2457C5] uppercase tracking-wider">
            Official Historical Archive
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#101A3A] tracking-tight mt-1">
            Cyclone History & Scientific Records
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Verified historical meteorological impacts on the Visakhapatnam coastline and civic lessons learned.
          </p>
        </div>

        {(currentRole === 'admin' || currentRole === 'command') && (
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 bg-[#2457C5] hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow active:scale-95 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Admin: Add Cyclone Record</span>
          </button>
        )}
      </div>

      {/* Year Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          <span>Year Filter:</span>
        </span>
        {years.map((y) => (
          <button
            key={y}
            onClick={() => setSelectedYear(y)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedYear === y
                ? 'bg-[#2457C5] text-white shadow-xs'
                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
            }`}
          >
            {y === 'all' ? 'All Years' : y}
          </button>
        ))}
      </div>

      {/* Vertical Timeline */}
      <div className="space-y-6 relative border-l-2 border-blue-200 ml-4 sm:ml-6 pl-6 sm:pl-8">
        {filteredCyclones.map((cyc) => {
          const wikiLink = cyc.wikiUrl || `https://en.wikipedia.org/wiki/Search?search=${encodeURIComponent(cyc.name)}`;

          return (
            <div
              key={cyc.id}
              className="relative bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:border-[#2457C5] transition-all space-y-4 group"
            >
              {/* Timeline Circle */}
              <span className="absolute -left-[35px] sm:-left-[43px] top-6 w-5 h-5 rounded-full bg-[#2457C5] ring-4 ring-blue-100 flex items-center justify-center text-white text-[10px] font-bold" />

              {/* Admin Actions */}
              {(currentRole === 'admin' || currentRole === 'command') && (
                <div className="absolute top-4 right-4 flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditModal(cyc)}
                    className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    title="Edit Record"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteCyclone(cyc.id)}
                    className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    title="Delete Record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div className="space-y-2 pb-3 border-b border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-extrabold text-[#2457C5] tracking-wide uppercase">
                      {cyc.year} Storm Event
                    </span>
                    <h2 className="text-xl font-black text-[#101A3A] leading-tight">{cyc.name}</h2>
                  </div>
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full self-start">
                    {cyc.affectedArea}
                  </span>
                </div>

                {/* PROMINENT WIKIPEDIA LINK BELOW CYCLONE NAME */}
                <div className="pt-1">
                  <a
                    href={wikiLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-[#2457C5] font-extrabold text-xs px-3 py-1.5 rounded-xl border border-blue-200 shadow-2xs transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5 text-[#2457C5]" />
                    <span>Wikipedia Reference & Article</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                  </a>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {cyc.impact}
              </p>

              <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 text-xs">
                <strong className="block text-[#2457C5] font-extrabold text-[11px] uppercase mb-0.5">
                  Civic Clearance Lesson Learned:
                </strong>
                <p className="text-slate-800 font-semibold">{cyc.lessonsLearned}</p>
              </div>

              <div className="flex items-center justify-between pt-2 text-xs text-slate-400">
                <span className="font-medium truncate mr-2">Source: {cyc.source}</span>
                <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  Verified IMD Data
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Articles & Research Reports Section */}
      <div className="pt-6 border-t border-slate-200 space-y-4">
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Scientific Literature
          </span>
          <h2 className="text-xl font-black text-[#101A3A] tracking-tight">
            Research Reports & Disaster Studies
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SAMPLE_ARTICLES.map((art) => (
            <div
              key={art.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all"
            >
              <div>
                <span className="text-[10px] font-bold uppercase text-[#2457C5] block mb-1">
                  {art.source} • {art.date}
                </span>
                <h3 className="font-extrabold text-sm text-[#101A3A] mb-2 leading-snug">
                  {art.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium mb-4">
                  {art.summary}
                </p>
              </div>

              <a
                href={art.link}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-[#2457C5] hover:underline flex items-center gap-1 self-start"
              >
                <span>Read source paper</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Add/Edit Cyclone Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-[#101A3A]">
                {editingCyc ? 'Edit Cyclone Record' : 'Add New Cyclone Record'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCyclone} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Cyclone Name</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Severe Cyclonic Storm Michaung"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Year</label>
                  <input
                    type="number"
                    value={formYear}
                    onChange={(e) => setFormYear(parseInt(e.target.value) || 2024)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Affected Area</label>
                  <input
                    type="text"
                    value={formArea}
                    onChange={(e) => setFormArea(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Wikipedia URL</label>
                <input
                  type="url"
                  value={formWikiUrl}
                  onChange={(e) => setFormWikiUrl(e.target.value)}
                  placeholder="https://en.wikipedia.org/wiki/..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Impact Summary</label>
                <textarea
                  rows={2}
                  value={formImpact}
                  onChange={(e) => setFormImpact(e.target.value)}
                  placeholder="Describe impact..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Lesson Learned</label>
                <textarea
                  rows={2}
                  value={formLesson}
                  onChange={(e) => setFormLesson(e.target.value)}
                  placeholder="Civic clearance lesson learned..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#2457C5] text-white rounded-xl shadow"
                >
                  Save Cyclone Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
