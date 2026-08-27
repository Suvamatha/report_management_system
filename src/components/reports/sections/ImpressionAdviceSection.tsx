import React from 'react';
import { ClipboardCheck, Sparkles } from 'lucide-react';
import type { Report } from '../../../types';

interface ImpressionAdviceSectionProps {
  report: Report;
  onChange: (updates: Partial<Report>) => void;
}

const COMMON_ADVICE_SNIPPETS = [
  'Observe for 2 hours post-procedure; NPO until gag reflex recovers.',
  'Monitor vital signs and observe for post-biopsy hemoptysis or shortness of breath.',
  'Follow up with Histopathology, GeneXpert, and BAL microbiology reports in Pulmonology OPD.',
  'Chest X-ray PA view if patient develops chest pain or acute distress.',
];

export const ImpressionAdviceSection: React.FC<ImpressionAdviceSectionProps> = ({
  report,
  onChange,
}) => {
  const insertAdviceSnippet = (snip: string) => {
    const text = report.advice ? `${report.advice}\n• ${snip}` : `• ${snip}`;
    onChange({ advice: text });
  };

  return (
    <div id="section-impression" className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
      <div>
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3 mb-4">
          <div className="p-2 bg-slate-100 rounded-lg text-slate-800">
            <ClipboardCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">Impression</h3>
            <p className="text-xs text-slate-500">Final diagnostic impression synthesised by attending pulmonologist</p>
          </div>
        </div>

        <textarea
          rows={4}
          value={report.impression}
          onChange={(e) => onChange({ impression: e.target.value })}
          placeholder="Enter final clinical impression (e.g. Endobronchial mass lesion involving right upper lobe apical segment. Biopsy and BAL performed for histopathology and MTB evaluation...)"
          className="w-full text-sm p-3.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors font-medium"
        />
      </div>

      <div id="section-advice" className="pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Advice & Recommendations</h3>
            <p className="text-xs text-slate-500">Post-procedure care instructions and follow-up plan</p>
          </div>
        </div>

        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 mr-1">
            <Sparkles className="w-3 h-3 text-sky-500" /> Post-care snippets:
          </span>
          {COMMON_ADVICE_SNIPPETS.map((snip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => insertAdviceSnippet(snip)}
              className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md border border-slate-200 transition-colors"
            >
              + {snip.slice(0, 35)}...
            </button>
          ))}
        </div>

        <textarea
          rows={4}
          value={report.advice}
          onChange={(e) => onChange({ advice: e.target.value })}
          placeholder="Enter advice and post-procedure recommendations (e.g. 1. NPO for 2 hours post-procedure...)"
          className="w-full text-sm p-3.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
        />
      </div>
    </div>
  );
};
