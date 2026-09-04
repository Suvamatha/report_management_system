import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import type { HospitalProfile } from '../../types';
import { hospitalRepository } from '../../services/storage/hospitalRepository';

interface HospitalSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const HospitalSettingsModal: React.FC<HospitalSettingsModalProps> = ({
  isOpen,
  onClose,
  onSaved,
}) => {
  const [profile, setProfile] = useState<HospitalProfile | null>(null);

  useEffect(() => {
    if (isOpen) {
      hospitalRepository.getProfile().then(setProfile);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    await hospitalRepository.updateProfile(profile);
    onSaved();
    onClose();
  };

  if (!profile) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Hospital & Department Configuration"
      subtitle="Configure hospital branding and header info displayed on reports"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <img
            src={profile.logoUrl || '/logo/logo.png'}
            alt="Hospital Logo"
            className="w-12 h-12 object-contain bg-white border border-slate-200 rounded p-1"
          />
          <div className="text-xs">
            <span className="font-semibold text-slate-800 block">Hospital Logo</span>
            <span className="text-slate-500 text-[11px]">Using official logo from <code className="bg-slate-200 px-1 py-0.5 rounded text-[10px]">public/logo/logo.png</code></span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Hospital Name</label>
          <input
            type="text"
            required
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 font-semibold"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
          <input
            type="text"
            required
            value={profile.department}
            onChange={(e) => setProfile({ ...profile, department: e.target.value })}
            className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Address / Location</label>
          <input
            type="text"
            required
            value={profile.address}
            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
            className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone</label>
            <input
              type="text"
              value={profile.contactPhone}
              onChange={(e) => setProfile({ ...profile, contactPhone: e.target.value })}
              className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Report ID Prefix</label>
            <input
              type="text"
              value={profile.reportPrefix}
              onChange={(e) => setProfile({ ...profile, reportPrefix: e.target.value })}
              placeholder="e.g. BR-2026-"
              className="w-full text-sm font-mono px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" icon={<Save className="w-4 h-4" />}>
            Save Profile
          </Button>
        </div>
      </form>
    </Modal>
  );
};
