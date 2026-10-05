import React from 'react';
import { Info, GraduationCap, Users, Heart, Building, Award, ShieldCheck } from 'lucide-react';
import SyntheticDataBanner from '../components/SyntheticDataBanner';

export default function AboutProjectPage() {
  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      <SyntheticDataBanner />

      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
          <Info className="w-7 h-7 text-emerald-400" /> About the CEP Project
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Vidyalankar School of Information Technology (VSIT) Academic Details.
        </p>
      </div>

      <div className="glass-card rounded-3xl p-8 border border-emerald-500/20 bg-slate-900/90 space-y-6">
        
        <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-400 text-slate-950 font-black flex items-center justify-center text-2xl shadow-lg">
            VSIT
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Vidyalankar School of Information Technology</h2>
            <p className="text-xs text-emerald-400 font-semibold">Department of Information Technology & Science</p>
            <p className="text-xs text-slate-400">Wadala (East), Mumbai, Maharashtra</p>
          </div>
        </div>

        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Project Overview</h3>
          <p>
            The Community Engagement Project (CEP) titled <strong>"Campus Plastic Bag Usage and Reduction Analysis"</strong> was conceived to address single-use polythene consumption within the Vidyalankar campus ecosystem.
          </p>
          <p>
            By combining empirical fieldwork observation, student-faculty survey questionnaires, SQLite data persistence, and interactive visualization dashboards, the system bridges software engineering with environmental sustainability.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-emerald-400" /> Academic Information
            </h4>
            <div className="text-xs text-slate-300 space-y-1">
              <p><strong>Course:</strong> BSc / MSc Information Technology</p>
              <p><strong>Academic Year:</strong> 2024–2025</p>
              <p><strong>Project Category:</strong> Community Engagement Project (CEP)</p>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" /> CEP Research Team & Faculty Guide
            </h4>
            <div className="text-xs text-slate-300 space-y-1">
              <p><strong>Faculty Guide:</strong> Department of IT Faculty Supervisor</p>
              <p><strong>Student Lead:</strong> CEP Student Project Team</p>
              <p><strong>Institution:</strong> VSIT Mumbai</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
