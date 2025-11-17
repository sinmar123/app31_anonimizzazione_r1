import { v4 as uuidv4 } from 'uuid';
import { SensitiveDataMatch, SensitiveDataType, ExtractionResult } from '../types';
import { PATTERNS, COMMON_ITALIAN_NAMES, COMMON_ITALIAN_SURNAMES, EXCLUDED_WORDS } from '../utils/patterns';
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
    // Pattern 1: Standard capitalized names (e.g., "Mario Rossi", "Nicolò Bianchi")
    const standardNamePattern = /\b([A-ZÀÈÉÌÒÙ][a-zàèéìòùäëïöüâêîôû]+(?:\s+[A-ZÀÈÉÌÒÙ][a-zàèéìòùäëïöüâêîôû]+){1,2})\b/g;

    // Pattern 2: Uppercase names (e.g., "PRONZATI CALAMARI Maurizia" or "ROSSI MARIO")
    const uppercaseNamePattern = /\b([A-ZÀÈÉÌÒÙ]{2,}(?:\s+[A-ZÀÈÉÌÒÙ]{2,})*(?:\s+[A-ZÀÈÉÌÒÙ][a-zàèéìòùäëïöüâêîôû]+)?)\b/g;

    // Pattern 3: Mixed format (e.g., "Maurizia PRONZATI" - name followed by uppercase surname)
    const mixedNamePattern = /\b([A-ZÀÈÉÌÒÙ][a-zàèéìòùäëïöüâêîôû]+\s+[A-ZÀÈÉÌÒÙ]{2,}(?:\s+[A-ZÀÈÉÌÒÙ]{2,})*)\b/g;

    let match;

    // Extract standard capitalized names
    while ((match = standardNamePattern.exec(text)) !== null) {
      this.processNameMatch(match[1], match.index);
    }

    // Extract uppercase names
    while ((match = uppercaseNamePattern.exec(text)) !== null) {
      const potentialName = match[1];
      // Must have at least 2 words or one uppercase word + one capitalized word
      const words = potentialName.split(/\s+/);
      if (words.length >= 2) {
        this.processNameMatch(potentialName, match.index);
      }
    }

    // Extract mixed format names
    while ((match = mixedNamePattern.exec(text)) !== null) {
      this.processNameMatch(match[1], match.index);
    }
  }

  private processNameMatch(potentialName: string, position: number): void {
    const words = potentialName.split(/\s+/);

    // Skip if any word is in the exclusion list (titles, articles, common words)
    // Check both original case and title case versions
    const hasExcludedWord = words.some(word => {
      const titleCase = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      return EXCLUDED_WORDS.includes(word) || EXCLUDED_WORDS.includes(titleCase);
    });

    if (hasExcludedWord) {
      return;
    }

    // Check if any word matches common Italian names or surnames (case-insensitive)
    const hasCommonName = words.some(word => {
      const titleCase = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      return (
        COMMON_ITALIAN_NAMES.includes(word) ||
        COMMON_ITALIAN_NAMES.includes(titleCase) ||
        COMMON_ITALIAN_SURNAMES.includes(word) ||
        COMMON_ITALIAN_SURNAMES.includes(titleCase)
      );
    });

    // Check if it looks like a name pattern
    const looksLikeName = words.length >= 2 && words.every(w =>
      /^[A-ZÀÈÉÌÒÙ][a-zàèéìòùäëïöüâêîôû]+$/.test(w) || // Standard capitalized
      /^[A-ZÀÈÉÌÒÙ]{2,}$/.test(w) // All uppercase
    );

    if ((hasCommonName || looksLikeName) && !this.isAlreadyMatched(potentialName)) {
      const existingMatch = this.findExistingMatchByOriginal(potentialName);

      if (existingMatch) {
        existingMatch.positions.push(position);
      } else {
        const newMatch: SensitiveDataMatch = {
          id: uuidv4(),
          type: 'name',
          original: potentialName,
          anonymized: generateFakeData('name'),
          positions: [position]
        };
        this.foundMatches.set(potentialName, newMatch);
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
