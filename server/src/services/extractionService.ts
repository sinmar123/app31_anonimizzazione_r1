import { v4 as uuidv4 } from 'uuid';
import { SensitiveDataMatch, SensitiveDataType, ExtractionResult } from '../types';
import { PATTERNS, COMMON_ITALIAN_NAMES, COMMON_ITALIAN_SURNAMES } from '../utils/patterns';
import { generateFakeData, resetCounters } from '../utils/generators';

export class ExtractionService {
  private foundMatches: Map<string, SensitiveDataMatch> = new Map();

  extractSensitiveData(text: string): ExtractionResult {
    this.foundMatches.clear();
    resetCounters();

    // Extract in order of specificity (most specific first)
    this.extractByPattern(text, 'fiscal_code', PATTERNS.fiscal_code);
    this.extractByPattern(text, 'iban', PATTERNS.iban);
    this.extractByPattern(text, 'vat_number', PATTERNS.vat_number);
    this.extractByPattern(text, 'email', PATTERNS.email);
    this.extractByPattern(text, 'phone', PATTERNS.phone);
    this.extractByPattern(text, 'address', PATTERNS.address);
    this.extractByPattern(text, 'birth_date', PATTERNS.birth_date);
    this.extractNames(text);

    const matches = Array.from(this.foundMatches.values());

    return {
      text,
      matches
    };
  }

  private extractByPattern(
    text: string,
    type: SensitiveDataType,
    pattern: RegExp
  ): void {
    const regex = new RegExp(pattern.source, pattern.flags);
    let match;

    while ((match = regex.exec(text)) !== null) {
      const original = match[0];

      // Skip if already matched (avoid duplicates)
      if (!this.isAlreadyMatched(original)) {
        const existingMatch = this.findExistingMatchByOriginal(original);

        if (existingMatch) {
          existingMatch.positions.push(match.index);
        } else {
          const newMatch: SensitiveDataMatch = {
            id: uuidv4(),
            type,
            original,
            anonymized: generateFakeData(type),
            positions: [match.index]
          };
          this.foundMatches.set(original, newMatch);
        }
      }
    }
  }

  private extractNames(text: string): void {
    // First, look for common Italian names with accented character support
    const namePattern = /\b([A-ZÀÈÉÌÒÙ][a-zàèéìòùäëïöüâêîôû]+(?:\s+[A-ZÀÈÉÌÒÙ][a-zàèéìòùäëïöüâêîôû]+){1,2})\b/g;
    let match;

    while ((match = namePattern.exec(text)) !== null) {
      const potentialName = match[1];
      const words = potentialName.split(/\s+/);

      // Check if any word is a common Italian name or surname
      const hasCommonName = words.some(
        word =>
          COMMON_ITALIAN_NAMES.includes(word) ||
          COMMON_ITALIAN_SURNAMES.includes(word)
      );

      // Also accept patterns like "Nome Cognome" that look like names (with accented chars)
      const looksLikeName = words.length >= 2 && words.every(w => /^[A-ZÀÈÉÌÒÙ][a-zàèéìòùäëïöüâêîôû]+$/.test(w));

      if ((hasCommonName || looksLikeName) && !this.isAlreadyMatched(potentialName)) {
        const existingMatch = this.findExistingMatchByOriginal(potentialName);

        if (existingMatch) {
          existingMatch.positions.push(match.index);
        } else {
          const newMatch: SensitiveDataMatch = {
            id: uuidv4(),
            type: 'name',
            original: potentialName,
            anonymized: generateFakeData('name'),
            positions: [match.index]
          };
          this.foundMatches.set(potentialName, newMatch);
        }
      }
    }
  }

  private isAlreadyMatched(text: string): boolean {
    // Check if this text is part of an already matched string
    for (const match of this.foundMatches.values()) {
      if (match.original.includes(text) && match.original !== text) {
        return true;
      }
    }
    return false;
  }

  private findExistingMatchByOriginal(original: string): SensitiveDataMatch | undefined {
    return this.foundMatches.get(original);
  }
}
