import { getDB } from './db';
import type { HospitalProfile } from '../../types';

const DEFAULT_HOSPITAL_ID = 'default-hospital';

export const defaultHospitalProfile: HospitalProfile = {
  id: DEFAULT_HOSPITAL_ID,
  name: 'Tribhuvan University Teaching Hospital',
  address: 'Maharajgunj, Kathmandu, Nepal',
  department: 'Department of Pediatrics & Critical Care Medicine',
  logoUrl: '/logo/logo.png',
  contactPhone: '+977-1-4412404',
  contactEmail: 'pulmonology@tuth.org.np',
  reportPrefix: 'BR-2026-',
};

export interface HospitalRepository {
  getProfile(): Promise<HospitalProfile>;
  updateProfile(profile: HospitalProfile): Promise<HospitalProfile>;
}

export const hospitalRepository: HospitalRepository = {
  async getProfile(): Promise<HospitalProfile> {
    const db = await getDB();
    const profile = await db.get('hospital', DEFAULT_HOSPITAL_ID);
    if (!profile) {
      await db.put('hospital', defaultHospitalProfile);
      return defaultHospitalProfile;
    }
    if (!profile.logoUrl) {
      profile.logoUrl = '/logo/logo.png';
      await db.put('hospital', profile);
    }
    return profile;
  },

  async updateProfile(profile: HospitalProfile): Promise<HospitalProfile> {
    const db = await getDB();
    const updated = { ...profile, id: DEFAULT_HOSPITAL_ID };
    await db.put('hospital', updated);
    return updated;
  },
};
