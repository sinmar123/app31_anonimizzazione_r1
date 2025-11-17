import axios from 'axios';
import {
  UploadResponse,
  AnonymizeResponse,
  MappingGrid
} from '../types';

const API_BASE = '/api';

export const api = {
  async uploadDocument(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post<UploadResponse>(
      `${API_BASE}/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    return response.data;
  },

  async anonymizeDocument(
    documentId: string,
    customMapping?: MappingGrid
  ): Promise<AnonymizeResponse> {
    const response = await axios.post<AnonymizeResponse>(
      `${API_BASE}/anonymize/${documentId}`,
      customMapping ? { customMapping } : {}
    );

    return response.data;
  },

  async updateMapping(
    documentId: string,
    mappingGrid: MappingGrid
  ): Promise<AnonymizeResponse> {
    const response = await axios.put<AnonymizeResponse>(
      `${API_BASE}/mapping/${documentId}`,
      { mappingGrid }
    );

    return response.data;
  },

  getDownloadUrl(documentId: string): string {
    return `${API_BASE}/download/${documentId}`;
  },

  getMappingExportUrl(documentId: string): string {
    return `${API_BASE}/mapping/export/${documentId}`;
  },

  async importMapping(file: File): Promise<MappingGrid> {
    const formData = new FormData();
    formData.append('mapping', file);

    const response = await axios.post<{ success: boolean; mappingGrid: MappingGrid }>(
      `${API_BASE}/mapping/import`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    return response.data.mappingGrid;
  }
};
