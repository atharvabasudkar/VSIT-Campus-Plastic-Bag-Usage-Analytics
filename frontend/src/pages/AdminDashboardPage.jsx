import React, { useState, useEffect, useContext } from 'react';
import { Shield, Lock, LogIn, RefreshCw, Upload, Download, Trash2, Edit3, CheckCircle2, AlertTriangle, Layers, MapPin, Flag, Target } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { fetchLocations, updateLocation, fetchTargets, updateTargets, resetDataset } from '../services/api';
import ImportCsvModal from '../components/ImportCsvModal';
import AddCampaignModal from '../components/AddCampaignModal';
import SyntheticDataBanner from '../components/SyntheticDataBanner';

export default function AdminDashboardPage({ setCurrentPage }) {
  const { user, token, isAdmin, login, logout, loading: authLoading } = useContext(AuthContext);

  const [email, setEmail] = useState('admin@vsit.edu.in');
  const [password, setPassword] = useState('admin123');
  const [loginError, setLoginError] = useState('');

  const [locations, setLocations] = useState([]);
  const [targets, setTargets] = useState(null);

  const [showImportModal, setShowImportModal] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

  const loadAdminData = async () => {
    try {
      const locRes = await fetchLocations();
      if (locRes.success) setLocations(locRes.locations);

      const tarRes = await fetchTargets();
      if (tarRes.success) setTargets(tarRes.target);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    const res = await login(email, password);
    if (!res.success) {
      setLoginError(res.message);
    }
  };

  const handleResetDataset = async () => {
    if (!window.confirm('CRITICAL WARNING: This will clear existing observation records and regenerate 1,000+ fresh synthetic dataset records. Proceed?')) return;
    try {
      const res = await resetDataset(token);
      if (res.success) {
        setActionMsg(res.message);
        loadAdminData();
        setTimeout(() => setActionMsg(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRiskChange = async (id, newRisk) => {
    try {
      await updateLocation(id, { risk_level: newRisk }, token);
      loadAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAdmin) {
    return (
      <div className="space-y-6 pb-12 max-w-md mx-auto pt-8">
        <SyntheticDataBanner />

        <div className="glass-card rounded-3xl p-8 border border-emerald-500/30 bg-slate-900 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/40">
              <Shield className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-extrabold text-white">VSIT Admin Portal Authentication</h2>
            <p className="text-xs text-slate-400">Login to manage campus datasets, campaigns, and targets.</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            {loginError && (
              <div className="bg-rose-950/50 border border-rose-500/30 text-rose-300 p-3 rounded-xl">
                {loginError}
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Admin Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl text-sm transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" /> {authLoading ? 'Authenticating...' : 'Sign In as Admin'}
            </button>
          </form>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <span className="font-bold text-emerald-400 block">Default Demo Credentials:</span>
            <p>• Email: <code>admin@vsit.edu.in</code></p>
            <p>• Password: <code>admin123</code></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <SyntheticDataBanner />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <Shield className="w-7 h-7 text-emerald-400" /> Administrator Management Suite
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Authenticated as <strong>{user?.name}</strong> ({user?.email})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowImportModal(true)}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition"
          >
            <Upload className="w-4 h-4" /> Import Fieldwork CSV
          </button>
          <button
            onClick={logout}
            className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-semibold px-4 py-2 rounded-xl text-xs transition"
          >
            Logout
          </button>
        </div>
      </div>

      {actionMsg && (
        <div className="bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 p-3 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {actionMsg}
        </div>
      )}

      {/* Dataset & Target Management Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Dataset Controls Card */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" /> Dataset Operations
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Manage the SQLite database records or reset synthetic demonstration data for fresh CEP viva testing.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={handleResetDataset}
              className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition"
            >
              <RefreshCw className="w-4 h-4" /> Regenerate Synthetic Dataset
            </button>
            <a
              href="/api/export/csv"
              download
              className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition"
            >
              <Download className="w-4 h-4 text-emerald-400" /> Export Full Dataset
            </a>
          </div>
        </div>

        {/* Reduction Targets Card */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" /> Reduction Target Configuration
          </h3>
          {targets && (
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Baseline Usage:</span>
                <strong className="text-white">{targets.baseline_usage.toLocaleString()} bags</strong>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Current Usage:</span>
                <strong className="text-amber-400">{targets.current_usage.toLocaleString()} bags</strong>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Target Usage:</span>
                <strong className="text-emerald-400">{targets.target_usage.toLocaleString()} bags</strong>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl text-emerald-300 font-bold border border-slate-800 text-[11px] mt-2">
                Achieved Reduction: {targets.reduction_pct}%
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Location Risk Level Governance */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <MapPin className="w-5 h-5 text-emerald-400" /> Campus Hotspot Risk Governance
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3">Location Name</th>
                <th className="p-3">Current Risk Level</th>
                <th className="p-3">Change Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {locations.map((loc) => (
                <tr key={loc.id}>
                  <td className="p-3 font-bold text-white">{loc.name}</td>
                  <td className="p-3">
                    <span className="font-bold text-amber-400">{loc.risk_level}</span>
                  </td>
                  <td className="p-3">
                    <select
                      value={loc.risk_level}
                      onChange={e => handleRiskChange(loc.id, e.target.value)}
                      className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="LOW">LOW</option>
                      <option value="MODERATE">MODERATE</option>
                      <option value="HIGH">HIGH</option>
                      <option value="CRITICAL">CRITICAL</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ImportCsvModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onRefresh={loadAdminData}
      />
    </div>
  );
}
