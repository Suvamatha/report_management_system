import React from 'react';
import { Stethoscope, Sparkles } from 'lucide-react';
import type { Report } from '../../../types';

interface IndicationSectionProps {
  report: Report;
  onChange: (updates: Partial<Report>) => void;
}

const COMMON_INDICATIONS = [
  'Hemoptysis evaluation',
  'Chronic persistent cough',
  'Unexplained pulmonary infiltrate',
  'Suspected pulmonary tuberculosis',
  'Suspected bronchogenic carcinoma',
  'Interstitial lung disease workup',
  'Foreign body removal',
];

export const IndicationSection: React.FC<IndicationSectionProps> = ({ report, onChange }) => {
  const insertIndication = (text: string) => {
    const current = report.indication ? `${report.indication}; ${text}` : text;
    onChange({ indication: current });
  };

  return (
    <div id="section-indication" className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">Clinical Indication</h3>
            <p className="text-xs text-slate-500">Reason and symptoms leading to bronchoscopy</p>
          </div>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 mr-1">
          <Sparkles className="w-3 h-3 text-purple-500" /> Common indications:
        </span>
        {COMMON_INDICATIONS.map((ind) => (
          <button
            key={ind}
            type="button"
            onClick={() => insertIndication(ind)}
            className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md border border-slate-200 transition-colors"
          >
            + {ind}
          </button>
        ))}
      </div>

      <textarea
        rows={3}
        value={report.indication}
        onChange={(e) => onChange({ indication: e.target.value })}
        placeholder="Enter clinical indication (e.g. 54-year-old male with persistent cough and hemoptysis for 3 months...)"
        className="w-full text-sm p-3.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
      />
    </div>
  );
};
