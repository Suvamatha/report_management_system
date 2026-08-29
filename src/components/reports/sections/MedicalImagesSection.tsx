import React, { useState, useRef } from 'react';
import {
  Image as ImageIcon,
  Upload,
  RotateCw,
  Trash2,
  MoveLeft,
  MoveRight,
  AlertCircle,
} from 'lucide-react';
import type { Report, MedicalImage } from '../../../types';
import { imageStorage } from '../../../services/storage/imageStorage';

interface MedicalImagesSectionProps {
  report: Report;
  onChange: (updates: Partial<Report>) => void;
}

export const MedicalImagesSection: React.FC<MedicalImagesSectionProps> = ({ report, onChange }) => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = async (files: FileList | File[]) => {
    setErrorMsg(null);
    const newImages: MedicalImage[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const validation = imageStorage.validateImage(file);
      if (!validation.valid) {
        setErrorMsg(validation.error || 'Invalid image file');
        return;
      }

      try {
        const dataUrl = await imageStorage.fileToDataUrl(file);
        const imageObj: MedicalImage = {
          id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          reportId: report.id,
          dataUrl,
          label: file.name.replace(/\.[^/.]+$/, ''),
          rotation: 0,
          order: (report.images?.length || 0) + newImages.length + 1,
          fileType: file.type,
          size: file.size,
          createdAt: new Date().toISOString(),
        };
        newImages.push(imageObj);
      } catch {
        setErrorMsg('Failed to process image upload.');
      }
    }

    if (newImages.length > 0) {
      const updatedList = [...(report.images || []), ...newImages];
      onChange({ images: updatedList });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleRotate = (imageId: string) => {
    const updated = (report.images || []).map((img) => {
      if (img.id === imageId) {
        const nextRotation = (img.rotation + 90) % 360;
        return { ...img, rotation: nextRotation };
      }
      return img;
    });
    onChange({ images: updated });
  };

  const handleLabelChange = (imageId: string, label: string) => {
    const updated = (report.images || []).map((img) => {
      if (img.id === imageId) {
        return { ...img, label };
      }
      return img;
    });
    onChange({ images: updated });
  };

  const handleDelete = (imageId: string) => {
    const updated = (report.images || [])
      .filter((img) => img.id !== imageId)
      .map((img, idx) => ({ ...img, order: idx + 1 }));
    onChange({ images: updated });
  };

  const handleMove = (index: number, direction: 'left' | 'right') => {
    const images = [...(report.images || [])];
    const targetIdx = direction === 'left' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= images.length) return;

    const temp = images[index];
    images[index] = images[targetIdx];
    images[targetIdx] = temp;

    const reordered = images.map((img, idx) => ({ ...img, order: idx + 1 }));
    onChange({ images: reordered });
  };

  return (
    <div id="section-images" className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">Medical Bronchoscopy Images</h3>
            <p className="text-xs text-slate-500">
              Endoscopic photos, biopsy sites, and airway anatomical captures
            </p>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-sky-500 bg-sky-50/80 scale-[0.99]'
            : 'border-slate-300 hover:border-sky-400 bg-slate-50/50 hover:bg-sky-50/30'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => e.target.files && processFiles(e.target.files)}
        />
        <div className="flex flex-col items-center justify-center gap-2 text-slate-600">
          <div className="p-3 bg-sky-100 text-sky-600 rounded-full">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">
              Click or drag & drop bronchoscopy images here
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Supports JPG, JPEG, PNG, WebP (Max file size: 10MB each)
            </p>
          </div>
        </div>
      </div>

      {report.images && report.images.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-700">
              Attached Images ({report.images.length})
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {report.images.map((img, idx) => (
              <div
                key={img.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs group flex flex-col justify-between"
              >
                <div className="relative bg-slate-950 aspect-4/3 flex items-center justify-center overflow-hidden">
                  <img
                    src={img.dataUrl}
                    alt={img.label || `Image ${idx + 1}`}
                    style={{ transform: `rotate(${img.rotation}deg)` }}
                    className="max-h-full max-w-full object-contain transition-transform duration-200"
                  />
                  <span className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                    #{idx + 1}
                  </span>

                  <div className="absolute top-2 right-2 flex items-center gap-1 opacity-90">
                    <button
                      type="button"
                      onClick={() => handleRotate(img.id)}
                      title="Rotate 90 degrees"
                      className="p-1.5 bg-slate-900/80 hover:bg-slate-900 text-white rounded-md text-xs transition-colors backdrop-blur-xs"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(img.id)}
                      title="Delete image"
                      className="p-1.5 bg-rose-600/90 hover:bg-rose-600 text-white rounded-md text-xs transition-colors backdrop-blur-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border-t border-slate-200">
                  <input
                    type="text"
                    value={img.label || ''}
                    onChange={(e) => handleLabelChange(img.id, e.target.value)}
                    placeholder="Enter image caption (e.g. RUL mass lesion)..."
                    className="w-full text-xs px-2.5 py-1.5 rounded-md border border-slate-300 bg-white focus:ring-2 focus:ring-sky-500 font-medium"
                  />

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60 text-xs text-slate-500">
                    <span>Order: {idx + 1}</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMove(idx, 'left')}
                        className="p-1 hover:bg-slate-200 rounded disabled:opacity-30 text-slate-700"
                        title="Move left"
                      >
                        <MoveLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === report.images.length - 1}
                        onClick={() => handleMove(idx, 'right')}
                        className="p-1 hover:bg-slate-200 rounded disabled:opacity-30 text-slate-700"
                        title="Move right"
                      >
                        <MoveRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
