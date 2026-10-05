import React, { useState, useEffect, useContext } from 'react';
import { Flag, Plus, Users, Target, CheckCircle2, Clock, Calendar, Sparkles } from 'lucide-react';
import { fetchCampaigns } from '../services/api';
import AddCampaignModal from '../components/AddCampaignModal';
import SyntheticDataBanner from '../components/SyntheticDataBanner';
import { AuthContext } from '../context/AuthContext';

export default function CampaignsPage() {
  const { isTeam } = useContext(AuthContext);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const loadCampaigns = async () => {
    setLoading(true);
    try {
      const res = await fetchCampaigns();
      if (res.success) {
        setCampaigns(res.campaigns);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return <span className="inline-flex items-center gap-1 bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 text-[10px] font-black px-2.5 py-0.5 rounded-full"><Sparkles className="w-3 h-3" /> ACTIVE</span>;
      case 'Completed':
        return <span className="inline-flex items-center gap-1 bg-blue-950/80 text-blue-300 border border-blue-500/40 text-[10px] font-semibold px-2.5 py-0.5 rounded-full"><CheckCircle2 className="w-3 h-3" /> COMPLETED</span>;
      default:
        return <span className="inline-flex items-center gap-1 bg-amber-950/80 text-amber-300 border border-amber-500/40 text-[10px] font-semibold px-2.5 py-0.5 rounded-full"><Clock className="w-3 h-3" /> UPCOMING</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <SyntheticDataBanner />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <Flag className="w-7 h-7 text-emerald-400" /> Reduction Campaign Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Monitoring VSIT campus awareness campaigns, participant reach, and measured reduction effectiveness.
          </p>
        </div>

        {isTeam && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition shadow-lg shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" /> Launch New Campaign
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((c) => (
          <div key={c.id} className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4 hover:border-emerald-500/30 transition flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-lg font-bold text-white leading-snug">{c.name}</h3>
                {getStatusBadge(c.status)}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{c.description}</p>

              <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{c.start_date} to {c.end_date}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-800/80">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Participants</span>
                  <span className="font-extrabold text-white text-sm flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-blue-400" /> {(c.participants || 0).toLocaleString()}
                  </span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Target Reduction</span>
                  <span className="font-extrabold text-emerald-400 text-sm flex items-center gap-1">
                    <Target className="w-3.5 h-3.5" /> {c.target_reduction}%
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Actual Measured Reduction</span>
                  <strong className="text-emerald-300">{c.actual_reduction}%</strong>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, ((c.actual_reduction || 0) / (c.target_reduction || 1)) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AddCampaignModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onRefresh={loadCampaigns}
      />
    </div>
  );
}
