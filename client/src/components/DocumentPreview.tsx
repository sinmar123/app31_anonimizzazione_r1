import React from 'react';
import './DocumentPreview.css';

interface DocumentPreviewProps {
  originalText: string;
  anonymizedText: string;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  originalText,
  anonymizedText
}) => {
  return (
    <div className="document-preview">
      <div className="preview-panel">
        <div className="preview-header">
          <h3>Documento Originale</h3>
          <span className="badge badge-original">Originale</span>
        </div>
        <div className="preview-content">
          <pre>{originalText}</pre>
        </div>
      </div>
      <div className="preview-panel">
        <div className="preview-header">
          <h3>Documento Anonimizzato</h3>
          <span className="badge badge-anonymized">Anonimizzato</span>
        </div>
        <div className="preview-content">
          <pre>{anonymizedText}</pre>
        </div>
      </div>
    </div>
  );
};
