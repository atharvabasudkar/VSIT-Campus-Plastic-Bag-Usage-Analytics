import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';

export default function SyntheticDataBanner() {
  return (
    <div className="bg-amber-950/40 border-b border-amber-500/30 text-amber-200 px-4 py-2 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Synthetic Dataset Notice:</strong> Synthetic dataset generated for academic demonstration and system testing. It does not represent officially measured VSIT plastic consumption.
          </span>
        </div>
        <div className="hidden md:flex items-center gap-1 text-amber-300 text-xs font-semibold shrink-0 bg-amber-900/50 px-2.5 py-0.5 rounded border border-amber-500/30">
          <Info className="w-3.5 h-3.5" /> VSIT CEP Demo
        </div>
      </div>
    </div>
  );
}
