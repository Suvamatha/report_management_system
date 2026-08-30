import React from 'react';
import { Eye, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import type { Report, FindingType, AnatomicalLocation } from '../../../types';
import { Button } from '../../ui/Button';

interface BronchoscopyFindingsSectionProps {
  report: Report;
  onChange: (updates: Partial<Report>) => void;
}

const COMMON_ABNORMAL_SNIPPETS = [
  'Mucosal erythema & edema',
  'Endobronchial mass lesion',
  'Luminal narrowing / stenosis',
  'Purulent secretions',
  'Active bleeding / oozing',
  'Friable mucosa',
  'Extrinsic compression',
  'Mucosal infiltration',
];

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

  const handleCustomTextChange = (location: AnatomicalLocation, customText: string) => {
    const updatedFindings = report.findings.map((f) => {
      if (f.anatomicalLocation === location) {
        return { ...f, customText };
      }
      return f;
    });
    onChange({ findings: updatedFindings });
  };

  const insertSnippet = (location: AnatomicalLocation, snippet: string) => {
    const finding = report.findings.find((f) => f.anatomicalLocation === location);
    const current = finding?.customText || '';
    const updated = current ? `${current}; ${snippet}` : snippet;
    handleCustomTextChange(location, updated);
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
                  ? 'bg-amber-50/60 border-amber-300 shadow-2xs'
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

              {(isAbnormal || item.customText) && (
                <div className="mt-3 pt-3 border-t border-amber-200/80">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <label className="block text-xs font-semibold text-amber-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Why is {item.anatomicalLocation} abnormal? (Description / Reason):</span>
                    </label>
                  </div>

                  <div className="mb-2 flex flex-wrap items-center gap-1">
                    <span className="text-[11px] font-medium text-amber-700 flex items-center gap-1 mr-1">
                      <Sparkles className="w-3 h-3 text-amber-500" /> Quick tags:
                    </span>
                    {COMMON_ABNORMAL_SNIPPETS.map((snip) => (
                      <button
                        key={snip}
                        type="button"
                        onClick={() => insertSnippet(item.anatomicalLocation, snip)}
                        className="text-[11px] px-2 py-0.5 bg-white hover:bg-amber-100 text-amber-900 rounded border border-amber-300 transition-colors shadow-2xs"
                      >
                        + {snip}
                      </button>
                    ))}
                  </div>

                  <textarea
                    rows={2}
                    value={item.customText}
                    onChange={(e) =>
                      handleCustomTextChange(item.anatomicalLocation, e.target.value)
                    }
                    placeholder={`Specify why ${item.anatomicalLocation} is abnormal (e.g. mucosal hyperemia, mass lesion, luminal narrowing, purulent secretions...)`}
                    className="w-full text-xs p-2.5 rounded-lg border border-amber-300 bg-white text-slate-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 placeholder-slate-400"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
