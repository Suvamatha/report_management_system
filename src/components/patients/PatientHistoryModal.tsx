import React, { useState, useEffect } from 'react';
import { Search, User, ChevronRight } from 'lucide-react';
import { Modal } from '../ui/Modal';
import type { Patient, Report } from '../../types';
import { patientRepository } from '../../services/storage/patientRepository';
import { reportRepository } from '../../services/storage/reportRepository';
import { Badge } from '../ui/Badge';

interface PatientHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectReport: (reportId: string) => void;
}

export const PatientHistoryModal: React.FC<PatientHistoryModalProps> = ({
  isOpen,
  onClose,
  onSelectReport,
}) => {
  const [search, setSearch] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientReports, setPatientReports] = useState<Report[]>([]);

  useEffect(() => {
    if (isOpen) {
      patientRepository.getAll().then(setPatients);
    }
  }, [isOpen]);

  const handleSearch = (q: string) => {
    setSearch(q);
    patientRepository.search(q).then(setPatients);
  };

  const handleSelectPatient = async (patient: Patient) => {
    setSelectedPatient(patient);
    const reports = await reportRepository.getByPatientId(patient.patientId);
    setPatientReports(reports);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Patient Directory & Procedure History"
      subtitle="Search patient records and past bronchoscopy reports"
      maxWidth="4xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[420px]">
        {/* Left Directory Search */}
        <div className="md:col-span-5 border-r border-slate-200 pr-4 space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Patient ID or Name..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          <div className="space-y-1.5 max-h-[350px] overflow-y-auto pr-1">
            {patients.map((p) => {
              const isSelected = selectedPatient?.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handleSelectPatient(p)}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-sky-50 border-sky-500 text-sky-900 shadow-2xs font-semibold'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div>
                    <div className="font-bold text-slate-900">{p.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {p.patientId} • {p.age}y / {p.gender}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              );
            })}
            {patients.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-6">No matching patients found.</p>
            )}
          </div>
        </div>

        {/* Right Patient Profile & Timeline */}
        <div className="md:col-span-7 space-y-4">
          {selectedPatient ? (
            <div>
              {/* Profile Header */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-4 flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-slate-900">{selectedPatient.name}</h4>
                  <p className="text-xs text-slate-500 font-mono">
                    Patient ID: {selectedPatient.patientId} | {selectedPatient.age} Years | {selectedPatient.gender}
                  </p>
                </div>
                <div className="p-2 bg-sky-100 text-sky-700 rounded-full">
                  <User className="w-5 h-5" />
                </div>
              </div>

              {/* Procedure Timeline */}
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Procedure History ({patientReports.length})
              </h5>

              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {patientReports.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => {
                      onSelectReport(r.id);
                      onClose();
                    }}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-sky-500 bg-white hover:bg-sky-50/40 cursor-pointer transition-all flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-slate-900">{r.reportNumber}</span>
                        <Badge status={r.status} />
                      </div>
                      <p className="text-xs text-slate-700 font-medium mt-1">{r.procedureName}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Visit Date: {r.visitDate}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
                {patientReports.length === 0 && (
                  <p className="text-xs text-slate-400 italic py-4">No procedure reports recorded for this patient.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs py-12">
              <User className="w-10 h-10 text-slate-300 mb-2" />
              <span>Select a patient from the list to view demographics and procedure history</span>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
