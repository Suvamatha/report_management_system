import React from 'react';
import { Search, RefreshCw } from 'lucide-react';
import type { ReportFilter, ReportStatus, DoctorProfile } from '../../types';

interface FilterBarProps {
  filter: ReportFilter;
  onChange: (filter: ReportFilter) => void;
  doctors: DoctorProfile[];
  onReset: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filter,
  onChange,
  doctors,
  onReset,
}) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs mb-6 flex flex-wrap items-center justify-between gap-3">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[240px]">
        <input
          type="text"
          placeholder="Search by Patient Name, ID, Report #, Doctor..."
          value={filter.searchQuery || ''}
          onChange={(e) => onChange({ ...filter, searchQuery: e.target.value })}
          className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
      </div>

      {/* Filter Selectors */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Status */}
        <select
          value={filter.status || 'All'}
          onChange={(e) =>
            onChange({ ...filter, status: e.target.value as ReportStatus | 'All' })
          }
          className="text-xs px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 bg-white"
        >
          <option value="All">All Statuses</option>
          <option value="Draft">Drafts</option>
          <option value="Completed">Completed</option>
          <option value="Amended">Amended</option>
        </select>

        {/* Doctor */}
        <select
          value={filter.doctorId || 'All'}
          onChange={(e) => onChange({ ...filter, doctorId: e.target.value })}
          className="text-xs px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 bg-white max-w-[180px]"
        >
          <option value="All">All Doctors</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        {/* Date Inputs */}
        <input
          type="date"
          value={filter.startDate || ''}
          onChange={(e) => onChange({ ...filter, startDate: e.target.value })}
          className="text-xs px-2.5 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 bg-white"
          title="From date"
        />

        <input
          type="date"
          value={filter.endDate || ''}
          onChange={(e) => onChange({ ...filter, endDate: e.target.value })}
          className="text-xs px-2.5 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 bg-white"
          title="To date"
        />

        {/* Reset */}
        <button
          type="button"
          onClick={onReset}
          className="p-2 rounded-lg border border-slate-300 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
          title="Reset filters"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
