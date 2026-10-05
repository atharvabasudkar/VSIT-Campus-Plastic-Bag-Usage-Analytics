import React, { useState } from 'react';
import { X, PlusCircle, CheckCircle2 } from 'lucide-react';
import { createObservation } from '../services/api';

export default function AddObservationModal({ isOpen, onClose, onRefresh }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    campus_location: 'Canteen',
    user_category: 'Students',
    department: 'BSc IT',
    bag_type: 'Thin Carry Bag',
    bags_used: 1,
    estimated_weight_grams: '',
    purpose: 'Food takeaway packaging',
    reusable_bag_used: 'No',
    plastic_avoidable: 'Yes',
    awareness_level: 'Medium',
    campaign_exposure: 'No',
    disposal_method: 'Dustbin',
    notes: 'Observed during lunch hour',
    submitted_by: 'CEP Field Researcher'
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createObservation(formData);
      if (res.success) {
        setSuccessMsg(res.message);
        if (onRefresh) onRefresh();
        setTimeout(() => {
          setSuccessMsg('');
          onClose();
        }, 1200);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="glass-card rounded-3xl border border-emerald-500/30 max-w-xl w-full p-6 relative overflow-hidden bg-slate-900 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-800 pb-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Record Plastic Usage Observation</h3>
            <p className="text-xs text-slate-400">CEP Fieldwork Observation Entry Form</p>
          </div>
        </div>

        {successMsg ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <p className="text-emerald-300 font-bold text-base">{successMsg}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Date *</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Campus Location *</label>
                <select
                  value={formData.campus_location}
                  onChange={e => setFormData({ ...formData, campus_location: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Canteen">Canteen</option>
                  <option value="Cafeteria">Cafeteria</option>
                  <option value="Stationery Area">Stationery Area</option>
                  <option value="Library Area">Library Area</option>
                  <option value="Administrative Area">Administrative Area</option>
                  <option value="Campus Events">Campus Events</option>
                  <option value="Student Activity Area">Student Activity Area</option>
                  <option value="Entrance / Exit">Entrance / Exit</option>
                  <option value="Nearby Vendor Interaction">Nearby Vendor Interaction</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">User Category *</label>
                <select
                  value={formData.user_category}
                  onChange={e => setFormData({ ...formData, user_category: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Students">Students</option>
                  <option value="Teaching Staff">Teaching Staff</option>
                  <option value="Non-Teaching Staff">Non-Teaching Staff</option>
                  <option value="Vendors">Vendors</option>
                  <option value="Visitors">Visitors</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Department</label>
                <select
                  value={formData.department}
                  onChange={e => setFormData({ ...formData, department: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="BSc IT">BSc IT</option>
                  <option value="BSc CS">BSc CS</option>
                  <option value="BCA">BCA</option>
                  <option value="MSc IT">MSc IT</option>
                  <option value="Teaching Staff">Teaching Staff</option>
                  <option value="Administrative Staff">Administrative Staff</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Plastic Bag Type *</label>
                <select
                  value={formData.bag_type}
                  onChange={e => setFormData({ ...formData, bag_type: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Thin Carry Bag">Thin Carry Bag (&lt;50µm)</option>
                  <option value="Medium Carry Bag">Medium Carry Bag</option>
                  <option value="Large Carry Bag">Large Carry Bag</option>
                  <option value="Food Packaging Bag">Food Packaging Bag</option>
                  <option value="Shopping Bag">Shopping Bag</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Bags Count *</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.bags_used}
                  onChange={e => setFormData({ ...formData, bags_used: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Reusable Bag Carried?</label>
                <select
                  value={formData.reusable_bag_used}
                  onChange={e => setFormData({ ...formData, reusable_bag_used: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="No">No (Single-Use Plastic)</option>
                  <option value="Yes">Yes (Cloth/Canvas/Reusable)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Plastic Avoidable?</label>
                <select
                  value={formData.plastic_avoidable}
                  onChange={e => setFormData({ ...formData, plastic_avoidable: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Yes">Yes (Easily Avoidable)</option>
                  <option value="No">No (Essential/Liquid Packaging)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Purpose of Usage</label>
              <input
                type="text"
                placeholder="e.g. Snack takeaway, books carry"
                value={formData.purpose}
                onChange={e => setFormData({ ...formData, purpose: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Observation Notes</label>
              <textarea
                rows="2"
                placeholder="Detailed context or observed user behavior..."
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-xl text-sm transition shadow-lg shadow-emerald-500/20"
            >
              {loading ? 'Submitting...' : 'Save Field Observation'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
