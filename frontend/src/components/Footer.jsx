import React from 'react';
import { Leaf, GraduationCap, Heart, ExternalLink, ShieldCheck } from 'lucide-react';

export default function Footer({ setCurrentPage }) {
  return (
    <footer className="bg-slate-950 border-t border-emerald-500/20 text-slate-400 pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        
        {/* Col 1: Brand & Institution */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-slate-950 fill-current" />
            </div>
            <span className="text-white font-extrabold text-base">VSIT CEP Sustainability</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Vidyalankar School of Information Technology (VSIT)<br />
            Department of Information Technology & Science<br />
            Campus Plastic Bag Usage and Reduction Analysis CEP.
          </p>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
            <GraduationCap className="w-4 h-4" /> Academic Year 2024–2025
          </div>
        </div>

        {/* Col 2: Navigation Links */}
        <div>
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3 border-b border-slate-800 pb-1">
            System Modules
          </h4>
          <ul className="space-y-1.5 text-xs">
            <li><button onClick={() => setCurrentPage('dashboard')} className="hover:text-emerald-400 transition">Analytics Dashboard</button></li>
            <li><button onClick={() => setCurrentPage('hotspots')} className="hover:text-emerald-400 transition">Campus Hotspots Map</button></li>
            <li><button onClick={() => setCurrentPage('survey')} className="hover:text-emerald-400 transition">Student/Staff Survey</button></li>
            <li><button onClick={() => setCurrentPage('report-usage')} className="hover:text-emerald-400 transition">Field Observation Entry</button></li>
            <li><button onClick={() => setCurrentPage('campaigns')} className="hover:text-emerald-400 transition">Campaign Tracker</button></li>
            <li><button onClick={() => setCurrentPage('impact')} className="hover:text-emerald-400 transition">Impact Calculator</button></li>
          </ul>
        </div>

        {/* Col 3: Academic Methodology */}
        <div>
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3 border-b border-slate-800 pb-1">
            Academic CEP Context
          </h4>
          <ul className="space-y-1.5 text-xs">
            <li><button onClick={() => setCurrentPage('methodology')} className="hover:text-emerald-400 transition">12-Step CEP Methodology</button></li>
            <li><button onClick={() => setCurrentPage('recommendations')} className="hover:text-emerald-400 transition">Dynamic Action Plans</button></li>
            <li><button onClick={() => setCurrentPage('reports')} className="hover:text-emerald-400 transition">Executive Report Generator</button></li>
            <li><button onClick={() => setCurrentPage('future-scope')} className="hover:text-emerald-400 transition">Future Scope & AI Vision</button></li>
            <li><button onClick={() => setCurrentPage('about')} className="hover:text-emerald-400 transition">Project & Faculty Info</button></li>
          </ul>
        </div>

        {/* Col 4: Disclaimer & Admin access */}
        <div>
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3 border-b border-slate-800 pb-1">
            Governance & Demo
          </h4>
          <p className="text-xs text-slate-400 mb-3 leading-relaxed">
            Data includes pre-seeded synthetic baseline measurements for college viva presentation & testing.
          </p>
          <button
            onClick={() => setCurrentPage('admin')}
            className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-emerald-400 font-semibold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition"
          >
            <ShieldCheck className="w-4 h-4" /> Admin Portal Access
          </button>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
        <p>© 2025 VSIT CEP Team. Developed for Vidyalankar School of Information Technology.</p>
        <p className="flex items-center gap-1">
          Built with <Heart className="w-3.5 h-3.5 text-red-500 fill-current" /> for Campus Environmental Sustainability
        </p>
      </div>
    </footer>
  );
}
