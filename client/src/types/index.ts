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
  documentId: string;
  originalName: string;
  textContent: string;
  uploadedAt: string;
}

export interface AnonymizationResult {
  originalText: string;
  anonymizedText: string;
  mappingGrid: MappingGrid;
}

export interface UploadResponse {
  success: boolean;
  documentId: string;
  originalName: string;
  textContent: string;
  uploadedAt: string;
}

export interface AnonymizeResponse {
  success: boolean;
  originalText: string;
  anonymizedText: string;
  mappingGrid: MappingGrid;
}

export interface ErrorResponse {
  error: string;
}

export const DATA_TYPE_LABELS: Record<SensitiveDataType, string> = {
  name: 'Nome',
  email: 'Email',
  phone: 'Telefono',
  address: 'Indirizzo',
  fiscal_code: 'Codice Fiscale',
  vat_number: 'Partita IVA',
  birth_date: 'Data di Nascita',
  iban: 'IBAN'
};
