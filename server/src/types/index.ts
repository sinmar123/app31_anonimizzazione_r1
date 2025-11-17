export interface SensitiveDataMatch {
  id: string;
  type: SensitiveDataType;
  original: string;
  anonymized: string;
  positions: number[];
}

export type SensitiveDataType =
  | 'name'
  | 'email'
  | 'phone'
  | 'address'
  | 'fiscal_code'
  | 'vat_number'
  | 'birth_date'
  | 'iban';

export interface MappingGrid {
  id: string;
  documentId: string;
  createdAt: string;
  mappings: SensitiveDataMatch[];
}

export interface DocumentInfo {
  id: string;
  originalName: string;
  uploadedAt: string;
  originalPath: string;
  anonymizedPath?: string;
  textContent: string;
  mappingGrid?: MappingGrid;
}

export interface AnonymizationResult {
  documentId: string;
  originalText: string;
  anonymizedText: string;
  mappingGrid: MappingGrid;
}

export interface ExtractionResult {
  text: string;
  matches: SensitiveDataMatch[];
}
