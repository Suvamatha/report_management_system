import { getDB } from './db';
import type { Patient } from '../../types';

export interface PatientRepository {
  getAll(): Promise<Patient[]>;
  getById(id: string): Promise<Patient | null>;
  getByPatientId(patientId: string): Promise<Patient | null>;
  search(query: string): Promise<Patient[]>;
  save(patient: Patient): Promise<Patient>;
  delete(id: string): Promise<void>;
}

export const patientRepository: PatientRepository = {
  async getAll(): Promise<Patient[]> {
    const db = await getDB();
    return db.getAll('patients');
  },

  async getById(id: string): Promise<Patient | null> {
    const db = await getDB();
    const patient = await db.get('patients', id);
    return patient || null;
  },

  async getByPatientId(patientId: string): Promise<Patient | null> {
    const db = await getDB();
    const patient = await db.getFromIndex('patients', 'by-patientId', patientId);
    return patient || null;
  },

  async search(query: string): Promise<Patient[]> {
    const db = await getDB();
    const all = await db.getAll('patients');
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter(
      (p) =>
        p.patientId.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        (p.phone && p.phone.includes(q))
    );
  },

  async save(patient: Patient): Promise<Patient> {
    const db = await getDB();
    const now = new Date().toISOString();
    const existing = await db.get('patients', patient.id);
    const updated: Patient = {
      ...patient,
      createdAt: existing ? existing.createdAt : now,
      updatedAt: now,
    };
    await db.put('patients', updated);
    return updated;
  },

  async delete(id: string): Promise<void> {
    const db = await getDB();
    await db.delete('patients', id);
  },
};
