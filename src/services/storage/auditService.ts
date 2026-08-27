import { getDB } from './db';
import type { AuditLog } from '../../types';

export const auditService = {
  async log(
    action: AuditLog['action'],
    reportId?: string,
    details?: string,
    user: string = 'Current Doctor'
  ): Promise<void> {
    try {
      const db = await getDB();
      const logEntry: AuditLog = {
        id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        reportId,
        action,
        user,
        timestamp: new Date().toISOString(),
        details,
      };
      await db.put('audit_logs', logEntry);
    } catch (err) {
      console.error('Failed to log audit event', err);
    }
  },

  async getAllLogs(): Promise<AuditLog[]> {
    const db = await getDB();
    const logs = await db.getAllFromIndex('audit_logs', 'by-timestamp');
    return logs.reverse(); // Latest first
  },

  async getLogsByReportId(reportId: string): Promise<AuditLog[]> {
    const db = await getDB();
    return db.getAllFromIndex('audit_logs', 'by-reportId', reportId);
  },
};
