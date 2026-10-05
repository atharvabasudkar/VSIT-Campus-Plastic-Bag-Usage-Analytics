import React, { useState, useEffect } from 'react';
import { MapPin, AlertTriangle, ShieldCheck, Flame, Info, CheckCircle2, ChevronRight, X, Sparkles } from 'lucide-react';
import { fetchLocations } from '../services/api';
import SyntheticDataBanner from '../components/SyntheticDataBanner';

export default function CampusHotspotsPage() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLoc, setSelectedLoc] = useState(null);

  useEffect(() => {
    const loadLocations = async () => {
      try {
        const res = await fetchLocations();
        if (res.success) {
          setLocations(res.locations);
          if (res.locations.length > 0) {
            setSelectedLoc(res.locations[0]);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadLocations();
  }, []);

  const getRiskBadge = (risk) => {
    switch (risk) {
      case 'CRITICAL':
        return <span className="inline-flex items-center gap-1 bg-red-950/80 text-red-400 border border-red-500/40 text-[10px] font-black px-2.5 py-0.5 rounded-full"><Flame className="w-3 h-3" /> CRITICAL</span>;
      case 'HIGH':
        return <span className="inline-flex items-center gap-1 bg-amber-950/80 text-amber-400 border border-amber-500/40 text-[10px] font-black px-2.5 py-0.5 rounded-full"><AlertTriangle className="w-3 h-3" /> HIGH</span>;
      case 'MODERATE':
        return <span className="inline-flex items-center gap-1 bg-yellow-950/80 text-yellow-300 border border-yellow-500/40 text-[10px] font-semibold px-2.5 py-0.5 rounded-full"><Info className="w-3 h-3" /> MODERATE</span>;
      default:
        return <span className="inline-flex items-center gap-1 bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-[10px] font-semibold px-2.5 py-0.5 rounded-full"><ShieldCheck className="w-3 h-3" /> LOW</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <SyntheticDataBanner />

      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
          <MapPin className="w-7 h-7 text-emerald-400" /> Campus Hotspots & Location Analysis
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Spatial distribution of plastic bag consumption across VSIT campus zones.
        </p>
      </div>

      {/* Visual Floorplan Grid Map */}
      <div className="glass-card rounded-3xl p-6 border border-emerald-500/20 bg-slate-900/90 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" /> VSIT Interactive Campus Hotspot Map
          </span>
          <span className="text-[11px] text-slate-400">Click location card for full risk diagnostic</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {locations.map((loc) => {
            const isSelected = selectedLoc?.id === loc.id;
            return (
              <div
                key={loc.id}
                onClick={() => setSelectedLoc(loc)}
                className={`glass-card rounded-2xl p-4 cursor-pointer transition-all duration-200 border ${
                  isSelected
                    ? 'border-emerald-400 bg-emerald-950/30 shadow-lg shadow-emerald-500/10 scale-[1.02]'
                    : 'border-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-white text-sm">{loc.name}</span>
                  {getRiskBadge(loc.risk_level)}
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Bags Recorded:</span>
                    <strong className="text-white">{(loc.bags_recorded || 0).toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Est Weight:</span>
                    <strong className="text-amber-400">{loc.weight_kg || 0} kg</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Location Diagnostic Drawer / Card */}
      {selectedLoc && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/30 bg-slate-900 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-black text-white">{selectedLoc.name} Diagnostic Profile</h2>
                {getRiskBadge(selectedLoc.risk_level)}
              </div>
              <p className="text-xs text-slate-400 mt-1">{selectedLoc.description}</p>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">Location Usage Trend</span>
              <span className="text-xs font-bold text-emerald-400">{selectedLoc.trend}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Stat 1 */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 font-medium">Bags Recorded</span>
              <p className="text-3xl font-black text-white">{(selectedLoc.bags_recorded || 0).toLocaleString()}</p>
              <p className="text-[11px] text-slate-400">Total bags observed</p>
            </div>

            {/* Stat 2 */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 font-medium">Plastic Weight</span>
              <p className="text-3xl font-black text-amber-400">{selectedLoc.weight_kg || 0} kg</p>
              <p className="text-[11px] text-slate-400">Accumulated plastic mass</p>
            </div>

            {/* Stat 3 */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 font-medium">Reusable Adoption</span>
              <p className="text-3xl font-black text-emerald-400">{selectedLoc.reusable_adoption_pct || 0}%</p>
              <p className="text-[11px] text-slate-400">Cloth / Tote bag users</p>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Major Reasons */}
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Primary Reasons for Usage</h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {(selectedLoc.major_reasons || []).map((reason, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended Action */}
            <div className="bg-emerald-950/30 p-4 rounded-2xl border border-emerald-500/30 space-y-2">
              <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Recommended Action
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed">
                {selectedLoc.recommended_action}
              </p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
