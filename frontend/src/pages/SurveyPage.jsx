import React, { useState, useEffect } from 'react';
import { ClipboardList, CheckCircle2, Sparkles, BarChart2, MessageSquare, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { submitSurvey, fetchSurveyStats } from '../services/api';
import SyntheticDataBanner from '../components/SyntheticDataBanner';

export default function SurveyPage() {
  const [activeTab, setActiveTab] = useState('take-survey'); // 'take-survey' | 'survey-results'
  const [formData, setFormData] = useState({
    user_category: 'Students',
    department: 'BSc IT',
    frequency_use: 'Occasionally',
    bags_per_week: 3,
    primary_location: 'Canteen',
    common_bag_type: 'Thin Carry Bag',
    primary_reason: 'Food takeaway convenience',
    carry_reusable_bag: 'Sometimes',
    reuse_frequency: 'Often',
    aware_impact: 'Yes',
    support_restrictions: 'Yes',
    switch_alternatives: 'Yes',
    incentives_help: 'Yes',
    noticed_campaigns: 'Yes',
    effective_measure: 'Canteen bag surcharge & BYOB rewards'
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmMsg, setConfirmMsg] = useState('');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await fetchSurveyStats();
      if (res.success) {
        setStats(res.stats);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await submitSurvey(formData);
      if (res.success) {
        setSubmitted(true);
        setConfirmMsg(res.message);
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        loadStats();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <SyntheticDataBanner />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <ClipboardList className="w-7 h-7 text-emerald-400" /> VSIT Plastic Usage Survey System
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Collecting student, faculty, and staff perspectives on campus single-use plastic reduction.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('take-survey')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'take-survey'
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Take Survey
          </button>
          <button
            onClick={() => setActiveTab('survey-results')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'survey-results'
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Survey Findings
          </button>
        </div>
      </div>

      {activeTab === 'take-survey' ? (
        <div className="max-w-3xl mx-auto glass-card rounded-3xl p-6 sm:p-8 border border-emerald-500/30 bg-slate-900/90 shadow-2xl">
          {submitted ? (
            <div className="text-center py-12 space-y-6">
              <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h2 className="text-2xl font-black text-white">Survey Response Submitted!</h2>
              <p className="text-emerald-300 text-sm font-semibold max-w-md mx-auto leading-relaxed">
                "{confirmMsg}"
              </p>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 max-w-md mx-auto text-xs text-slate-400 space-y-1">
                <p>Your input helps the CEP research team formulate actionable policies for VSIT leadership.</p>
              </div>
              <div className="flex justify-center gap-4 pt-4">
                <button
                  onClick={() => setSubmitted(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-5 py-2.5 rounded-xl text-xs"
                >
                  Submit Another Response
                </button>
                <button
                  onClick={() => setActiveTab('survey-results')}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5"
                >
                  View Survey Findings <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 text-xs">
              
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" /> Student & Staff Survey Questionnaire (15 Questions)
                </h3>
                <p className="text-[11px] text-slate-400">All questions are mandatory for analytical accuracy.</p>
              </div>

              {/* Q1 & Q2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-200 mb-1">1. User Category *</label>
                  <select
                    value={formData.user_category}
                    onChange={e => setFormData({ ...formData, user_category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Students">Student</option>
                    <option value="Teaching Staff">Teaching Staff</option>
                    <option value="Non-Teaching Staff">Non-Teaching Staff</option>
                    <option value="Vendors">Vendor</option>
                    <option value="Visitors">Visitor</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-200 mb-1">2. Department *</label>
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

              {/* Q3 & Q4 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-200 mb-1">3. Plastic Bag Usage Frequency on Campus</label>
                  <select
                    value={formData.frequency_use}
                    onChange={e => setFormData({ ...formData, frequency_use: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Daily">Daily</option>
                    <option value="2-3 times/week">2-3 times per week</option>
                    <option value="Occasionally">Occasionally</option>
                    <option value="Rarely">Rarely</option>
                    <option value="Never">Never</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-200 mb-1">4. Approx. Plastic Bags Used Per Week: <strong className="text-emerald-400">{formData.bags_per_week}</strong></label>
                  <input
                    type="range"
                    min="0"
                    max="25"
                    value={formData.bags_per_week}
                    onChange={e => setFormData({ ...formData, bags_per_week: parseInt(e.target.value) })}
                    className="w-full accent-emerald-500"
                  />
                </div>
              </div>

              {/* Q5 & Q6 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-200 mb-1">5. Primary Location of Bag Acquisition</label>
                  <select
                    value={formData.primary_location}
                    onChange={e => setFormData({ ...formData, primary_location: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Canteen">Canteen</option>
                    <option value="Cafeteria">Cafeteria</option>
                    <option value="Stationery Area">Stationery Area</option>
                    <option value="Campus Events">Campus Events</option>
                    <option value="Nearby Vendor Interaction">Nearby Vendors</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-200 mb-1">6. Most Commonly Used Bag Type</label>
                  <select
                    value={formData.common_bag_type}
                    onChange={e => setFormData({ ...formData, common_bag_type: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Thin Carry Bag">Thin Carry Bag (&lt;50 microns)</option>
                    <option value="Medium Carry Bag">Medium Carry Bag</option>
                    <option value="Large Carry Bag">Large Carry Bag</option>
                    <option value="Food Packaging Bag">Food Packaging Bag</option>
                    <option value="Shopping Bag">Shopping Bag</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Q7 & Q8 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-200 mb-1">7. Primary Reason for Plastic Bag Use</label>
                  <input
                    type="text"
                    value={formData.primary_reason}
                    onChange={e => setFormData({ ...formData, primary_reason: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-200 mb-1">8. Do you carry a Reusable Cloth Bag?</label>
                  <select
                    value={formData.carry_reusable_bag}
                    onChange={e => setFormData({ ...formData, carry_reusable_bag: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Always">Always</option>
                    <option value="Often">Often</option>
                    <option value="Sometimes">Sometimes</option>
                    <option value="Rarely">Rarely</option>
                    <option value="Never">Never</option>
                  </select>
                </div>
              </div>

              {/* Q9 & Q10 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-200 mb-1">9. How frequently do you reuse plastic bags?</label>
                  <select
                    value={formData.reuse_frequency}
                    onChange={e => setFormData({ ...formData, reuse_frequency: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Always">Always reuse</option>
                    <option value="Often">Often reuse</option>
                    <option value="Sometimes">Sometimes</option>
                    <option value="Never">Single-use discard</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-200 mb-1">10. Aware of Plastic Environmental Impact?</label>
                  <select
                    value={formData.aware_impact}
                    onChange={e => setFormData({ ...formData, aware_impact: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Yes">Yes (Fully Aware)</option>
                    <option value="Partially">Partially Aware</option>
                    <option value="No">No / Unaware</option>
                  </select>
                </div>
              </div>

              {/* Q11, Q12, Q13 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-200 mb-1">11. Support Restrictions?</label>
                  <select
                    value={formData.support_restrictions}
                    onChange={e => setFormData({ ...formData, support_restrictions: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Yes">Yes (Strongly Support)</option>
                    <option value="Neutral">Neutral</option>
                    <option value="No">No</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-200 mb-1">12. Switch to Alternatives?</label>
                  <select
                    value={formData.switch_alternatives}
                    onChange={e => setFormData({ ...formData, switch_alternatives: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Yes">Yes (Paper/Cloth)</option>
                    <option value="Maybe">Maybe</option>
                    <option value="No">No</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-200 mb-1">13. Incentives Encourage You?</label>
                  <select
                    value={formData.incentives_help}
                    onChange={e => setFormData({ ...formData, incentives_help: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Yes">Yes (Eco points / Discounts)</option>
                    <option value="No">No impact</option>
                  </select>
                </div>
              </div>

              {/* Q14 & Q15 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-200 mb-1">14. Noticed Campaigns on VSIT Campus?</label>
                  <select
                    value={formData.noticed_campaigns}
                    onChange={e => setFormData({ ...formData, noticed_campaigns: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Yes">Yes (Have seen posters/drives)</option>
                    <option value="No">No</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-200 mb-1">15. Most Effective Measure to Reduce Plastic</label>
                  <select
                    value={formData.effective_measure}
                    onChange={e => setFormData({ ...formData, effective_measure: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Canteen bag surcharge & BYOB rewards">Canteen surcharge & BYOB rewards</option>
                    <option value="Free cloth bag distribution to freshers">Free cloth bag distribution</option>
                    <option value="Strict zero-plastic vendor rules">Strict zero-plastic vendor rules</option>
                    <option value="Digital awareness campaigns">Digital awareness campaigns</option>
                    <option value="Eco points green leaderboard">Eco points green leaderboard</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold py-3 rounded-2xl text-sm transition shadow-xl shadow-emerald-500/20"
              >
                {loading ? 'Submitting Responses...' : 'Submit VSIT Campus Survey'}
              </button>
            </form>
          )}
        </div>
      ) : (
        /* Survey Results Tab */
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="glass-card rounded-2xl p-5 border border-slate-800 text-center space-y-1">
              <span className="text-xs text-slate-400">Total Survey Respondents</span>
              <p className="text-3xl font-black text-white">{stats?.totalSurveys || 0}</p>
            </div>
            <div className="glass-card rounded-2xl p-5 border border-slate-800 text-center space-y-1">
              <span className="text-xs text-slate-400">Environmental Awareness</span>
              <p className="text-3xl font-black text-emerald-400">{stats?.awarePct || 0}%</p>
            </div>
            <div className="glass-card rounded-2xl p-5 border border-slate-800 text-center space-y-1">
              <span className="text-xs text-slate-400">Support Restrictions</span>
              <p className="text-3xl font-black text-teal-300">{stats?.supportPct || 0}%</p>
            </div>
            <div className="glass-card rounded-2xl p-5 border border-slate-800 text-center space-y-1">
              <span className="text-xs text-slate-400">Willing to Switch to Cloth</span>
              <p className="text-3xl font-black text-amber-400">{stats?.switchPct || 0}%</p>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-emerald-400" /> Voted Most Effective Reduction Measures
            </h3>
            <div className="space-y-3">
              {(stats?.measures || []).map((m, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-200">
                    <span>{m.measure}</span>
                    <span className="text-emerald-400">{m.count} votes</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (m.count / (stats?.totalSurveys || 1)) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
