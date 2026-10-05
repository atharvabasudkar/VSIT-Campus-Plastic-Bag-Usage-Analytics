import React, { useState } from 'react';
import { PlusCircle, CheckCircle2, ClipboardList, Send } from 'lucide-react';
import { createObservation } from '../services/api';
import SyntheticDataBanner from '../components/SyntheticDataBanner';

export default function ReportUsagePage() {
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
    notes: 'Observed during lunch hour peak',
    submitted_by: 'VSIT Student/Observer'
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createObservation(formData);
      if (res.success) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      <SyntheticDataBanner />

      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
          <PlusCircle className="w-7 h-7 text-emerald-400" /> Log Plastic Usage Field Observation
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          CEP Team & Student Fieldwork Data Entry Form.
        </p>
      </div>

      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-emerald-500/30 bg-slate-900 shadow-2xl">
        {submitted ? (
          <div className="text-center py-12 space-y-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
            <h2 className="text-2xl font-bold text-white">Observation Saved to Database!</h2>
            <p className="text-slate-300 text-xs">
              Your field observation has been saved into SQLite database and included in overall campus analytics calculations.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs"
            >
              Log Another Observation
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Date of Observation *</label>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                <label className="block font-semibold text-slate-300 mb-1">Bags Used Count *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.bags_used}
                  onChange={e => setFormData({ ...formData, bags_used: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Est. Weight (grams)</label>
                <input
                  type="number"
                  placeholder="Auto-calculated if blank"
                  value={formData.estimated_weight_grams}
                  onChange={e => setFormData({ ...formData, estimated_weight_grams: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Reusable Alternative Available?</label>
                <select
                  value={formData.reusable_bag_used}
                  onChange={e => setFormData({ ...formData, reusable_bag_used: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="No">No (Single-Use Plastic)</option>
                  <option value="Yes">Yes (Cloth/Canvas Tote)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Was Plastic Avoidable?</label>
                <select
                  value={formData.plastic_avoidable}
                  onChange={e => setFormData({ ...formData, plastic_avoidable: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Yes">Yes (Easily Avoidable)</option>
                  <option value="No">No (Essential Liquid/Safety)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Purpose of Usage</label>
              <input
                type="text"
                placeholder="e.g. Snack takeaway packaging, xerox printouts carrying"
                value={formData.purpose}
                onChange={e => setFormData({ ...formData, purpose: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Field Observation Notes</label>
              <textarea
                rows="3"
                placeholder="Observed user behavior, vendor compliance, presence of awareness posters..."
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-2xl text-sm transition shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Observation Record'}
            </button>
          </form>
        )}
      </div>

    </div>
  );
}
