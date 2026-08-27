import { getDB } from './db';
import type { MedicalImage } from '../../types';

export const MAX_IMAGE_SIZE_MB = 10;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const imageStorage = {
  validateImage(file: File): { valid: boolean; error?: string } {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: `Invalid file type "${file.type}". Supported formats are JPG, JPEG, PNG, and WebP.`,
      };
    }
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      return {
        valid: false,
        error: `File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds the maximum limit of ${MAX_IMAGE_SIZE_MB}MB.`,
      };
    }
    return { valid: true };
  },

  async fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  },

  async saveImage(image: MedicalImage): Promise<MedicalImage> {
    const db = await getDB();
    await db.put('images', image);
    return image;
  },

  async saveImages(images: MedicalImage[]): Promise<MedicalImage[]> {
    const db = await getDB();
    const tx = db.transaction('images', 'readwrite');
    for (const img of images) {
      await tx.store.put(img);
    }
    await tx.done;
    return images;
  },

  async getImagesByReportId(reportId: string): Promise<MedicalImage[]> {
    const db = await getDB();
    const images = await db.getAllFromIndex('images', 'by-reportId', reportId);
    return images.sort((a, b) => a.order - b.order);
  },

  async deleteImage(id: string): Promise<void> {
    const db = await getDB();
    await db.delete('images', id);
  },

  async deleteImagesByReportId(reportId: string): Promise<void> {
    const db = await getDB();
    const images = await db.getAllFromIndex('images', 'by-reportId', reportId);
    const tx = db.transaction('images', 'readwrite');
    for (const img of images) {
      await tx.store.delete(img.id);
    }
    await tx.done;
  },
};
