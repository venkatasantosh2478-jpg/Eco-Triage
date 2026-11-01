import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { CheckCircle2 } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-24 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#101A3A] text-white px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-xs sm:text-sm font-semibold border border-slate-700 animate-in fade-in slide-in-from-bottom-4"
    >
      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
      <span>{toastMessage}</span>
    </div>
  );
};
