import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Printer,
  FileSpreadsheet,
  CheckCircle,
  Eye,
  Edit3,
  FileText,
  User,
  Activity,
  Stethoscope,
  Eye as EyeIcon,
  Syringe,
  Image as ImageIcon,
  ClipboardCheck,
  Award,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import type { Report, HospitalProfile, DoctorProfile } from '../../types';
import { reportRepository } from '../../services/storage/reportRepository';
import { hospitalRepository } from '../../services/storage/hospitalRepository';
import { doctorRepository } from '../../services/storage/doctorRepository';
import { exportReportToDocx } from '../../services/documents/docxExporter';
import { printReport } from '../../services/documents/pdfExporter';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { SaveStatus } from './SaveStatus';
import { FinalizeModal } from './FinalizeModal';
import { MedicalReportPreview } from './MedicalReportPreview';

import { PatientSection } from './sections/PatientSection';
import { VisitSection } from './sections/VisitSection';
import { ProcedureSection } from './sections/ProcedureSection';
import { CTFindingsSection } from './sections/CTFindingsSection';
import { IndicationSection } from './sections/IndicationSection';
import { BronchoscopyFindingsSection } from './sections/BronchoscopyFindingsSection';
import { InterventionsSection } from './sections/InterventionsSection';
import { MedicalImagesSection } from './sections/MedicalImagesSection';
import { ImpressionAdviceSection } from './sections/ImpressionAdviceSection';
import { DoctorSection } from './sections/DoctorSection';

interface ReportEditorProps {
  reportId: string;
  onBack: () => void;
  onOpenTemplates: () => void;
}

const SECTIONS = [
  { id: 'section-patient', label: 'Patient Information', icon: User },
  { id: 'section-visit', label: 'Visit & Referral', icon: Activity },
  { id: 'section-procedure', label: 'Procedure Details', icon: Stethoscope },
  { id: 'section-ct', label: 'Radiological Finding', icon: FileText },
  { id: 'section-indication', label: 'Clinical Indication', icon: Stethoscope },
  { id: 'section-findings', label: 'Bronchoscopy Findings', icon: EyeIcon },
  { id: 'section-interventions', label: 'Interventions / Samples', icon: Syringe },
  { id: 'section-images', label: 'Medical Images', icon: ImageIcon },
  { id: 'section-impression', label: 'Impression & Advice', icon: ClipboardCheck },
  { id: 'section-doctor', label: 'Doctor Sign-off', icon: Award },
];

