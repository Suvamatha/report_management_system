import React from 'react';
import { Activity } from 'lucide-react';
import type { Report, RouteOption } from '../../../types';

interface ProcedureSectionProps {
  report: Report;
  onChange: (updates: Partial<Report>) => void;
}

export const ProcedureSection: React.FC<ProcedureSectionProps> = ({ report, onChange }) => {
  return (
    <div id="section-procedure" className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4 mb-5">
        <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-900">Procedure Information</h3>
          <p className="text-xs text-slate-500">Premedication, sedation, and access route</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Procedure Name</label>
          <input
            type="text"
            value={report.procedureName}
            onChange={(e) => onChange({ procedureName: e.target.value })}
            placeholder="e.g. Flexible Bronchoscopy"
            className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Premedication <span className="text-slate-400 font-normal">(Free text)</span>
          </label>
          <input
            type="text"
            value={report.premedication}
            onChange={(e) => onChange({ premedication: e.target.value })}
            placeholder="e.g. Lignocaine 2% topical spray"
            className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Sedation <span className="text-slate-400 font-normal">(Free text)</span>
          </label>
          <input
            type="text"
            value={report.sedation}
            onChange={(e) => onChange({ sedation: e.target.value })}
            placeholder="e.g. Midazolam 2mg IV"
            className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
          />
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100">
        <label className="block text-xs font-semibold text-slate-700 mb-2">Access Route</label>
        <div className="flex flex-wrap items-center gap-4">
          {(['Oral', 'Nasal', 'Other'] as RouteOption[]).map((r) => (
            <label
              key={r}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg border cursor-pointer text-sm font-medium transition-all ${
                report.route === r
                  ? 'bg-sky-50 border-sky-500 text-sky-700 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="route"
                value={r}
                checked={report.route === r}
                onChange={() => onChange({ route: r })}
                className="text-sky-600 focus:ring-sky-500"
              />
              {r}
            </label>
          ))}

          {report.route === 'Other' && (
            <input
              type="text"
              value={report.routeCustom || ''}
              onChange={(e) => onChange({ routeCustom: e.target.value })}
              placeholder="Specify custom route (e.g. Tracheostomy, ETT)"
              className="text-sm px-3 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 w-64"
            />
          )}
        </div>
      </div>
    </div>
  );
};
