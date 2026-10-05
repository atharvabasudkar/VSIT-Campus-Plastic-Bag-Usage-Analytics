import React from 'react';
import { BookOpen, Download, CheckCircle2, ArrowRight, Sparkles, FileSpreadsheet } from 'lucide-react';
import SyntheticDataBanner from '../components/SyntheticDataBanner';

export default function MethodologyPage() {
  const steps = [
    { step: 1, title: 'Problem Identification', desc: 'Framing campus single-use polythene waste as an urban ecological hazard at VSIT.' },
    { step: 2, title: 'Literature & Regulatory Study', desc: 'Reviewing Maharashtra Plastic Waste Management Rules (2018) & global campus zero-waste literature.' },
    { step: 3, title: 'Campus Survey Questionnaire Design', desc: 'Formulating a 15-question structured survey for students, teaching faculty, and staff.' },
    { step: 4, title: 'Fieldwork Observation & Data Collection', desc: 'Deploying student researchers across canteen, stationery shop, activity zones, and perimeter vendors.' },
    { step: 5, title: 'Data Cleaning & Preprocessing', desc: 'Parsing observation logs, standardizing bag thickness weights, and removing duplicates.' },
    { step: 6, title: 'Exploratory Data Analysis (EDA)', desc: 'Calculating totals, daily averages, department distributions, and reusable adoption percentages.' },
    { step: 7, title: 'Identification of Plastic Hotspots', desc: 'Mapping campus zones into Low, Moderate, High, and Critical risk categories.' },
    { step: 8, title: 'Reduction Strategy Development', desc: 'Formulating tailored intervention policies (canteen discounts, reusable tote drives).' },
    { step: 9, title: 'Awareness Campaign Implementation', desc: 'Executing "Bring Your Own Bag" (BYOB) and "Plastic-Free Friday" awareness drives.' },
    { step: 10, title: 'Post-Campaign Re-Measurement', desc: 'Conducting follow-up fieldwork observation audits to evaluate behavioral shifts.' },
    { step: 11, title: 'Comparison with Baseline Data', desc: 'Applying the baseline reduction formula: Reduction % = ((Baseline - Current) / Baseline) × 100.' },
    { step: 12, title: 'Final Policy Recommendations', desc: 'Submitting final recommendations & sustainability dashboard to VSIT administration.' }
  ];

  return (
    <div className="space-y-6 pb-12">
      <SyntheticDataBanner />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-emerald-400" /> Academic CEP Research Methodology
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Standardized 12-Step Community Engagement Project Framework.
          </p>
        </div>

        <a
          href="/api/export/template"
          download
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition shadow-lg shadow-emerald-500/20"
        >
          <FileSpreadsheet className="w-4 h-4" /> Download Fieldwork CSV Template
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((s) => (
          <div key={s.step} className="glass-card rounded-3xl p-6 border border-slate-800 space-y-3 hover:border-emerald-500/30 transition bg-slate-900/80">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-extrabold text-sm flex items-center justify-center border border-emerald-500/30">
                {s.step}
              </div>
              <h3 className="text-base font-bold text-white leading-tight">{s.title}</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pl-11">{s.desc}</p>
          </div>
        ))}
      </div>

    </div>
  );
}
