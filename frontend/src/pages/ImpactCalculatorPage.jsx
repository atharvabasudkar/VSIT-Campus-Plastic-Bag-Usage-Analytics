import React, { useState, useEffect } from 'react';
import { Calculator, Scale, Leaf, Globe, Sparkles, Info, ArrowRight } from 'lucide-react';
import { calculateImpact } from '../services/api';
import SyntheticDataBanner from '../components/SyntheticDataBanner';

export default function ImpactCalculatorPage() {
  const [inputs, setInputs] = useState({
    bagsAvoided: 5000,
    bagWeightGrams: 8.0,
    studentPopulation: 3500,
    reusableAdoptionTargetPct: 50
  });

  const [result, setResult] = useState(null);

  useEffect(() => {
    loadCalculation();
  }, [inputs]);

  const loadCalculation = async () => {
    try {
      const res = await calculateImpact(inputs);
      if (res.success) {
        setResult(res.calculation);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <SyntheticDataBanner />

      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
          <Calculator className="w-7 h-7 text-emerald-400" /> Environmental Impact Estimator
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Model environmental benefits of single-use plastic bag reduction initiatives across VSIT.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Interactive Parameter Controls (Col 5) */}
        <div className="lg:col-span-5 glass-card rounded-3xl p-6 border border-emerald-500/20 space-y-5 bg-slate-900/90">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" /> Configurable Impact Parameters
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-semibold text-slate-300 mb-1">
                <span>Plastic Bags Avoided / Month:</span>
                <strong className="text-emerald-400 font-extrabold">{inputs.bagsAvoided.toLocaleString()} bags</strong>
              </div>
              <input
                type="range"
                min="500"
                max="50000"
                step="500"
                value={inputs.bagsAvoided}
                onChange={e => setInputs({ ...inputs, bagsAvoided: parseInt(e.target.value) })}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-300 mb-1">
                <span>Avg Bag Weight (grams):</span>
                <strong className="text-amber-400 font-extrabold">{inputs.bagWeightGrams} g</strong>
              </div>
              <input
                type="range"
                min="3.0"
                max="15.0"
                step="0.5"
                value={inputs.bagWeightGrams}
                onChange={e => setInputs({ ...inputs, bagWeightGrams: parseFloat(e.target.value) })}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-300 mb-1">
                <span>VSIT Student & Staff Population:</span>
                <strong className="text-blue-400 font-extrabold">{inputs.studentPopulation.toLocaleString()} users</strong>
              </div>
              <input
                type="range"
                min="1000"
                max="10000"
                step="250"
                value={inputs.studentPopulation}
                onChange={e => setInputs({ ...inputs, studentPopulation: parseInt(e.target.value) })}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-300 mb-1">
                <span>Target Reusable Adoption:</span>
                <strong className="text-teal-300 font-extrabold">{inputs.reusableAdoptionTargetPct}%</strong>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                step="5"
                value={inputs.reusableAdoptionTargetPct}
                onChange={e => setInputs({ ...inputs, reusableAdoptionTargetPct: parseInt(e.target.value) })}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Calculated Results Display (Col 7) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            
            <div className="glass-card rounded-2xl p-5 border border-emerald-500/30 text-center space-y-1 bg-gradient-to-br from-slate-900 to-emerald-950/40">
              <span className="text-xs text-slate-400">Plastic Waste Avoided</span>
              <p className="text-3xl font-black text-emerald-400">{result?.wasteAvoidedKg || 0} kg</p>
              <p className="text-[11px] text-slate-400">per month</p>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-emerald-500/30 text-center space-y-1 bg-gradient-to-br from-slate-900 to-teal-950/40">
              <span className="text-xs text-slate-400">CO2 Equivalent Saved</span>
              <p className="text-3xl font-black text-teal-300">{result?.co2AvoidedKg || 0} kg</p>
              <p className="text-[11px] text-slate-400">per month (3.5x factor)</p>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-emerald-500/30 text-center space-y-1">
              <span className="text-xs text-slate-400">Yearly Waste Reduction</span>
              <p className="text-3xl font-black text-amber-400">{(result?.yearlyWasteAvoidedKg || 0).toLocaleString()} kg</p>
              <p className="text-[11px] text-slate-400">annualized projection</p>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-emerald-500/30 text-center space-y-1">
              <span className="text-xs text-slate-400">Reusable Bags Adopted</span>
              <p className="text-3xl font-black text-blue-400">{(result?.reusableBagsAdopted || 0).toLocaleString()}</p>
              <p className="text-[11px] text-slate-400">active campus users</p>
            </div>

          </div>

          {/* Impact Assumptions & Methodology Section */}
          <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-3 bg-slate-950/80">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Info className="w-4 h-4 text-emerald-400" /> Scientific & Life-Cycle Impact Assumptions
            </h4>
            <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
              <p>
                <strong>CO2 Conversion Factor:</strong> Standard low-density polyethylene (LDPE) manufacturing & incineration lifecycle emits approximately 3.5 kg CO2 equivalent per 1.0 kg of raw plastic material.
              </p>
              <p>
                <strong>Landfill Volume:</strong> 1,000 plastic carry bags occupy approx. 0.15 m³ of uncompacted landfill volume and persist for 100 to 500 years.
              </p>
              <p className="text-amber-400/90 text-[11px] italic">
                * Environmental estimates depend on bag material, thickness, weight, disposal pathway, and lifecycle assumptions.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
