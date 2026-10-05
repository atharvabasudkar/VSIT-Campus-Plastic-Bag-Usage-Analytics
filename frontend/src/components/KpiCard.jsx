import React from 'react';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';

export default function KpiCard({ title, value, unit = '', subtitle, icon: Icon, trend, trendLabel, color = 'emerald', tooltip }) {
  const colorMap = {
    emerald: 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30 icon-bg-emerald-500/20 text-emerald-300',
    green: 'from-green-500/20 to-emerald-500/10 text-green-400 border-green-500/30 icon-bg-green-500/20 text-green-300',
    blue: 'from-blue-500/20 to-cyan-500/10 text-blue-400 border-blue-500/30 icon-bg-blue-500/20 text-blue-300',
    amber: 'from-amber-500/20 to-yellow-500/10 text-amber-400 border-amber-500/30 icon-bg-amber-500/20 text-amber-300',
    purple: 'from-purple-500/20 to-indigo-500/10 text-purple-400 border-purple-500/30 icon-bg-purple-500/20 text-purple-300',
    rose: 'from-rose-500/20 to-pink-500/10 text-rose-400 border-rose-500/30 icon-bg-rose-500/20 text-rose-300'
  };

  const currentStyle = colorMap[color] || colorMap.emerald;

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-5 relative overflow-hidden transition-all duration-300 hover:-translate-y-1">
      {/* Background Gradient Glow */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${currentStyle} rounded-full blur-2xl opacity-40 pointer-events-none`} />

      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {Icon && (
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${currentStyle} bg-slate-900/80`}>
              <Icon className="w-5 h-5" />
            </div>
          )}
          <div>
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">{title}</h3>
            {subtitle && <p className="text-[11px] text-slate-400">{subtitle}</p>}
          </div>
        </div>

        {tooltip && (
          <div className="group relative cursor-pointer">
            <Info className="w-4 h-4 text-slate-500 hover:text-slate-300 transition" />
            <div className="absolute right-0 top-6 w-48 p-2 bg-slate-900 text-slate-300 text-[11px] rounded-lg border border-slate-700 shadow-xl opacity-0 group-hover:opacity-100 transition duration-200 z-30 pointer-events-none">
              {tooltip}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-1.5 mt-2">
        <span className="text-2xl sm:text-3xl font-black tracking-tight text-white">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        {unit && <span className="text-xs font-bold text-slate-400">{unit}</span>}
      </div>

      {trend !== undefined && (
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          {trend > 0 ? (
            <span className="inline-flex items-center gap-0.5 text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <TrendingUp className="w-3.5 h-3.5" /> +{trend}%
            </span>
          ) : trend < 0 ? (
            <span className="inline-flex items-center gap-0.5 text-rose-400 font-semibold bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
              <TrendingDown className="w-3.5 h-3.5" /> {trend}%
            </span>
          ) : (
            <span className="inline-flex items-center gap-0.5 text-slate-400 font-semibold bg-slate-800 px-2 py-0.5 rounded-full">
              <Minus className="w-3 h-3" /> 0%
            </span>
          )}
          {trendLabel && <span className="text-slate-400 text-[11px]">{trendLabel}</span>}
        </div>
      )}
    </div>
  );
}
