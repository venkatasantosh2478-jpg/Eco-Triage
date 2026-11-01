import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { getSeverityColors } from '../../utils/rules.ts';
import { AlertTriangle, Clock, MapPin, Plus, Zap } from 'lucide-react';

export const MyReportsView: React.FC = () => {
  const { incidents, currentUser, setSelectedIncidentId, setActivePage } = useApp();

  const userName = currentUser ? currentUser.name : 'Lakshmi (Field)';

  const myReports = incidents.filter(
    (i) =>
      i.reportedBy.toLowerCase().includes(userName.toLowerCase().split(' ')[0]) ||
      i.reportedBy.toLowerCase().includes('lakshmi') ||
      i.reportedBy.toLowerCase().includes('field')
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#2457C5] uppercase tracking-wider">
            Field Officer Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#101A3A] tracking-tight mt-1">
            My Submitted Hazard Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time status updates and triage scores for hazards submitted by your unit.
          </p>
        </div>

        <button
          onClick={() => setActivePage('report')}
          className="self-start sm:self-auto px-4 py-2.5 bg-[#D32F2F] hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow"
        >
          <Plus className="w-4 h-4" />
          <span>New Hazard Report</span>
        </button>
      </div>

      <div className="space-y-3">
        {myReports.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
            <Clock className="w-8 h-8 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800">No reports submitted yet</h3>
            <p className="text-xs text-slate-500">Take a photo from the field to log your first report.</p>
          </div>
        ) : (
          myReports.map((inc) => {
            const colors = getSeverityColors(inc.severity);
            return (
              <div
                key={inc.id}
                onClick={() => setSelectedIncidentId(inc.id)}
                className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-[#2457C5] shadow-xs transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm text-white ${colors.dot}`}
                  >
                    {inc.priority_score.toFixed(1)}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-[#101A3A]">{inc.location}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span>{inc.roadType}</span>
                      <span>•</span>
                      <span>{inc.createdAt}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full border ${colors.bg} ${colors.text} ${colors.border}`}
                  >
                    {inc.status}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
