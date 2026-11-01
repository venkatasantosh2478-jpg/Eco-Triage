import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { getSeverityColors } from '../utils/rules.ts';
import { getStatusLabelForMode } from '../utils/modeConfig.ts';
import {
  Filter,
  Grid,
  List,
  Zap,
  Search,
} from 'lucide-react';

export const QueuePage: React.FC = () => {
  const {
    incidents,
    setSelectedIncidentId,
    setActivePage,
    avgAiTimeMs,
    deleteIncident,
    currentRole,
    operatingMode,
    language,
    getContent,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<
    'All open' | 'Critical and Pending' | 'All' | 'Critical' | 'Pending' | 'Hospital Routes' | 'Assigned' | 'Cleared'
  >(operatingMode === 'emergency' ? 'Critical and Pending' : 'All open');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [searchQuery, setSearchQuery] = useState('');

  // Section 14.6: Queue default filter is "All open" in Daily mode, "Critical and Pending" in Emergency mode
  useEffect(() => {
    setActiveFilter(operatingMode === 'emergency' ? 'Critical and Pending' : 'All open');
  }, [operatingMode]);

  // Counts
  const totalReports = incidents.length;
  const criticalCount = incidents.filter((i) => i.severity === 'Critical').length;
  const pendingCount = incidents.filter((i) => i.status === 'Pending').length;

  const filtered = incidents.filter((inc) => {
    const matchesSearch =
      inc.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.id.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (activeFilter === 'All open') return inc.status !== 'Cleared';
    if (activeFilter === 'Critical and Pending') {
      return (inc.severity === 'Critical' || inc.severity === 'High') && inc.status !== 'Cleared';
    }
    if (activeFilter === 'Critical') return inc.severity === 'Critical';
    if (activeFilter === 'Pending') return inc.status === 'Pending';
    if (activeFilter === 'Hospital Routes') return inc.roadType === 'Hospital Route';
    if (activeFilter === 'Assigned') return inc.status === 'Assigned' || inc.status === 'In Progress';
    if (activeFilter === 'Cleared') return inc.status === 'Cleared';
    return true;
  });

  // Sort by priority score, highest first, ties by id
  const sorted = [...filtered].sort((a, b) => b.priority_score - a.priority_score);

  return (
    <div className="space-y-6">
      {/* 1. STATS STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#E2E7F0] shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Total Ingested
          </span>
          <span className="text-2xl sm:text-3xl font-black text-[#101A3A]">{totalReports}</span>
        </div>

        <div className="p-4 rounded-2xl bg-red-50/50 border border-red-200 shadow-xs">
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider block mb-1">
            Critical Severity
          </span>
          <span className="text-2xl sm:text-3xl font-black text-[#D32F2F]">{criticalCount}</span>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 shadow-xs">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block mb-1">
            {operatingMode === 'emergency' ? 'Pending Clearance' : 'Open Reports'}
          </span>
          <span className="text-2xl sm:text-3xl font-black text-amber-700">{pendingCount}</span>
        </div>

        <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 shadow-xs">
          <span className="text-xs font-bold text-[#2457C5] uppercase tracking-wider block mb-1">
            Avg AI Triage Time
          </span>
          <span className="text-2xl sm:text-3xl font-black text-[#2457C5]">
            {(avgAiTimeMs / 1000).toFixed(1)}s
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">&lt; 30s benchmark</span>
        </div>
      </div>

      {/* 2. FILTERS & VIEW MODE CONTROLS */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#E2E7F0] shadow-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search location or ID..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#2457C5]"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {(
            [
              'All open',
              'Critical and Pending',
              'All',
              'Critical',
              'Pending',
              'Hospital Routes',
              'Assigned',
              'Cleared',
            ] as const
          ).map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                activeFilter === f
                  ? 'bg-[#2457C5] text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Desktop View Mode Toggle */}
        <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('cards')}
            className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'cards' ? 'bg-white text-[#2457C5] shadow-xs' : 'text-slate-500'
            }`}
            title="Card View"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'table' ? 'bg-white text-[#2457C5] shadow-xs' : 'text-slate-500'
            }`}
            title="Table View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. INCIDENTS LIST */}
      {sorted.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Filter className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-[#101A3A]">
            {getContent('empty_reports_text')}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try choosing another filter chip or submit a new hazard from the field.
          </p>
          <button
            onClick={() => setActivePage('report')}
            className="px-5 py-2.5 bg-[#D32F2F] text-white font-bold rounded-xl text-xs shadow hover:bg-red-700"
          >
            Report Hazard Now
          </button>
        </div>
      ) : viewMode === 'cards' ? (
        /* Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((inc) => {
            const colors = getSeverityColors(inc.severity);
            const displayStatus = getStatusLabelForMode(inc.status, operatingMode, language);

            return (
              <div
                key={inc.id}
                onClick={() => setSelectedIncidentId(inc.id)}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-[#2457C5] transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      {inc.id.toUpperCase()}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {inc.sample && (
                        <span className="text-[10px] font-bold text-slate-400 uppercase border border-slate-200 px-1 rounded">
                          Sample
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${colors.bg} ${colors.text} ${colors.border}`}
                      >
                        {inc.severity}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-base text-[#101A3A] group-hover:text-[#2457C5] transition-colors leading-tight">
                      {inc.location}
                    </h3>
                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                      <span className="font-semibold text-slate-700">{inc.roadType}</span>
                      <span>•</span>
                      <span>{inc.zone.split('(')[0]}</span>
                    </div>
                  </div>

                  {/* Badges row */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 capitalize">
                      {inc.obstruction.replace(/_/g, ' ')}
                    </span>
                    {inc.hazard === 'live_electrical_wire' && (
                      <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-700 font-bold flex items-center gap-1">
                        <Zap className="w-3 h-3 text-red-600" />
                        <span>Live Wire</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none">
                      Score
                    </span>
                    <span className="text-2xl font-black text-[#101A3A]">
                      {inc.priority_score.toFixed(1)}
                    </span>
                  </div>

                  <div className="text-right flex flex-col items-end gap-1">
                    <span
                      className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full ${colors.pillBg} ${colors.text}`}
                    >
                      {displayStatus}
                    </span>
                    <span className="block text-[10px] text-slate-400">{inc.createdAt}</span>
                    {currentRole === 'admin' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteIncident(inc.id);
                        }}
                        className="text-[10px] text-red-600 font-bold hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Obstruction</th>
                  <th className="py-3 px-4">Road Type</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sorted.map((inc) => {
                  const colors = getSeverityColors(inc.severity);
                  const displayStatus = getStatusLabelForMode(inc.status, operatingMode, language);
                  return (
                    <tr
                      key={inc.id}
                      onClick={() => setSelectedIncidentId(inc.id)}
                      className="hover:bg-blue-50/50 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 font-black text-sm text-[#101A3A]">
                        {inc.priority_score.toFixed(1)}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {inc.location}
                        {inc.hazard === 'live_electrical_wire' && (
                          <span className="ml-1 text-red-600 font-bold">⚡</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-black uppercase text-[10px] px-2 py-0.5 rounded-full border ${colors.bg} ${colors.text} ${colors.border}`}
                        >
                          {inc.severity}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 capitalize">
                        {inc.obstruction.replace(/_/g, ' ')}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700">{inc.roadType}</td>
                      <td className="py-3 px-4 font-bold text-slate-800">{displayStatus}</td>
                      <td className="py-3 px-4 text-slate-400">{inc.createdAt}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
