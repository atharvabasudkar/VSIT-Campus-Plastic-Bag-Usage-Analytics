import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, Legend, CartesianGrid
} from 'recharts';
import {
  ShoppingBag, Scale, Percent, Target, Users, MapPin, Award,
  Sparkles, AlertCircle, Info, RefreshCw, Layers
} from 'lucide-react';
import KpiCard from '../components/KpiCard';
import DataFilter from '../components/DataFilter';
import SyntheticDataBanner from '../components/SyntheticDataBanner';
import { fetchDashboardAnalytics } from '../services/api';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#64748b'];

export default function DashboardPage() {
  const [filters, setFilters] = useState({
    location: 'All',
    department: 'All',
    userCategory: 'All',
    bagType: 'All',
    reusable: 'All',
    campaignExposure: 'All'
  });

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFormulaModal, setShowFormulaModal] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchDashboardAnalytics(filters);
      if (res.success) {
        setData(res);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters]);

  const resetFilters = () => {
    setFilters({
      location: 'All',
      department: 'All',
      userCategory: 'All',
      bagType: 'All',
      reusable: 'All',
      campaignExposure: 'All'
    });
  };

  const kpis = data?.kpis || {};
  const charts = data?.charts || {};
  const insights = data?.insights || [];
  const score = kpis.sustainabilityScore || { score: 68, rating: 'Good', color: 'green' };

  return (
    <div className="space-y-6 pb-12">
      <SyntheticDataBanner />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            Sustainability Analytics Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time measurements & synthetic dataset analytics for VSIT campus plastic reduction.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Sustainability Score Badge */}
          <div
            onClick={() => setShowFormulaModal(true)}
            className="glass-card rounded-2xl px-4 py-2 border border-emerald-500/30 flex items-center gap-3 cursor-pointer hover:border-emerald-400 transition"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black flex items-center justify-center text-lg">
              {score.score}
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">VSIT Sustainability Score</p>
              <p className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                {score.rating} <Info className="w-3 h-3 text-slate-400" />
              </p>
            </div>
          </div>

          <button
            onClick={loadData}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-xl transition"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Data Filter Panel */}
      <DataFilter filters={filters} setFilters={setFilters} onReset={resetFilters} />

      {/* 10 KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        
        <KpiCard
          title="Total Bags Recorded"
          value={kpis.totalBags || 0}
          unit="bags"
          subtitle="Observed dataset"
          icon={ShoppingBag}
          color="emerald"
          trend={-12.4}
          trendLabel="vs last quarter"
        />

        <KpiCard
          title="Avg Bags Per Day"
          value={kpis.avgBagsPerDay || 0}
          unit="bags/day"
          subtitle="Campus wide"
          icon={Layers}
          color="blue"
        />

        <KpiCard
          title="Plastic Waste Weight"
          value={kpis.totalWeightKg || 0}
          unit="kg"
          subtitle="Estimated weight"
          icon={Scale}
          color="amber"
          tooltip="Calculated from bag type thickness assumptions (Thin 4.5g, Medium 8g, Large 14.5g)."
        />

        <KpiCard
          title="Reusable Adoption"
          value={kpis.reusableAdoptionRate || 0}
          unit="%"
          subtitle="Cloth/Canvas bags"
          icon={Percent}
          color="emerald"
          trend={+4.2}
          trendLabel="increasing"
        />

        <KpiCard
          title="Avoidable Usage"
          value={kpis.avoidablePercentage || 0}
          unit="%"
          subtitle="Non-essential polythene"
          icon={AlertCircle}
          color="rose"
        />

        <KpiCard
          title="Current Reduction"
          value={kpis.currentReductionPct || 0}
          unit="%"
          subtitle="Against baseline"
          icon={Target}
          color="green"
        />

        <KpiCard
          title="Reduction Target"
          value={kpis.targetReductionPct || 50}
          unit="%"
          subtitle="Goal for 2025"
          icon={Target}
          color="purple"
        />

        <KpiCard
          title="Survey Responses"
          value={kpis.surveyCount || 0}
          unit="responses"
          subtitle="Student & Staff"
          icon={Users}
          color="blue"
        />

        <KpiCard
          title="Top Usage Hotspot"
          value={kpis.topLocation || 'Canteen'}
          subtitle={`${kpis.topLocationBags || 0} bags recorded`}
          icon={MapPin}
          color="rose"
        />

        <KpiCard
          title="Top Bag Type"
          value={kpis.topBagType || 'Thin Carry Bag'}
          subtitle={`${kpis.topBagBags || 0} count`}
          icon={ShoppingBag}
          color="amber"
        />

      </div>

      {/* Dynamic Analytical Insights Panel */}
      {insights.length > 0 && (
        <div className="glass-card rounded-2xl p-4 border border-emerald-500/30 bg-emerald-950/20 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" /> Automated CEP Analytical Insights
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
            {insights.map((item, idx) => (
              <div key={idx} className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-white text-xs block">{item.title}</span>
                <p className="text-slate-300 leading-relaxed text-[11px]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Data Visualization Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Monthly Plastic Usage Trend */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" /> Monthly Plastic Bag Usage Trend
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.monthlyTrend || []}>
                <defs>
                  <linearGradient id="bagsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="total_bags" stroke="#10b981" fillOpacity={1} fill="url(#bagsGrad)" name="Plastic Bags Used" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Usage by Campus Location */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" /> Usage Breakdown by Campus Location
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.usageByLocation || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="location" stroke="#94a3b8" fontSize={10} angle={-25} textAnchor="end" height={50} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Bar dataKey="bags_used" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Bags Recorded" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Plastic Bag Type Distribution */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-emerald-400" /> Plastic Bag Type Distribution
          </h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.bagTypeDistribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {(charts.bagTypeDistribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: User Category Analysis */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" /> User Category Consumption Analysis
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.userCategoryAnalysis || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                <YAxis dataKey="category" type="category" stroke="#94a3b8" fontSize={11} width={110} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Bar dataKey="bags_used" fill="#f59e0b" radius={[0, 6, 6, 0]} name="Bags Used" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 5: Department Analysis */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" /> Academic Department Analysis
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.departmentAnalysis || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="department" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Bar dataKey="bags_used" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="Bags Used" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 6: Reduction Progress (Baseline vs Current vs Target) */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-400" /> Campus Reduction Milestone Progress
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.reductionProgress || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="stage" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Bar dataKey="bags" fill="#10b981" radius={[6, 6, 0, 0]} name="Bags Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Formula Modal */}
      {showFormulaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-card rounded-3xl border border-emerald-500/30 max-w-md w-full p-6 relative bg-slate-900">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" /> VSIT Plastic Reduction Score Formula
            </h3>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              The project-defined sustainability score (0–100) measures campus plastic management performance:
            </p>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-300 space-y-1">
              <p>Score = 25% * (Reusable Adoption %)</p>
              <p>+ 20% * (Reduction Achieved vs Target %)</p>
              <p>+ 20% * (Campus Awareness Rate %)</p>
              <p>+ 20% * (100 - Avoidable Plastic %)</p>
              <p>+ 15% * (Campaign Exposure %)</p>
            </div>
            <p className="text-[11px] text-slate-400 mt-3">
              Ratings: 80–100 (Excellent), 60–79 (Good), 40–59 (Developing), 0–39 (Needs Improvement).
            </p>
            <button
              onClick={() => setShowFormulaModal(false)}
              className="mt-5 w-full bg-emerald-500 text-slate-950 font-bold py-2 rounded-xl text-xs"
            >
              Close Explanation
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
