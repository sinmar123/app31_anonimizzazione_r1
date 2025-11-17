// Italian sensitive data patterns
export const PATTERNS = {
  // Italian Fiscal Code (Codice Fiscale)
  fiscal_code: /\b[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]\b/gi,

  // Italian VAT Number (Partita IVA)
  vat_number: /\b(IT)?[0-9]{11}\b/g,

  // Email addresses
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,

  // Phone numbers (Italian format)
  phone: /\b(?:\+39\s?)?(?:0\d{1,4}|\d{3})[\s.-]?\d{6,7}\b|\b(?:\+39\s?)?\d{3}[\s.-]?\d{3}[\s.-]?\d{4}\b/g,

  // Dates (various formats)
  birth_date: /\b(?:\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}|\d{2,4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2})\b/g,

  // IBAN (Italian)
  iban: /\bIT\d{2}[A-Z]\d{10}[A-Z0-9]{12}\b/gi,

  // Italian addresses (simplified pattern)
  address: /\b(?:Via|Viale|Piazza|Corso|Largo|Vicolo|Strada|Contrada)\s+[A-Za-zÀ-ÿ\s]+,?\s*\d{1,5}(?:\s*[\/\-]?\s*[A-Za-z0-9]*)?\b/gi,

  // Names (capitalized words, including accented characters)
  // Supports Italian accented characters: À, È, É, Ì, Ò, Ù and lowercase à, è, é, ì, ò, ù
  name: /\b[A-ZÀÈÉÌÒÙ][a-zàèéìòùäëïöüâêîôû]+(?:\s+[A-ZÀÈÉÌÒÙ][a-zàèéìòùäëïöüâêîôû]+){1,2}\b/g
};

// Common Italian first names for better detection
export const COMMON_ITALIAN_NAMES = [
  'Marco', 'Giuseppe', 'Giovanni', 'Antonio', 'Francesco', 'Mario',
  'Luigi', 'Roberto', 'Andrea', 'Stefano', 'Alessandro', 'Paolo',
  'Maria', 'Anna', 'Francesca', 'Laura', 'Sara', 'Elena', 'Giulia',
  'Chiara', 'Valentina', 'Silvia', 'Martina', 'Federica', 'Alessia',
  'Luca', 'Matteo', 'Davide', 'Simone', 'Riccardo', 'Fabio', 'Lorenzo',
  'Nicolò', 'Niccolò', 'Nicoló', 'Tommaso', 'Edoardo', 'Federico',
  'Gabriele', 'Leonardo', 'Michele', 'Emanuele', 'Enrico', 'Filippo'
];

// Common Italian surnames
export const COMMON_ITALIAN_SURNAMES = [
  'Rossi', 'Russo', 'Ferrari', 'Esposito', 'Bianchi', 'Romano',
  'Colombo', 'Ricci', 'Marino', 'Greco', 'Bruno', 'Gallo',
  'Conti', 'De Luca', 'Mancini', 'Costa', 'Giordano', 'Rizzo',
  'Lombardi', 'Moretti', 'Barbieri', 'Fontana', 'Santoro', 'Mariani'
];
