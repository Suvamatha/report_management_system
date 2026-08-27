import React, { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import type { Report, DoctorProfile } from '../../../types';
import { doctorRepository } from '../../../services/storage/doctorRepository';

interface VisitSectionProps {
  report: Report;
  onChange: (updates: Partial<Report>) => void;
}

export const VisitSection: React.FC<VisitSectionProps> = ({ report, onChange }) => {
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);

  useEffect(() => {
    doctorRepository.getAll().then((list) => {
      setDoctors(list);
      if (!report.doctorId && list.length > 0) {
        const defaultDoc = list.find((d) => d.isDefault) || list[0];
        onChange({
          doctorId: defaultDoc.id,
          consultedBy: defaultDoc.name,
        });
      }
    });
  }, []);

  const handleDoctorChange = (docId: string) => {
    const doc = doctors.find((d) => d.id === docId);
    if (doc) {
      onChange({
        doctorId: doc.id,
        consultedBy: doc.name,
      });
    }
  };

  return (
    <div id="section-visit" className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4 mb-5">
        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
          <Calendar className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-900">Visit & Referral Information</h3>
          <p className="text-xs text-slate-500">Date of procedure and attending pulmonologists</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Visit Date <span className="text-rose-500">*</span>
          </label>
          <input
            type="date"
            value={report.visitDate}
            onChange={(e) => onChange({ visitDate: e.target.value })}
            className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Referred By</label>
          <input
            type="text"
            value={report.referredBy}
            onChange={(e) => onChange({ referredBy: e.target.value })}
            placeholder="e.g. Dr. K. P. Sharma (Internal Med)"
            className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Consulted By (Doctor) <span className="text-rose-500">*</span>
          </label>
          <select
            value={report.doctorId || ''}
            onChange={(e) => handleDoctorChange(e.target.value)}
            className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
          >
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.name} ({doc.designation})
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
