import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { getSeverityColors } from '../../utils/rules.ts';
import { CheckCircle2, Clock, MapPin, Truck, Zap, ArrowRight } from 'lucide-react';

export const MyAssignmentsView: React.FC = () => {
  const { incidents, updateIncidentStatus, setSelectedIncidentId } = useApp();

  // Assigned or active clearance jobs
  const assignments = incidents
    .filter((i) => i.status === 'Assigned' || i.status === 'On the way' || i.status === 'Working')
    .sort((a, b) => b.priority_score - a.priority_score);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
          Clearance Squad Dispatch
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-[#101A3A] tracking-tight mt-1">
          My Active Assignments
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Priority-ranked road blockages assigned to your field squad. Update your operational state in one tap.
        </p>
      </div>

      <div className="space-y-4">
        {assignments.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
            <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto" />
            <h3 className="font-bold text-slate-800">No pending assignments</h3>
            <p className="text-xs text-slate-500">All current roadblocks have been successfully cleared!</p>
          </div>
        ) : (
          assignments.map((inc) => {
            const colors = getSeverityColors(inc.severity);

            return (
              <div
                key={inc.id}
                className="bg-white rounded-3xl p-6 border-2 border-slate-200 hover:border-[#2457C5] shadow-xs transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base text-white ${colors.dot}`}
                    >
                      {inc.priority_score.toFixed(1)}
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-[#101A3A]">{inc.location}</h2>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="font-semibold text-[#2457C5]">{inc.roadType}</span>
                        <span>•</span>
                        <span>{inc.zone}</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`self-start sm:self-center text-xs font-black uppercase px-3 py-1 rounded-full border ${colors.bg} ${colors.text} ${colors.border}`}
                  >
                    Current Status: {inc.status}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between text-slate-600">
                    <span>Assigned Squad:</span>
                    <strong className="text-slate-900">{inc.assignedTo || 'Squad 4'}</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Machinery Needed:</span>
                    <strong className="text-[#2457C5]">{inc.equipment}</strong>
                  </div>
                  {inc.note && (
                    <div className="pt-1 text-slate-700 italic">"{inc.note}"</div>
                  )}
                </div>

                {/* 3 Large Action Buttons: On the way, Working, Done */}
                <div className="grid grid-cols-3 gap-2.5 pt-2">
                  <button
                    onClick={() => updateIncidentStatus(inc.id, 'On the way', 'Squad en route to location.')}
                    className={`py-3 px-2 rounded-xl text-xs font-black transition-all ${
                      inc.status === 'On the way'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-blue-50 text-[#2457C5] hover:bg-blue-100'
                    }`}
                  >
                    1. On the way
                  </button>

                  <button
                    onClick={() => updateIncidentStatus(inc.id, 'Working', 'Chainsaws deployed, cutting tree branches.')}
                    className={`py-3 px-2 rounded-xl text-xs font-black transition-all ${
                      inc.status === 'Working'
                        ? 'bg-amber-600 text-white shadow-md'
                        : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                    }`}
                  >
                    2. Working Now
                  </button>

                  <button
                    onClick={() => updateIncidentStatus(inc.id, 'Cleared', 'Road fully cleared and opened to traffic.')}
                    className="py-3 px-2 bg-[#16834A] hover:bg-green-700 text-white rounded-xl text-xs font-black shadow transition-all active:scale-95"
                  >
                    3. Mark Done ✓
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
