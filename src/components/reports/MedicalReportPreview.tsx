import React, { useEffect, useState } from 'react';
import type { BronchoscopyFinding, DoctorProfile, HospitalProfile, Report } from '../../types';
import { doctorRepository } from '../../services/storage/doctorRepository';
import { hospitalRepository } from '../../services/storage/hospitalRepository';

interface MedicalReportPreviewProps {
  report: Report;
}

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="report-section-title">{children}</h3>
);

const FindingsTable: React.FC<{ findings: BronchoscopyFinding[] }> = ({ findings }) => (
  <table className="findings-table">
    <thead>
      <tr>
        <th>Anatomical location</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      {findings.map((finding) => (
        <tr key={finding.id || finding.anatomicalLocation}>
          <td>
            <span className="finding-location">{finding.anatomicalLocation}</span>
          </td>
          <td>
            <span className={`finding-status ${finding.findingType === 'Normal' ? 'is-normal' : 'is-abnormal'}`}>
              {finding.findingType !== 'Normal' && finding.customText
                ? finding.customText
                : finding.findingType === 'Normal' && finding.anatomicalLocation === 'Tracheobronchial Tree'
                  ? 'Normal TBT'
                  : finding.findingType}
            </span>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export const MedicalReportPreview: React.FC<MedicalReportPreviewProps> = ({ report }) => {
  const [hospital, setHospital] = useState<HospitalProfile | null>(null);
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);

  useEffect(() => {
    hospitalRepository.getProfile().then(setHospital);
    if (report.doctorId) doctorRepository.getById(report.doctorId).then(setDoctor);
  }, [report.doctorId]);

  if (!hospital) return <div className="p-8 text-center text-slate-500">Loading report preview...</div>;

  const findingSplit = Math.ceil(report.findings.length / 2);
  const imageCount = report.images.length;
  const imageColumns = imageCount <= 4 ? Math.max(imageCount, 1) : 5;
  const imageHeight = imageCount <= 5 ? '26mm' : imageCount <= 10 ? '20mm' : '17mm';

  return (
    <article className="a4-container report-document bg-white text-slate-900 shadow-xl border border-slate-300 max-w-[210mm] mx-auto my-4 font-sans">
      <header className="report-header">
        <h1>{hospital.name}</h1>
        <p className="report-department">{hospital.department}</p>
        <p className="report-contact">{hospital.address} &nbsp;|&nbsp; Phone: {hospital.contactPhone}</p>
      </header>

      <div className="report-title">{report.procedureName || 'Flexible Fiberoptic Bronchoscopy'}</div>

      <section className="report-info-card report-keep-together" aria-label="Patient and visit information">
        <div><span>Patient ID</span><strong>{report.patientId || '—'}</strong></div>
        <div><span>Visit date</span><strong>{report.visitDate || '—'}</strong></div>
        <div><span>Patient name</span><strong>{report.patientName || '—'}</strong></div>
        <div><span>Referred by</span><strong>{report.referredBy || '—'}</strong></div>
        <div><span>Age / Gender</span><strong>{report.patientAge || '—'} / {report.patientGender}</strong></div>
        <div><span>Consulted by</span><strong>{report.consultedBy || doctor?.name || '—'}</strong></div>
      </section>

      <section className="report-procedure report-keep-together">
        <SectionTitle>Procedure details</SectionTitle>
        <div className="procedure-grid">
          <div><span>Premedication</span><strong>{report.premedication || 'None'}</strong></div>
          <div><span>Sedation</span><strong>{report.sedation || 'None'}</strong></div>
          <div><span>Route</span><strong>{report.route === 'Other' ? report.routeCustom || 'Other' : report.route}</strong></div>
        </div>
      </section>

      <section className="clinical-grid report-keep-together">
        <div className="clinical-card">
          <SectionTitle>Clinical indication</SectionTitle>
          <p className={report.indication ? '' : 'is-empty'}>{report.indication || 'No clinical indication recorded.'}</p>
        </div>
        <div className="clinical-card">
          <SectionTitle>Radiological findings</SectionTitle>
          <p className={report.ctFindings ? '' : 'is-empty'}>{report.ctFindings || 'No radiological findings recorded.'}</p>
        </div>
      </section>

      <section className="report-section report-keep-together">
        <SectionTitle>Bronchoscopic anatomical findings</SectionTitle>
        <div className="findings-grid">
          <FindingsTable findings={report.findings.slice(0, findingSplit)} />
          <FindingsTable findings={report.findings.slice(findingSplit)} />
        </div>
      </section>

      {imageCount > 0 && (
        <section className="report-section report-images">
          <SectionTitle>Medical bronchoscopy images</SectionTitle>
          <div className="image-grid" style={{ gridTemplateColumns: `repeat(${imageColumns}, minmax(0, 1fr))` }}>
            {report.images.map((image, index) => (
              <figure key={image.id} className="report-image">
                <div className="report-image-frame" style={{ height: imageHeight }}>
                  <img
                    src={image.dataUrl}
                    alt={image.label || `Bronchoscopy image ${index + 1}`}
                    style={{ transform: `rotate(${image.rotation}deg)` }}
                  />
                </div>
                <figcaption>Fig. {index + 1}{image.label ? ` · ${image.label}` : ''}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      <section className="report-section report-keep-together">
        <SectionTitle>Interventions &amp; sample collection</SectionTitle>
        <p className={`report-text-block ${report.interventionsText ? '' : 'is-empty'}`}>
          {report.interventionsText || 'No interventions or samples recorded.'}
        </p>
      </section>

      <section className="impression-grid report-keep-together">
        <div className="impression-card">
          <SectionTitle>Impression</SectionTitle>
          <p>{report.impression || 'No impression entered.'}</p>
        </div>
        <div className="advice-card">
          <SectionTitle>Advice</SectionTitle>
          <p>{report.advice || 'Standard post-bronchoscopy care.'}</p>
        </div>
      </section>

      <footer className="report-footer report-keep-together">
        <div className="report-metadata">
          <p><strong>Report no.</strong> {report.reportNumber}</p>
          <p><strong>Procedure date</strong> {report.visitDate || '—'}</p>
          <p><strong>Status</strong> {report.status}</p>
        </div>
        <div className="consultant-block">
          {doctor?.signatureUrl && <img src={doctor.signatureUrl} alt="Consultant signature" />}
          <p className="consultant-name">{doctor?.name || report.consultedBy || '—'}</p>
          <p>{doctor?.designation || 'Consultant Pulmonologist'}</p>
          <p>{doctor?.credentials || 'MD, DM Pulmonology'}</p>
        </div>
      </footer>
    </article>
  );
};
