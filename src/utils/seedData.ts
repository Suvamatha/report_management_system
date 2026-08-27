import type { Report, AnatomicalLocation } from '../types';
import { reportRepository } from '../services/storage/reportRepository';
import { hospitalRepository } from '../services/storage/hospitalRepository';
import { doctorRepository, defaultDoctors } from '../services/storage/doctorRepository';
import { templateRepository, createDefaultFindings } from '../services/storage/templateRepository';

const anatomicalLocations: AnatomicalLocation[] = [
  'Vocal Cord',
  'Trachea',
  'Carina',
  'Tracheobronchial Tree',
  'Right Upper Lobe',
  'Right Middle Lobe',
  'Right Lower Lobe',
  'Left Upper Lobe',
  'Lingular Lobe',
  'Left Lower Lobe',
];

export async function seedInitialDataIfNeeded(): Promise<void> {
  // Ensure hospital profile exists
  await hospitalRepository.getProfile();

  // Ensure doctor profiles exist
  await doctorRepository.getAll();

  // Ensure templates exist
  await templateRepository.getAll();

  // Check if reports exist
  const existingReports = await reportRepository.getAll();

  if (existingReports.length === 0) {
    const today = new Date().toISOString().split('T')[0];

    const demoReport1: Report = {
      id: 'rep-demo-001',
      reportNumber: 'BR-2026-000001',
      patientId: 'PAT-98412',
      patientName: 'Ram Bahadur Thapa',
      patientAge: 54,
      patientGender: 'Male',
      visitDate: today,
      referredBy: 'Dr. K. P. Sharma (Internal Med)',
      consultedBy: 'Dr. Ramesh Sharma',
      doctorId: defaultDoctors[0].id,
      procedureName: 'Flexible Fiberoptic Bronchoscopy',
      premedication: 'Lignocaine 2% topical spray to upper airway',
      sedation: 'Midazolam 2.5mg IV',
      route: 'Oral',
      ctFindings: 'Chest CT shows right upper lobe subsolid nodular opacity (2.2cm) with mild ipsilateral hilar lymphadenopathy. No obvious cavitation.',
      indication: 'Persistent cough for 3 months with focal right upper lobe opacity on CT scanning.',
      findings: anatomicalLocations.map((loc) => {
        if (loc === 'Right Upper Lobe') {
          return {
            id: `f-${loc.replace(/\s+/g, '-')}`,
            anatomicalLocation: loc,
            findingType: 'Abnormal',
            customText: 'Mucosal erythema and luminal narrowing at apical segment orifice with irregular friable endobronchial lesion.',
          };
        }
        if (loc === 'Carina') {
          return {
            id: `f-${loc.replace(/\s+/g, '-')}`,
            anatomicalLocation: loc,
            findingType: 'Normal',
            customText: 'Sharp and mobile carina.',
          };
        }
        return {
          id: `f-${loc.replace(/\s+/g, '-')}`,
          anatomicalLocation: loc,
          findingType: 'Normal',
          customText: 'Normal lumen and mucosal architecture.',
        };
      }),
      bal: {
        done: true,
        sampleSite: 'Right Upper Lobe (Apical Segment)',
        specimenTests: 'Cytology, AFB stain, GeneXpert MTB/RIF, Bacterial Culture',
        notes: '2x 20mL saline instillation with good fluid return (18mL return).',
      },
      endobronchialBiopsy: {
        done: true,
        site: 'Right Upper Lobe lesion',
        specimenNotes: '4 bite biopsies obtained without significant bleeding.',
      },
      conventionalTbna: {
        done: false,
        stationSite: '',
        specimenTests: '',
        notes: '',
      },
      brushing: {
        done: true,
        site: 'RUL apical segmental bronchus',
        notes: 'Cytological brushings obtained and smeared onto glass slides; fixed in 95% ethanol.',
      },
      impression: 'Endobronchial mucosal irregularity/lesion at Right Upper Lobe apical segment. Biopsy, BAL, and brushing performed for histopathology and microbiological evaluation.',
      advice: '1. Post-bronchoscopy observation in recovery room for 2 hours.\n2. NPO for 2 hours until gag reflex fully recovers.\n3. Collect Histopathology, GeneXpert, and BAL cytology results in 3-5 days.',
      images: [],
      status: 'Completed',
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      finalizedAt: new Date().toISOString(),
    };

    const demoReport2: Report = {
      id: 'rep-demo-002',
      reportNumber: 'BR-2026-000002',
      patientId: 'PAT-67210',
      patientName: 'Sita Devi Gurung',
      patientAge: 42,
      patientGender: 'Female',
      visitDate: today,
      referredBy: 'Dr. A. Rai (OPD)',
      consultedBy: 'Dr. Sunita Shrestha',
      doctorId: defaultDoctors[1].id,
      procedureName: 'Diagnostic Fiberoptic Bronchoscopy',
      premedication: 'Lignocaine 2% gargle & local spray',
      sedation: 'Midazolam 2mg IV',
      route: 'Nasal',
      ctFindings: 'HRCT Chest reveals bilateral ground glass opacities predominantly in lower zones.',
      indication: 'Subacute shortness of breath and interstitial lung pattern on HRCT.',
      findings: createDefaultFindings(),
      bal: {
        done: true,
        sampleSite: 'Right Middle Lobe (Medial segment)',
        specimenTests: 'Differential cell count, AFB, Fungal culture, Pneumocystis PCR',
        notes: 'Serous fluid retrieved (45mL).',
      },
      endobronchialBiopsy: {
        done: false,
        site: '',
        specimenNotes: '',
      },
      conventionalTbna: {
        done: false,
        stationSite: '',
        specimenTests: '',
        notes: '',
      },
      brushing: {
        done: false,
        site: '',
        notes: '',
      },
      impression: 'Normal airway mucosal inspection. Bronchoalveolar Lavage (BAL) performed from Right Middle Lobe for ILD workup.',
      advice: '1. Monitor post-procedure oxygen saturation.\n2. Follow up with BAL cell count and microbiology reports.',
      images: [],
      status: 'Draft',
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await reportRepository.save(demoReport1);
    await reportRepository.save(demoReport2);
  }
}
