import React from 'react';

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs animate-pulse space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-4 bg-slate-200 rounded w-1/3" />
        <div className="h-6 bg-slate-200 rounded-full w-20" />
      </div>
      <div className="h-3 bg-slate-200 rounded w-2/3" />
      <div className="h-24 bg-slate-100 rounded-xl w-full" />
      <div className="flex justify-between items-center pt-2">
        <div className="h-3 bg-slate-200 rounded w-24" />
        <div className="h-8 bg-slate-200 rounded-lg w-28" />
      </div>
    </div>
  );
};
