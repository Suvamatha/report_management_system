export type Gender = 'Male' | 'Female' | 'Other';
export type ReportStatus = 'Draft' | 'Completed' | 'Amended';
export type RouteOption = 'Oral' | 'Nasal' | 'Other';

export type AnatomicalLocation =
  | 'Vocal Cord'
  | 'Trachea'
  | 'Carina'
  | 'Tracheobronchial Tree'
  | 'Right Upper Lobe'
  | 'Right Middle Lobe'
  | 'Right Lower Lobe'
  | 'Left Upper Lobe'
  | 'Lingular Lobe'
  | 'Left Lower Lobe';

export type FindingType = 'Normal' | 'Abnormal' | 'Custom';

export interface BronchoscopyFinding {
  id: string;
  anatomicalLocation: AnatomicalLocation;
  findingType: FindingType;
  customText: string;
}

export interface BALProcedure {
  done: boolean;
  sampleSite: string;
  specimenTests: string;
  notes: string;
}

export interface EndobronchialBiopsyProcedure {
  done: boolean;
  site: string;
  specimenNotes: string;
}

export interface TBNAProcedure {
  done: boolean;
  stationSite: string;
  specimenTests: string;
  notes: string;
}

export interface BrushingProcedure {
  done: boolean;
  site: string;
  notes: string;
}

export interface MedicalImage {
  id: string;
  reportId: string;
  blobId?: string; // stored in IndexedDB
  dataUrl: string; // for UI rendering & DOCX export
  label: string;
  rotation: number; // 0, 90, 180, 270 degrees
  order: number;
  fileType: string;
  size: number;
  createdAt: string;
}

export interface Patient {
  id: string;
  patientId: string; // e.g. TUTH-2026-9812
  name: string;
  age: number | string;
  gender: Gender;
  phone?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DoctorProfile {
  id: string;
  name: string;
  designation: string;
  credentials: string;
  department: string;
  signatureUrl?: string; // base64 or objectUrl
  isDefault?: boolean;
}

export interface HospitalProfile {
  id: string;
  name: string;
  address: string;
  department: string;
  logoUrl?: string;
  contactPhone: string;
  contactEmail: string;
  reportPrefix: string; // e.g. BR-2026-
}

export interface Report {
  id: string;
  reportNumber: string; // BR-2026-000001
  patientId: string;
  patientName: string;
  patientAge: number | string;
  patientGender: Gender;
  visitDate: string;
  referredBy: string;
  consultedBy: string;
  doctorId: string; // selected doctor ID
  procedureName: string; // e.g. "Digital Bronchoscopy"
  premedication: string;
  sedation: string;
  route: RouteOption;
  routeCustom?: string;
  ctFindings: string;
  indication: string;
  findings: BronchoscopyFinding[];
  bal: BALProcedure;
  endobronchialBiopsy: EndobronchialBiopsyProcedure;
  conventionalTbna: TBNAProcedure;
  brushing: BrushingProcedure;
  /** Free-form record of any interventions and samples collected. */
  interventionsText?: string;
  impression: string;
  advice: string;
  images: MedicalImage[];
  status: ReportStatus;
  version: number;
  parentReportId?: string;
  createdAt: string;
  updatedAt: string;
  finalizedAt?: string;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  defaultFindings: BronchoscopyFinding[];
  defaultPremedication?: string;
  defaultSedation?: string;
  defaultRoute?: RouteOption;
  defaultImpression?: string;
  defaultAdvice?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  reportId?: string;
  action:
    | 'Report Created'
    | 'Report Updated'
    | 'Report Finalized'
    | 'Report Amended'
    | 'Report Exported DOCX'
    | 'Report Exported PDF'
    | 'Report Printed'
    | 'Report Deleted'
    | 'Image Added'
    | 'Image Deleted'
    | 'Backup Exported'
    | 'Backup Restored';
  user: string;
  timestamp: string;
  details?: string;
}

export interface ReportFilter {
  searchQuery?: string;
  status?: ReportStatus | 'All';
  doctorId?: string;
  startDate?: string;
  endDate?: string;
}
