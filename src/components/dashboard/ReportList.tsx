import React from 'react';
import { Edit3, Eye, FileSpreadsheet, Trash2, FileText } from 'lucide-react';
import type { Report, HospitalProfile, DoctorProfile } from '../../types';
import { Badge } from '../ui/Badge';
import { exportReportToDocx } from '../../services/documents/docxExporter';

interface ReportListProps {
  reports: Report[];
  onOpenReport: (id: string) => void;
  onDeleteReport: (id: string) => void;
  hospital: HospitalProfile | null;
  doctors: DoctorProfile[];
}

export const ReportList: React.FC<ReportListProps> = ({
  reports,
  onOpenReport,
  onDeleteReport,
  hospital,
  doctors,
}) => {
  if (reports.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 shadow-xs">
        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-800">No medical reports found</h3>
        <p className="text-xs text-slate-500 mt-1">
          Create a new digital bronchoscopy report to begin clinical documentation.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
              <th className="py-3 px-4">Report ID</th>
              <th className="py-3 px-4">Patient ID & Name</th>
              <th className="py-3 px-4">Procedure</th>
              <th className="py-3 px-4">Visit Date</th>
              <th className="py-3 px-4">Attending Doctor</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs">
            {reports.map((report) => {
              const doc = doctors.find((d) => d.id === report.doctorId);
              return (
                <tr
                  key={report.id}
                  className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  onClick={() => onOpenReport(report.id)}
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                    {report.reportNumber}
                    {report.version > 1 && (
                      <span className="ml-1 text-[10px] text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200">
                        v{report.version}
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">{report.patientName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {report.patientId} • {report.patientAge}y / {report.patientGender}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-medium text-slate-700 max-w-[180px] truncate">
                    {report.procedureName}
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                    {report.visitDate}
                  </td>

                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    {doc?.name || report.consultedBy || 'Attending Physician'}
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <Badge status={report.status} />
                  </td>

                  <td
                    className="py-3.5 px-4 text-right whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onOpenReport(report.id)}
                        className="p-1.5 text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                        title={report.status === 'Draft' ? 'Edit Draft' : 'View Report'}
                      >
                        {report.status === 'Draft' ? (
                          <Edit3 className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => hospital && exportReportToDocx(report, hospital, doc)}
                        className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Export Word (.docx)"
                      >
                        <FileSpreadsheet className="w-4 h-4" />
                      </button>

                      {report.status === 'Draft' && (
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete draft report ${report.reportNumber}?`)) {
                              onDeleteReport(report.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Draft"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
