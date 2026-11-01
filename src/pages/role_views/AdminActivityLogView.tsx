import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Activity, Clock, Filter, Search, User } from 'lucide-react';

export const AdminActivityLogView: React.FC = () => {
  const { activityLogs } = useApp();
  const [filterUser, setFilterUser] = useState('All');
  const [search, setSearch] = useState('');

  const users = ['All', ...new Set(activityLogs.map((l) => l.who))];

  const filteredLogs = activityLogs.filter((log) => {
    const matchesUser = filterUser === 'All' || log.who === filterUser;
    const matchesSearch = log.what.toLowerCase().includes(search.toLowerCase());
    return matchesUser && matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          System Audit Trail
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-[#101A3A] tracking-tight mt-1">
          Activity & Governance Log
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Immutable device event trail recording crew dispatches, priority overrides, and shelter updates.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search activity description..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#2457C5]"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Filter User:</span>
          <select
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
          >
            {users.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">No matching logs found.</div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-4 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-[#101A3A]">{log.who}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-[11px] text-slate-500 font-medium">{log.when}</span>
                </div>
                <p className="text-slate-700 font-medium">{log.what}</p>
              </div>
              <span className="text-[10px] font-mono text-slate-400">{log.id}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
