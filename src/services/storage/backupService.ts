import { getDB } from './db';
import { auditService } from './auditService';
import type { AuditLog, DoctorProfile, HospitalProfile, MedicalImage, Patient, Report, ReportTemplate } from '../../types';

export interface BackupData {
  version: string;
  exportedAt: string;
  system: string;
  data: {
    reports: Report[];
    images: MedicalImage[];
    patients: Patient[];
    doctors: DoctorProfile[];
    hospital: HospitalProfile[];
    templates: ReportTemplate[];
    audit_logs: AuditLog[];
  };
}

export const backupService = {
  async createBackup(): Promise<BackupData> {
    const db = await getDB();
    const reports = await db.getAll('reports');
    const images = await db.getAll('images');
    const patients = await db.getAll('patients');
    const doctors = await db.getAll('doctors');
    const hospital = await db.getAll('hospital');
    const templates = await db.getAll('templates');
    const audit_logs = await db.getAll('audit_logs');

    const backup: BackupData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      system: 'Digital Bronchoscopy / Pulmonology Procedure Report System',
      data: {
        reports,
        images,
        patients,
        doctors,
        hospital,
        templates,
        audit_logs,
      },
    };

    await auditService.log(
      'Backup Exported',
      undefined,
      `Exported database backup containing ${reports.length} reports, ${images.length} images, and ${patients.length} patients`
    );

    return backup;
  },

  async downloadBackup(): Promise<void> {
    const backup = await this.createBackup();
    const jsonStr = JSON.stringify(backup, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const dateStr = new Date().toISOString().slice(0, 10);

    const link = document.createElement('a');
    link.href = url;
    link.download = `pulmonology_reports_backup_${dateStr}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  async restoreBackup(backupJson: BackupData): Promise<{ success: boolean; count: number }> {
    if (!backupJson.data || !backupJson.system || !Array.isArray(backupJson.data.reports)) {
      throw new Error('Invalid backup file format.');
    }

    const db = await getDB();
    const { reports, images, patients, doctors, hospital, templates, audit_logs } =
      backupJson.data;

    // Restore Reports
    const txReports = db.transaction('reports', 'readwrite');
    for (const r of reports || []) {
      await txReports.store.put(r);
    }
    await txReports.done;

    // Restore Images
    const txImages = db.transaction('images', 'readwrite');
    for (const img of images || []) {
      await txImages.store.put(img);
    }
    await txImages.done;

    // Restore Patients
    const txPatients = db.transaction('patients', 'readwrite');
    for (const p of patients || []) {
      await txPatients.store.put(p);
    }
    await txPatients.done;

    // Restore Doctors
    const txDoctors = db.transaction('doctors', 'readwrite');
    for (const d of doctors || []) {
      await txDoctors.store.put(d);
    }
    await txDoctors.done;

    // Restore Hospital
    const txHospital = db.transaction('hospital', 'readwrite');
    for (const h of hospital || []) {
      await txHospital.store.put(h);
    }
    await txHospital.done;

    // Restore Templates
    const txTemplates = db.transaction('templates', 'readwrite');
    for (const t of templates || []) {
      await txTemplates.store.put(t);
    }
    await txTemplates.done;

    // Restore Audit Logs
    const txAudit = db.transaction('audit_logs', 'readwrite');
    for (const a of audit_logs || []) {
      await txAudit.store.put(a);
    }
    await txAudit.done;

    await auditService.log(
      'Backup Restored',
      undefined,
      `Restored database from backup file dated ${backupJson.exportedAt}`
    );

    return { success: true, count: (reports || []).length };
  },
};
