import * as fs from 'fs';
import * as path from 'path';
import mammoth from 'mammoth';
import JSZip from 'jszip';
import { AnonymizationService } from './anonymizationService';
import { DocumentInfo, MappingGrid, AnonymizationResult, SensitiveDataMatch } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class DocxService {
  private anonymizationService: AnonymizationService;
  private uploadDir: string;
  private documents: Map<string, DocumentInfo> = new Map();

  constructor(uploadDir: string) {
    this.anonymizationService = new AnonymizationService();
    this.uploadDir = uploadDir;

    // Ensure upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
  }

  async processUpload(filePath: string, originalName: string): Promise<DocumentInfo> {
    const documentId = uuidv4();

    // Extract text from DOCX
    const textContent = await this.extractTextFromDocx(filePath);

    // Create document info
    const docInfo: DocumentInfo = {
      id: documentId,
      originalName,
      uploadedAt: new Date().toISOString(),
      originalPath: filePath,
      textContent
    };

    this.documents.set(documentId, docInfo);

    return docInfo;
  }

  async extractTextFromDocx(filePath: string): Promise<string> {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }

  async anonymizeDocument(documentId: string): Promise<AnonymizationResult> {
    const docInfo = this.documents.get(documentId);
    if (!docInfo) {
      throw new Error(`Document with ID ${documentId} not found`);
    }

    const result = this.anonymizationService.anonymizeText(
      docInfo.textContent,
      documentId
    );

    // Save mapping grid to document info
    docInfo.mappingGrid = result.mappingGrid;

    // Generate anonymized DOCX file
    const anonymizedPath = await this.generateAnonymizedDocx(
      documentId,
      result.anonymizedText,
      docInfo.originalName
    );

    docInfo.anonymizedPath = anonymizedPath;

    return result;
  }

  async anonymizeWithCustomMapping(
    documentId: string,
    mappingGrid: MappingGrid
  ): Promise<AnonymizationResult> {
    const docInfo = this.documents.get(documentId);
    if (!docInfo) {
      throw new Error(`Document with ID ${documentId} not found`);
    }

    const anonymizedText = this.anonymizationService.applyCustomMapping(
      docInfo.textContent,
      mappingGrid
    );

    const result: AnonymizationResult = {
      documentId,
      originalText: docInfo.textContent,
      anonymizedText,
      mappingGrid
    };

    // Update document info
    docInfo.mappingGrid = mappingGrid;

    // Generate anonymized DOCX file
    const anonymizedPath = await this.generateAnonymizedDocx(
      documentId,
      anonymizedText,
      docInfo.originalName
    );

    docInfo.anonymizedPath = anonymizedPath;

    return result;
  }

  private async generateAnonymizedDocx(
    documentId: string,
    anonymizedText: string,
    originalName: string
  ): Promise<string> {
    const docInfo = this.documents.get(documentId);
    if (!docInfo) {
      throw new Error(`Document with ID ${documentId} not found`);
    }

    // Load the original DOCX file as a ZIP (DOCX is just a ZIP archive)
    const originalBuffer = fs.readFileSync(docInfo.originalPath);
    const zip = await JSZip.loadAsync(originalBuffer);

    // Get the main document XML
    const documentXmlFile = zip.file('word/document.xml');
    if (!documentXmlFile) {
      throw new Error('Invalid DOCX file: word/document.xml not found');
    }
    const documentXml = await documentXmlFile.async('string');

    // Apply replacements to the XML while preserving structure
    let modifiedXml = documentXml;

    if (docInfo.mappingGrid) {
      modifiedXml = this.applyReplacementsToXml(documentXml, docInfo.mappingGrid.mappings);
    }

    // Update the ZIP with the modified XML
    zip.file('word/document.xml', modifiedXml);

    // Generate the new DOCX buffer
    const buffer = await zip.generateAsync({ type: 'nodebuffer' });

    const baseName = path.basename(originalName, path.extname(originalName));
    const anonymizedFileName = `${baseName}_anonymized_${documentId}.docx`;
    const anonymizedPath = path.join(this.uploadDir, anonymizedFileName);

    fs.writeFileSync(anonymizedPath, buffer);

    return anonymizedPath;
  }

  private applyReplacementsToXml(xml: string, mappings: SensitiveDataMatch[]): string {
    let result = xml;

    // Sort by length (longest first) to avoid partial replacements
    const sortedMappings = [...mappings].sort(
      (a, b) => b.original.length - a.original.length
    );

    for (const mapping of sortedMappings) {
      // Escape special regex characters in the search pattern
      const escapedOriginal = this.escapeRegExp(mapping.original);

      // Replace all occurrences in the XML
      // This will work for text that is not split by formatting tags
      const regex = new RegExp(escapedOriginal, 'g');
      result = result.replace(regex, mapping.anonymized);
    }

    return result;
  }

  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  getDocumentInfo(documentId: string): DocumentInfo | undefined {
    return this.documents.get(documentId);
  }

  saveMappingGrid(documentId: string): string {
    const docInfo = this.documents.get(documentId);
    if (!docInfo || !docInfo.mappingGrid) {
      throw new Error(`Mapping grid for document ${documentId} not found`);
    }

    const baseName = path.basename(docInfo.originalName, path.extname(docInfo.originalName));
    const mappingFileName = `${baseName}_mapping_${documentId}.json`;
    const mappingPath = path.join(this.uploadDir, mappingFileName);

    fs.writeFileSync(
      mappingPath,
      JSON.stringify(docInfo.mappingGrid, null, 2),
      'utf-8'
    );

    return mappingPath;
  }

  loadMappingGrid(filePath: string): MappingGrid {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as MappingGrid;
  }

  cleanup(documentId: string): void {
    const docInfo = this.documents.get(documentId);
    if (docInfo) {
      // Remove files
      if (fs.existsSync(docInfo.originalPath)) {
        fs.unlinkSync(docInfo.originalPath);
      }
      if (docInfo.anonymizedPath && fs.existsSync(docInfo.anonymizedPath)) {
        fs.unlinkSync(docInfo.anonymizedPath);
      }
      this.documents.delete(documentId);
    }
  }
}
