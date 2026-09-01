import type { Report } from '../../types';
import { auditService } from '../storage/auditService';

export async function printReport(report?: Pick<Report, 'reportNumber' | 'procedureName'>): Promise<void> {
  const previousTitle = document.title;
  const printTitle = report
    ? `${report.reportNumber} — ${report.procedureName || 'Bronchoscopy Report'}`
    : 'Bronchoscopy Report';

  document.title = printTitle;
  const restoreTitle = () => {
    document.title = previousTitle;
  };

  window.addEventListener('afterprint', restoreTitle, { once: true });
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
