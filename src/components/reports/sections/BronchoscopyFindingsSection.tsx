import React from 'react';
import { Eye, CheckCircle2 } from 'lucide-react';
import type { Report, FindingType, AnatomicalLocation } from '../../../types';
import { Button } from '../../ui/Button';

interface BronchoscopyFindingsSectionProps {
  report: Report;
  onChange: (updates: Partial<Report>) => void;
}

export const BronchoscopyFindingsSection: React.FC<BronchoscopyFindingsSectionProps> = ({
  report,
  onChange,
}) => {
  const handleFindingTypeChange = (location: AnatomicalLocation, newType: FindingType) => {
    const updatedFindings = report.findings.map((f) => {
      if (f.anatomicalLocation === location) {
        return {
          ...f,
          findingType: newType,
          customText: newType === 'Normal' ? '' : f.customText,
        };
      }
      return f;
    });
    onChange({ findings: updatedFindings });
  };

  const markAllRemainingNormal = () => {
    const updatedFindings = report.findings.map((f) => {
      if (f.findingType === 'Normal' && !f.customText) {
        return f;
      }
      if (!f.customText) {
        return { ...f, findingType: 'Normal' as FindingType, customText: '' };
      }
      return f;
    });
    onChange({ findings: updatedFindings });
  };

  return (
    <div id="section-findings" className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-teal-50 rounded-lg text-teal-600">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">Bronchoscopic Findings</h3>
            <p className="text-xs text-slate-500">
              Anatomical examination of upper airway, trachea, and lobar bronchi
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          onClick={markAllRemainingNormal}
        >
          Mark Unset as Normal
        </Button>
      </div>

      <div className="space-y-3">
        {report.findings.map((item) => {
          const isAbnormal = item.findingType !== 'Normal';
          const normalLabel =
            item.anatomicalLocation === 'Tracheobronchial Tree' ? 'Normal TBT' : 'Normal';

          return (
            <div
              key={item.id || item.anatomicalLocation}
              className={`p-4 rounded-xl border transition-all ${
                isAbnormal
                  ? 'bg-amber-50/50 border-amber-300 shadow-2xs'
                  : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      isAbnormal ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
                    }`}
                  />
                  <span className="text-sm font-semibold text-slate-800">
                    {item.anatomicalLocation}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={item.findingType}
                    onChange={(e) =>
                      handleFindingTypeChange(
                        item.anatomicalLocation,
                        e.target.value as FindingType
                      )
                    }
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                      isAbnormal
                        ? 'bg-amber-100 text-amber-900 border-amber-300 focus:ring-amber-500'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-300 focus:ring-emerald-500'
                    }`}
                  >
                    <option value="Normal">{normalLabel}</option>
                    <option value="Abnormal">Abnormal</option>
                    <option value="Custom">Custom Finding</option>
                  </select>
                </div>
              </div>

              {/* {(isAbnormal || item.customText) && (
                <div className="mt-3 pt-3 border-t border-slate-200/70">
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    Detailed Finding Description for {item.anatomicalLocation}:
                  </label>
                  <textarea
                    rows={2}
                    value={item.customText}
                    onChange={(e) =>
                      handleCustomTextChange(item.anatomicalLocation, e.target.value)
                    }
                    placeholder={`Describe abnormal finding for ${item.anatomicalLocation} (e.g. mucosal hyperemia, mass lesion, stenosis, purulent secretions...)`}
                    className="w-full text-xs p-2.5 rounded-lg border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              )} */}
            </div>
          );
        })}
      </div>
    </div>
  );
};