export const ReportEditor: React.FC<ReportEditorProps> = ({
  reportId,
  onBack,
  onOpenTemplates,
}) => {
  const [report, setReport] = useState<Report | null>(null);
  const [hospital, setHospital] = useState<HospitalProfile | null>(null);
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [isFinalizeOpen, setIsFinalizeOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('section-patient');

  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    reportRepository.getById(reportId).then((r) => {
      if (r) {
        setReport(r);
        if (r.updatedAt) {
          setLastSavedAt(new Date(r.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }
      }
    });

    hospitalRepository.getProfile().then(setHospital);
  }, [reportId]);

  useEffect(() => {
    if (report?.doctorId) {
      doctorRepository.getById(report.doctorId).then(setDoctor);
    }
  }, [report?.doctorId]);

  const triggerAutosave = (updatedReport: Report) => {
    setSaveState('saving');
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);

    autosaveTimerRef.current = setTimeout(async () => {
      try {
        await reportRepository.save(updatedReport);
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setSaveState('saved');
        setLastSavedAt(now);
        setTimeout(() => setSaveState('idle'), 2000);
      } catch {
        setSaveState('error');
      }
    }, 1200);
  };

  const handleReportChange = (updates: Partial<Report>) => {
    if (!report) return;
    const updated = { ...report, ...updates };
    setReport(updated);
    if (report.status === 'Draft') {
      triggerAutosave(updated);
    }
  };

  const handleFinalizeConfirm = async () => {
    if (!report) return;
    const finalized = await reportRepository.finalize(report.id);
    setReport(finalized);
  };

  const handleAmend = async () => {
    if (!report) return;
    const amended = await reportRepository.amend(report.id);
    setReport(amended);
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!report) {
    return <div className="p-12 text-center text-slate-500">Loading Clinical Report...</div>;
  }

  return (
    <div className="report-editor-page min-h-screen bg-slate-100 flex flex-col">
      {/* Action Header */}
      <header className="sticky top-0 z-30 bg-slate-900 text-white shadow-md no-print">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Back & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Return to Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight text-white">
                  {report.reportNumber}
                </h2>
                <Badge status={report.status} />
                {report.version > 1 && (
                  <span className="text-[10px] bg-slate-800 text-sky-300 font-semibold px-2 py-0.5 rounded">
                    v{report.version}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Patient: <span className="text-slate-200 font-medium">{report.patientName || 'New Patient'}</span> ({report.patientId || 'Unspecified'})
              </p>
            </div>
          </div>

          {/* Center Autosave State */}
          <div className="hidden sm:block">
            <SaveStatus status={saveState} lastSavedAt={lastSavedAt} />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {report.status === 'Draft' && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-slate-300 hover:text-white hover:bg-slate-800"
                icon={<Sparkles className="w-4 h-4 text-amber-400" />}
                onClick={onOpenTemplates}
              >
                Apply Template
              </Button>
            )}

            <Button
              type="button"
              variant={isPreview ? 'primary' : 'outline'}
              size="sm"
              icon={isPreview ? <Edit3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              onClick={() => setIsPreview(!isPreview)}
            >
              {isPreview ? 'Back to Editor' : 'A4 Preview'}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              icon={<FileSpreadsheet className="w-4 h-4 text-blue-600" />}
              onClick={() => hospital && exportReportToDocx(report, hospital, doctor)}
            >
              Word (.docx)
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              icon={<Printer className="w-4 h-4 text-slate-700" />}
              onClick={() => printReport(report)}
            >
              Print / PDF
            </Button>

            {report.status === 'Draft' ? (
              <Button
                type="button"
                variant="success"
                size="sm"
                icon={<CheckCircle className="w-4 h-4" />}
                onClick={() => setIsFinalizeOpen(true)}
              >
                Finalize Report
              </Button>
            ) : (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                icon={<RefreshCw className="w-4 h-4 text-sky-400" />}
                onClick={handleAmend}
              >
                Amend Report (v{report.version + 1})
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Content Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 print:p-0 print:m-0 print:max-w-none">
        {/* Editor Form View (Visible on screen when not preview, hidden during print) */}
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 w-full ${isPreview ? 'hidden' : 'print:hidden'}`}>
          <aside className="lg:col-span-3 hidden lg:block sticky top-20 h-fit space-y-1 bg-white p-3 rounded-xl border border-slate-200 shadow-xs editor-sidebar no-print">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 block mb-2">
              Report Sections
            </span>
            {SECTIONS.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2.5 transition-all ${
                    isActive
                      ? 'bg-sky-50 text-sky-700 font-semibold border-l-4 border-sky-600'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                  <span>{sec.label}</span>
                </button>
              );
            })}
          </aside>

          <main className="lg:col-span-9 space-y-6">
            <PatientSection report={report} onChange={handleReportChange} />
            <VisitSection report={report} onChange={handleReportChange} />
            <ProcedureSection report={report} onChange={handleReportChange} />
            <CTFindingsSection report={report} onChange={handleReportChange} />
            <IndicationSection report={report} onChange={handleReportChange} />
            <BronchoscopyFindingsSection report={report} onChange={handleReportChange} />
            <InterventionsSection report={report} onChange={handleReportChange} />
            <MedicalImagesSection report={report} onChange={handleReportChange} />
            <ImpressionAdviceSection report={report} onChange={handleReportChange} />
            <DoctorSection report={report} />
          </main>
        </div>

        {/* A4 Preview & Print View (Always printed when window.print is called, visible when isPreview is true) */}
        <div className={`w-full ${isPreview ? 'block' : 'hidden print:block'}`}>
          <MedicalReportPreview report={report} />
        </div>
      </div>

      <FinalizeModal
        isOpen={isFinalizeOpen}
        onClose={() => setIsFinalizeOpen(false)}
        onConfirm={handleFinalizeConfirm}
        reportNumber={report.reportNumber}
      />
    </div>
  );
};
