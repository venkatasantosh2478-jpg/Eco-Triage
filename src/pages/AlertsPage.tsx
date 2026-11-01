import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { AlertItem } from '../types.ts';
import {
  AlertTriangle,
  Bell,
  Clock,
  Plus,
  ShieldAlert,
  Trash2,
  X,
  Send,
  Radio,
} from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const { alerts, publishAlert, expireAlert, currentRole } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'weather' | 'flood' | 'road' | 'other'>('all');
  const [isManagerOpen, setIsManagerOpen] = useState(false);

  // New alert form state
  const [type, setType] = useState<AlertItem['type']>('weather');
  const [severity, setSeverity] = useState<AlertItem['severity']>('Warning');
  const [message, setMessage] = useState('');
  const [messageTe, setMessageTe] = useState('');
  const [messageHi, setMessageHi] = useState('');
  const [source, setSource] = useState('Municipal Control Room (Sample)');
  const [expiresAt, setExpiresAt] = useState('28 Oct, 2026 • 6:00 PM');

  const filteredAlerts = alerts.filter((a) => {
    if (activeTab === 'all') return true;
    return a.type === activeTab;
  });

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    publishAlert({
      type,
      severity,
      message: message.trim(),
      messageTe: messageTe.trim() || undefined,
      messageHi: messageHi.trim() || undefined,
      issuedAt: 'Just now',
      expiresAt,
      source,
      active: true,
    });

    setIsManagerOpen(false);
    setMessage('');
    setMessageTe('');
    setMessageHi('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Title & Command Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
            Public Broadcast System
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#101A3A] tracking-tight mt-1">
            Emergency Alerts & Warnings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time cyclone warnings, flash-flood advisories, and arterial road reopening updates.
          </p>
        </div>

        {(currentRole === 'command' || currentRole === 'admin') && (
          <button
            onClick={() => setIsManagerOpen(true)}
            className="self-start sm:self-auto px-4 py-2.5 bg-[#D32F2F] hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Publish New Alert</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {(['all', 'weather', 'flood', 'road', 'other'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
              activeTab === tab
                ? 'bg-[#101A3A] text-white shadow-xs'
                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
            }`}
          >
            {tab === 'all' ? 'All Alerts' : `${tab} Alerts`}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-2">
            <Bell className="w-8 h-8 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800">No active alerts</h3>
            <p className="text-xs text-slate-400">You will see real-time bulletins here as they are issued.</p>
          </div>
        ) : (
          filteredAlerts.map((a) => {
            const isWarning = a.severity === 'Warning';
            return (
              <div
                key={a.id}
                className={`p-6 rounded-3xl border-2 transition-all shadow-xs flex flex-col sm:flex-row items-start justify-between gap-4 ${
                  !a.active
                    ? 'bg-slate-50 border-slate-200 opacity-60'
                    : isWarning
                    ? 'bg-[#FFF1F0] border-[#D32F2F]'
                    : 'bg-[#FFF9EB] border-[#F2A900]'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5 text-white ${
                      isWarning ? 'bg-[#D32F2F]' : 'bg-[#F2A900]'
                    }`}
                  >
                    {isWarning ? <AlertTriangle className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full ${
                          isWarning ? 'bg-red-200 text-red-900' : 'bg-amber-200 text-amber-900'
                        }`}
                      >
                        {a.severity} • {a.type}
                      </span>
                      {!a.active && (
                        <span className="text-[10px] font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                          Deactivated
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-extrabold text-[#101A3A] leading-snug">
                      {a.message}
                    </h3>

                    {a.messageTe && (
                      <p className="text-xs text-slate-700 font-medium">తెలుగు: {a.messageTe}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-2 font-medium">
                      <span>Issued: {a.issuedAt}</span>
                      <span>•</span>
                      <span>Expires: {a.expiresAt}</span>
                      <span>•</span>
                      <span className="font-semibold">{a.source}</span>
                    </div>
                  </div>
                </div>

                {/* Command Officer / Admin controls */}
                {(currentRole === 'command' || currentRole === 'admin') && a.active && (
                  <button
                    onClick={() => expireAlert(a.id)}
                    className="self-end sm:self-center px-3 py-1.5 rounded-xl text-xs font-bold text-red-700 hover:bg-red-100 border border-red-200 transition-colors"
                  >
                    Deactivate
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Command Publish Alert Modal */}
      {isManagerOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-extrabold text-base text-[#101A3A] flex items-center gap-2">
                <Radio className="w-5 h-5 text-red-600" />
                <span>Command Alerts Manager</span>
              </h3>
              <button onClick={() => setIsManagerOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePublish} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Alert Category</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                  >
                    <option value="weather">Weather Cyclone</option>
                    <option value="road">Road Obstruction</option>
                    <option value="flood">Flash Flood</option>
                    <option value="other">Public Notice</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Severity Level</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                  >
                    <option value="Warning">Warning (Red)</option>
                    <option value="Advisory">Advisory (Amber)</option>
                    <option value="Info">Info (Blue)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alert Message (English)
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. Cyclone Warning: Coastal Visakhapatnam..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Telugu Translation (Optional)
                </label>
                <input
                  type="text"
                  value={messageTe}
                  onChange={(e) => setMessageTe(e.target.value)}
                  placeholder="హెచ్చరిక సందేశం..."
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Issuing Source</label>
                  <input
                    type="text"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Expiry Horizon</label>
                  <input
                    type="text"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsManagerOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#D32F2F] hover:bg-red-700 text-white rounded-xl shadow"
                >
                  Publish to Live Ticker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
