import React, { useState, useEffect } from 'react';
import { Lightbulb, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Utensils, BookOpen, Calendar, Award } from 'lucide-react';
import { fetchDashboardAnalytics } from '../services/api';
import SyntheticDataBanner from '../components/SyntheticDataBanner';

export default function RecommendationsPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDashboardAnalytics().then(res => {
      if (res.success) setData(res);
    });
  }, []);

  const topLoc = data?.kpis?.topLocation || 'Canteen';
  const avoidablePct = data?.kpis?.avoidablePercentage || 45;

  const recommendations = [
    {
      category: 'Food & Canteen (High Priority)',
      icon: Utensils,
      title: `Prioritize Reusable Packaging & Bag Surcharges at ${topLoc}`,
      description: `Data confirms ${topLoc} is the primary single-use plastic bag hotspot. Implement a ₹2 eco-surcharge for polythene takeaway bags and provide 5% food discounts for students bringing reusable food containers.`,
      impact: 'High Impact (Est. 28% bag reduction)',
      effort: 'Medium Effort'
    },
    {
      category: 'Student Behavioral Incentives',
      icon: Award,
      title: 'Introduce Green Points & BYOB Reward Program',
      description: 'Create a digital green points system in the VSIT mobile app. Students logging reusable cloth bag usage at campus gates receive sustainability credits redeemable for library book extensions or canteen discounts.',
      impact: 'High Impact',
      effort: 'Low Effort'
    },
    {
      category: 'Vendor Outreach',
      icon: ShieldCheck,
      title: 'Enforce Sustainable Packaging Mandates for Perimeter Vendors',
      description: 'Partner with local food stalls and tea vendors surrounding VSIT perimeter gates to replace thin polythene bags with bio-degradable paper sacks and banana leaf wrappers.',
      impact: 'Medium Impact',
      effort: 'Medium Effort'
    },
    {
      category: 'Campus Events & Fests',
      icon: Calendar,
      title: 'Mandate "Zero Single-Use Plastic" Policy for Campus Fests',
      description: 'Require all student festival committees (V-Hack, TechX, Cultural Fest) to enforce paper/cloth packaging rules for food stalls and event merchandise distribution.',
      impact: 'High Impact',
      effort: 'Low Effort'
    },
    {
      category: 'Infrastructure & Waste Audits',
      icon: BookOpen,
      title: 'Install Dedicated Plastic Recycling Bins & Conduct Monthly Audits',
      description: 'Deploy color-coded waste segregation bins at entrance gates, canteen exits, and activity areas. Empower CEP student teams to conduct monthly plastic audits.',
      impact: 'Medium Impact',
      effort: 'Low Effort'
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      <SyntheticDataBanner />

      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
          <Lightbulb className="w-7 h-7 text-amber-400" /> Dynamic Sustainability Recommendations Engine
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Data-driven policy measures tailored to VSIT campus plastic consumption patterns.
        </p>
      </div>

      {/* Analytics Context Banner */}
      <div className="glass-card rounded-2xl p-4 border border-emerald-500/30 bg-emerald-950/20 flex items-center gap-3">
        <AlertTriangle className="w-6 h-6 text-emerald-400 shrink-0" />
        <p className="text-xs text-slate-300">
          <strong>Data Context Adaptive Engine:</strong> Recommendations automatically prioritize <strong>{topLoc}</strong> due to highest recorded bag volume, and target <strong>{avoidablePct}%</strong> avoidable polythene waste.
        </p>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec, idx) => {
          const IconComp = rec.icon;
          return (
            <div key={idx} className="glass-card rounded-3xl p-6 border border-slate-800 space-y-3 hover:border-emerald-500/30 transition bg-slate-900/90">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">{rec.category}</span>
                    <h3 className="text-base font-bold text-white">{rec.title}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px]">
                  <span className="bg-emerald-950/80 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-500/30 font-semibold">{rec.impact}</span>
                  <span className="bg-slate-950 text-slate-400 px-2.5 py-1 rounded-lg border border-slate-800 font-medium">{rec.effort}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed pl-13">{rec.description}</p>
            </div>
          );
        })}
      </div>

    </div>
  );
}
