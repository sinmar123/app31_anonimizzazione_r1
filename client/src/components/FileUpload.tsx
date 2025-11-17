import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import './FileUpload.css';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isLoading }) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    disabled: isLoading
  });

  return (
    <div
      {...getRootProps()}
      className={`file-upload ${isDragActive ? 'drag-active' : ''} ${isLoading ? 'loading' : ''}`}
    >
      <input {...getInputProps()} />
      <div className="upload-icon">
        {isLoading ? (
          <div className="spinner"></div>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        )}
      </div>
      <div className="upload-text">
        {isLoading ? (
          <p>Caricamento in corso...</p>
        ) : isDragActive ? (
          <p>Rilascia il file qui...</p>
        ) : (
          <>
            <p className="upload-main-text">
              Trascina qui il file DOCX o clicca per selezionarlo
            </p>
            <p className="upload-sub-text">
              Supportati solo file .docx (max 10MB)
            </p>
          </>
        )}
      </div>
    </div>
  );
};
