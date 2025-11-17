import React from 'react';
import './ActionButtons.css';

interface ActionButtonsProps {
  onDownloadDoc: () => void;
  onDownloadMapping: () => void;
  onReset: () => void;
  isLoading: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onDownloadDoc,
  onDownloadMapping,
  onReset,
  isLoading
}) => {
  return (
    <div className="action-buttons">
      <button
        className="btn btn-primary btn-large"
        onClick={onDownloadDoc}
        disabled={isLoading}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Scarica DOCX Anonimizzato
      </button>

      <button
        className="btn btn-success btn-large"
        onClick={onDownloadMapping}
        disabled={isLoading}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
        Scarica Mapping JSON
      </button>

      <button
        className="btn btn-secondary btn-large"
        onClick={onReset}
        disabled={isLoading}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="1 4 1 10 7 10" />
          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
        </svg>
        Nuovo Documento
      </button>
    </div>
  );
};
