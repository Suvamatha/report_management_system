import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Eraser } from 'lucide-react';
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
  const [signatureMode, setSignatureMode] = useState<'upload' | 'draw'>('upload');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

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

    let finalSig = editingDoc.signatureUrl;

    if (signatureMode === 'draw' && canvasRef.current) {
      finalSig = canvasRef.current.toDataURL('image/png');
    }

    const docToSave: DoctorProfile = {
      id: editingDoc.id || `doc-${Date.now()}`,
      name: editingDoc.name,
      designation: editingDoc.designation || 'Consultant Pulmonologist',
      credentials: editingDoc.credentials || 'MD',
      department: editingDoc.department || 'Department of Pulmonology',
      signatureUrl: finalSig,
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

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#0f172a';
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
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

            {/* Signature Configuration Module */}
            <div className="pt-2 border-t border-sky-200">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-700">Digital Signature</label>
                <div className="flex items-center gap-1 bg-slate-200/80 p-0.5 rounded-lg text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setSignatureMode('upload')}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      signatureMode === 'upload' ? 'bg-white text-sky-900 shadow-2xs font-bold' : 'text-slate-600'
                    }`}
                  >
                    Upload Image
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignatureMode('draw')}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      signatureMode === 'draw' ? 'bg-white text-sky-900 shadow-2xs font-bold' : 'text-slate-600'
                    }`}
                  >
                    Draw Signature
                  </button>
                </div>
              </div>

              {signatureMode === 'upload' ? (
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
              ) : (
                <div className="space-y-2">
                  <div className="relative border-2 border-dashed border-slate-300 bg-white rounded-lg p-1 text-center">
                    <canvas
                      ref={canvasRef}
                      width={400}
                      height={100}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                      className="w-full h-24 touch-none cursor-crosshair"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Draw signature using mouse, stylus, or touch screen</span>
                    <button
                      type="button"
                      onClick={clearCanvas}
                      className="flex items-center gap-1 text-rose-600 font-semibold hover:underline"
                    >
                      <Eraser className="w-3.5 h-3.5" /> Clear Canvas
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setEditingDoc(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save Doctor Profile
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
