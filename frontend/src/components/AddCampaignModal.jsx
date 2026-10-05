import React, { useState, useContext } from 'react';
import { X, Flag, CheckCircle2 } from 'lucide-react';
import { createCampaign } from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function AddCampaignModal({ isOpen, onClose, onRefresh }) {
  const { token } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    participants: 100,
    target_reduction: 30.0,
    actual_reduction: 0.0,
    status: 'Active',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createCampaign(formData, token);
      if (res.success) {
        setMsg('Campaign created successfully!');
        if (onRefresh) onRefresh();
        setTimeout(() => {
          setMsg('');
          onClose();
        }, 1200);
      }
    } catch (err) {
      setMsg('Failed to create campaign.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="glass-card rounded-3xl border border-emerald-500/30 max-w-md w-full p-6 relative bg-slate-900 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-800 pb-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <Flag className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Add Sustainability Campaign</h3>
            <p className="text-xs text-slate-400">Launch a new VSIT plastic reduction drive</p>
          </div>
        </div>

        {msg ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <p className="text-emerald-300 font-bold text-base">{msg}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Campaign Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. BYOB Cloth Bag Drive"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Start Date *</label>
                <input
                  type="date"
                  required
                  value={formData.start_date}
                  onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">End Date *</label>
                <input
                  type="date"
                  required
                  value={formData.end_date}
                  onChange={e => setFormData({ ...formData, end_date: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Target Reduction %</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.target_reduction}
                  onChange={e => setFormData({ ...formData, target_reduction: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Upcoming">Upcoming</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Campaign Description</label>
              <textarea
                rows="2"
                placeholder="Objectives and target audience..."
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-xl text-sm transition shadow-lg shadow-emerald-500/20"
            >
              {loading ? 'Creating...' : 'Create Campaign'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
