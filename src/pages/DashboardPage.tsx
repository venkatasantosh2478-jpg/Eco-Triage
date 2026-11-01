import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { SAMPLE_CREWS } from '../utils/storage.ts';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  HardHat,
  Layers,
  LifeBuoy,
  PieChart,
  Shield,
  Truck,
  Users,
  Zap,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { incidents, helpPoints, activityLogs, currentRole, setActivePage, setSelectedIncidentId } = useApp();

  const [dateRange, setDateRange] = useState('7d');

  // Stats calculation
  const total = incidents.length;
  const critical = incidents.filter((i) => i.severity === 'Critical').length;
  const pending = incidents.filter((i) => i.status === 'Pending').length;
  const cleared = incidents.filter((i) => i.status === 'Cleared').length;
  const freeCrews = SAMPLE_CREWS.filter((c) => c.status === 'Free').length;

  // Severity counts
  const high = incidents.filter((i) => i.severity === 'High').length;
  const medium = incidents.filter((i) => i.severity === 'Medium').length;
  const low = incidents.filter((i) => i.severity === 'Low').length;

  // Export CSV function for Command & Admin
  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Location',
      'Latitude',
      'Longitude',
      'Priority Score',
      'Severity',
      'Obstruction',
      'Hazard',
      'Road Type',
      'Status',
      'Reported By',
      'Created At',
    ];

    const rows = incidents.map((i) => [
      i.id,
      `"${i.location.replace(/"/g, '""')}"`,
      i.lat,
      i.lng,
      i.priority_score,
      i.severity,
      i.obstruction,
      i.hazard,
      `"${i.roadType}"`,
      i.status,
      `"${i.reportedBy}"`,
      `"${i.createdAt}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ecotriage_incidents_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Top Header & Range selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#2457C5] uppercase tracking-wider">
            Operational Intelligence
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#101A3A] tracking-tight mt-1">
            Command Operations Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Aggregated municipal clearance metrics, crew dispatch statuses, and shelter occupancies.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-xs focus:outline-none"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>

          {(currentRole === 'command' || currentRole === 'admin') && (
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 bg-[#2457C5] hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow active:scale-95 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          )}
        </div>
      </div>

      {/* 5 KPI Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 block">Total Reports</span>
          <strong className="text-2xl sm:text-3xl font-black text-[#101A3A] mt-1 block">
            {total}
          </strong>
          <span className="text-[10px] text-green-600 font-bold">↑ 12% vs yesterday</span>
        </div>

        <div className="p-4 rounded-2xl bg-red-50/40 border border-red-200 shadow-xs">
          <span className="text-xs font-bold text-red-600 block">Critical Hazards</span>
          <strong className="text-2xl sm:text-3xl font-black text-[#D32F2F] mt-1 block">
            {critical}
          </strong>
          <span className="text-[10px] text-red-500 font-semibold">Hospital lifelines</span>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200 shadow-xs">
          <span className="text-xs font-bold text-amber-600 block">Pending Queue</span>
          <strong className="text-2xl sm:text-3xl font-black text-amber-700 mt-1 block">
            {pending}
          </strong>
          <span className="text-[10px] text-amber-600 font-semibold">Awaiting squads</span>
        </div>

        <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-200 shadow-xs">
          <span className="text-xs font-bold text-[#2457C5] block">Crews Free</span>
          <strong className="text-2xl sm:text-3xl font-black text-[#2457C5] mt-1 block">
            {freeCrews}
          </strong>
          <span className="text-[10px] text-blue-600 font-semibold">Ready to dispatch</span>
        </div>

        <div className="p-4 rounded-2xl bg-green-50/40 border border-green-200 shadow-xs col-span-2 sm:col-span-1">
          <span className="text-xs font-bold text-green-700 block">Cleared Today</span>
          <strong className="text-2xl sm:text-3xl font-black text-[#16834A] mt-1 block">
            {cleared}
          </strong>
          <span className="text-[10px] text-green-600 font-semibold">Roads reopened</span>
        </div>
      </div>

      {/* Visual Charts: 7-Day Trend Bar Chart & Severity Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 7-Day Trend (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="font-extrabold text-base text-[#101A3A]">Hazard Trend (Last 7 Days)</h2>
              <span className="text-xs text-slate-400">Daily reports vs cleared bottlenecks</span>
            </div>
            <BarChart3 className="w-5 h-5 text-slate-400" />
          </div>

          {/* SVG Bar Chart */}
          <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-2 px-2">
            {[
              { day: 'Mon', reports: 42, cleared: 38 },
              { day: 'Tue', reports: 68, cleared: 52 },
              { day: 'Wed', reports: 95, cleared: 78 },
              { day: 'Thu', reports: 140, cleared: 110 },
              { day: 'Fri', reports: 115, cleared: 125 },
              { day: 'Sat', reports: 80, cleared: 95 },
              { day: 'Sun', reports: 55, cleared: 60 },
            ].map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div className="w-full flex items-end justify-center gap-1.5 h-44">
                  {/* Reports bar */}
                  <div
                    style={{ height: `${(d.reports / 150) * 100}%` }}
                    className="w-1/2 bg-[#D32F2F]/80 rounded-t-md hover:bg-red-700 transition-all"
                    title={`Reports: ${d.reports}`}
                  />
                  {/* Cleared bar */}
                  <div
                    style={{ height: `${(d.cleared / 150) * 100}%` }}
                    className="w-1/2 bg-[#16834A]/80 rounded-t-md hover:bg-green-700 transition-all"
                    title={`Cleared: ${d.cleared}`}
                  />
                </div>
                <span className="text-[11px] font-bold text-slate-500">{d.day}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-6 text-xs font-semibold text-slate-600 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-[#D32F2F]" />
              <span>Incoming Ingested Reports</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-[#16834A]" />
              <span>Hazards Cleared</span>
            </div>
          </div>
        </div>

        {/* Severity & Status Breakdown (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="font-extrabold text-base text-[#101A3A]">Severity Breakdown</h2>
            <PieChart className="w-5 h-5 text-slate-400" />
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-[#D32F2F]">Critical (9.0+)</span>
                <span>{critical} ({Math.round((critical / (total || 1)) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-[#D32F2F] h-2 rounded-full"
                  style={{ width: `${(critical / (total || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-[#EF6C00]">High (7.0 - 8.9)</span>
                <span>{high} ({Math.round((high / (total || 1)) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-[#EF6C00] h-2 rounded-full"
                  style={{ width: `${(high / (total || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-amber-600">Medium (4.0 - 6.9)</span>
                <span>{medium} ({Math.round((medium / (total || 1)) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-[#F2A900] h-2 rounded-full"
                  style={{ width: `${(medium / (total || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-[#16834A]">Low (&lt;4.0)</span>
                <span>{low} ({Math.round((low / (total || 1)) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-[#16834A] h-2 rounded-full"
                  style={{ width: `${(low / (total || 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-xs text-slate-500">
            Average time from intake to crew assignment: <strong className="text-slate-800">18 minutes</strong>.
          </div>
        </div>
      </div>

      {/* Crews Panel & Relief Camp Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Squad Status Panel (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="font-extrabold text-base text-[#101A3A]">Municipal Clearance Squads</h2>
            <span className="text-xs text-slate-400 font-bold">{SAMPLE_CREWS.length} Units Deployed</span>
          </div>

          <div className="space-y-2">
            {SAMPLE_CREWS.map((crew) => (
              <div
                key={crew.id}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#2457C5] flex items-center justify-center">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-800 font-bold">{crew.name}</strong>
                    <span className="text-[11px] text-slate-500">{crew.type}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      crew.status === 'Free'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {crew.status}
                  </span>
                  {crew.assignedIncidentId && (
                    <button
                      onClick={() => {
                        setSelectedIncidentId(crew.assignedIncidentId!);
                      }}
                      className="text-[11px] font-bold text-[#2457C5] hover:underline"
                    >
                      View Job
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Log Panel for Admin & Command (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="font-extrabold text-base text-[#101A3A]">Recent Municipal Activity</h2>
            <Activity className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1 text-xs">
            {activityLogs.slice(0, 7).map((log) => (
              <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <strong className="text-slate-900 font-bold">{log.who}</strong>
                  <span className="text-[10px] text-slate-400">{log.when}</span>
                </div>
                <p className="text-slate-600 text-[11px]">{log.what}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
