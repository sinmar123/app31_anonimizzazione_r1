# DOCX Anonymizer

Applicazione web per l'anonimizzazione automatica di documenti DOCX.

## Funzionalità

- 📤 Upload drag & drop di file DOCX
- 🔍 Estrazione automatica di dati sensibili (nomi, email, telefoni, indirizzi, CF, P.IVA, date)
- 🔄 Mapping automatico tra dati reali e fittizi
- 👁️ Preview affiancato del documento originale e anonimizzato
- ✏️ Tabella di mapping interattiva e modificabile
- 💾 Export/Import della griglia di mapping in JSON
- ⬇️ Download del DOCX anonimizzato

## Requisiti

- Node.js >= 18.0.0
- npm >= 9.0.0

## Installazione

```bash
npm run install:all
```

## Sviluppo

```bash
npm run dev
```

Il server sarà disponibile su `http://localhost:3001` e il client su `http://localhost:5173`.

## Build

```bash
npm run build
npm start
```

## Struttura del Progetto

```
├── client/                 # Frontend React + TypeScript
│   ├── src/
│   │   ├── components/    # Componenti React
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   └── ...
├── server/                 # Backend Express + TypeScript
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── utils/         # Utility functions
│   │   └── types/         # TypeScript types
│   └── ...
└── ...
```

## API Endpoints

- `POST /api/upload` - Upload DOCX file
- `POST /api/anonymize` - Anonymize document with mapping
- `GET /api/download/:id` - Download anonymized document
- `POST /api/mapping/export` - Export mapping as JSON
- `POST /api/mapping/import` - Import mapping from JSON

## Licenza

MIT
