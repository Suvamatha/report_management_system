import React, { useState, useEffect } from 'react';
import { User, Search } from 'lucide-react';
import type { Report, Patient, Gender } from '../../../types';
import { patientRepository } from '../../../services/storage/patientRepository';

interface PatientSectionProps {
  report: Report;
  onChange: (updates: Partial<Report>) => void;
}

export const PatientSection: React.FC<PatientSectionProps> = ({ report, onChange }) => {
  const [patientSearch, setPatientSearch] = useState('');
  const [matchingPatients, setMatchingPatients] = useState<Patient[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (patientSearch.trim().length > 1) {
      patientRepository.search(patientSearch).then((results) => {
        setMatchingPatients(results);
        setShowResults(results.length > 0);
      });
    } else {
      setMatchingPatients([]);
      setShowResults(false);
    }
  }, [patientSearch]);

  const selectExistingPatient = (p: Patient) => {
    onChange({
      patientId: p.patientId,
      patientName: p.name,
      patientAge: p.age,
      patientGender: p.gender,
    });
    setPatientSearch('');
    setShowResults(false);
  };

  return (
    <div id="section-patient" className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-sky-50 rounded-lg text-sky-600">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">Patient Information</h3>
            <p className="text-xs text-slate-500">Demographics and unique patient identifier</p>
          </div>
        </div>

        <div className="relative w-64">
          <div className="relative">
            <input
              type="text"
              placeholder="Search existing patient..."
              value={patientSearch}
              onChange={(e) => setPatientSearch(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
          </div>

          {showResults && (
            <div className="absolute z-20 top-full mt-1 w-full bg-white rounded-lg border border-slate-200 shadow-lg max-h-48 overflow-y-auto">
              {matchingPatients.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => selectExistingPatient(p)}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-sky-50 border-b border-slate-100 last:border-0 flex items-center justify-between"
                >
                  <div>
                    <span className="font-semibold text-slate-800">{p.name}</span>
                    <span className="text-slate-400 ml-2">({p.patientId})</span>
                  </div>
                  <span className="text-slate-500">{p.age}y / {p.gender}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Patient ID <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={report.patientId}
            onChange={(e) => onChange({ patientId: e.target.value })}
            placeholder="e.g. PAT-2026-901"
            className="w-full text-sm font-mono px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Patient Full Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={report.patientName}
            onChange={(e) => onChange({ patientName: e.target.value })}
            placeholder="e.g. Ram Bahadur Thapa"
            className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Age</label>
            <input
              type="number"
              min="0"
              max="120"
              value={report.patientAge}
              onChange={(e) => onChange({ patientAge: e.target.value })}
              placeholder="Years"
              className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
            <select
              value={report.patientGender}
              onChange={(e) => onChange({ patientGender: e.target.value as Gender })}
              className="w-full text-sm px-2.5 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
