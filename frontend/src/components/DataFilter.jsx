import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

export default function DataFilter({ filters, setFilters, onReset }) {
  const departments = ['All', 'BSc IT', 'BSc CS', 'BCA', 'MSc IT', 'Teaching Staff', 'Administrative Staff', 'Other'];
  const locations = [
    'All',
    'Canteen',
    'Cafeteria',
    'Stationery Area',
    'Library Area',
    'Administrative Area',
    'Campus Events',
    'Student Activity Area',
    'Entrance / Exit',
    'Nearby Vendor Interaction',
    'Other'
  ];
  const userCategories = ['All', 'Students', 'Teaching Staff', 'Non-Teaching Staff', 'Vendors', 'Visitors'];
  const bagTypes = ['All', 'Thin Carry Bag', 'Medium Carry Bag', 'Large Carry Bag', 'Food Packaging Bag', 'Shopping Bag', 'Other'];

  const handleChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="glass-card rounded-2xl p-4 border border-emerald-500/20 mb-6 space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 text-white font-semibold text-sm">
          <Filter className="w-4 h-4 text-emerald-400" />
          <span>Analytics Data Filters</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        
        {/* Location Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Campus Location</label>
          <select
            value={filters.location || 'All'}
            onChange={e => handleChange('location', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
          </select>
        </div>

        {/* Department Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Department</label>
          <select
            value={filters.department || 'All'}
            onChange={e => handleChange('department', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        {/* User Category Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">User Category</label>
          <select
            value={filters.userCategory || 'All'}
            onChange={e => handleChange('userCategory', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            {userCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        {/* Bag Type Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Plastic Bag Type</label>
          <select
            value={filters.bagType || 'All'}
            onChange={e => handleChange('bagType', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            {bagTypes.map(bt => <option key={bt} value={bt}>{bt}</option>)}
          </select>
        </div>

        {/* Reusable Bag Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Reusable Bag Used?</label>
          <select
            value={filters.reusable || 'All'}
            onChange={e => handleChange('reusable', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="All">All Statuses</option>
            <option value="Yes">Yes (Reusable)</option>
            <option value="No">No (Single-Use Plastic)</option>
          </select>
        </div>

        {/* Campaign Exposure Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Campaign Exposure</label>
          <select
            value={filters.campaignExposure || 'All'}
            onChange={e => handleChange('campaignExposure', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="All">All Exposure</option>
            <option value="Yes">Exposed to Campaign</option>
            <option value="No">Not Exposed</option>
          </select>
        </div>

      </div>
    </div>
  );
}
