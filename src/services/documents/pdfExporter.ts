import type { Report } from '../../types';
import { auditService } from '../storage/auditService';

export async function printReport(): Promise<void> {
  window.print();
}

export async function exportReportToPdf(report: Report): Promise<void> {
  window.print();

  await auditService.log(
    'Report Exported PDF',
    report.id,
    `Triggered PDF / Print export for report ${report.reportNumber}`
  );
}
