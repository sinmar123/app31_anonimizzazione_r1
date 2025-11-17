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

// Words to exclude from name detection (titles, articles, common words)
export const EXCLUDED_WORDS = [
  // Titles and honorifics
  'Sig', 'Signor', 'Signore', 'Signora', 'Signorina',
  'Dott', 'Dottor', 'Dottore', 'Dottoressa',
  'Avv', 'Avvocato', 'Avvocatessa',
  'Ing', 'Ingegner', 'Ingegnere',
  'Prof', 'Professor', 'Professore', 'Professoressa',
  'Arch', 'Architetto',
  'Rag', 'Ragioniere', 'Ragioniera',
  'Geom', 'Geometra',
  'Presidente', 'Direttore', 'Direttrice',
  'Ministro', 'Senatore', 'Senatrice',
  'Onorevole', 'Sindaco',
  'Ill', 'Illmo', 'Illustrissimo',
  'Egr', 'Egregio', 'Egregia',
  'Gent', 'Gentile', 'Gentilissimo', 'Gentilissima',
  'Spett', 'Spettabile',
  'Preg', 'Pregiatissimo', 'Pregiatissima',
  // Articles
  'Il', 'Lo', 'La', 'Le', 'Li', 'Gli', 'I',
  'Un', 'Una', 'Uno',
  // Prepositions and conjunctions
  'Di', 'Da', 'In', 'Con', 'Su', 'Per', 'Tra', 'Fra',
  'Del', 'Dello', 'Della', 'Dei', 'Degli', 'Delle',
  'Al', 'Allo', 'Alla', 'Ai', 'Agli', 'Alle',
  'Dal', 'Dallo', 'Dalla', 'Dai', 'Dagli', 'Dalle',
  'Nel', 'Nello', 'Nella', 'Nei', 'Negli', 'Nelle',
  'Sul', 'Sullo', 'Sulla', 'Sui', 'Sugli', 'Sulle',
  'Col', 'Coi',
  'Ed', 'Od',
  // Common words that might appear capitalized
  'Che', 'Chi', 'Cosa', 'Come', 'Dove', 'Quando', 'Perché',
  'Questo', 'Questa', 'Questi', 'Queste', 'Quello', 'Quella',
  'Quale', 'Quali', 'Quanto', 'Quanta', 'Quanti', 'Quante',
  'Tutto', 'Tutta', 'Tutti', 'Tutte',
  'Altro', 'Altra', 'Altri', 'Altre',
  'Ogni', 'Qualche', 'Alcuni', 'Alcune',
  'Nessun', 'Nessuno', 'Nessuna',
  'Molto', 'Molta', 'Molti', 'Molte',
  'Poco', 'Poca', 'Pochi', 'Poche',
  'Tanto', 'Tanta', 'Tanti', 'Tante',
  'Proprio', 'Propria', 'Propri', 'Proprie',
  'Stesso', 'Stessa', 'Stessi', 'Stesse',
  // Verbs that might appear capitalized at start of sentence
  'Essere', 'Avere', 'Fare', 'Dire', 'Dare', 'Stare',
  'Andare', 'Venire', 'Potere', 'Volere', 'Dovere', 'Sapere'
];
