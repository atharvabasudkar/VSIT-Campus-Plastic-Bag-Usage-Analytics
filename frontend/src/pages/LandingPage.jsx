import React from 'react';
import { Leaf, ArrowRight, BarChart3, ClipboardList, ShieldCheck, Target, Globe, BookOpen, Award, CheckCircle2, TrendingDown, Users, Sparkles, MapPin } from 'lucide-react';
import SyntheticDataBanner from '../components/SyntheticDataBanner';

export default function LandingPage({ setCurrentPage, onOpenPledge }) {
  return (
    <div className="space-y-16 pb-12">
      <SyntheticDataBanner />

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-8 pb-16 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto text-center space-y-6 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-emerald-500/30 text-emerald-300 text-xs font-semibold shadow-lg">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Community Engagement Project (CEP) • VSIT Academic Year 2024–2025</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-none">
            Campus Plastic Bag Usage & <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-green-400 bg-clip-text text-transparent">Reduction Analysis</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
            An interactive data-driven sustainability analytics system developed at <strong className="text-white">Vidyalankar School of Information Technology (VSIT)</strong> to quantify single-use plastic waste, analyze campus usage hotspots, track reduction campaigns, and build a plastic-free academic campus.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setCurrentPage('dashboard')}
              className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold px-6 py-3.5 rounded-2xl text-sm flex items-center gap-2 shadow-xl shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95"
            >
              <BarChart3 className="w-5 h-5" /> View Analytics Dashboard
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCurrentPage('survey')}
              className="glass-panel hover:bg-slate-800 text-white font-bold px-6 py-3.5 rounded-2xl text-sm border border-slate-700 flex items-center gap-2 transition hover:border-emerald-500/50"
            >
              <ClipboardList className="w-5 h-5 text-emerald-400" /> Take Campus Survey
            </button>

            <button
              onClick={onOpenPledge}
              className="bg-slate-900 hover:bg-slate-800 text-emerald-300 font-bold px-5 py-3.5 rounded-2xl text-sm border border-emerald-500/30 flex items-center gap-2 transition"
            >
              <Award className="w-5 h-5 text-amber-400" /> Make Eco Pledge
            </button>
          </div>

        </div>
      </section>

      {/* Key Campus Quick Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          
          <div className="glass-card rounded-2xl p-5 border border-emerald-500/20 text-center space-y-1">
            <p className="text-xs text-slate-400 font-medium">Bags Recorded</p>
            <p className="text-3xl sm:text-4xl font-black text-white">1,050+</p>
            <p className="text-[11px] text-emerald-400 font-semibold">Fieldwork Observations</p>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-emerald-500/20 text-center space-y-1">
            <p className="text-xs text-slate-400 font-medium">Reusable Bag Adoption</p>
            <p className="text-3xl sm:text-4xl font-black text-emerald-400">31.5%</p>
            <p className="text-[11px] text-slate-400">Current Measured Rate</p>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-emerald-500/20 text-center space-y-1">
            <p className="text-xs text-slate-400 font-medium">Campus Plastic Waste</p>
            <p className="text-3xl sm:text-4xl font-black text-amber-400">85.4 kg</p>
            <p className="text-[11px] text-slate-400">Estimated Weight Avoidable</p>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-emerald-500/20 text-center space-y-1">
            <p className="text-xs text-slate-400 font-medium">Reduction Achieved</p>
            <p className="text-3xl sm:text-4xl font-black text-teal-300">35.0%</p>
            <p className="text-[11px] text-emerald-400 font-semibold">Against Baseline Target</p>
          </div>

        </div>
      </section>

      {/* Project Objectives */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 border border-slate-800 space-y-8">
          
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Project Objectives</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Converting raw campus observation data into actionable environmental insights for VSIT leadership and students.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3 hover:border-emerald-500/30 transition">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Quantify Campus Usage</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Determine exactly how many plastic carry bags are used daily across VSIT canteens, stationery counters, fests, and admin offices.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3 hover:border-emerald-500/30 transition">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Identify Usage Hotspots</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Map location risk profiles (Low, Moderate, High, Critical) to pinpoint high-consumption areas and target intervention strategies.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3 hover:border-emerald-500/30 transition">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <TrendingDown className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Track Reduction Progress</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Measure baseline plastic consumption against active campaigns, target reduction goals, and environmental impact estimates.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Why Plastic Reduction Matters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
              <Globe className="w-3.5 h-3.5" /> Environmental Impact
            </div>
            <h2 className="text-3xl font-extrabold text-white leading-tight">
              Why Plastic Reduction Matters at Vidyalankar
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Single-use plastic bags take over 100 to 500 years to decompose in urban landfills. A college campus with thousands of students generates tons of non-biodegradable waste every academic term.
            </p>
            
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Prevents non-biodegradable polythene accumulation in campus drainage.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Encourages lifelong sustainable behaviors among IT and management students.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Supports VSIT's vision of becoming a benchmark Green Educational Institution.</span>
              </li>
            </ul>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-emerald-500/20 space-y-4 bg-gradient-to-br from-slate-900 to-emerald-950/30">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" /> CEP Fieldwork Framework
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Our Community Engagement Project combines systematic data collection, field observations, student surveys, statistical modeling, and administrative policy recommendations.
            </p>
            
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setCurrentPage('methodology')}
                className="bg-slate-950 hover:bg-slate-800 text-emerald-300 text-xs font-semibold py-2.5 px-3 rounded-xl border border-emerald-500/30 text-center transition"
              >
                Explore CEP Methodology
              </button>
              <button
                onClick={() => setCurrentPage('impact')}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold py-2.5 px-3 rounded-xl text-center transition"
              >
                Environmental Calculator
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Call to Action (CTA) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-emerald-500/30 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 text-center space-y-6">
          <h2 className="text-3xl font-black text-white">Join the VSIT Green Campus Movement</h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto">
            Participate in our plastic reduction survey, report your reusable bag usage, or log field observations for the CEP project team.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onOpenPledge}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-xl text-sm shadow-xl shadow-emerald-500/20 transition"
            >
              Sign Eco Pledge Now
            </button>
            <button
              onClick={() => setCurrentPage('survey')}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-3 rounded-xl text-sm border border-slate-700 transition"
            >
              Complete Student Survey
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
