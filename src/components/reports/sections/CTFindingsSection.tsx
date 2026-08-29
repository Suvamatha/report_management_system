import React from 'react';
import { FileText, Sparkles } from 'lucide-react';
import type { Report } from '../../../types';

interface CTFindingsSectionProps {
  report: Report;
  onChange: (updates: Partial<Report>) => void;
}

const COMMON_CT_SNIPPETS = [
  'Solitary pulmonary nodule',
  'Ground glass opacities',
  'Mediastinal lymphadenopathy',
  'Collapse / Atelectasis',
  'Centrilobular emphysema',
  'Bronchiectasis',
  'Cavitary lesion',
];

export const CTFindingsSection: React.FC<CTFindingsSectionProps> = ({ report, onChange }) => {
  const insertSnippet = (snippet: string) => {
    const text = report.ctFindings ? `${report.ctFindings}; ${snippet}` : snippet;
    onChange({ ctFindings: text });
  };

  return (
    <div id="section-ct" className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">Radiological Finding</h3>
            <p className="text-xs text-slate-500">Radiological CT chest findings prior to bronchoscopy</p>
          </div>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        {/* <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 mr-1">
          <Sparkles className="w-3 h-3 text-amber-500" /> Quick tags:
        </span> */}
        {/* {COMMON_CT_SNIPPETS.map((snip) => (
          <button
            key={snip}
            type="button"
            onClick={() => insertSnippet(snip)}
            className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md border border-slate-200 transition-colors"
          >
            + {snip}
          </button>
        ))} */}
      </div>

      <textarea
        rows={4}
        value={report.ctFindings}
        onChange={(e) => onChange({ ctFindings: e.target.value })}
        // placeholder="Enter radiological CT findings (e.g. CT chest demonstrates soft tissue mass in right upper lobe...)"
        className="w-full text-sm p-3.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
      />
    </div>
  );
};
