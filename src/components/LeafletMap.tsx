import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Incident, HelpPoint } from '../types.ts';

interface LeafletMapProps {
  incidents?: Incident[];
  helpPoints?: HelpPoint[];
  selectedId?: string | null;
  onSelectIncident?: (id: string) => void;
  onSelectHelpPoint?: (id: string) => void;
  height?: string;
  showHelpPoints?: boolean;
  showHazards?: boolean;
  center?: [number, number];
  zoom?: number;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  incidents = [],
  helpPoints = [],
  selectedId,
  onSelectIncident,
  onSelectHelpPoint,
  height = '500px',
  showHelpPoints = true,
  showHazards = true,
  center = [17.6868, 83.2185],
  zoom = 12,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});

  useEffect(() => {
    if (!containerRef.current) return;

    if (!mapRef.current) {
      const map = L.map(containerRef.current, {
        center,
        zoom,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      mapRef.current = map;
    }

    const map = mapRef.current;

    // Clear existing markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    // Add Incident / Hazard Markers
    if (showHazards) {
      incidents.forEach((inc) => {
        const isCritical = inc.priority_score >= 8 || inc.severity === 'Critical';
        const isHigh = inc.priority_score >= 6;
        const bgClass = isCritical ? 'bg-red-600' : isHigh ? 'bg-amber-500' : 'bg-emerald-600';

        const customIcon = L.divIcon({
          className: 'custom-leaflet-marker',
          html: `
            <div class="relative flex items-center justify-center group">
              <div class="w-8 h-8 rounded-full ${bgClass} text-white font-extrabold text-xs flex items-center justify-center shadow-lg border-2 border-white transform hover:scale-110 transition-all">
                ${inc.priority_score.toFixed(1)}
              </div>
              ${
                inc.hazard === 'live_electrical_wire'
                  ? '<div class="absolute -top-1 -right-1 w-3.5 h-3.5 bg-yellow-400 text-black font-black text-[9px] rounded-full flex items-center justify-center border border-black shadow-xs">⚡</div>'
                  : ''
              }
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const popupHtml = `
          <div class="p-1 max-w-[220px]">
            <div class="flex items-center justify-between gap-2 mb-1">
              <span class="font-extrabold text-xs text-slate-900">${inc.id}</span>
              <span class="px-1.5 py-0.5 text-[10px] font-bold rounded ${
                isCritical ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'
              }">${inc.severity}</span>
            </div>
            <p class="font-bold text-xs text-slate-800 leading-snug mb-1">${inc.location}</p>
            <div class="text-[11px] text-slate-600 mb-1.5 space-y-0.5">
              <div>Road: <strong>${inc.roadType}</strong></div>
              <div>Status: <span class="font-semibold text-blue-600">${inc.status}</span></div>
            </div>
            ${
              inc.approvedByGovernance
                ? `<div class="text-[10px] bg-green-50 text-green-700 font-bold px-1.5 py-1 rounded border border-green-200 flex items-center gap-1 mb-1.5">
                     ✓ Pinned by Governance
                   </div>`
                : ''
            }
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=${inc.lat},${inc.lng}"
              target="_blank"
              rel="noopener noreferrer"
              class="mt-1.5 inline-flex items-center gap-1 bg-[#2457C5] hover:bg-blue-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-md transition-colors"
            >
              📍 Open Google Maps Route
            </a>
          </div>
        `;

        const marker = L.marker([inc.lat, inc.lng], { icon: customIcon }).addTo(map);
        marker.bindPopup(popupHtml);

        marker.on('click', () => {
          if (onSelectIncident) {
            onSelectIncident(inc.id);
          }
        });

        markersRef.current[inc.id] = marker;
      });
    }

    // Add Help Point / Relief Shelter Markers
    if (showHelpPoints) {
      helpPoints.forEach((hp) => {
        const getSymbolAndColor = () => {
          switch (hp.category) {
            case 'relief_camp':
              return { symbol: '⛺', bg: 'bg-emerald-600' };
            case 'hospital':
              return { symbol: '🏥', bg: 'bg-red-600' };
            case 'fire_station':
              return { symbol: '🚒', bg: 'bg-amber-600' };
            case 'water_food':
              return { symbol: '🚰', bg: 'bg-cyan-600' };
            case 'depot':
              return { symbol: '🚛', bg: 'bg-[#2457C5]' };
            default:
              return { symbol: '🛡️', bg: 'bg-blue-600' };
          }
        };

        const { symbol, bg } = getSymbolAndColor();

        const hpIcon = L.divIcon({
          className: 'custom-help-marker',
          html: `
            <div class="w-8 h-8 rounded-xl ${bg} text-white flex items-center justify-center font-black text-sm shadow-md border-2 border-white transform hover:scale-110 transition-all">
              ${symbol}
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const hpPopup = `
          <div class="p-1 max-w-[220px]">
            <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block mb-0.5">
              ${hp.category.replace('_', ' ').toUpperCase()}
            </span>
            <h4 class="font-extrabold text-xs text-slate-900">${hp.name}</h4>
            <p class="text-[11px] text-slate-600 mt-0.5">${hp.address}</p>
            ${
              hp.capacityFree !== undefined
                ? `<div class="mt-1.5 text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    ${hp.capacityFree} free beds available
                   </div>`
                : ''
            }
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=${hp.lat},${hp.lng}"
              target="_blank"
              rel="noopener noreferrer"
              class="mt-2 inline-flex items-center gap-1 bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] font-bold px-2.5 py-1 rounded-md transition-colors"
            >
              🗺️ Open Google Maps Route
            </a>
          </div>
        `;

        const hpMarker = L.marker([hp.lat, hp.lng], { icon: hpIcon }).addTo(map);
        hpMarker.bindPopup(hpPopup);

        hpMarker.on('click', () => {
          if (onSelectHelpPoint) {
            onSelectHelpPoint(hp.id);
          }
        });

        markersRef.current['hp_' + hp.id] = hpMarker;
      });
    }

    // Fly to selected item if specified
    if (selectedId) {
      const targetMarker = markersRef.current[selectedId] || markersRef.current['hp_' + selectedId];
      if (targetMarker) {
        targetMarker.openPopup();
      }
    }
  }, [incidents, helpPoints, selectedId, showHelpPoints, showHazards, center, zoom]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
      <div ref={containerRef} style={{ height, width: '100%' }} />
    </div>
  );
};
