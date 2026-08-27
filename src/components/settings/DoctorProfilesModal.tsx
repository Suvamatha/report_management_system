import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import type { DoctorProfile } from '../../types';
import { doctorRepository } from '../../services/storage/doctorRepository';

interface DoctorProfilesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const DoctorProfilesModal: React.FC<DoctorProfilesModalProps> = ({
  isOpen,
  onClose,
  onSaved,
}) => {
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [editingDoc, setEditingDoc] = useState<Partial<DoctorProfile> | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadDoctors();
    }
  }, [isOpen]);

  const loadDoctors = async () => {
    const list = await doctorRepository.getAll();
    setDoctors(list);
  };

  const handleSaveDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoc || !editingDoc.name) return;

    const docToSave: DoctorProfile = {
      id: editingDoc.id || `doc-${Date.now()}`,
      name: editingDoc.name,
      designation: editingDoc.designation || 'Consultant Pulmonologist',
      credentials: editingDoc.credentials || 'MD',
      department: editingDoc.department || 'Department of Pulmonology',
      signatureUrl: editingDoc.signatureUrl,
      isDefault: editingDoc.isDefault || false,
    };

    await doctorRepository.save(docToSave);
    setEditingDoc(null);
    loadDoctors();
    onSaved();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this doctor profile?')) {
      await doctorRepository.delete(id);
      loadDoctors();
      onSaved();
    }
  };

  const handleSignatureUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (editingDoc && typeof reader.result === 'string') {
        setEditingDoc({ ...editingDoc, signatureUrl: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Physician & Doctor Profiles"
      subtitle="Manage attending pulmonologists, credentials, and digital signatures"
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Doctors List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Configured Doctors ({doctors.length})
            </h4>
            <Button
              type="button"
              variant="outline"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={() =>
                setEditingDoc({
                  name: '',
                  designation: 'Senior Consultant Pulmonologist',
                  credentials: 'MD, DM Pulmonology',
                  department: 'Department of Pulmonology',
                })
              }
            >
              Add Doctor Profile
            </Button>
          </div>

          {doctors.map((doc) => (
            <div
              key={doc.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{doc.name}</span>
                  {doc.isDefault && (
                    <span className="bg-sky-100 text-sky-800 text-[10px] font-bold px-2 py-0.5 rounded">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 font-medium mt-0.5">{doc.designation}</p>
                <p className="text-xs text-slate-500">{doc.credentials}</p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingDoc(doc)}
                >
                  Edit
                </Button>
                {doctors.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDelete(doc.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Edit / Add Form Drawer */}
        {editingDoc && (
          <form onSubmit={handleSaveDoc} className="p-4 rounded-xl border border-sky-300 bg-sky-50/40 space-y-3">
            <h4 className="text-xs font-bold text-sky-900 uppercase">
              {editingDoc.id ? 'Edit Doctor Profile' : 'New Doctor Profile'}
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Doctor Name</label>
                <input
                  type="text"
                  required
                  value={editingDoc.name || ''}
                  onChange={(e) => setEditingDoc({ ...editingDoc, name: e.target.value })}
                  placeholder="e.g. Dr. Ramesh Sharma"
                  className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Designation</label>
                <input
                  type="text"
                  value={editingDoc.designation || ''}
                  onChange={(e) => setEditingDoc({ ...editingDoc, designation: e.target.value })}
                  placeholder="e.g. Associate Professor & Pulmonologist"
                  className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Qualifications & Credentials</label>
                <input
                  type="text"
                  value={editingDoc.credentials || ''}
                  onChange={(e) => setEditingDoc({ ...editingDoc, credentials: e.target.value })}
                  placeholder="e.g. MBBS, MD (Internal Med), DM (Pulmonary Medicine), FCCP"
                  className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            {/* Signature Upload */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Digital Signature Image (PNG/JPG)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  className="text-xs"
                  onChange={(e) => e.target.files?.[0] && handleSignatureUpload(e.target.files[0])}
                />
                {editingDoc.signatureUrl && (
                  <img
                    src={editingDoc.signatureUrl}
                    alt="Preview Signature"
                    className="h-8 max-w-[120px] object-contain border rounded p-1 bg-white"
                  />
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setEditingDoc(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save Doctor
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
