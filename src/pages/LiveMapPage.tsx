import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { getSeverityColors } from '../utils/rules.ts';
import { Incident } from '../types.ts';
import { LeafletMap } from '../components/LeafletMap.tsx';
import {
  AlertTriangle,
  ChevronDown,
  Filter,
  Layers,
  LifeBuoy,
  MapPin,
  Search,
  Shield,
  Zap,
  CheckCircle,
} from 'lucide-react';

export const LiveMapPage: React.FC = () => {
  const {
    incidents,
    helpPoints,
    setSelectedIncidentId,
    setActivePage,
    approveAndPinIncident,
    currentRole,
    operatingMode,
  } = useApp();

  // Section 14.6: Daily default filter "All open". Emergency default filter "Critical and Pending".
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<
    'All open' | 'Critical and Pending' | 'Pinned' | 'Critical' | 'Pending' | 'Hospital Routes'
  >(operatingMode === 'emergency' ? 'Critical and Pending' : 'All open');

  React.useEffect(() => {
    setActiveFilter(operatingMode === 'emergency' ? 'Critical and Pending' : 'All open');
  }, [operatingMode]);

  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);

  // Filter incidents
  const filteredIncidents = incidents.filter((inc) => {
    const matchesSearch =
      inc.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.id.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (activeFilter === 'All open') return inc.status !== 'Cleared';
    if (activeFilter === 'Critical and Pending') {
      return inc.severity === 'Critical' || inc.status === 'Pending';
    }
    if (activeFilter === 'Pinned') return inc.pinnedToMap || inc.approvedByGovernance;
    if (activeFilter === 'Critical') return inc.severity === 'Critical';
    if (activeFilter === 'Pending') return inc.status === 'Pending';
    if (activeFilter === 'Hospital Routes') return inc.roadType === 'Hospital Route';
    return true;
  });

  const sortedIncidents = [...filteredIncidents].sort((a, b) => b.priority_score - a.priority_score);

  const handleSelectIncident = (incId: string) => {
    setSelectedPinId(incId);
    setSelectedIncidentId(incId);
  };

  const selectedIncident = incidents.find((i) => i.id === selectedPinId);

  return (
    <div className="space-y-4" data-testid={`live-map-page-${operatingMode}`}>
      {/* Top Banner */}
      <div
        className={`${
          operatingMode === 'emergency'
            ? 'bg-gradient-to-r from-red-950 via-[#D32F2F] to-red-800'
            : 'bg-gradient-to-r from-[#101A3A] via-[#2457C5] to-[#1E40AF]'
        } text-white p-4 sm:p-5 rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3`}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-extrabold text-sm uppercase tracking-wider text-cyan-200">
              Live GIS Command Map • Visakhapatnam ({operatingMode.toUpperCase()} MODE)
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            {operatingMode === 'emergency'
              ? 'Emergency Blocked Corridors & Critical Pins'
              : 'Real-Time Coastal Hazard Tracking'}
          </h1>
          <p className="text-xs text-blue-100 mt-0.5">
            Default Filter: {activeFilter} • OpenStreetMap & Governance Stream
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActivePage('report')}
            className="bg-[#D32F2F] hover:bg-red-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Report Hazard</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left List + Right Leaflet Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left List (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Vizag locations..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#2457C5]"
            />
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5" data-testid="map-filter-chips">
            {(
              [
                'All open',
                'Critical and Pending',
                'Pinned',
                'Critical',
                'Pending',
                'Hospital Routes',
              ] as const
            ).map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeFilter === f
                    ? 'bg-[#2457C5] text-white shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {f === 'Pinned' ? '✓ Pinned on Map' : f}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
            <span>{sortedIncidents.length} hazards visible</span>
            <span className="text-[#2457C5]">Visakhapatnam Lat/Lng</span>
          </div>

          {/* Incidents List */}
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {sortedIncidents.length === 0 ? (
              <div className="p-8 text-center text-slate-400 space-y-2">
                <Filter className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs font-semibold">No hazards match active filter.</p>
              </div>
            ) : (
              sortedIncidents.map((inc) => {
                const colors = getSeverityColors(inc.severity);
                const isSelected = selectedPinId === inc.id;

                return (
                  <div
                    key={inc.id}
                    onClick={() => handleSelectIncident(inc.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                      isSelected
                        ? 'border-[#2457C5] bg-blue-50/50 shadow-xs ring-1 ring-[#2457C5]'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs text-white shrink-0 ${colors.dot}`}
                        >
                          {inc.priority_score.toFixed(1)}
                        </div>
                        <strong className="text-xs font-bold text-[#101A3A] truncate">
                          {inc.location}
                        </strong>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${colors.bg} ${colors.text} ${colors.border}`}>
                        {inc.severity}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600 flex items-center justify-between">
                      <span className="truncate">{inc.roadType}</span>
                      {inc.hazard === 'live_electrical_wire' && (
                        <span className="text-red-600 font-bold flex items-center gap-0.5 text-[10px]">
                          <Zap className="w-3 h-3" /> Live Wire
                        </span>
                      )}
                    </div>

                    {inc.approvedByGovernance ? (
                      <div className="text-[10px] bg-green-50 text-green-700 font-bold px-2 py-0.5 rounded border border-green-200 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        <span>Pinned by {inc.governanceOfficerName || 'Governance Officer'}</span>
                      </div>
                    ) : (
                      (currentRole === 'command' || currentRole === 'admin') && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            approveAndPinIncident(inc.id);
                          }}
                          className="mt-1 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] py-1 rounded-lg transition-colors flex items-center justify-center gap-1 shadow-2xs"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Approve & Pin to Map</span>
                        </button>
                      )
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Map Canvas (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs p-3 space-y-3">
          <LeafletMap
            incidents={sortedIncidents}
            helpPoints={helpPoints}
            selectedId={selectedPinId}
            onSelectIncident={handleSelectIncident}
            height="560px"
          />

          {/* Selected Incident Drawer / Details Box */}
          {selectedIncident && (
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-[#101A3A]">{selectedIncident.id}</span>
                  <span className="text-xs text-slate-500 font-medium">({selectedIncident.location})</span>
                  {selectedIncident.approvedByGovernance && (
                    <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      ✓ Governance Pinned
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 font-medium">
                  {selectedIncident.note || 'No additional note provided.'}
                </p>
              </div>

              {!selectedIncident.approvedByGovernance && (currentRole === 'command' || currentRole === 'admin') && (
                <button
                  onClick={() => approveAndPinIncident(selectedIncident.id)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md transition-all flex items-center gap-1.5 whitespace-nowrap"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Approve & Pin to Live Map</span>
                </button>
              )}

              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedIncident.lat},${selectedIncident.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#2457C5] hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <MapPin className="w-4 h-4" />
                <span>Google Maps Route</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
