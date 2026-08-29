import React, { useState, useEffect } from 'react';
import {
  Plus,
  FileText,
  Users,
  Building2,
  UserCheck,
  Download,
  Upload,
  ShieldCheck,
} from 'lucide-react';
import type { Report, ReportFilter, HospitalProfile, DoctorProfile } from '../../types';
import { reportRepository } from '../../services/storage/reportRepository';
import { hospitalRepository } from '../../services/storage/hospitalRepository';
import { doctorRepository } from '../../services/storage/doctorRepository';
import { createDefaultFindings } from '../../services/storage/templateRepository';
import { backupService } from '../../services/storage/backupService';
import { Button } from '../ui/Button';
import { StatsCards } from './StatsCards';
import { FilterBar } from './FilterBar';
import { ReportList } from './ReportList';

interface DashboardProps {
  onNewReport: (reportId: string) => void;
  onOpenReport: (reportId: string) => void;
  onOpenPatients: () => void;
  onOpenHospitalSettings: () => void;
  onOpenDoctorSettings: () => void;
  onOpenAuditLogs: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNewReport,
  onOpenReport,
  onOpenPatients,
  onOpenHospitalSettings,
  onOpenDoctorSettings,
  onOpenAuditLogs,
}) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [allReports, setAllReports] = useState<Report[]>([]);
  const [hospital, setHospital] = useState<HospitalProfile | null>(null);
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);

  const [filter, setFilter] = useState<ReportFilter>({
    searchQuery: '',
    status: 'All',
    doctorId: 'All',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const list = await reportRepository.getAll();
    setAllReports(list);
    const h = await hospitalRepository.getProfile();
    setHospital(h);
    const d = await doctorRepository.getAll();
    setDoctors(d);
  };

  useEffect(() => {
    reportRepository.search(filter).then(setReports);
  }, [filter, allReports]);

  const handleCreateNewReport = async () => {
    const nextReportNum = await reportRepository.generateNextReportNumber();
    const defaultDoc = doctors.find((d) => d.isDefault) || doctors[0];
    const today = new Date().toISOString().split('T')[0];

    const newReport: Report = {
      id: `rep-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      reportNumber: nextReportNum,
      patientId: '',
      patientName: '',
      patientAge: '',
      patientGender: 'Male',
      visitDate: today,
      referredBy: '',
      consultedBy: defaultDoc?.name || '',
      doctorId: defaultDoc?.id || '',
      procedureName: 'Flexible Fiberoptic Bronchoscopy',
      premedication: 'Lignocaine 2% spray',
      sedation: 'Midazolam 2mg IV',
      route: 'Oral',
      ctFindings: '',
      indication: '',
      findings: createDefaultFindings(),
      bal: { done: false, sampleSite: '', specimenTests: '', notes: '' },
      endobronchialBiopsy: { done: false, site: '', specimenNotes: '' },
      conventionalTbna: { done: false, stationSite: '', specimenTests: '', notes: '' },
      brushing: { done: false, site: '', notes: '' },
      interventionsText: '',
      impression: '',
      advice: '1. Observe for 2 hours post-procedure.\n2. NPO for 2 hours until gag reflex recovers.',
      images: [],
      status: 'Draft',
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const saved = await reportRepository.save(newReport);
    onNewReport(saved.id);
  };

  const handleDeleteReport = async (id: string) => {
    await reportRepository.delete(id);
    loadData();
  };

  const handleBackupExport = async () => {
    await backupService.downloadBackup();
  };

  const handleBackupImport = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const json = JSON.parse(reader.result as string);
        await backupService.restoreBackup(json);
        alert('Database restored successfully from backup!');
        loadData();
      } catch {
        alert('Failed to restore backup file. Invalid format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="bg-slate-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-600 rounded-xl text-white shadow-xs">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">
                {hospital?.name || 'Pulmonology Report System'}
              </h1>
              <p className="text-xs text-sky-300 font-medium">
                {hospital?.department || 'Department of Pulmonology'}
              </p>
            </div>
          </div>

          {/* Quick Management Triggers */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:text-white hover:bg-slate-800"
              icon={<Users className="w-4 h-4 text-sky-400" />}
              onClick={onOpenPatients}
            >
              Patient Directory
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:text-white hover:bg-slate-800"
              icon={<UserCheck className="w-4 h-4 text-emerald-400" />}
              onClick={onOpenDoctorSettings}
            >
              Doctors
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:text-white hover:bg-slate-800"
              icon={<Building2 className="w-4 h-4 text-amber-400" />}
              onClick={onOpenHospitalSettings}
            >
              Hospital Settings
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:text-white hover:bg-slate-800"
              icon={<ShieldCheck className="w-4 h-4 text-purple-400" />}
              onClick={onOpenAuditLogs}
            >
              Audit Logs
            </Button>

            {/* Create New Report */}
            <Button
              type="button"
              variant="primary"
              size="md"
              icon={<Plus className="w-4 h-4" />}
              onClick={handleCreateNewReport}
            >
              New Bronchoscopy Report
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        {/* Metric Summary Cards */}
        <StatsCards reports={allReports} />

        {/* Filter and Search Bar */}
        <FilterBar
          filter={filter}
          onChange={setFilter}
          doctors={doctors}
          onReset={() => setFilter({ searchQuery: '', status: 'All', doctorId: 'All' })}
        />

        {/* Interactive Reports Table */}
        <ReportList
          reports={reports}
          onOpenReport={onOpenReport}
          onDeleteReport={handleDeleteReport}
          hospital={hospital}
          doctors={doctors}
        />

        {/* Footer Backup & Data Protection Utility */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            <p className="font-semibold text-slate-700">Digital Medical Procedure Reporting System</p>
            <p className="text-[11px] text-slate-400">
              Data stored locally in high-performance IndexedDB browser storage.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleBackupExport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-sky-600" /> Export Backup (.json)
            </button>

            <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5 text-emerald-600" /> Restore Backup
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleBackupImport(e.target.files[0])}
              />
            </label>
          </div>
        </div>
      </main>
    </div>
  );
};
