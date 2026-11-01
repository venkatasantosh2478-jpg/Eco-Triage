import React from 'react';
import { ModeSettingsView } from '../pages/role_views/ModeSettingsView.tsx';

export const ModeManagerModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-start justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-50 rounded-3xl max-w-5xl w-full p-4 sm:p-6 shadow-2xl border border-slate-200 my-4 animate-in zoom-in-95">
        <ModeSettingsView onCloseModal={onClose} />
      </div>
    </div>
  );
};
