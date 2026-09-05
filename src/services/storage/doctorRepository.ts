import { getDB } from './db';
import type { DoctorProfile } from '../../types';

export const defaultDoctors: DoctorProfile[] = [
  {
    id: 'doc-1',
    name: 'Dr. Ramesh Sharma',
    designation: 'Senior Consultant Pulmonologist',
    credentials: 'MD, DM (Pulmonary Medicine), FCCP',
    department: 'Department of Pediatrics',
    isDefault: true,
  },
  {
    id: 'doc-2',
    name: 'Dr. Sunita Shrestha',
    designation: 'Associate Professor & Pulmonologist',
    credentials: 'MBBS, MD (Internal Medicine), Fellowship Interventional Pulmonology',
    department: 'Department of Pediatrics',
    isDefault: false,
  },
];

export interface DoctorRepository {
  getAll(): Promise<DoctorProfile[]>;
  getById(id: string): Promise<DoctorProfile | null>;
  save(doctor: DoctorProfile): Promise<DoctorProfile>;
  delete(id: string): Promise<void>;
  setDefault(id: string): Promise<void>;
}

export const doctorRepository: DoctorRepository = {
  async getAll(): Promise<DoctorProfile[]> {
    const db = await getDB();
    const doctors = await db.getAll('doctors');
    if (doctors.length === 0) {
      for (const doc of defaultDoctors) {
        await db.put('doctors', doc);
      }
      return defaultDoctors;
    }
    return doctors;
  },

  async getById(id: string): Promise<DoctorProfile | null> {
    const db = await getDB();
    const doc = await db.get('doctors', id);
    return doc || null;
  },

  async save(doctor: DoctorProfile): Promise<DoctorProfile> {
    const db = await getDB();
    await db.put('doctors', doctor);
    return doctor;
  },

  async delete(id: string): Promise<void> {
    const db = await getDB();
    await db.delete('doctors', id);
  },

  async setDefault(id: string): Promise<void> {
    const db = await getDB();
    const all = await db.getAll('doctors');
    const tx = db.transaction('doctors', 'readwrite');
    for (const doc of all) {
      doc.isDefault = doc.id === id;
      await tx.store.put(doc);
    }
    await tx.done;
  },
};
