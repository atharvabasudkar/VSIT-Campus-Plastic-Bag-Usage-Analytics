import React, { useState, useEffect } from 'react';
import { FileText, Download, Printer, Shield, Calendar, MapPin, CheckCircle2, Sparkles, Filter } from 'lucide-react';
import { generateReportData } from '../services/api';
import DataFilter from '../components/DataFilter';
import SyntheticDataBanner from '../components/SyntheticDataBanner';

export default function ReportsPage() {
  const [filters, setFilters] = useState({
    location: 'All',
    department: 'All',
    userCategory: 'All',
    bagType: 'All'
  });

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadReport = async () => {
    setLoading(true);
    try {
      const res = await generateReportData(filters);
      if (res.success) {
        setReport(res.report);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, [filters]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="no-print space-y-6">
        <SyntheticDataBanner />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
              <FileText className="w-7 h-7 text-emerald-400" /> Executive Report Generator
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Generate formatted college CEP report for viva presentation and administrative review.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition shadow-lg shadow-emerald-500/20"
            >
              <Printer className="w-4 h-4" /> Print / Save as PDF
            </button>
            <a
              href="/api/export/csv"
              download
              className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition"
            >
              <Download className="w-4 h-4 text-emerald-400" /> Export CSV Dataset
            </a>
          </div>
        </div>

        <DataFilter
          filters={filters}
          setFilters={setFilters}
          onReset={() => setFilters({ location: 'All', department: 'All', userCategory: 'All', bagType: 'All' })}
        />
      </div>

      {/* Formatted Academic Printable Report Container */}
      <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-slate-800 bg-slate-900/95 space-y-8 print:p-0 print:border-none print:bg-white print:text-black">
        
        {/* Report Header */}
        <div className="border-b border-slate-800 print:border-black pb-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-emerald-400 print:text-black tracking-widest">
              COMMUNITY ENGAGEMENT PROJECT (CEP) FINAL REPORT
            </span>
            <span className="text-xs text-slate-400 print:text-black font-mono">
              Generated: {new Date().toLocaleDateString()}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white print:text-black">
            Campus Plastic Bag Usage and Reduction Analysis
          </h2>
          <p className="text-sm font-semibold text-emerald-300 print:text-black">
            Vidyalankar School of Information Technology (VSIT)
          </p>
        </div>

        {/* Executive Summary */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-white print:text-black uppercase tracking-wider border-l-4 border-emerald-500 pl-3">
            1. Executive Summary
          </h3>
          <p className="text-xs text-slate-300 print:text-black leading-relaxed">
            {report?.executiveSummary}
          </p>
        </div>

        {/* Key Metrics Overview */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-white print:text-black uppercase tracking-wider border-l-4 border-emerald-500 pl-3">
            2. Campus Plastic Usage Metrics
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="bg-slate-950 print:bg-slate-100 p-4 rounded-xl border border-slate-800 print:border-slate-300 space-y-1">
              <span className="text-[11px] text-slate-400 print:text-slate-700">Total Bags Recorded</span>
              <p className="text-2xl font-black text-white print:text-black">{(report?.totalBags || 0).toLocaleString()}</p>
            </div>
            <div className="bg-slate-950 print:bg-slate-100 p-4 rounded-xl border border-slate-800 print:border-slate-300 space-y-1">
              <span className="text-[11px] text-slate-400 print:text-slate-700">Estimated Plastic Weight</span>
              <p className="text-2xl font-black text-amber-400 print:text-black">{report?.totalWeightKg || 0} kg</p>
            </div>
            <div className="bg-slate-950 print:bg-slate-100 p-4 rounded-xl border border-slate-800 print:border-slate-300 space-y-1">
              <span className="text-[11px] text-slate-400 print:text-slate-700">Reusable Adoption</span>
              <p className="text-2xl font-black text-emerald-400 print:text-black">{report?.reusableAdoptionPct || 0}%</p>
            </div>
            <div className="bg-slate-950 print:bg-slate-100 p-4 rounded-xl border border-slate-800 print:border-slate-300 space-y-1">
              <span className="text-[11px] text-slate-400 print:text-slate-700">Reduction vs Baseline</span>
              <p className="text-2xl font-black text-teal-300 print:text-black">{report?.reductionProgress?.reductionPct || 0}%</p>
            </div>
          </div>
        </div>

        {/* High Risk Hotspots Table */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-white print:text-black uppercase tracking-wider border-l-4 border-emerald-500 pl-3">
            3. High-Risk Campus Hotspots
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-300 print:text-black border border-slate-800 print:border-black">
              <thead className="bg-slate-950 print:bg-slate-200 text-slate-400 print:text-black uppercase">
                <tr>
                  <th className="p-3">Campus Location</th>
                  <th className="p-3">Bags Recorded</th>
                  <th className="p-3">Est. Weight (kg)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-slate-300">
                {(report?.topLocations || []).map((loc, i) => (
                  <tr key={i}>
                    <td className="p-3 font-bold text-white print:text-black">{loc.campus_location}</td>
                    <td className="p-3">{loc.bags.toLocaleString()}</td>
                    <td className="p-3">{loc.weight_kg} kg</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-white print:text-black uppercase tracking-wider border-l-4 border-emerald-500 pl-3">
            4. Key Recommendations for VSIT Leadership
          </h3>
          <ul className="space-y-2 text-xs text-slate-300 print:text-black">
            {(report?.recommendations || []).map((rec, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="font-bold text-emerald-400 print:text-black">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Signatures Footer for Academic Viva */}
        <div className="pt-12 border-t border-slate-800 print:border-black grid grid-cols-3 gap-6 text-center text-xs text-slate-400 print:text-black">
          <div>
            <div className="border-b border-slate-700 print:border-black mb-2 h-10" />
            <span>Student CEP Lead</span>
          </div>
          <div>
            <div className="border-b border-slate-700 print:border-black mb-2 h-10" />
            <span>Faculty Project Guide</span>
          </div>
          <div>
            <div className="border-b border-slate-700 print:border-black mb-2 h-10" />
            <span>Head of Department (VSIT)</span>
          </div>
        </div>

      </div>
    </div>
  );
}
