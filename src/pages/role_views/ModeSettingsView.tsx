import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  ModeAssetRecord,
  ModeAssetSlotKey,
  ModeContentRecord,
  ModeFeatureRecord,
  OperatingMode,
} from '../../utils/modeConfig.ts';
import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  History,
  Image as ImageIcon,
  Layers,
  Radio,
  RefreshCw,
  RotateCcw,
  Save,
  ShieldAlert,
  Sliders,
  Sun,
  Upload,
  X,
} from 'lucide-react';

export const ModeSettingsView: React.FC<{ onCloseModal?: () => void }> = ({ onCloseModal }) => {
  const {
    operatingMode,
    globalServerMode,
    previewMode,
    setPreviewMode,
    modeSince,
    modeReason,
    disasterName,
    expectedEnd,
    emergencyBroadcastMessage,
    emergencyBroadcastExpiry,
    scheduledSwitch,
    modeHistory,
    modeFeatures,
    modeAssets,
    modeContent,
    modeSwitchError,
    clearModeSwitchError,
    hasActiveWarningPrompt,
    dismissWarningPrompt,
    setOperatingMode,
    scheduleModeSwitch,
    cancelScheduledSwitch,
    saveModeFeatures,
    saveModeAsset,
    saveModeContent,
    incidents,
    currentRole,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'switch' | 'features' | 'images' | 'content'>('switch');

  // Tab 1: Switch confirmation state
  const [confirmTargetMode, setConfirmTargetMode] = useState<OperatingMode | null>(null);
  const [switchReasonInput, setSwitchReasonInput] = useState<string>('');
  const [disasterNameInput, setDisasterNameInput] = useState<string>(disasterName);
  const [expectedEndInput, setExpectedEndInput] = useState<string>(expectedEnd || '');
  const [isSubmittingSwitch, setIsSubmittingSwitch] = useState<boolean>(false);

  // Schedule state
  const [schedTargetMode, setSchedTargetMode] = useState<OperatingMode>(
    globalServerMode === 'daily' ? 'emergency' : 'daily'
  );
  const [schedDateTime, setSchedDateTime] = useState<string>('');
  const [schedReason, setSchedReason] = useState<string>('Scheduled automated transition');

  // Tab 2: Features draft state
  const [draftFeatures, setDraftFeatures] = useState<ModeFeatureRecord[]>(modeFeatures);
  useEffect(() => {
    setDraftFeatures(modeFeatures);
  }, [modeFeatures]);

  // Tab 3: Images editor state
  const [editingSlot, setEditingSlot] = useState<{
    slot_key: ModeAssetSlotKey;
    mode: OperatingMode;
  } | null>(null);
  const [imgDesktopUrl, setImgDesktopUrl] = useState<string>('');
  const [imgMobileUrl, setImgMobileUrl] = useState<string>('');
  const [imgAltEn, setImgAltEn] = useState<string>('');
  const [imgAltTe, setImgAltTe] = useState<string>('');
  const [imgAltHi, setImgAltHi] = useState<string>('');
  const [imgCredit, setImgCredit] = useState<string>('');
  const [imgLicence, setImgLicence] = useState<string>('');
  const [imgRightsConfirmed, setImgRightsConfirmed] = useState<boolean>(false);
  const [imgUploadError, setImgUploadError] = useState<string | null>(null);

  // Tab 4: Content editor state
  const [draftContent, setDraftContent] = useState<ModeContentRecord[]>(modeContent);
  const [contentFilterMode, setContentFilterMode] = useState<OperatingMode>('daily');
  const [draftBroadcastMsg, setDraftBroadcastMsg] = useState<string>(emergencyBroadcastMessage);
  const [draftBroadcastExp, setDraftBroadcastExp] = useState<string>(emergencyBroadcastExpiry);

  useEffect(() => {
    setDraftContent(modeContent);
    setDraftBroadcastMsg(emergencyBroadcastMessage);
    setDraftBroadcastExp(emergencyBroadcastExpiry);
  }, [modeContent, emergencyBroadcastMessage, emergencyBroadcastExpiry]);

  const openIncidentsCount = incidents.filter((i) => i.status !== 'Cleared').length;
  const isAdmin = currentRole === 'admin';

  // Handlers for Tab 1: Switch
  const handleInitiateSwitch = (target: OperatingMode) => {
    if (!isAdmin) return;
    clearModeSwitchError();
    setConfirmTargetMode(target);
    setSwitchReasonInput('');
    setDisasterNameInput(disasterName || 'Cyclone, coastal Visakhapatnam');
  };

  const handleConfirmSwitchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmTargetMode) return;
    setIsSubmittingSwitch(true);
    const ok = await setOperatingMode(
      confirmTargetMode,
      switchReasonInput,
      confirmTargetMode === 'emergency' ? disasterNameInput : undefined,
      confirmTargetMode === 'emergency' ? expectedEndInput : undefined
    );
    setIsSubmittingSwitch(false);
    if (ok) {
      setConfirmTargetMode(null);
      setSwitchReasonInput('');
    }
  };

  const handleRetrySwitch = async () => {
    if (!confirmTargetMode) return;
    setIsSubmittingSwitch(true);
    const ok = await setOperatingMode(
      confirmTargetMode,
      switchReasonInput || 'Retry mode switch',
      confirmTargetMode === 'emergency' ? disasterNameInput : undefined,
      confirmTargetMode === 'emergency' ? expectedEndInput : undefined
    );
    setIsSubmittingSwitch(false);
    if (ok) {
      setConfirmTargetMode(null);
    }
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedDateTime) return;
    await scheduleModeSwitch(schedTargetMode, schedDateTime, schedReason, disasterNameInput);
    setSchedDateTime('');
  };

  // Handlers for Tab 2: Features
  const toggleFeatureDraft = (featureKey: string, modeCol: 'daily_enabled' | 'emergency_enabled') => {
    if (!isAdmin) return;
    setDraftFeatures((prev) =>
      prev.map((f) => (f.feature_key === featureKey ? { ...f, [modeCol]: !f[modeCol] } : f))
    );
  };

  const handleSaveFeatures = async () => {
    await saveModeFeatures(draftFeatures);
  };

  // Handlers for Tab 3: Images
  const openEditSlotModal = (asset: ModeAssetRecord) => {
    setEditingSlot({ slot_key: asset.slot_key, mode: asset.mode });
    setImgDesktopUrl(asset.image_url_desktop);
    setImgMobileUrl(asset.image_url_mobile);
    setImgAltEn(asset.alt_en);
    setImgAltTe(asset.alt_te);
    setImgAltHi(asset.alt_hi);
    setImgCredit(asset.credit);
    setImgLicence(asset.licence);
    setImgRightsConfirmed(false);
    setImgUploadError(null);
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    targetCrop: 'desktop' | 'mobile' | 'both'
  ) => {
    setImgUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setImgUploadError('Invalid file type. Only JPG, PNG, or WebP images are allowed.');
      return;
    }

    const maxBytes = 5 * 1024 * 1024; // 5 MB limit per Section 14.7
    if (file.size > maxBytes) {
      setImgUploadError('Image exceeds the 5 MB maximum size limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      if (result) {
        if (targetCrop === 'desktop' || targetCrop === 'both') setImgDesktopUrl(result);
        if (targetCrop === 'mobile' || targetCrop === 'both') setImgMobileUrl(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveImageSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlot) return;
    setImgUploadError(null);

    if (!imgRightsConfirmed) {
      setImgUploadError('Please check "I have the right to use this image."');
      return;
    }
    if (!imgAltEn.trim() || !imgAltTe.trim() || !imgAltHi.trim()) {
      setImgUploadError('Alt text is required in all three languages (English, Telugu, and Hindi).');
      return;
    }

    const result = await saveModeAsset({
      slot_key: editingSlot.slot_key,
      mode: editingSlot.mode,
      image_url_desktop: imgDesktopUrl,
      image_url_mobile: imgMobileUrl || imgDesktopUrl,
      alt_en: imgAltEn,
      alt_te: imgAltTe,
      alt_hi: imgAltHi,
      credit: imgCredit,
      licence: imgLicence,
      rightsConfirmed: imgRightsConfirmed,
    });

    if (!result.ok) {
      setImgUploadError(result.error || 'Could not save image.');
    } else {
      setEditingSlot(null);
    }
  };

  const handleResetSlot = async (slot_key: ModeAssetSlotKey, mode: OperatingMode) => {
    await saveModeAsset({ slot_key, mode, resetToDefault: true });
  };

  // Handlers for Tab 4: Content
  const handleContentChange = (
    key: ModeContentRecord['key'],
    mode: OperatingMode,
    language: ModeContentRecord['language'],
    newText: string
  ) => {
    setDraftContent((prev) =>
      prev.map((c) =>
        c.key === key && c.mode === mode && c.language === language ? { ...c, text: newText } : c
      )
    );
  };

  const handleSaveAllContent = async () => {
    await saveModeContent(draftContent, draftBroadcastMsg, draftBroadcastExp);
  };

  const slotKeys: ModeAssetSlotKey[] = [
    'home_hero',
    'tile_help',
    'tile_medical',
    'tile_precautions',
    'tile_heroes',
    'precautions_thumb',
    'share_card',
  ];

  const otherMode: OperatingMode = globalServerMode === 'daily' ? 'emergency' : 'daily';

  return (
    <div className="space-y-6" data-testid="mode-settings-screen">
      {/* Top Header Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              globalServerMode === 'emergency'
                ? 'bg-red-100 text-[#D32F2F]'
                : 'bg-blue-100 text-[#2457C5]'
            }`}
          >
            <Radio className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#101A3A] tracking-tight">
                Admin Mode Settings (Section 14)
              </h1>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase ${
                  globalServerMode === 'emergency'
                    ? 'bg-red-600 text-white'
                    : 'bg-blue-100 text-[#2457C5]'
                }`}
              >
                Live: {globalServerMode.toUpperCase()} MODE
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Configure the global operating mode, feature flags, visual slots, and trilingual wording across all connected devices.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* "Preview as" Toggle Button (Section 14.7) */}
          {isAdmin && (
            <button
              type="button"
              data-testid="preview-mode-toggle-btn"
              onClick={() =>
                setPreviewMode(previewMode ? null : otherMode)
              }
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 border transition-all cursor-pointer ${
                previewMode
                  ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-md'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>
                {previewMode
                  ? `Exit Preview (${previewMode.toUpperCase()})`
                  : `Preview as ${otherMode === 'emergency' ? 'Emergency' : 'Daily'} Mode`}
              </span>
            </button>
          )}

          {onCloseModal && (
            <button
              type="button"
              onClick={onCloseModal}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
              aria-label="Close Mode Settings"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Non-Admin 403 Notice */}
      {!isAdmin && (
        <div
          className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-900 font-bold flex items-center gap-3"
          data-testid="non-admin-mode-notice"
        >
          <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
          <span>
            Read-Only View (403 Restricted): Only an Admin can change the mode, feature flags, images, or mode content. You are currently signed in as [{currentRole.toUpperCase()}].
          </span>
        </div>
      )}

      {/* Command Officer Warning Alert One-Tap Prompt for Admin (Section 14.2) */}
      {isAdmin && hasActiveWarningPrompt && (
        <div
          className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm"
          data-testid="severe-warning-mode-prompt"
        >
          <div className="flex items-center gap-2.5 text-amber-950 text-xs sm:text-sm font-extrabold">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>A severe warning is active. Switch to Emergency mode?</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleInitiateSwitch('emergency')}
              className="px-4 py-2 bg-[#D32F2F] hover:bg-red-700 text-white rounded-xl text-xs font-black shadow cursor-pointer"
            >
              Switch to Emergency mode
            </button>
            <button
              type="button"
              onClick={dismissWarningPrompt}
              className="px-3 py-2 bg-white hover:bg-amber-100 text-amber-900 rounded-xl text-xs font-bold border border-amber-300 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* 4 Tabs Navigation (Section 14.7) */}
      <div className="flex items-center gap-2 overflow-x-auto bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
        {[
          { id: 'switch', label: '1. Switch', icon: Sliders },
          { id: 'features', label: '2. Features', icon: Layers },
          { id: 'images', label: '3. Images', icon: ImageIcon },
          { id: 'content', label: '4. Content', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              data-testid={`mode-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                active
                  ? 'bg-white text-[#2457C5] shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* =====================================================================
          TAB 1: SWITCH (Confirmation Dialogs, Schedule & Mode History)
      ===================================================================== */}
      {activeTab === 'switch' && (
        <div className="space-y-6">
          {/* Two-Option Mode Switch Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Option 1: Daily Mode */}
            <div
              className={`rounded-3xl p-6 border-2 transition-all flex flex-col justify-between ${
                globalServerMode === 'daily'
                  ? 'border-[#2457C5] bg-blue-50/40 shadow-sm'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#2457C5] flex items-center justify-center">
                      <Sun className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-[#101A3A]">Daily mode</h3>
                      <span className="text-[11px] font-bold text-[#2457C5]">Default Year-Round Operations</span>
                    </div>
                  </div>
                  {globalServerMode === 'daily' && (
                    <span className="px-3 py-1 rounded-full bg-[#2457C5] text-white text-xs font-black flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Active
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                  Normal operations. Everyday road problems, help directory and preparedness.
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-200/70">
                {globalServerMode === 'daily' ? (
                  <span className="text-xs font-bold text-slate-500">
                    Active since {modeSince} • &ldquo;{modeReason}&rdquo;
                  </span>
                ) : (
                  <button
                    type="button"
                    disabled={!isAdmin}
                    data-testid="initiate-daily-switch-btn"
                    onClick={() => handleInitiateSwitch('daily')}
                    className="w-full py-3 px-4 bg-[#2457C5] hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold rounded-xl text-xs sm:text-sm shadow transition-all cursor-pointer"
                  >
                    Switch back to Daily mode
                  </button>
                )}
              </div>
            </div>

            {/* Option 2: Emergency Mode */}
            <div
              className={`rounded-3xl p-6 border-2 transition-all flex flex-col justify-between ${
                globalServerMode === 'emergency'
                  ? 'border-[#D32F2F] bg-red-50/40 shadow-sm'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-red-100 text-[#D32F2F] flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-red-700">Emergency mode</h3>
                      <span className="text-[11px] font-bold text-red-600">Cyclone, Flood or Disaster</span>
                    </div>
                  </div>
                  {globalServerMode === 'emergency' && (
                    <span className="px-3 py-1 rounded-full bg-[#D32F2F] text-white text-xs font-black flex items-center gap-1 animate-pulse">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Active
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                  Active disaster. Fastest reporting, blocked roads and relief camps first.
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-200/70">
                {globalServerMode === 'emergency' ? (
                  <span className="text-xs font-bold text-red-700">
                    {disasterName} • Active since {modeSince}
                  </span>
                ) : (
                  <button
                    type="button"
                    disabled={!isAdmin}
                    data-testid="initiate-emergency-switch-btn"
                    onClick={() => handleInitiateSwitch('emergency')}
                    className="w-full py-3 px-4 bg-[#D32F2F] hover:bg-red-700 disabled:opacity-50 text-white font-extrabold rounded-xl text-xs sm:text-sm shadow transition-all cursor-pointer"
                  >
                    Switch to Emergency mode
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Switch Failure Banner with Try Again button (Section 14.2) */}
          {modeSwitchError && (
            <div
              className="p-4 rounded-2xl bg-red-50 border border-red-300 flex items-center justify-between gap-3 text-xs sm:text-sm text-red-900 font-bold"
              role="alert"
            >
              <span>{modeSwitchError}</span>
              <button
                type="button"
                onClick={handleRetrySwitch}
                className="px-3.5 py-1.5 bg-[#D32F2F] text-white rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Try again</span>
              </button>
            </div>
          )}

          {/* Confirmation Dialog for Switching Mode (Section 14.2) */}
          {confirmTargetMode && (
            <form
              onSubmit={handleConfirmSwitchSubmit}
              data-testid="mode-switch-confirm-dialog"
              className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-700 space-y-4 animate-in fade-in"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base sm:text-lg font-black">
                  {confirmTargetMode === 'emergency'
                    ? 'Confirm Switch to Emergency Mode'
                    : 'Confirm Switch Back to Daily Mode'}
                </h3>
                <button
                  type="button"
                  onClick={() => setConfirmTargetMode(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {confirmTargetMode === 'daily' && (
                <div
                  className="p-3.5 rounded-2xl bg-blue-950/80 border border-blue-700 text-xs sm:text-sm text-blue-200 font-bold"
                  data-testid="open-incidents-survival-note"
                >
                  {openIncidentsCount} incidents still open. They stay in the queue. A switch never deletes or hides open incidents, reports queued offline, users or settings.
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {confirmTargetMode === 'emergency'
                      ? 'Reason for switching to Emergency mode (Required, one line) *'
                      : 'Closing note for returning to Daily mode (Required) *'}
                  </label>
                  <input
                    type="text"
                    required
                    data-testid="mode-switch-reason-input"
                    value={switchReasonInput}
                    onChange={(e) => setSwitchReasonInput(e.target.value)}
                    placeholder={
                      confirmTargetMode === 'emergency'
                        ? 'e.g. IMD Cyclone Warning issued for coastal Visakhapatnam'
                        : 'e.g. Major arterial roads cleared; resuming standard daily operations'
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-600 text-white text-xs sm:text-sm font-semibold focus:outline-none focus:border-blue-400"
                  />
                </div>

                {confirmTargetMode === 'emergency' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Disaster Name (Optional)
                      </label>
                      <input
                        type="text"
                        data-testid="mode-switch-disaster-input"
                        value={disasterNameInput}
                        onChange={(e) => setDisasterNameInput(e.target.value)}
                        placeholder="e.g. Cyclone, coastal Visakhapatnam"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-600 text-white text-xs sm:text-sm font-semibold focus:outline-none focus:border-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Expected End Time (Optional)
                      </label>
                      <input
                        type="text"
                        value={expectedEndInput}
                        onChange={(e) => setExpectedEndInput(e.target.value)}
                        placeholder="e.g. Tomorrow 18:00 IST"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-600 text-white text-xs sm:text-sm font-semibold focus:outline-none focus:border-blue-400"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmTargetMode(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingSwitch}
                  data-testid="confirm-mode-switch-submit-btn"
                  className={`px-6 py-2.5 rounded-xl text-white text-xs sm:text-sm font-black shadow-lg cursor-pointer ${
                    confirmTargetMode === 'emergency'
                      ? 'bg-[#D32F2F] hover:bg-red-700'
                      : 'bg-[#2457C5] hover:bg-blue-700'
                  }`}
                >
                  {confirmTargetMode === 'emergency'
                    ? 'Switch to Emergency mode'
                    : 'Switch to Daily mode'}
                </button>
              </div>
            </form>
          )}

          {/* Optional Schedule Automatic Switch (Section 14.2) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-[#2457C5]" />
                <h3 className="text-base font-black text-[#101A3A]">
                  Schedule Automatic Mode Switch
                </h3>
              </div>
              {scheduledSwitch && (
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold">
                  Scheduled: {scheduledSwitch.targetMode.toUpperCase()} at {scheduledSwitch.switchAt}
                </span>
              )}
            </div>

            {scheduledSwitch ? (
              <div
                className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                data-testid="active-schedule-banner"
              >
                <div className="text-xs sm:text-sm text-amber-950 font-semibold">
                  <strong>Switch automatically at {scheduledSwitch.switchAt}</strong> to{' '}
                  <span className="uppercase font-black">{scheduledSwitch.targetMode}</span> mode
                  (Reason: &ldquo;{scheduledSwitch.reason}&rdquo;)
                </div>
                {isAdmin && (
                  <button
                    type="button"
                    data-testid="cancel-schedule-btn"
                    onClick={cancelScheduledSwitch}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shrink-0 cursor-pointer"
                  >
                    Cancel Schedule
                  </button>
                )}
              </div>
            ) : (
              <form
                onSubmit={handleScheduleSubmit}
                className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end"
              >
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Mode</label>
                  <select
                    value={schedTargetMode}
                    onChange={(e) => setSchedTargetMode(e.target.value as OperatingMode)}
                    disabled={!isAdmin}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                  >
                    <option value="emergency">Emergency mode</option>
                    <option value="daily">Daily mode</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Switch automatically at
                  </label>
                  <input
                    type="datetime-local"
                    required
                    disabled={!isAdmin}
                    data-testid="schedule-datetime-input"
                    value={schedDateTime}
                    onChange={(e) => setSchedDateTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Reason</label>
                  <input
                    type="text"
                    required
                    disabled={!isAdmin}
                    value={schedReason}
                    onChange={(e) => setSchedReason(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!isAdmin}
                  data-testid="save-schedule-btn"
                  className="px-4 py-2.5 bg-[#101A3A] hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-extrabold cursor-pointer"
                >
                  Schedule Switch
                </button>
              </form>
            )}
          </div>

          {/* Mode History List (Last 20 switches with duration — Section 14.2 & 14.7) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-[#2457C5]" />
                <h3 className="text-base font-black text-[#101A3A]">
                  Mode Switch History (Last 20 Switches)
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-500">{modeHistory.length} records</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase text-[11px]">
                    <th className="py-2.5 px-3">Transition</th>
                    <th className="py-2.5 px-3">Reason / Note</th>
                    <th className="py-2.5 px-3">Switched By</th>
                    <th className="py-2.5 px-3">Switched At</th>
                    <th className="py-2.5 px-3">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {modeHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80">
                      <td className="py-2.5 px-3 font-extrabold whitespace-nowrap">
                        <span className="uppercase text-slate-500">{item.from_mode}</span>
                        <span className="mx-1.5 text-slate-400">→</span>
                        <span
                          className={`uppercase px-2 py-0.5 rounded-full text-[10px] ${
                            item.to_mode === 'emergency'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-blue-100 text-[#2457C5]'
                          }`}
                        >
                          {item.to_mode}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 font-medium">{item.reason}</td>
                      <td className="py-2.5 px-3 text-slate-600 font-semibold whitespace-nowrap">
                        {item.switched_by}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">
                        {item.switched_at}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-700 whitespace-nowrap">
                        {item.duration || item.ended_at || 'Active'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: FEATURES (Feature Flag Matrix for Daily & Emergency — Section 14.4)
      ===================================================================== */}
      {activeTab === 'features' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-black text-[#101A3A]">
                Mode Feature Matrix ({draftFeatures.length} Configurable Capabilities)
              </h3>
              <p className="text-xs text-slate-500">
                Toggle which features are enabled in Daily Mode and Emergency Mode. Disabled features are hidden in UI and refused by the server API.
              </p>
            </div>
            {isAdmin && (
              <button
                type="button"
                data-testid="save-mode-features-btn"
                onClick={handleSaveFeatures}
                className="px-5 py-2.5 bg-[#2457C5] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 shadow cursor-pointer shrink-0"
              >
                <Save className="w-4 h-4" />
                <span>Save Feature Matrix</span>
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase text-[11px]">
                  <th className="py-3 px-3">Feature / Capability</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3 text-center">Daily Mode</th>
                  <th className="py-3 px-3 text-center">Emergency Mode</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {draftFeatures.map((feat) => (
                  <tr key={feat.feature_key} className="hover:bg-slate-50/80">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{feat.label_en}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{feat.feature_key}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[10px]">
                        {feat.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        disabled={!isAdmin}
                        data-testid={`toggle-daily-${feat.feature_key}`}
                        onClick={() => toggleFeatureDraft(feat.feature_key, 'daily_enabled')}
                        className={`px-3 py-1 rounded-full text-[11px] font-black transition-all cursor-pointer ${
                          feat.daily_enabled
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {feat.daily_enabled ? 'ON' : 'OFF'}
                      </button>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        disabled={!isAdmin}
                        data-testid={`toggle-emergency-${feat.feature_key}`}
                        onClick={() => toggleFeatureDraft(feat.feature_key, 'emergency_enabled')}
                        className={`px-3 py-1 rounded-full text-[11px] font-black transition-all cursor-pointer ${
                          feat.emergency_enabled
                            ? 'bg-red-600 text-white'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {feat.emergency_enabled ? 'ON' : 'OFF'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: IMAGES (Side-by-Side Daily & Emergency Slots — Section 14.5 & 14.7)
      ===================================================================== */}
      {activeTab === 'images' && (
        <div className="space-y-5">
          {slotKeys.map((slotKey) => {
            const dailyAsset = modeAssets.find((a) => a.slot_key === slotKey && a.mode === 'daily');
            const emergAsset = modeAssets.find((a) => a.slot_key === slotKey && a.mode === 'emergency');
            if (!dailyAsset || !emergAsset) return null;

            return (
              <div
                key={slotKey}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-black text-[#101A3A]">{dailyAsset.slot_label}</h3>
                    <span className="text-[11px] font-mono text-slate-400">Slot: {slotKey}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[dailyAsset, emergAsset].map((asset) => (
                    <div
                      key={`${asset.slot_key}-${asset.mode}`}
                      className={`rounded-2xl p-4 border ${
                        asset.mode === 'emergency'
                          ? 'border-red-200 bg-red-50/20'
                          : 'border-blue-200 bg-blue-50/20'
                      } space-y-3`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            asset.mode === 'emergency'
                              ? 'bg-red-600 text-white'
                              : 'bg-blue-600 text-white'
                          }`}
                        >
                          {asset.mode} Mode Image
                        </span>
                        {isAdmin && (
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              data-testid={`edit-asset-${asset.slot_key}-${asset.mode}`}
                              onClick={() => openEditSlotModal(asset)}
                              className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg text-[11px] font-bold cursor-pointer"
                            >
                              Replace / Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleResetSlot(asset.slot_key, asset.mode)}
                              className="p-1 bg-white hover:bg-slate-100 text-slate-600 border border-slate-300 rounded-lg cursor-pointer"
                              title="Reset to default"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="h-36 rounded-xl overflow-hidden bg-slate-200 border border-slate-200">
                        <img
                          src={asset.image_url_desktop}
                          alt={asset.alt_en}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="space-y-1 text-[11px] text-slate-600">
                        <div>
                          <strong className="text-slate-800">Alt (EN):</strong> {asset.alt_en}
                        </div>
                        <div>
                          <strong className="text-slate-800">Alt (TE):</strong> {asset.alt_te}
                        </div>
                        <div>
                          <strong className="text-slate-800">Alt (HI):</strong> {asset.alt_hi}
                        </div>
                        <div className="text-[10px] text-slate-400 pt-1">
                          Credit: {asset.credit} • Licence: {asset.licence}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Image Replacement Modal (Section 14.7) */}
          {editingSlot && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
              <form
                onSubmit={handleSaveImageSlot}
                data-testid="image-replace-modal"
                className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-black text-[#101A3A]">
                    Replace Image — {editingSlot.slot_key} ({editingSlot.mode.toUpperCase()})
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditingSlot(null)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {imgUploadError && (
                  <div
                    className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-bold"
                    data-testid="image-upload-error"
                  >
                    {imgUploadError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Upload Desktop Crop (JPG/PNG/WebP, max 5 MB)
                    </label>
                    <label className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-300 text-xs font-bold cursor-pointer">
                      <Upload className="w-4 h-4" />
                      <span>Choose Desktop File</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(e) => handleFileUpload(e, 'both')}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="text"
                      value={imgDesktopUrl}
                      onChange={(e) => setImgDesktopUrl(e.target.value)}
                      placeholder="Desktop Image URL"
                      className="mt-1.5 w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mobile / Low-Data Crop URL
                    </label>
                    <label className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-300 text-xs font-bold cursor-pointer">
                      <Upload className="w-4 h-4" />
                      <span>Choose Mobile File</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(e) => handleFileUpload(e, 'mobile')}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="text"
                      value={imgMobileUrl}
                      onChange={(e) => setImgMobileUrl(e.target.value)}
                      placeholder="Mobile Image URL"
                      className="mt-1.5 w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Alt Text in English (Required) *
                    </label>
                    <input
                      type="text"
                      required
                      data-testid="asset-alt-en-input"
                      value={imgAltEn}
                      onChange={(e) => setImgAltEn(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Alt Text in Telugu / తెలుగు (Required) *
                    </label>
                    <input
                      type="text"
                      required
                      data-testid="asset-alt-te-input"
                      value={imgAltTe}
                      onChange={(e) => setImgAltTe(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Alt Text in Hindi / हिन्दी (Required) *
                    </label>
                    <input
                      type="text"
                      required
                      data-testid="asset-alt-hi-input"
                      value={imgAltHi}
                      onChange={(e) => setImgAltHi(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Photographer / Source Credit *
                    </label>
                    <input
                      type="text"
                      required
                      value={imgCredit}
                      onChange={(e) => setImgCredit(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Licence (e.g. CC0, CC-BY 4.0) *
                    </label>
                    <input
                      type="text"
                      required
                      value={imgLicence}
                      onChange={(e) => setImgLicence(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2.5 pt-1 text-xs font-extrabold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    data-testid="asset-rights-checkbox"
                    checked={imgRightsConfirmed}
                    onChange={(e) => setImgRightsConfirmed(e.target.checked)}
                    className="w-4 h-4 rounded text-[#2457C5]"
                  />
                  <span>
                    I have the right to use this image (No government emblems, real agency logos, or unconsented identifiable faces).
                  </span>
                </label>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditingSlot(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    data-testid="save-asset-modal-btn"
                    className="px-5 py-2 rounded-xl bg-[#2457C5] hover:bg-blue-700 text-white text-xs font-extrabold shadow cursor-pointer"
                  >
                    Save Image Slot
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          TAB 4: CONTENT (Headlines, Sub-lines, Banners in EN/TE/HI — Section 14.6 & 14.7)
      ===================================================================== */}
      {activeTab === 'content' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-black text-[#101A3A]">
                Mode Wording & Trilingual Content Editor
              </h3>
              <p className="text-xs text-slate-500">
                Customize headlines, sub-lines, buttons, and banners per mode in English, Telugu, and Hindi.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                {(['daily', 'emergency'] as OperatingMode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setContentFilterMode(m)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase cursor-pointer ${
                      contentFilterMode === m
                        ? 'bg-white text-[#101A3A] shadow-xs'
                        : 'text-slate-600'
                    }`}
                  >
                    {m} Mode
                  </button>
                ))}
              </div>
              {isAdmin && (
                <button
                  type="button"
                  data-testid="save-mode-content-btn"
                  onClick={handleSaveAllContent}
                  className="px-5 py-2.5 bg-[#2457C5] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 shadow cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Content</span>
                </button>
              )}
            </div>
          </div>

          {/* Emergency Broadcast Banner Config */}
          <div className="p-4 rounded-2xl bg-red-50/60 border border-red-200 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-red-800">
              Full-Width Emergency Broadcast Banner (Command / Admin Message)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-3">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Broadcast Message
                </label>
                <input
                  type="text"
                  disabled={!isAdmin}
                  value={draftBroadcastMsg}
                  onChange={(e) => setDraftBroadcastMsg(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Expiry Time
                </label>
                <input
                  type="text"
                  disabled={!isAdmin}
                  value={draftBroadcastExp}
                  onChange={(e) => setDraftBroadcastExp(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Per-Key Trilingual Rows */}
          <div className="space-y-4">
            {(
              [
                'global_pill',
                'hero_headline',
                'hero_subline',
                'primary_cta',
                'secondary_cta',
                'banner_message',
                'empty_reports_text',
                'heroes_banner_text',
                'share_tagline',
              ] as const
            ).map((contentKey) => {
              const rowsForKey = draftContent.filter(
                (c) => c.key === contentKey && c.mode === contentFilterMode
              );
              const label = rowsForKey[0]?.label || contentKey;
              return (
                <div
                  key={`${contentFilterMode}-${contentKey}`}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#101A3A]">{label}</span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {contentFilterMode} • {contentKey}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {(['en', 'te', 'hi'] as const).map((lang) => {
                      const row = rowsForKey.find((r) => r.language === lang);
                      return (
                        <div key={lang}>
                          <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                            {lang === 'en' ? 'English' : lang === 'te' ? 'Telugu (తెలుగు)' : 'Hindi (हिन्दी)'}
                          </label>
                          <input
                            type="text"
                            disabled={!isAdmin}
                            value={row?.text || ''}
                            onChange={(e) =>
                              handleContentChange(contentKey, contentFilterMode, lang, e.target.value)
                            }
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
