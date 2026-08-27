import React, { useState, useEffect } from 'react';
import { seedInitialDataIfNeeded } from './utils/seedData';
import { Dashboard } from './components/dashboard/Dashboard';
import { ReportEditor } from './components/reports/ReportEditor';
import { PatientHistoryModal } from './components/patients/PatientHistoryModal';
import { HospitalSettingsModal } from './components/settings/HospitalSettingsModal';
import { DoctorProfilesModal } from './components/settings/DoctorProfilesModal';
import { TemplatesModal } from './components/templates/TemplatesModal';
import { AuditLogsModal } from './components/audit/AuditLogsModal';
import { reportRepository } from './services/storage/reportRepository';

export const App: React.FC = () => {
  const [view, setView] = useState<'dashboard' | 'editor'>('dashboard');
  const [activeReportId, setActiveReportId] = useState<string | null>(null);

  // Modals state
  const [isPatientsOpen, setIsPatientsOpen] = useState(false);
  const [isHospitalSettingsOpen, setIsHospitalSettingsOpen] = useState(false);
  const [isDoctorSettingsOpen, setIsDoctorSettingsOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isAuditLogsOpen, setIsAuditLogsOpen] = useState(false);

  useEffect(() => {
    seedInitialDataIfNeeded();
  }, []);

  const handleOpenReport = (reportId: string) => {
    setActiveReportId(reportId);
    setView('editor');
  };

  const handleApplyTemplate = async (template: any) => {
    if (!activeReportId) return;
    const currentReport = await reportRepository.getById(activeReportId);
    if (!currentReport) return;

    const updated = {
      ...currentReport,
      findings: template.defaultFindings || currentReport.findings,
      premedication: template.defaultPremedication || currentReport.premedication,
      sedation: template.defaultSedation || currentReport.sedation,
      route: template.defaultRoute || currentReport.route,
      impression: template.defaultImpression || currentReport.impression,
      advice: template.defaultAdvice || currentReport.advice,
    };

    await reportRepository.save(updated);
    // Force re-render of editor
    setActiveReportId(null);
    setTimeout(() => setActiveReportId(currentReport.id), 50);
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 selection:bg-sky-500 selection:text-white">
      {view === 'dashboard' ? (
        <Dashboard
          onNewReport={(id) => handleOpenReport(id)}
          onOpenReport={(id) => handleOpenReport(id)}
          onOpenPatients={() => setIsPatientsOpen(true)}
          onOpenHospitalSettings={() => setIsHospitalSettingsOpen(true)}
          onOpenDoctorSettings={() => setIsDoctorSettingsOpen(true)}
          onOpenAuditLogs={() => setIsAuditLogsOpen(true)}
        />
      ) : (
        activeReportId && (
          <ReportEditor
            reportId={activeReportId}
            onBack={() => {
              setView('dashboard');
              setActiveReportId(null);
            }}
            onOpenTemplates={() => setIsTemplatesOpen(true)}
          />
        )
      )}

      {/* Shared Global Modals */}
      <PatientHistoryModal
        isOpen={isPatientsOpen}
        onClose={() => setIsPatientsOpen(false)}
        onSelectReport={(reportId) => handleOpenReport(reportId)}
      />

      <HospitalSettingsModal
        isOpen={isHospitalSettingsOpen}
        onClose={() => setIsHospitalSettingsOpen(false)}
        onSaved={() => {}}
      />

      <DoctorProfilesModal
        isOpen={isDoctorSettingsOpen}
        onClose={() => setIsDoctorSettingsOpen(false)}
        onSaved={() => {}}
      />

      <TemplatesModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onApplyTemplate={handleApplyTemplate}
      />

      <AuditLogsModal
        isOpen={isAuditLogsOpen}
        onClose={() => setIsAuditLogsOpen(false)}
      />
    </div>
  );
};

export default App;
