import { SensitiveDataType } from '../types';

// Fake Italian first names
const FAKE_FIRST_NAMES = [
  'Aldo', 'Bruno', 'Carlo', 'Diego', 'Enrico', 'Fabio', 'Giorgio',
  'Ivan', 'Leo', 'Mirco', 'Nino', 'Omar', 'Pietro', 'Remo', 'Sergio',
  'Alba', 'Bruna', 'Carla', 'Diana', 'Eva', 'Flora', 'Gina',
  'Ida', 'Lisa', 'Mara', 'Nina', 'Olga', 'Paola', 'Rita', 'Sara'
];

// Fake Italian surnames
const FAKE_SURNAMES = [
  'Verdi', 'Neri', 'Viola', 'Grigi', 'Azzurri', 'Gialli', 'Rosa',
  'Marrone', 'Celeste', 'Arancio', 'Cremisi', 'Porpora', 'Turchese',
  'Smeraldo', 'Rubino', 'Zaffiro', 'Topazio', 'Ambra', 'Corallo', 'Perla'
];

// Fake street names
const FAKE_STREETS = [
  'Via Roma', 'Via Milano', 'Via Napoli', 'Via Torino', 'Via Firenze',
  'Corso Italia', 'Piazza Centrale', 'Viale Europa', 'Via della Pace',
  'Via Libertà', 'Corso Vittoria', 'Piazza Unità'
];

// Fake email domains
const FAKE_DOMAINS = ['esempio.it', 'test.com', 'demo.org', 'prova.net'];

let nameCounter = 0;
let emailCounter = 0;
let phoneCounter = 0;
let addressCounter = 0;
let cfCounter = 0;
let vatCounter = 0;
let dateCounter = 0;
let ibanCounter = 0;

export function resetCounters(): void {
  nameCounter = 0;
  emailCounter = 0;
  phoneCounter = 0;
  addressCounter = 0;
  cfCounter = 0;
  vatCounter = 0;
  dateCounter = 0;
  ibanCounter = 0;
}

export function generateFakeData(type: SensitiveDataType): string {
  switch (type) {
    case 'name':
      return generateFakeName();
    case 'email':
      return generateFakeEmail();
    case 'phone':
      return generateFakePhone();
    case 'address':
      return generateFakeAddress();
    case 'fiscal_code':
      return generateFakeFiscalCode();
    case 'vat_number':
      return generateFakeVatNumber();
    case 'birth_date':
      return generateFakeBirthDate();
    case 'iban':
      return generateFakeIban();
    default:
      return '[REDACTED]';
  }
}

function generateFakeName(): string {
  const firstName = FAKE_FIRST_NAMES[nameCounter % FAKE_FIRST_NAMES.length];
  const surname = FAKE_SURNAMES[nameCounter % FAKE_SURNAMES.length];
  nameCounter++;
  return `${firstName} ${surname}`;
}

function generateFakeEmail(): string {
  const domain = FAKE_DOMAINS[emailCounter % FAKE_DOMAINS.length];
  emailCounter++;
  return `utente${emailCounter}@${domain}`;
}

function generateFakePhone(): string {
  phoneCounter++;
  const prefix = ['333', '339', '347', '320', '328'][phoneCounter % 5];
  const number = String(1000000 + phoneCounter).padStart(7, '0');
  return `+39 ${prefix} ${number}`;
}

function generateFakeAddress(): string {
  const street = FAKE_STREETS[addressCounter % FAKE_STREETS.length];
  addressCounter++;
  return `${street}, ${addressCounter}`;
}

function generateFakeFiscalCode(): string {
  cfCounter++;
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let cf = '';
  for (let i = 0; i < 6; i++) {
    cf += letters[(cfCounter + i) % 26];
  }
  cf += String(50 + (cfCounter % 50)).padStart(2, '0');
  cf += letters[cfCounter % 12]; // Month letter
  cf += String(1 + (cfCounter % 28)).padStart(2, '0');
  cf += letters[cfCounter % 26];
  cf += String(100 + (cfCounter % 900)).padStart(3, '0');
  cf += letters[(cfCounter * 7) % 26];
  return cf;
}

function generateFakeVatNumber(): string {
  vatCounter++;
  return String(10000000000 + vatCounter).padStart(11, '0');
}

function generateFakeBirthDate(): string {
  dateCounter++;
  const day = String(1 + (dateCounter % 28)).padStart(2, '0');
  const month = String(1 + (dateCounter % 12)).padStart(2, '0');
  const year = 1950 + (dateCounter % 50);
  return `${day}/${month}/${year}`;
}

function generateFakeIban(): string {
  ibanCounter++;
  const checkDigits = String(10 + (ibanCounter % 90)).padStart(2, '0');
  const cin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[ibanCounter % 26];
  const abi = String(10000 + ibanCounter).slice(-5);
  const cab = String(10000 + (ibanCounter * 3)).slice(-5);
  const account = String(100000000000 + ibanCounter).slice(-12);
  return `IT${checkDigits}${cin}${abi}${cab}${account}`;
}
