import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import type { ReportTemplate } from '../../types';
import { templateRepository } from '../../services/storage/templateRepository';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTemplate: (template: ReportTemplate) => void;
}

export const TemplatesModal: React.FC<TemplatesModalProps> = ({
  isOpen,
  onClose,
  onApplyTemplate,
}) => {
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);

  useEffect(() => {
    if (isOpen) {
      templateRepository.getAll().then(setTemplates);
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Procedure Templates Library"
      subtitle="Select a pre-configured template to auto-populate standard clinical defaults"
      maxWidth="xl"
    >
      <div className="space-y-4">
        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800">
          <strong>Clinical Safety Notice:</strong> Applying a template populates recommended baseline values. Always review and verify all anatomical findings prior to finalization.
        </div>

        <div className="space-y-3">
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              className="p-4 rounded-xl border border-slate-200 hover:border-sky-500 bg-white hover:bg-sky-50/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-sky-700">
                  {tpl.name}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">{tpl.description}</p>
                <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-slate-600">
                  <span className="bg-slate-100 px-2 py-0.5 rounded font-mono">
                    Route: {tpl.defaultRoute || 'Oral'}
                  </span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded">
                    Findings: {tpl.defaultFindings.length} Locations
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="primary"
                size="sm"
                icon={<ArrowRight className="w-4 h-4" />}
                onClick={() => {
                  onApplyTemplate(tpl);
                  onClose();
                }}
              >
                Apply
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};
