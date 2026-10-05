import React, { useState, useContext } from 'react';
import { X, UploadCloud, FileSpreadsheet, CheckCircle2, AlertCircle, Download } from 'lucide-react';
import { uploadFieldworkCsv } from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function ImportCsvModal({ isOpen, onClose, onRefresh }) {
  const { token } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setErrorMsg('Please select a valid CSV file.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await uploadFieldworkCsv(file, token);
      if (res.success) {
        setResult(res);
        if (onRefresh) onRefresh();
      } else {
        setErrorMsg(res.message || 'Import failed.');
      }
    } catch (err) {
      setErrorMsg('Server error during file upload.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="glass-card rounded-3xl border border-emerald-500/30 max-w-lg w-full p-6 relative overflow-hidden bg-slate-900 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-800 pb-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Import Fieldwork CSV Data</h3>
            <p className="text-xs text-slate-400">Replace or supplement dataset with real field observations</p>
          </div>
        </div>

        {result ? (
          <div className="py-6 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="text-lg font-bold text-white">Import Complete!</h4>
            <p className="text-emerald-300 text-xs font-semibold">{result.message}</p>
            {result.warnings && result.warnings.length > 0 && (
              <div className="bg-amber-950/40 p-3 rounded-xl border border-amber-500/30 text-amber-300 text-left text-[11px] max-h-32 overflow-y-auto">
                <p className="font-bold mb-1">Warnings / Skipped Rows:</p>
                {result.warnings.map((w, idx) => <p key={idx}>• {w}</p>)}
              </div>
            )}
            <button
              onClick={onClose}
              className="mt-4 bg-emerald-500 text-slate-950 font-bold px-6 py-2 rounded-xl text-xs"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200">Fieldwork CSV Spreadsheet Template</span>
                <a
                  href="/api/export/template"
                  download
                  className="text-emerald-400 hover:underline font-bold text-[11px] flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> Download Template
                </a>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Ensure CSV headers match: <code>date, user_category, department, campus_location, bag_type, bags_used, estimated_weight_grams, purpose, reusable_bag_used, plastic_avoidable</code>
              </p>
            </div>

            <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500/50 rounded-2xl p-6 text-center bg-slate-950/50 transition">
              <FileSpreadsheet className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                id="csv-file-input"
              />
              <label htmlFor="csv-file-input" className="cursor-pointer">
                <span className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-4 py-2 rounded-xl border border-slate-600 inline-block mb-1">
                  Select CSV File
                </span>
                <p className="text-[11px] text-slate-400">
                  {file ? file.name : 'Drag & drop or click to browse'}
                </p>
              </label>
            </div>

            {errorMsg && (
              <div className="bg-rose-950/50 border border-rose-500/30 text-rose-300 p-2.5 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !file}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold py-2.5 rounded-xl text-sm transition shadow-lg shadow-emerald-500/20"
            >
              {loading ? 'Validating & Uploading...' : 'Upload & Validate CSV Data'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
