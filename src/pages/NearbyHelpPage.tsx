import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { HelpCategory, HelpPoint } from '../types.ts';
import { calculateDistance } from '../utils/rules.ts';
import { LeafletMap } from '../components/LeafletMap.tsx';
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  Compass,
  Edit2,
  Heart,
  LifeBuoy,
  MapPin,
  Navigation,
  Phone,
  Shield,
  Truck,
  Utensils,
  Droplet,
  Zap,
  Users,
  X,
} from 'lucide-react';

export const NearbyHelpPage: React.FC = () => {
  const { helpPoints, updateHelpPointCapacity, addHelpPoint, deleteHelpPoint, currentRole, incidents } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);
  const [routeWarning, setRouteWarning] = useState<string | null>(null);

  // Edit Shelter Capacity Modal (Command & Admin)
  const [editingPoint, setEditingPoint] = useState<HelpPoint | null>(null);
  const [newFreeBeds, setNewFreeBeds] = useState<number>(100);
  const [newStatus, setNewStatus] = useState<HelpPoint['status']>('Open');

  // Add Facility Modal (Command & Admin)
  const [isAddFacilityOpen, setIsAddFacilityOpen] = useState(false);
  const [addName, setAddName] = useState('');
  const [addCategory, setAddCategory] = useState<HelpCategory>('relief_camp');
  const [addAddress, setAddAddress] = useState('Central Visakhapatnam');
  const [addPhone, setAddPhone] = useState('+91 891 256 0000');
  const [addCapacity, setAddCapacity] = useState(250);
  const [addCapacityFree, setAddCapacityFree] = useState(100);
  const [addFacilitiesStr, setAddFacilitiesStr] = useState('Hot Food, Drinking Water, Medical Aid');

  // User center (Visakhapatnam center)
  const userLat = 17.725;
  const userLng = 83.31;

  const categories: { id: string; label: string; icon: any }[] = [
    { id: 'all', label: 'All Services', icon: Shield },
    { id: 'relief_camp', label: 'Relief Camps', icon: LifeBuoy },
    { id: 'hospital', label: 'Hospitals', icon: Heart },
    { id: 'fire_station', label: 'Fire & Rescue', icon: AlertTriangle },
    { id: 'depot', label: 'Clearance Depots', icon: Truck },
    { id: 'water_food', label: 'Water & Food', icon: Utensils },
  ];

  const handleSaveNewFacility = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName.trim()) return;
    addHelpPoint({
      name: addName.trim(),
      category: addCategory,
      lat: userLat + (Math.random() - 0.5) * 0.04,
      lng: userLng + (Math.random() - 0.5) * 0.04,
      address: addAddress,
      phone: addPhone,
      status: 'Open',
      capacity: addCapacity,
      capacityFree: addCapacityFree,
      facilities: addFacilitiesStr.split(',').map((s) => s.trim()).filter(Boolean),
      sample: false,
    });
    setIsAddFacilityOpen(false);
    setAddName('');
  };

  const pointsWithDistance = helpPoints
    .map((hp) => ({
      ...hp,
      dist: calculateDistance(userLat, userLng, hp.lat, hp.lng),
    }))
    .filter((hp) => (activeCategory === 'all' ? true : hp.category === activeCategory))
    .sort((a, b) => a.dist - b.dist);

  // Directions clicked - check if road is blocked by critical hazards
  const handleGetDirections = (hp: HelpPoint) => {
    setSelectedPointId(hp.id);
    // Find if there is a critical hazard near this route
    const blockedNearby = incidents.find(
      (inc) =>
        (inc.severity === 'Critical' || inc.severity === 'High') &&
        calculateDistance(hp.lat, hp.lng, inc.lat, inc.lng) < 2.5
    );

    if (blockedNearby) {
      setRouteWarning(
        `Warning: Route near ${blockedNearby.location} is blocked by ${
          blockedNearby.hazard === 'live_electrical_wire' ? 'live electrical cables' : 'fallen trees'
        }. Use alternate highway bypass.`
      );
    } else {
      setRouteWarning(null);
    }
  };

  const handleOpenEdit = (hp: HelpPoint) => {
    setEditingPoint(hp);
    setNewFreeBeds(hp.capacityFree || 0);
    setNewStatus(hp.status);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPoint) return;
    updateHelpPointCapacity(editingPoint.id, newFreeBeds, newStatus);
    setEditingPoint(null);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-[#16834A] uppercase tracking-wider">
            Public Safety & Civic Care
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#101A3A] tracking-tight mt-1">
            Nearby Help & Safe Shelters
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Verified relief camps, trauma emergency hospitals, and water distribution points in Visakhapatnam.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(currentRole === 'command' || currentRole === 'admin') && (
            <button
              onClick={() => setIsAddFacilityOpen(true)}
              className="px-4 py-2.5 bg-[#16834A] hover:bg-green-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow transition-all active:scale-95"
            >
              <Building2 className="w-4 h-4" />
              <span>Admin: Add Facility</span>
            </button>
          )}

          <div className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 self-start sm:self-auto">
            Saved offline
          </div>
        </div>
      </div>

      {/* Category Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {categories.map((c) => {
          const Icon = c.icon;
          const isActive = activeCategory === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#16834A] text-white shadow-md'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{c.label}</span>
            </button>
          );
        })}
      </div>

      {/* Route Warning Banner if detected */}
      {routeWarning && (
        <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-400 text-amber-950 flex items-start gap-3 shadow-md animate-in fade-in">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <strong className="block text-sm font-extrabold">Navigational Hazard Alert</strong>
            <p className="text-xs font-semibold mt-0.5">{routeWarning}</p>
          </div>
          <button
            onClick={() => setRouteWarning(null)}
            className="text-amber-700 p-1 hover:bg-amber-100 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Split Layout: List of Help Cards + Interactive Overview Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left List (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {pointsWithDistance.map((hp) => {
            const isCamp = hp.category === 'relief_camp';
            const isSelected = selectedPointId === hp.id;

            return (
              <div
                key={hp.id}
                className={`bg-white rounded-3xl p-5 border transition-all shadow-xs ${
                  isSelected
                    ? 'border-[#2457C5] ring-2 ring-blue-100'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white ${
                        isCamp
                          ? 'bg-[#16834A]'
                          : hp.category === 'hospital'
                          ? 'bg-[#D32F2F]'
                          : 'bg-[#2457C5]'
                      }`}
                    >
                      {isCamp ? (
                        <LifeBuoy className="w-5 h-5" />
                      ) : hp.category === 'hospital' ? (
                        <Heart className="w-5 h-5" />
                      ) : (
                        <Building2 className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-base text-[#101A3A]">{hp.name}</h3>
                        {hp.sample && (
                          <span className="text-[10px] uppercase font-bold text-slate-400 border border-slate-200 px-1 rounded">
                            Sample
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-[#2457C5] font-bold">
                        {hp.dist} km from current location
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                      hp.status === 'Open'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : hp.status === 'Almost full'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}
                  >
                    {hp.status}
                  </span>
                </div>

                <p className="text-xs text-slate-500 mb-3">{hp.address}</p>

                {/* Capacity Bar for Relief Camps */}
                {isCamp && hp.capacity && hp.capacityFree !== undefined && (
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 mb-3 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>Shelter Capacity</span>
                      <span className="text-[#16834A]">
                        {hp.capacityFree} of {hp.capacity} beds free
                      </span>
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-[#16834A] h-2.5 rounded-full transition-all"
                        style={{
                          width: `${Math.round(((hp.capacity - hp.capacityFree) / hp.capacity) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Amenities / Facilities */}
                {hp.facilities && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {hp.facilities.map((fac, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                      >
                        ✓ {fac}
                      </span>
                    ))}
                  </div>
                )}

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${hp.phone.split(' ')[0]}`}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 font-bold rounded-xl text-slate-800 flex items-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-green-700" />
                      <span>Call Facility</span>
                    </a>

                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${hp.lat},${hp.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleGetDirections(hp)}
                      className="px-3 py-1.5 bg-[#2457C5] hover:bg-blue-700 font-bold rounded-xl text-white flex items-center gap-1.5 shadow transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Get Directions</span>
                    </a>
                  </div>

                  {/* Command Officer / Admin quick capacity update & delete */}
                  {(currentRole === 'command' || currentRole === 'admin') && (
                    <div className="flex items-center gap-2">
                      {isCamp && (
                        <button
                          onClick={() => handleOpenEdit(hp)}
                          className="text-xs font-bold text-[#16834A] hover:underline flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Update Beds</span>
                        </button>
                      )}
                      {currentRole === 'admin' && (
                        <button
                          onClick={() => deleteHelpPoint(hp.id)}
                          className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
                        >
                          <X className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Map Preview (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4 sticky top-28">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-[#101A3A] flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#2457C5]" />
              <span>Visakhapatnam Facilities Map</span>
            </h3>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
              Offline Cache
            </span>
          </div>

          <LeafletMap
            helpPoints={pointsWithDistance}
            incidents={incidents}
            selectedId={selectedPointId}
            onSelectHelpPoint={(id) => setSelectedPointId(id)}
            height="360px"
            showHelpPoints={true}
            showHazards={true}
          />

          <div className="text-xs text-slate-500 space-y-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-800 block text-[11px] uppercase">
              Immediate Relief Hotline
            </span>
            <p className="text-[11px] leading-relaxed">
              For priority evacuation transport from inundated colonies, reach the Central Disaster Cell at{' '}
              <strong className="text-slate-900">0891-2568241 (Sample)</strong> or dial 112.
            </p>
          </div>
        </div>
      </div>

      {/* FIXED NAVY EMERGENCY CONTACTS STRIP AT BOTTOM */}
      <div className="bg-[#101A3A] text-white p-5 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-red-400 uppercase tracking-wider block">
            National Disaster Lines
          </span>
          <strong className="text-base font-extrabold">Instant Toll-Free Emergency Help</strong>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <a
            href="tel:112"
            className="flex-1 sm:flex-initial px-5 py-2.5 bg-[#D32F2F] hover:bg-red-700 text-white rounded-xl font-black text-sm shadow flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Phone className="w-4 h-4" />
            <span>112 Emergency</span>
          </a>
          <a
            href="tel:108"
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            <span>108 Ambulance</span>
          </a>
          <a
            href="tel:101"
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            <span>101 Fire</span>
          </a>
        </div>
      </div>

      {/* Edit Shelter Capacity Modal */}
      {editingPoint && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-extrabold text-base text-[#101A3A]">Update Camp Capacity</h3>
              <button onClick={() => setEditingPoint(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Free Beds Available (Out of {editingPoint.capacity})
                </label>
                <input
                  type="number"
                  min="0"
                  max={editingPoint.capacity}
                  value={newFreeBeds}
                  onChange={(e) => setNewFreeBeds(parseInt(e.target.value) || 0)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Operating Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold"
                >
                  <option value="Open">Open</option>
                  <option value="Almost full">Almost full</option>
                  <option value="Full">Full</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingPoint(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#16834A] text-white rounded-xl shadow"
                >
                  Save Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Facility Modal */}
      {isAddFacilityOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-[#101A3A]">Admin: Add New Facility / Shelter</h3>
              <button onClick={() => setIsAddFacilityOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewFacility} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Facility Name</label>
                <input
                  type="text"
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  placeholder="e.g. Visakhapatnam Port Relief Shelter"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={addCategory}
                  onChange={(e) => setAddCategory(e.target.value as HelpCategory)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                >
                  <option value="relief_camp">Relief Camp</option>
                  <option value="hospital">Hospital</option>
                  <option value="fire_station">Fire & Rescue Station</option>
                  <option value="depot">Clearance Machinery Depot</option>
                  <option value="water_food">Water & Food Distribution</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Address / Location</label>
                <input
                  type="text"
                  value={addAddress}
                  onChange={(e) => setAddAddress(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Emergency Phone</label>
                <input
                  type="text"
                  value={addPhone}
                  onChange={(e) => setAddPhone(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                  required
                />
              </div>

              {addCategory === 'relief_camp' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Total Capacity</label>
                    <input
                      type="number"
                      value={addCapacity}
                      onChange={(e) => setAddCapacity(parseInt(e.target.value) || 100)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Free Beds</label>
                    <input
                      type="number"
                      value={addCapacityFree}
                      onChange={(e) => setAddCapacityFree(parseInt(e.target.value) || 0)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Facilities (Comma separated)
                </label>
                <input
                  type="text"
                  value={addFacilitiesStr}
                  onChange={(e) => setAddFacilitiesStr(e.target.value)}
                  placeholder="Hot Food, Drinking Water, First Aid"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddFacilityOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#16834A] text-white rounded-xl shadow"
                >
                  Save Facility
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
