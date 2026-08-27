import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';
import type {
  Report,
  MedicalImage,
  Patient,
  DoctorProfile,
  HospitalProfile,
  ReportTemplate,
  AuditLog,
} from '../../types';

interface BronchoscopyDB extends DBSchema {
  reports: {
    key: string;
    value: Report;
    indexes: {
      'by-patientId': string;
      'by-status': string;
      'by-reportNumber': string;
      'by-updatedAt': string;
    };
  };
  images: {
    key: string;
    value: MedicalImage;
    indexes: {
      'by-reportId': string;
    };
  };
  patients: {
    key: string;
    value: Patient;
    indexes: {
      'by-patientId': string;
      'by-name': string;
    };
  };
  doctors: {
    key: string;
    value: DoctorProfile;
  };
  hospital: {
    key: string;
    value: HospitalProfile;
  };
  templates: {
    key: string;
    value: ReportTemplate;
  };
  audit_logs: {
    key: string;
    value: AuditLog;
    indexes: {
      'by-timestamp': string;
      'by-reportId': string;
    };
  };
}

const DB_NAME = 'PulmonologyReportSystemDB';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<BronchoscopyDB>> | null = null;

export function getDB(): Promise<IDBPDatabase<BronchoscopyDB>> {
  if (!dbPromise) {
    dbPromise = openDB<BronchoscopyDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('reports')) {
          const reportStore = db.createObjectStore('reports', { keyPath: 'id' });
          reportStore.createIndex('by-patientId', 'patientId');
          reportStore.createIndex('by-status', 'status');
          reportStore.createIndex('by-reportNumber', 'reportNumber', { unique: true });
          reportStore.createIndex('by-updatedAt', 'updatedAt');
        }

        if (!db.objectStoreNames.contains('images')) {
          const imageStore = db.createObjectStore('images', { keyPath: 'id' });
          imageStore.createIndex('by-reportId', 'reportId');
        }

        if (!db.objectStoreNames.contains('patients')) {
          const patientStore = db.createObjectStore('patients', { keyPath: 'id' });
          patientStore.createIndex('by-patientId', 'patientId', { unique: true });
          patientStore.createIndex('by-name', 'name');
        }

        if (!db.objectStoreNames.contains('doctors')) {
          db.createObjectStore('doctors', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('hospital')) {
          db.createObjectStore('hospital', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('templates')) {
          db.createObjectStore('templates', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('audit_logs')) {
          const auditStore = db.createObjectStore('audit_logs', { keyPath: 'id' });
          auditStore.createIndex('by-timestamp', 'timestamp');
          auditStore.createIndex('by-reportId', 'reportId');
        }
      },
    });
  }
  return dbPromise;
}
