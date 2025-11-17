import React, { useState } from 'react';
import { SensitiveDataMatch, MappingGrid, DATA_TYPE_LABELS } from '../types';
import './MappingTable.css';

interface MappingTableProps {
  mappingGrid: MappingGrid;
  onMappingUpdate: (updatedGrid: MappingGrid) => void;
  onExport: () => void;
  onImport: (file: File) => void;
}

export const MappingTable: React.FC<MappingTableProps> = ({
  mappingGrid,
  onMappingUpdate,
  onExport,
  onImport
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleEdit = (match: SensitiveDataMatch) => {
    setEditingId(match.id);
    setEditValue(match.anonymized);
  };

  const handleSave = (matchId: string) => {
    const updatedMappings = mappingGrid.mappings.map(m =>
      m.id === matchId ? { ...m, anonymized: editValue } : m
    );
    onMappingUpdate({
      ...mappingGrid,
      mappings: updatedMappings
    });
    setEditingId(null);
    setEditValue('');
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValue('');
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
    }
    e.target.value = '';
  };

  const groupedMappings = mappingGrid.mappings.reduce((acc, match) => {
    if (!acc[match.type]) {
      acc[match.type] = [];
    }
    acc[match.type].push(match);
    return acc;
  }, {} as Record<string, SensitiveDataMatch[]>);

  return (
    <div className="mapping-table-container">
      <div className="mapping-header">
        <h3>Griglia di Mapping</h3>
        <div className="mapping-actions">
          <button className="btn btn-secondary" onClick={onExport}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
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
            Esporta JSON
          </button>
          <label className="btn btn-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
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
            Importa JSON
            <input
              type="file"
              accept=".json"
              onChange={handleFileImport}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>

      <div className="mapping-stats">
        <span className="stat">
          <strong>{mappingGrid.mappings.length}</strong> elementi trovati
        </span>
        <span className="stat">
          <strong>{Object.keys(groupedMappings).length}</strong> categorie
        </span>
      </div>

      {Object.entries(groupedMappings).map(([type, matches]) => (
        <div key={type} className="mapping-group">
          <div className="group-header">
            <span className="group-title">
              {DATA_TYPE_LABELS[type as keyof typeof DATA_TYPE_LABELS] || type}
            </span>
            <span className="group-count">{matches.length}</span>
          </div>
          <table className="mapping-table">
            <thead>
              <tr>
                <th>Dato Originale</th>
                <th>Dato Anonimizzato</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {matches.map(match => (
                <tr key={match.id}>
                  <td className="original-value">{match.original}</td>
                  <td>
                    {editingId === match.id ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        className="edit-input"
                        autoFocus
                      />
                    ) : (
                      <span className="anonymized-value">{match.anonymized}</span>
                    )}
                  </td>
                  <td className="actions-cell">
                    {editingId === match.id ? (
                      <>
                        <button
                          className="btn-icon btn-save"
                          onClick={() => handleSave(match.id)}
                          title="Salva"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </button>
                        <button
                          className="btn-icon btn-cancel"
                          onClick={handleCancel}
                          title="Annulla"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </>
                    ) : (
                      <button
                        className="btn-icon btn-edit"
                        onClick={() => handleEdit(match)}
                        title="Modifica"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {mappingGrid.mappings.length === 0 && (
        <div className="no-data">
          Nessun dato sensibile trovato nel documento.
        </div>
      )}
    </div>
  );
};
