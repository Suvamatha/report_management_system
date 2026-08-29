import { getDB } from './db';
import type { ReportTemplate, AnatomicalLocation, BronchoscopyFinding } from '../../types';

const defaultLocations: AnatomicalLocation[] = [
  'Vocal Cord',
  'Trachea',
  'Carina',
  // 'Tracheobronchial Tree',
  'Right Upper Lobe',
  'Right Middle Lobe',
  'Right Lower Lobe',
  'Left Upper Lobe',
  'Lingular Lobe',
  'Left Lower Lobe',
];

export function createDefaultFindings(): BronchoscopyFinding[] {
  return defaultLocations.map((location) => ({
    id: `finding-${location.replace(/\s+/g, '-').toLowerCase()}`,
    anatomicalLocation: location,
    findingType: 'Normal',
    customText: '',
  }));
}

export const defaultTemplates: ReportTemplate[] = [
  {
    id: 'template-normal',
    name: 'Bronchoscopy - Completely Normal Study',
    description: 'Standard normal fiberoptic bronchoscopic study with normal airways throughout.',
    defaultFindings: createDefaultFindings(),
    defaultPremedication: 'Lignocaine 2% spray (topical airway anesthesia)',
    defaultSedation: 'Midazolam 2mg IV',
    defaultRoute: 'Oral',
    defaultImpression: 'Normal flexible fiberoptic bronchoscopy. Clear tracheobronchial tree with no endobronchial mass, stenosis, or mucosal lesion.',
    defaultAdvice: '1. Observe for 2 hours post-procedure.\n2. NPO for 2 hours until gag reflex returns.\n3. Routine follow-up in Pulmonology OPD as scheduled.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'template-standard-biopsy',
    name: 'Bronchoscopy - Endobronchial Biopsy Protocol',
    description: 'Standard protocol for endobronchial lesion evaluation with biopsy & BAL.',
    defaultFindings: createDefaultFindings(),
    defaultPremedication: 'Lignocaine 2% spray (topical airway anesthesia)',
    defaultSedation: 'Midazolam 2mg IV + Fentanyl 50mcg IV',
    defaultRoute: 'Oral',
    defaultImpression: 'Endobronchial lesion visualized. Biopsy and BAL performed for histopathology and microbiological analysis.',
    defaultAdvice: '1. Monitor vital signs and observe for post-biopsy hemoptysis.\n2. Check chest X-ray if symptomatic.\n3. Collect Histopathology and BAL cytology reports when available.',
    createdAt: new Date().toISOString(),
  },
];

export interface TemplateRepository {
  getAll(): Promise<ReportTemplate[]>;
  getById(id: string): Promise<ReportTemplate | null>;
  save(template: ReportTemplate): Promise<ReportTemplate>;
  delete(id: string): Promise<void>;
}

export const templateRepository: TemplateRepository = {
  async getAll(): Promise<ReportTemplate[]> {
    const db = await getDB();
    const templates = await db.getAll('templates');
    if (templates.length === 0) {
      for (const t of defaultTemplates) {
        await db.put('templates', t);
      }
      return defaultTemplates;
    }
    return templates;
  },

  async getById(id: string): Promise<ReportTemplate | null> {
    const db = await getDB();
    const template = await db.get('templates', id);
    return template || null;
  },

  async save(template: ReportTemplate): Promise<ReportTemplate> {
    const db = await getDB();
    await db.put('templates', template);
    return template;
  },

  async delete(id: string): Promise<void> {
    const db = await getDB();
    await db.delete('templates', id);
  },
};
