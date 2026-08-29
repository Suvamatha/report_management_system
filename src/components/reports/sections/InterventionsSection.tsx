import React from 'react';
import { Syringe } from 'lucide-react';
import type { Report } from '../../../types';

interface InterventionsSectionProps {
  report: Report;
  onChange: (updates: Partial<Report>) => void;
}

export const InterventionsSection: React.FC<InterventionsSectionProps> = ({ report, onChange }) => (
  <section id="section-interventions" className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
    <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4 mb-5">
      <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
        <Syringe className="w-5 h-5" />
      </div>
      <div>
        <h3 className="text-base font-semibold text-slate-900">Interventions &amp; Sample Collection</h3>
        <p className="text-xs text-slate-500">Enter any procedure, sample, site, test, or collection detail in your own words.</p>
      </div>
    </div>

    <label htmlFor="interventions-text" className="block text-xs font-semibold text-slate-700 mb-1.5">
      Procedure notes <span className="text-slate-400 font-normal">(free text)</span>
    </label>
    <textarea
      id="interventions-text"
      rows={7}
      value={report.interventionsText || ''}
      onChange={(event) => onChange({ interventionsText: event.target.value })}
      placeholder={'Example: BAL collected from the right middle lobe and sent for AFB, GeneXpert, bacterial culture, and cytology.\n\nAny other intervention or sample collection can be recorded here.'}
      className="w-full resize-y text-sm p-3 rounded-lg border border-slate-300 bg-white leading-relaxed focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
    />
  </section>
);
