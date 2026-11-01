import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { getSeverityColors } from '../../utils/rules.ts';
import { AlertTriangle, CheckCircle2, ShieldCheck, X, XCircle, Zap } from 'lucide-react';

export const VerifyReportsView: React.FC = () => {
  const { incidents, verifyIncident, approveAndPinIncident, setSelectedIncidentId } = useApp();
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('Duplicate report / Obstruction not verified');

  const unverified = incidents.filter((i) => !i.verified);

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingId) return;
    verifyIncident(rejectingId, false, rejectReason);
    setRejectingId(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <span className="text-xs font-bold text-[#D32F2F] uppercase tracking-wider">
          Command Quality Control
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-[#101A3A] tracking-tight mt-1">
          Verify Incoming Field Reports
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Review crowd-sourced SMS and unauthenticated field reports before crew assignment.
        </p>
      </div>

      <div className="space-y-4">
        {unverified.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
            <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto" />
            <h3 className="font-bold text-slate-800">All reports verified</h3>
            <p className="text-xs text-slate-500">There are no pending unverified reports in the intake queue.</p>
          </div>
        ) : (
          unverified.map((inc) => {
            const colors = getSeverityColors(inc.severity);
            return (
              <div
                key={inc.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-300 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base text-white ${colors.dot}`}
                    >
                      {inc.priority_score.toFixed(1)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-black text-[#101A3A]">{inc.location}</h2>
                        <span className="text-[10px] uppercase font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                          Unverified
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {inc.roadType} • Source: {inc.source} ({inc.reportedBy})
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-slate-400">{inc.createdAt}</span>
                </div>

                {inc.note && (
                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    "{inc.note}"
                  </p>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => setRejectingId(inc.id)}
                    className="px-4 py-2 bg-slate-100 hover:bg-red-50 text-red-600 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject</span>
                  </button>

                  <button
                    onClick={() => approveAndPinIncident(inc.id)}
                    className="px-5 py-2 bg-[#16834A] hover:bg-green-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow transition-all active:scale-95"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve & Pin to Live Map</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Reject Reason Modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl animate-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-[#101A3A]">Reject Incident Report</h3>
              <button onClick={() => setRejectingId(null)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleConfirmReject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Reason for Rejection
                </label>
                <textarea
                  rows={2}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRejectingId(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#D32F2F] text-white rounded-xl shadow"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
