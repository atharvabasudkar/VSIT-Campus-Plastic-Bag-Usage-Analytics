import React from 'react';
import { Sparkles, QrCode, Cpu, Eye, Smartphone, Trophy, Award, Database, TrendingUp } from 'lucide-react';
import SyntheticDataBanner from '../components/SyntheticDataBanner';

export default function FutureScopePage() {
  const scopeItems = [
    { title: 'QR-Based Reusable Bag Tracking', icon: QrCode, desc: 'Unique QR tags stitched on VSIT cloth tote bags scanned at canteen counters for instant eco-rewards.' },
    { title: 'IoT Smart Bin Weight Sensors', icon: Cpu, desc: 'Real-time fill level & weight telemetry installed in campus waste bins sending alerts when capacity is reached.' },
    { title: 'AI Computer Vision Waste Classifier', icon: Eye, desc: 'Camera-based deep learning models at canteen disposal stations classifying polythene vs paper waste automatically.' },
    { title: 'VSIT Green Points & Leaderboard', icon: Trophy, desc: 'Inter-departmental competition where students earn green points for logged reusable bag usage.' },
    { title: 'Predictive Plastic Consumption AI', icon: TrendingUp, desc: 'Machine learning forecast model predicting spike in plastic waste before major campus festivals and events.' },
    { title: 'Campus Procurement ERP Integration', icon: Database, desc: 'Direct API integration with college vendor supply databases to restrict plastic packaging orders upstream.' }
  ];

  return (
    <div className="space-y-6 pb-12">
      <SyntheticDataBanner />

      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
          <Sparkles className="w-7 h-7 text-emerald-400" /> Future Scope & Smart Innovations
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Planned technological roadmap for scaling VSIT's plastic-free campus analytics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scopeItems.map((item, idx) => {
          const IconComp = item.icon;
          return (
            <div key={idx} className="glass-card rounded-3xl p-6 border border-slate-800 space-y-3 hover:border-emerald-500/30 transition bg-slate-900/80">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <IconComp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">{item.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
            </div>
          );
        })}
      </div>

    </div>
  );
}
