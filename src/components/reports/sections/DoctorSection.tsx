import React, { useEffect, useState } from 'react';
import { Award, FilePen } from 'lucide-react';
import type { Report, DoctorProfile } from '../../../types';
import { doctorRepository } from '../../../services/storage/doctorRepository';

interface DoctorSectionProps {
  report: Report;
}

export const DoctorSection: React.FC<DoctorSectionProps> = ({ report }) => {
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorProfile | null>(null);

  useEffect(() => {
    if (report.doctorId) {
      doctorRepository.getById(report.doctorId).then((doc) => {
        if (doc) setSelectedDoctor(doc);
      });
    }
  }, [report.doctorId]);

  return (
    <div id="section-doctor" className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4 mb-5">
        <div className="p-2 bg-slate-100 rounded-lg text-slate-800">
          <Award className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-900">Doctor Authentication & Sign-off</h3>
          <p className="text-xs text-slate-500">Attending physician credentials and digital signature</p>
        </div>
      </div>

      <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-slate-500 block uppercase font-semibold tracking-wider">
            Attending Pulmonologist
          </span>
          <h4 className="text-base font-bold text-slate-900 mt-0.5">
            {selectedDoctor?.name || report.consultedBy || 'Attending Physician'}
          </h4>
          <p className="text-xs text-slate-600 font-medium">
            {selectedDoctor?.designation || 'Consultant Pulmonologist'}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">{selectedDoctor?.credentials || 'MD, DM Pulmonology'}</p>
          <p className="text-xs text-slate-400">{selectedDoctor?.department || 'Department of Pediatrics'}</p>
        </div>

        <div className="border border-slate-300 rounded-lg p-3 bg-white w-52 text-center shadow-2xs">
          <span className="text-[10px] text-slate-400 block mb-1 uppercase tracking-wider font-semibold">
            Digital Signature
          </span>
          {selectedDoctor?.signatureUrl ? (
            <img
              src={selectedDoctor.signatureUrl}
              alt="Doctor Signature"
              className="h-12 max-w-full mx-auto object-contain"
            />
          ) : (
            <div className="h-12 border border-dashed border-slate-300 rounded flex items-center justify-center text-slate-400 text-xs gap-1">
              <FilePen className="w-3.5 h-3.5" /> Signature Configured
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
