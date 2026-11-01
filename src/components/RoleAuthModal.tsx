import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { UserProfile, UserRole } from '../types.ts';
import { SAMPLE_USERS } from '../utils/storage.ts';
import { Eye, HardHat, Radio, ShieldCheck, X, KeyRound, AlertCircle } from 'lucide-react';

export const RoleAuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, signIn, setActivePage } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>('command');
  const [userName, setUserName] = useState<string>('Ravi (Command)');
  const [pin, setPin] = useState<string>('1234');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const roleCards = [
    {
      role: 'viewer' as UserRole,
      title: 'Viewer / Observer',
      desc: 'Can see the live map, queue and dashboard. Read-only access.',
      icon: Eye,
      color: 'blue',
      defaultUser: SAMPLE_USERS.find((u) => u.role === 'viewer')!,
    },
    {
      role: 'field' as UserRole,
      title: 'Field Officer',
      desc: 'Reports hazards on-site, views own assignments, updates progress.',
      icon: HardHat,
      color: 'amber',
      defaultUser: SAMPLE_USERS.find((u) => u.role === 'field')!,
    },
    {
      role: 'command' as UserRole,
      title: 'Command Officer',
      desc: 'Verifies reports, dispatches crews, manages alerts & shelters, overrides priority.',
      icon: Radio,
      color: 'indigo',
      defaultUser: SAMPLE_USERS.find((u) => u.role === 'command')!,
    },
    {
      role: 'admin' as UserRole,
      title: 'System Admin',
      desc: 'Full access to users, crews, zones, activity logs, content, and data reset.',
      icon: ShieldCheck,
      color: 'red',
      defaultUser: SAMPLE_USERS.find((u) => u.role === 'admin')!,
    },
  ];

  const handleSelectRole = (card: typeof roleCards[0]) => {
    setSelectedRole(card.role);
    setUserName(card.defaultUser.name);
    setPin(card.defaultUser.pin);
    setErrorMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }
    if (pin.length !== 4) {
      setErrorMessage('PIN must be exactly 4 digits.');
      return;
    }

    const newUser: UserProfile = {
      id: `user_${Date.now()}`,
      name: userName,
      role: selectedRole,
      pin,
      department:
        selectedRole === 'command'
          ? 'Municipal Emergency Command'
          : selectedRole === 'field'
          ? 'Clearance Squad 4'
          : selectedRole === 'admin'
          ? 'Administration'
          : 'Observer Wing',
      description: `Active ${selectedRole} session for demo.`,
    };

    signIn(newUser);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in zoom-in-95 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div>
            <h2 className="text-2xl font-black text-[#101A3A] tracking-tight">Who are you?</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Select your municipal role to access clearance operations and command features.
            </p>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Role Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {roleCards.map((card) => {
            const Icon = card.icon;
            const isSelected = selectedRole === card.role;
            return (
              <button
                key={card.role}
                type="button"
                onClick={() => handleSelectRole(card)}
                className={`p-4 rounded-2xl text-left border-2 transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#2457C5] bg-[#EAF0FF]/60 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-[#2457C5] text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#101A3A]">{card.title}</h3>
                    <span className="text-[10px] text-slate-400 font-semibold block">PIN: {card.defaultUser.pin}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{card.desc}</p>
              </button>
            );
          })}
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Staff Member Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="e.g. Officer Ravi"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#2457C5]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">4-Digit Security PIN</label>
              <div className="relative">
                <input
                  type="password"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 1234"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 tracking-widest focus:outline-none focus:border-[#2457C5]"
                  required
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="mt-3 flex items-center gap-1.5 text-xs text-red-600 font-semibold">
              <AlertCircle className="w-4 h-4" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                setIsAuthModalOpen(false);
                setActivePage('report');
              }}
              className="text-xs text-[#2457C5] font-semibold hover:underline"
            >
              Report without signing in (Unverified demo)
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 bg-[#2457C5] hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md transition-all active:scale-95"
            >
              Sign In as {selectedRole.toUpperCase()}
            </button>
          </div>
        </form>

        {/* Demo Disclaimer */}
        <p className="text-[11px] text-slate-400 text-center leading-relaxed">
          Demo sign-in. The real version will use secure login (OTP or municipal ID). Role limits in this demo are for workflow demonstration and not real security.
        </p>
      </div>
    </div>
  );
};
