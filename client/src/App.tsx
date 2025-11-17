import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { DocumentPreview } from './components/DocumentPreview';
import { MappingTable } from './components/MappingTable';
import { ActionButtons } from './components/ActionButtons';
import { api } from './services/api';
import { MappingGrid, DocumentInfo, AnonymizationResult } from './types';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [documentInfo, setDocumentInfo] = useState<DocumentInfo | null>(null);
  const [anonymizationResult, setAnonymizationResult] = useState<AnonymizationResult | null>(null);

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      // Upload the file
      const uploadResponse = await api.uploadDocument(file);
      setDocumentInfo({
        documentId: uploadResponse.documentId,
        originalName: uploadResponse.originalName,
        textContent: uploadResponse.textContent,
        uploadedAt: uploadResponse.uploadedAt
      });

      // Automatically anonymize
      const anonymizeResponse = await api.anonymizeDocument(uploadResponse.documentId);
      setAnonymizationResult({
        originalText: anonymizeResponse.originalText,
        anonymizedText: anonymizeResponse.anonymizedText,
        mappingGrid: anonymizeResponse.mappingGrid
      });
    } catch (err) {
      console.error('Error processing file:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Si è verificato un errore durante il caricamento del file'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleMappingUpdate = async (updatedGrid: MappingGrid) => {
    if (!documentInfo) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.updateMapping(documentInfo.documentId, updatedGrid);
      setAnonymizationResult({
        originalText: anonymizationResult?.originalText || documentInfo.textContent,
        anonymizedText: response.anonymizedText,
        mappingGrid: response.mappingGrid
      });
    } catch (err) {
      console.error('Error updating mapping:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Si è verificato un errore durante l\'aggiornamento del mapping'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportMapping = () => {
    if (!documentInfo) return;
    window.location.href = api.getMappingExportUrl(documentInfo.documentId);
  };

  const handleImportMapping = async (file: File) => {
    if (!documentInfo) return;

    setIsLoading(true);
    setError(null);

    try {
      const importedGrid = await api.importMapping(file);
      // Apply the imported mapping
      await handleMappingUpdate(importedGrid);
    } catch (err) {
      console.error('Error importing mapping:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Si è verificato un errore durante l\'importazione del mapping'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadDoc = () => {
    if (!documentInfo) return;
    window.location.href = api.getDownloadUrl(documentInfo.documentId);
  };

  const handleDownloadMapping = () => {
    handleExportMapping();
  };

  const handleReset = () => {
    setDocumentInfo(null);
    setAnonymizationResult(null);
    setError(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <h1>DOCX Anonymizer</h1>
          <p className="subtitle">
            Anonimizza automaticamente i tuoi documenti DOCX proteggendo i dati sensibili
          </p>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          {error && (
            <div className="error-banner">
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
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
              <button className="error-close" onClick={() => setError(null)}>
                &times;
              </button>
            </div>
          )}

          {!documentInfo ? (
            <div className="upload-section">
              <FileUpload onFileSelect={handleFileSelect} isLoading={isLoading} />
              <div className="features">
                <div className="feature">
                  <div className="feature-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <h3>Protezione Dati</h3>
                  <p>Rileva automaticamente nomi, email, telefoni, CF, P.IVA e altro</p>
                </div>
                <div className="feature">
                  <div className="feature-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="16 18 22 12 16 6" />
                      <polyline points="8 6 2 12 8 18" />
                    </svg>
                  </div>
                  <h3>Mapping JSON</h3>
                  <p>Esporta e importa la griglia di mapping per de-anonimizzazione</p>
                </div>
                <div className="feature">
                  <div className="feature-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <line x1="3" y1="9" x2="21" y2="9" />
                      <line x1="9" y1="21" x2="9" y2="9" />
                    </svg>
                  </div>
                  <h3>Tabella Interattiva</h3>
                  <p>Modifica manualmente i valori anonimizzati secondo le tue esigenze</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="results-section">
              <div className="document-info">
                <h2>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
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
                  {documentInfo.originalName}
                </h2>
                <span className="upload-time">
                  Caricato il {new Date(documentInfo.uploadedAt).toLocaleString('it-IT')}
                </span>
              </div>

              {anonymizationResult && (
                <>
                  <DocumentPreview
                    originalText={anonymizationResult.originalText}
                    anonymizedText={anonymizationResult.anonymizedText}
                  />

                  <MappingTable
                    mappingGrid={anonymizationResult.mappingGrid}
                    onMappingUpdate={handleMappingUpdate}
                    onExport={handleExportMapping}
                    onImport={handleImportMapping}
                  />

                  <ActionButtons
                    onDownloadDoc={handleDownloadDoc}
                    onDownloadMapping={handleDownloadMapping}
                    onReset={handleReset}
                    isLoading={isLoading}
                  />
                </>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>DOCX Anonymizer - Proteggi i dati sensibili nei tuoi documenti</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
