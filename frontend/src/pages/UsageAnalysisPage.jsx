import React, { useState, useEffect, useContext } from 'react';
import { BarChart3, Search, Trash2, Plus, Download, RefreshCw, FileText } from 'lucide-react';
import { fetchObservations, deleteObservation } from '../services/api';
import DataFilter from '../components/DataFilter';
import AddObservationModal from '../components/AddObservationModal';
import SyntheticDataBanner from '../components/SyntheticDataBanner';
import { AuthContext } from '../context/AuthContext';

export default function UsageAnalysisPage() {
  const { isAdmin } = useContext(AuthContext);
  const [filters, setFilters] = useState({
    location: 'All',
    department: 'All',
    userCategory: 'All',
    bagType: 'All'
  });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchObservations({ ...filters, search, page, limit: 20 });
      if (res.success) {
        setRecords(res.records);
        setPagination(res.pagination);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters, page, search]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this observation record?')) return;
    try {
      const res = await deleteObservation(id, localStorage.getItem('vsit_cep_token'));
      if (res.success) {
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <SyntheticDataBanner />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-emerald-400" /> Plastic Usage Observation Records
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Browse, search, and manage individual fieldwork observation records stored in database.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition shadow-lg shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" /> Add Observation
          </button>
          <a
            href="/api/export/csv"
            download
            className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition"
          >
            <Download className="w-4 h-4 text-emerald-400" /> Export CSV
          </a>
        </div>
      </div>

      <DataFilter
        filters={filters}
        setFilters={setFilters}
        onReset={() => setFilters({ location: 'All', department: 'All', userCategory: 'All', bagType: 'All' })}
      />

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <input
          type="text"
          placeholder="Search by ID, purpose, notes..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Records Table */}
      <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3">Record ID</th>
                <th className="p-3">Date</th>
                <th className="p-3">Location</th>
                <th className="p-3">User & Dept</th>
                <th className="p-3">Bag Type</th>
                <th className="p-3">Bags Used</th>
                <th className="p-3">Reusable?</th>
                <th className="p-3">Avoidable?</th>
                {isAdmin && <th className="p-3">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 font-mono font-bold text-emerald-400">{r.record_id}</td>
                  <td className="p-3 text-slate-300">{r.date}</td>
                  <td className="p-3 font-semibold text-white">{r.campus_location}</td>
                  <td className="p-3 text-slate-300">{r.user_category} ({r.department})</td>
                  <td className="p-3 text-slate-300">{r.bag_type}</td>
                  <td className="p-3 font-bold text-white">{r.bags_used}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-md font-semibold text-[10px] ${r.reusable_bag_used === 'Yes' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'}`}>
                      {r.reusable_bag_used}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-md font-semibold text-[10px] ${r.plastic_avoidable === 'Yes' ? 'bg-amber-950 text-amber-300 border border-amber-500/30' : 'bg-slate-800 text-slate-400'}`}>
                      {r.plastic_avoidable}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="p-3">
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="text-rose-400 hover:text-rose-300 p-1 rounded hover:bg-slate-800"
                        title="Delete Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Showing page {page} of {pagination.totalPages} ({pagination.total} records total)</span>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-3 py-1 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              disabled={page >= pagination.totalPages}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <AddObservationModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onRefresh={loadData}
      />
    </div>
  );
}
