import { getDB } from './db';
import type { Report, ReportFilter } from '../../types';
import { patientRepository } from './patientRepository';
import { hospitalRepository } from './hospitalRepository';
import { auditService } from './auditService';
import { imageStorage } from './imageStorage';

export interface ReportRepository {
  getAll(): Promise<Report[]>;
  getById(id: string): Promise<Report | null>;
  getByReportNumber(reportNumber: string): Promise<Report | null>;
  getByPatientId(patientId: string): Promise<Report[]>;
  search(filter: ReportFilter): Promise<Report[]>;
  save(report: Report): Promise<Report>;
  finalize(id: string): Promise<Report>;
  amend(id: string): Promise<Report>;
  delete(id: string): Promise<void>;
  generateNextReportNumber(): Promise<string>;
}

export const reportRepository: ReportRepository = {
  async getAll(): Promise<Report[]> {
    const db = await getDB();
    const reports = await db.getAll('reports');
    return reports.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  },

  async getById(id: string): Promise<Report | null> {
    const db = await getDB();
    const report = await db.get('reports', id);
    if (!report) return null;
    const images = await imageStorage.getImagesByReportId(report.id);
    return { ...report, images };
  },

  async getByReportNumber(reportNumber: string): Promise<Report | null> {
    const db = await getDB();
    const report = await db.getFromIndex('reports', 'by-reportNumber', reportNumber);
    if (!report) return null;
    const images = await imageStorage.getImagesByReportId(report.id);
    return { ...report, images };
  },

  async getByPatientId(patientId: string): Promise<Report[]> {
    const db = await getDB();
    const reports = await db.getAllFromIndex('reports', 'by-patientId', patientId);
    return reports.sort(
      (a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime()
    );
  },

  async search(filter: ReportFilter): Promise<Report[]> {
    const db = await getDB();
    let reports = await db.getAll('reports');

    const { searchQuery, status, doctorId, startDate, endDate } = filter;

    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      reports = reports.filter(
        (r) =>
          r.reportNumber.toLowerCase().includes(q) ||
          r.patientId.toLowerCase().includes(q) ||
          r.patientName.toLowerCase().includes(q) ||
          r.consultedBy.toLowerCase().includes(q) ||
          r.referredBy.toLowerCase().includes(q) ||
          r.impression.toLowerCase().includes(q)
      );
    }

    if (status && status !== 'All') {
      reports = reports.filter((r) => r.status === status);
    }

    if (doctorId && doctorId !== 'All') {
      reports = reports.filter((r) => r.doctorId === doctorId);
    }

    if (startDate) {
      reports = reports.filter((r) => r.visitDate >= startDate);
    }

    if (endDate) {
      reports = reports.filter((r) => r.visitDate <= endDate);
    }

    return reports.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  },

  async save(report: Report): Promise<Report> {
    const db = await getDB();
    const now = new Date().toISOString();
    const existing = await db.get('reports', report.id);

    const isNew = !existing;
    const updatedReport: Report = {
      ...report,
      createdAt: existing ? existing.createdAt : now,
      updatedAt: now,
    };

    await db.put('reports', updatedReport);

    if (updatedReport.images && updatedReport.images.length > 0) {
      await imageStorage.saveImages(updatedReport.images);
    }

    if (updatedReport.patientId) {
      const patient = await patientRepository.getByPatientId(updatedReport.patientId);
      if (patient) {
        await patientRepository.save({
          ...patient,
          name: updatedReport.patientName || patient.name,
          age: updatedReport.patientAge || patient.age,
          gender: updatedReport.patientGender || patient.gender,
        });
      } else {
        await patientRepository.save({
          id: `pat-${Date.now()}`,
          patientId: updatedReport.patientId,
          name: updatedReport.patientName || 'Unknown Patient',
          age: updatedReport.patientAge || '',
          gender: updatedReport.patientGender || 'Other',
          createdAt: now,
          updatedAt: now,
        });
      }
    }

    await auditService.log(
      isNew ? 'Report Created' : 'Report Updated',
      updatedReport.id,
      `Report ${updatedReport.reportNumber} (${updatedReport.status}) for patient ${updatedReport.patientId}`
    );

    return updatedReport;
  },

  async finalize(id: string): Promise<Report> {
    const report = await this.getById(id);
    if (!report) throw new Error(`Report ${id} not found`);

    const now = new Date().toISOString();
    const finalizedReport: Report = {
      ...report,
      status: 'Completed',
      finalizedAt: now,
      updatedAt: now,
    };

    const db = await getDB();
    await db.put('reports', finalizedReport);

    await auditService.log(
      'Report Finalized',
      id,
      `Report ${finalizedReport.reportNumber} finalized at ${now}`
    );

    return finalizedReport;
  },

  async amend(id: string): Promise<Report> {
    const original = await this.getById(id);
    if (!original) throw new Error(`Original report ${id} not found`);

    const now = new Date().toISOString();
    const newVersionNumber = (original.version || 1) + 1;
    const amendedReport: Report = {
      ...original,
      id: `rep-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      reportNumber: `${original.reportNumber}-v${newVersionNumber}`,
      status: 'Draft',
      version: newVersionNumber,
      parentReportId: original.id,
      createdAt: now,
      updatedAt: now,
      finalizedAt: undefined,
      images: original.images.map((img) => ({
        ...img,
        id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      })),
    };

    await this.save(amendedReport);

    await auditService.log(
      'Report Amended',
      amendedReport.id,
      `Created amended version v${newVersionNumber} from report ${original.reportNumber}`
    );

    return amendedReport;
  },

  async delete(id: string): Promise<void> {
    const report = await this.getById(id);
    if (!report) return;

    const db = await getDB();
    await db.delete('reports', id);
    await imageStorage.deleteImagesByReportId(id);

    await auditService.log(
      'Report Deleted',
      id,
      `Deleted report ${report.reportNumber} (Patient: ${report.patientId})`
    );
  },

  async generateNextReportNumber(): Promise<string> {
    const hospital = await hospitalRepository.getProfile();
    const prefix = hospital.reportPrefix || 'BR-2026-';
    const db = await getDB();
    const all = await db.getAll('reports');

    let maxNum = 0;
    for (const r of all) {
      if (r.reportNumber && r.reportNumber.startsWith(prefix)) {
        const numPart = r.reportNumber.replace(prefix, '').split('-')[0];
        const parsed = parseInt(numPart, 10);
        if (!isNaN(parsed) && parsed > maxNum) {
          maxNum = parsed;
        }
      }
    }

    const nextNum = (maxNum + 1).toString().padStart(6, '0');
    return `${prefix}${nextNum}`;
  },
};
