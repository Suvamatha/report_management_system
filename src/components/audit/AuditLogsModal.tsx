import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { Modal } from '../ui/Modal';
import type { AuditLog } from '../../types';
import { auditService } from '../../services/storage/auditService';

interface AuditLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditLogsModal: React.FC<AuditLogsModalProps> = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    if (isOpen) {
      auditService.getAllLogs().then(setLogs);
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="System Audit & Security Logs"
      subtitle="Local immutable audit history tracking clinical report actions"
      maxWidth="3xl"
    >
      <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
        {logs.map((log) => (
          <div
            key={log.id}
            className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 text-xs space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 bg-slate-200/80 px-2 py-0.5 rounded text-[11px]">
                {log.action}
              </span>
              <span className="text-slate-400 text-[11px] font-mono">
                {new Date(log.timestamp).toLocaleString()}
              </span>
            </div>
            <p className="text-slate-700 font-medium">{log.details}</p>
            <div className="flex items-center gap-1 text-slate-400 text-[10px]">
              <User className="w-3 h-3 text-slate-400" />
              <span>User: {log.user}</span>
            </div>
          </div>
        ))}

        {logs.length === 0 && (
          <p className="text-xs text-slate-400 text-center py-8">No audit logs recorded yet.</p>
        )}
      </div>
    </Modal>
  );
};
