import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface FinalizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  reportNumber: string;
}

export const FinalizeModal: React.FC<FinalizeModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  reportNumber,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Finalize Clinical Procedure Report"
      subtitle={`Report ID: ${reportNumber}`}
      maxWidth="md"
    >
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <p className="font-semibold text-amber-900 text-sm mb-1">
              Confirm Report Finalization
            </p>
            <p>
              Are you sure you want to finalize report <strong>{reportNumber}</strong>?
            </p>
            <p className="mt-2 text-amber-800">
              Once finalized, the report status changes to <strong>Completed</strong> and clinical contents cannot be overwritten directly. Further updates will require creating an official <strong>amendment (version 2+)</strong> for audit integrity.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="success"
            icon={<ShieldCheck className="w-4 h-4" />}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Finalize & Sign Report
          </Button>
        </div>
      </div>
    </Modal>
  );
};
