import React from 'react';
import { Save, Check, Loader2 } from 'lucide-react';

interface SaveStatusProps {
  status: 'idle' | 'saving' | 'saved' | 'error';
  lastSavedAt: string | null;
}

export const SaveStatus: React.FC<SaveStatusProps> = ({ status, lastSavedAt }) => {
  return (
    <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100/80 px-2.5 py-1 rounded-full border border-slate-200">
      {status === 'saving' && (
        <>
          <Loader2 className="w-3.5 h-3.5 text-sky-600 animate-spin" />
          <span className="text-sky-700 font-medium">Autosaving...</span>
        </>
      )}

      {status === 'saved' && (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-emerald-700 font-medium">Saved</span>
        </>
      )}

      {status === 'idle' && lastSavedAt && (
        <>
          <Save className="w-3.5 h-3.5 text-slate-400" />
          <span>Last saved at {lastSavedAt}</span>
        </>
      )}

      {status === 'error' && (
        <span className="text-rose-600 font-semibold">Save failed</span>
      )}
    </div>
  );
};
