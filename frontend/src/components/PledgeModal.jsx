import React, { useState } from 'react';
import { X, Award, CheckCircle2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { submitPledge } from '../services/api';

export default function PledgeModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    user_category: 'Students',
    department: 'BSc IT',
    pledge_type: 'I pledge to carry a reusable cloth bag every day on VSIT campus and refrain from accepting single-use plastic carry bags.'
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await submitPledge(formData);
      if (res.success) {
        setSubmitted(true);
        setMsg(res.message);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      setMsg('Failed to record pledge.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-card rounded-3xl border border-emerald-500/30 max-w-lg w-full p-6 relative overflow-hidden bg-slate-900 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-white">Eco-Pledge Registered!</h3>
            <p className="text-slate-300 text-sm leading-relaxed max-w-md mx-auto">{msg}</p>
            <div className="bg-emerald-950/40 p-3 rounded-xl border border-emerald-500/20 text-emerald-300 text-xs font-medium">
              You are now recognized as a VSIT Campus Sustainability Ambassador.
            </div>
            <button
              onClick={onClose}
              className="mt-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-sm transition shadow-lg shadow-emerald-500/20"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center">
                <Award className="w-6 h-6 text-slate-950" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white">VSIT Campus Eco-Pledge</h3>
                <p className="text-xs text-emerald-400 font-medium">Commit to Zero Single-Use Plastic Usage</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">User Category</label>
                  <select
                    value={formData.user_category}
                    onChange={e => setFormData({ ...formData, user_category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Students">Student</option>
                    <option value="Teaching Staff">Teaching Staff</option>
                    <option value="Non-Teaching Staff">Non-Teaching Staff</option>
                    <option value="Vendors">Vendor</option>
                    <option value="Visitors">Visitor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={e => setFormData({ ...formData, department: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
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

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">VSIT Email (Optional)</label>
                <input
                  type="email"
                  placeholder="student@vsit.edu.in"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="bg-emerald-950/30 p-3 rounded-xl border border-emerald-500/30">
                <label className="block text-[11px] font-semibold text-emerald-300 mb-1 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Pledge Declaration
                </label>
                <p className="text-xs text-slate-300 italic">
                  "{formData.pledge_type}"
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold py-2.5 rounded-xl text-sm transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              {loading ? 'Registering...' : 'Sign Campus Eco-Pledge'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
