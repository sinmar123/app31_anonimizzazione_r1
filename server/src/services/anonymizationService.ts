import { MappingGrid, SensitiveDataMatch, AnonymizationResult } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { ExtractionService } from './extractionService';

export class AnonymizationService {
  private extractionService: ExtractionService;

  constructor() {
    this.extractionService = new ExtractionService();
  }

  anonymizeText(text: string, documentId: string): AnonymizationResult {
    const { matches } = this.extractionService.extractSensitiveData(text);

    const mappingGrid: MappingGrid = {
      id: uuidv4(),
      documentId,
      createdAt: new Date().toISOString(),
      mappings: matches
    };

    const anonymizedText = this.applyAnonymization(text, matches);

    return {
      documentId,
      originalText: text,
      anonymizedText,
      mappingGrid
    };
  }

  applyAnonymization(text: string, mappings: SensitiveDataMatch[]): string {
    let result = text;

    // Sort by length (longest first) to avoid partial replacements
    const sortedMappings = [...mappings].sort(
      (a, b) => b.original.length - a.original.length
    );

    for (const mapping of sortedMappings) {
      // Use global replacement to replace all occurrences
      const escapedOriginal = this.escapeRegExp(mapping.original);
      const regex = new RegExp(escapedOriginal, 'g');
      result = result.replace(regex, mapping.anonymized);
    }

    return result;
  }

  applyCustomMapping(text: string, mappingGrid: MappingGrid): string {
    return this.applyAnonymization(text, mappingGrid.mappings);
  }

  deanonymizeText(anonymizedText: string, mappingGrid: MappingGrid): string {
    let result = anonymizedText;

    // Sort by length (longest first)
    const sortedMappings = [...mappingGrid.mappings].sort(
      (a, b) => b.anonymized.length - a.anonymized.length
    );

    for (const mapping of sortedMappings) {
      const escapedAnonymized = this.escapeRegExp(mapping.anonymized);
      const regex = new RegExp(escapedAnonymized, 'g');
      result = result.replace(regex, mapping.original);
    }

    return result;
  }

  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
