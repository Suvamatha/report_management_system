import React from 'react';
import { Syringe, TestTube } from 'lucide-react';
import type { Report } from '../../../types';

interface InterventionsSectionProps {
  report: Report;
  onChange: (updates: Partial<Report>) => void;
}

export const InterventionsSection: React.FC<InterventionsSectionProps> = ({ report, onChange }) => {
  return (
    <div id="section-interventions" className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4 mb-5">
        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
          <Syringe className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-900">Interventions & Sample Collection</h3>
          <p className="text-xs text-slate-500">BAL, endobronchial biopsy, TBNA, and bronchial brushing procedures</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* BAL */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            report.bal.done ? 'bg-sky-50/60 border-sky-300' : 'bg-slate-50/50 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TestTube className={`w-4 h-4 ${report.bal.done ? 'text-sky-600' : 'text-slate-400'}`} />
              <h4 className="text-sm font-semibold text-slate-900">Bronchoalveolar Lavage (BAL)</h4>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
              <input
                type="checkbox"
                checked={report.bal.done}
                onChange={(e) =>
                  onChange({
                    bal: { ...report.bal, done: e.target.checked },
                  })
                }
                className="w-4 h-4 text-sky-600 rounded focus:ring-sky-500"
              />
              <span className={report.bal.done ? 'text-sky-700' : 'text-slate-500'}>
                {report.bal.done ? 'DONE' : 'Not Performed'}
              </span>
            </label>
          </div>

          {report.bal.done && (
            <div className="space-y-3 pt-2 border-t border-sky-200/60">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Sample Site / Segment</label>
                <input
                  type="text"
                  value={report.bal.sampleSite}
                  onChange={(e) =>
                    onChange({ bal: { ...report.bal, sampleSite: e.target.value } })
                  }
                  placeholder="e.g. Right Middle Lobe (Medial segment)"
                  className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Specimen / Lab Tests</label>
                <input
                  type="text"
                  value={report.bal.specimenTests}
                  onChange={(e) =>
                    onChange({ bal: { ...report.bal, specimenTests: e.target.value } })
                  }
                  placeholder="e.g. Cytology, AFB, GeneXpert, Bacterial & Fungal Culture"
                  className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Additional Notes</label>
                <input
                  type="text"
                  value={report.bal.notes}
                  onChange={(e) =>
                    onChange({ bal: { ...report.bal, notes: e.target.value } })
                  }
                  placeholder="e.g. 50mL saline instilled, 25mL clear fluid recovered"
                  className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Endobronchial Biopsy */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            report.endobronchialBiopsy.done ? 'bg-sky-50/60 border-sky-300' : 'bg-slate-50/50 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TestTube className={`w-4 h-4 ${report.endobronchialBiopsy.done ? 'text-sky-600' : 'text-slate-400'}`} />
              <h4 className="text-sm font-semibold text-slate-900">Endobronchial Biopsy</h4>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
              <input
                type="checkbox"
                checked={report.endobronchialBiopsy.done}
                onChange={(e) =>
                  onChange({
                    endobronchialBiopsy: { ...report.endobronchialBiopsy, done: e.target.checked },
                  })
                }
                className="w-4 h-4 text-sky-600 rounded focus:ring-sky-500"
              />
              <span className={report.endobronchialBiopsy.done ? 'text-sky-700' : 'text-slate-500'}>
                {report.endobronchialBiopsy.done ? 'DONE' : 'Not Performed'}
              </span>
            </label>
          </div>

          {report.endobronchialBiopsy.done && (
            <div className="space-y-3 pt-2 border-t border-sky-200/60">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Site</label>
                <input
                  type="text"
                  value={report.endobronchialBiopsy.site}
                  onChange={(e) =>
                    onChange({
                      endobronchialBiopsy: { ...report.endobronchialBiopsy, site: e.target.value },
                    })
                  }
                  placeholder="e.g. Right Upper Lobe apical segment mucosal lesion"
                  className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Specimen / Notes</label>
                <input
                  type="text"
                  value={report.endobronchialBiopsy.specimenNotes}
                  onChange={(e) =>
                    onChange({
                      endobronchialBiopsy: { ...report.endobronchialBiopsy, specimenNotes: e.target.value },
                    })
                  }
                  placeholder="e.g. 4 bite tissue biopsies sent in 10% formalin"
                  className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Conventional TBNA */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            report.conventionalTbna.done ? 'bg-sky-50/60 border-sky-300' : 'bg-slate-50/50 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TestTube className={`w-4 h-4 ${report.conventionalTbna.done ? 'text-sky-600' : 'text-slate-400'}`} />
              <h4 className="text-sm font-semibold text-slate-900">Conventional TBNA</h4>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
              <input
                type="checkbox"
                checked={report.conventionalTbna.done}
                onChange={(e) =>
                  onChange({
                    conventionalTbna: { ...report.conventionalTbna, done: e.target.checked },
                  })
                }
                className="w-4 h-4 text-sky-600 rounded focus:ring-sky-500"
              />
              <span className={report.conventionalTbna.done ? 'text-sky-700' : 'text-slate-500'}>
                {report.conventionalTbna.done ? 'DONE' : 'Not Performed'}
              </span>
            </label>
          </div>

          {report.conventionalTbna.done && (
            <div className="space-y-3 pt-2 border-t border-sky-200/60">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Station / Site</label>
                <input
                  type="text"
                  value={report.conventionalTbna.stationSite}
                  onChange={(e) =>
                    onChange({
                      conventionalTbna: { ...report.conventionalTbna, stationSite: e.target.value },
                    })
                  }
                  placeholder="e.g. Subcarinal station (Station 7)"
                  className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Specimen / Tests</label>
                <input
                  type="text"
                  value={report.conventionalTbna.specimenTests}
                  onChange={(e) =>
                    onChange({
                      conventionalTbna: { ...report.conventionalTbna, specimenTests: e.target.value },
                    })
                  }
                  placeholder="e.g. Cytology slides, cell block"
                  className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Notes</label>
                <input
                  type="text"
                  value={report.conventionalTbna.notes}
                  onChange={(e) =>
                    onChange({
                      conventionalTbna: { ...report.conventionalTbna, notes: e.target.value },
                    })
                  }
                  placeholder="e.g. 21G C-TBNA needle used, 3 passes made"
                  className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Brushing */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            report.brushing.done ? 'bg-sky-50/60 border-sky-300' : 'bg-slate-50/50 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TestTube className={`w-4 h-4 ${report.brushing.done ? 'text-sky-600' : 'text-slate-400'}`} />
              <h4 className="text-sm font-semibold text-slate-900">Bronchial Brushing</h4>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
              <input
                type="checkbox"
                checked={report.brushing.done}
                onChange={(e) =>
                  onChange({
                    brushing: { ...report.brushing, done: e.target.checked },
                  })
                }
                className="w-4 h-4 text-sky-600 rounded focus:ring-sky-500"
              />
              <span className={report.brushing.done ? 'text-sky-700' : 'text-slate-500'}>
                {report.brushing.done ? 'DONE' : 'Not Performed'}
              </span>
            </label>
          </div>

          {report.brushing.done && (
            <div className="space-y-3 pt-2 border-t border-sky-200/60">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Site</label>
                <input
                  type="text"
                  value={report.brushing.site}
                  onChange={(e) =>
                    onChange({
                      brushing: { ...report.brushing, site: e.target.value },
                    })
                  }
                  placeholder="e.g. Right Upper Lobe apical segment"
                  className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Notes</label>
                <input
                  type="text"
                  value={report.brushing.notes}
                  onChange={(e) =>
                    onChange({
                      brushing: { ...report.brushing, notes: e.target.value },
                    })
                  }
                  placeholder="e.g. Cytology smears prepared and fixed"
                  className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
