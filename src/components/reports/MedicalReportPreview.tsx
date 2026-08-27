import React, { useEffect, useState } from 'react';
import type { Report, HospitalProfile, DoctorProfile } from '../../types';
import { hospitalRepository } from '../../services/storage/hospitalRepository';
import { doctorRepository } from '../../services/storage/doctorRepository';

interface MedicalReportPreviewProps {
  report: Report;
}

export const MedicalReportPreview: React.FC<MedicalReportPreviewProps> = ({ report }) => {
  const [hospital, setHospital] = useState<HospitalProfile | null>(null);
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);

  useEffect(() => {
    hospitalRepository.getProfile().then(setHospital);
    if (report.doctorId) {
      doctorRepository.getById(report.doctorId).then(setDoctor);
    }
  }, [report.doctorId]);

  if (!hospital) return <div className="p-8 text-center text-slate-500">Loading Report Preview...</div>;

  return (
    <div className="a4-container bg-white text-slate-900 shadow-2xl rounded-xl border border-slate-300 max-w-[210mm] mx-auto p-[15mm] my-6 font-sans text-xs leading-relaxed relative print:shadow-none print:border-none print:m-0 print:p-0">
      {/* Hospital Header */}
      <div className="border-b-2 border-slate-900 pb-4 mb-4 text-center">
        <h1 className="text-xl font-bold uppercase tracking-wide text-slate-900">
          {hospital.name}
        </h1>
        <h2 className="text-sm font-semibold text-sky-700 mt-0.5">
          {hospital.department}
        </h2>
        <p className="text-[11px] text-slate-600 mt-0.5">
          {hospital.address} | Phone: {hospital.contactPhone}
        </p>
      </div>

      {/* Report Title Badge */}
      <div className="text-center my-3">
        <span className="inline-block bg-slate-900 text-white font-bold text-xs uppercase px-4 py-1 rounded-md tracking-wider">
          {report.procedureName || 'Digital Bronchoscopy Report'}
        </span>
      </div>

      {/* Patient & Visit Metadata Grid */}
      <div className="border border-slate-300 rounded-lg p-3 my-3 bg-slate-50/50 grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
        <div>
          <span className="font-semibold text-slate-500 w-24 inline-block">Patient ID:</span>
          <span className="font-bold font-mono text-slate-900">{report.patientId}</span>
        </div>
        <div>
          <span className="font-semibold text-slate-500 w-24 inline-block">Visit Date:</span>
          <span className="font-medium text-slate-900">{report.visitDate}</span>
        </div>
        <div>
          <span className="font-semibold text-slate-500 w-24 inline-block">Patient Name:</span>
          <span className="font-bold text-slate-900">{report.patientName}</span>
        </div>
        <div>
          <span className="font-semibold text-slate-500 w-24 inline-block">Referred By:</span>
          <span className="font-medium text-slate-900">{report.referredBy || '—'}</span>
        </div>
        <div>
          <span className="font-semibold text-slate-500 w-24 inline-block">Age / Gender:</span>
          <span className="font-medium text-slate-900">
            {report.patientAge} Years / {report.patientGender}
          </span>
        </div>
        <div>
          <span className="font-semibold text-slate-500 w-24 inline-block">Consulted By:</span>
          <span className="font-bold text-slate-900">{report.consultedBy || doctor?.name || '—'}</span>
        </div>
      </div>

      {/* Procedure Information */}
      <div className="border border-slate-200 rounded-lg p-3 my-3 bg-white space-y-1">
        <h3 className="text-xs font-bold uppercase text-sky-800 tracking-wider mb-1 border-b border-slate-100 pb-1">
          Procedure Details
        </h3>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <span className="font-semibold text-slate-500 block">Premedication:</span>
            <span className="text-slate-800">{report.premedication || 'None'}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-500 block">Sedation:</span>
            <span className="text-slate-800">{report.sedation || 'None'}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-500 block">Route:</span>
            <span className="text-slate-800">
              {report.route === 'Other' ? report.routeCustom || 'Other' : report.route}
            </span>
          </div>
        </div>
      </div>

      {/* CT Findings */}
      {report.ctFindings && (
        <div className="my-3">
          <h3 className="text-xs font-bold uppercase text-sky-800 tracking-wider mb-1">
            CT Findings
          </h3>
          <p className="text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-200 whitespace-pre-wrap">
            {report.ctFindings}
          </p>
        </div>
      )}

      {/* Clinical Indication */}
      {report.indication && (
        <div className="my-3">
          <h3 className="text-xs font-bold uppercase text-sky-800 tracking-wider mb-1">
            Clinical Indication
          </h3>
          <p className="text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-200 whitespace-pre-wrap">
            {report.indication}
          </p>
        </div>
      )}

      {/* Bronchoscopic Findings Table */}
      <div className="my-4">
        <h3 className="text-xs font-bold uppercase text-sky-800 tracking-wider mb-1.5">
          Bronchoscopic Anatomical Findings
        </h3>
        <table className="w-full text-left border-collapse border border-slate-300 text-xs">
          <thead>
            <tr className="bg-slate-800 text-white font-semibold">
              <th className="p-2 border border-slate-300 w-1/3">Anatomical Location</th>
              <th className="p-2 border border-slate-300 w-1/4">Status</th>
              <th className="p-2 border border-slate-300">Observations / Detailed Findings</th>
            </tr>
          </thead>
          <tbody>
            {report.findings.map((f, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                <td className="p-2 border border-slate-200 font-semibold text-slate-900">
                  {f.anatomicalLocation}
                </td>
                <td className="p-2 border border-slate-200">
                  <span
                    className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                      f.findingType === 'Normal'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {f.findingType === 'Normal' && f.anatomicalLocation === 'Tracheobronchial Tree'
                      ? 'Normal TBT'
                      : f.findingType}
                  </span>
                </td>
                <td className="p-2 border border-slate-200 text-slate-800">
                  {f.customText || 'Normal lumen, mucosal architecture, and patent segments.'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Interventions & Samples */}
      <div className="my-4">
        <h3 className="text-xs font-bold uppercase text-sky-800 tracking-wider mb-1.5">
          Interventions & Sample Collection
        </h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 rounded border border-slate-200 bg-slate-50/50">
            <span className="font-semibold text-slate-900">BAL: </span>
            <span className={report.bal.done ? 'font-bold text-sky-700' : 'text-slate-500'}>
              {report.bal.done ? 'DONE' : 'Not Done'}
            </span>
            {report.bal.done && (
              <div className="mt-1 text-[11px] text-slate-700">
                <div>Site: {report.bal.sampleSite || 'Standard'}</div>
                <div>Tests: {report.bal.specimenTests || 'Cytology, AFB'}</div>
                {report.bal.notes && <div>Notes: {report.bal.notes}</div>}
              </div>
            )}
          </div>

          <div className="p-2 rounded border border-slate-200 bg-slate-50/50">
            <span className="font-semibold text-slate-900">Endobronchial Biopsy: </span>
            <span className={report.endobronchialBiopsy.done ? 'font-bold text-sky-700' : 'text-slate-500'}>
              {report.endobronchialBiopsy.done ? 'DONE' : 'Not Done'}
            </span>
            {report.endobronchialBiopsy.done && (
              <div className="mt-1 text-[11px] text-slate-700">
                <div>Site: {report.endobronchialBiopsy.site}</div>
                <div>Specimen: {report.endobronchialBiopsy.specimenNotes}</div>
              </div>
            )}
          </div>

          <div className="p-2 rounded border border-slate-200 bg-slate-50/50">
            <span className="font-semibold text-slate-900">Conventional TBNA: </span>
            <span className={report.conventionalTbna.done ? 'font-bold text-sky-700' : 'text-slate-500'}>
              {report.conventionalTbna.done ? 'DONE' : 'Not Done'}
            </span>
            {report.conventionalTbna.done && (
              <div className="mt-1 text-[11px] text-slate-700">
                <div>Station: {report.conventionalTbna.stationSite}</div>
                <div>Tests: {report.conventionalTbna.specimenTests}</div>
                {report.conventionalTbna.notes && <div>Notes: {report.conventionalTbna.notes}</div>}
              </div>
            )}
          </div>

          <div className="p-2 rounded border border-slate-200 bg-slate-50/50">
            <span className="font-semibold text-slate-900">Brushing: </span>
            <span className={report.brushing.done ? 'font-bold text-sky-700' : 'text-slate-500'}>
              {report.brushing.done ? 'DONE' : 'Not Done'}
            </span>
            {report.brushing.done && (
              <div className="mt-1 text-[11px] text-slate-700">
                <div>Site: {report.brushing.site}</div>
                {report.brushing.notes && <div>Notes: {report.brushing.notes}</div>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* IMPRESSION */}
      <div className="my-4 p-3 bg-sky-50/70 border border-sky-300 rounded-lg">
        <h3 className="text-xs font-bold uppercase text-sky-900 tracking-wider mb-1">
          Impression
        </h3>
        <p className="text-slate-900 font-medium whitespace-pre-wrap">
          {report.impression || 'No impression entered.'}
        </p>
      </div>

      {/* ADVICE */}
      <div className="my-4 p-3 bg-slate-50 border border-slate-300 rounded-lg">
        <h3 className="text-xs font-bold uppercase text-slate-800 tracking-wider mb-1">
          Advice & Follow-up
        </h3>
        <p className="text-slate-800 whitespace-pre-wrap">
          {report.advice || 'Standard post-bronchoscopy care.'}
        </p>
      </div>

      {/* Medical Images Grid */}
      {report.images && report.images.length > 0 && (
        <div className="my-6 avoid-break">
          <h3 className="text-xs font-bold uppercase text-sky-800 tracking-wider mb-2 border-b border-slate-200 pb-1">
            Medical Bronchoscopy Images
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {report.images.map((img, idx) => (
              <div key={img.id} className="border border-slate-300 rounded overflow-hidden bg-slate-900">
                <div className="aspect-4/3 flex items-center justify-center overflow-hidden">
                  <img
                    src={img.dataUrl}
                    alt={img.label}
                    style={{ transform: `rotate(${img.rotation}deg)` }}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="p-1.5 bg-white border-t border-slate-200 text-center">
                  <p className="text-[10px] font-semibold text-slate-800 truncate">
                    Fig {idx + 1}: {img.label || 'Bronchoscopy View'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Doctor Sign-off Footer Block */}
      <div className="mt-8 pt-4 border-t-2 border-slate-900 flex items-end justify-between avoid-break">
        <div>
          <p className="text-[10px] text-slate-500 font-mono">Report ID: {report.reportNumber}</p>
          <p className="text-[10px] text-slate-500">Status: {report.status.toUpperCase()}</p>
          <p className="text-[10px] text-slate-400 mt-1">Generated by Digital Bronchoscopy System</p>
        </div>

        <div className="text-right">
          {doctor?.signatureUrl ? (
            <img
              src={doctor.signatureUrl}
              alt="Doctor Signature"
              className="h-10 ml-auto object-contain mb-1"
            />
          ) : (
            <div className="h-8" />
          )}
          <p className="text-xs font-bold text-slate-900">{doctor?.name || report.consultedBy}</p>
          <p className="text-[11px] text-slate-600">{doctor?.designation || 'Consultant Pulmonologist'}</p>
          <p className="text-[10px] text-slate-500">{doctor?.credentials || 'MD, DM Pulmonology'}</p>
        </div>
      </div>
    </div>
  );
};
