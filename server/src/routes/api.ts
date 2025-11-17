import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { DocxService } from '../services/docxService';
import { MappingGrid } from '../types';

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.docx') {
      return cb(new Error('Only .docx files are allowed'));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Initialize DocxService
const uploadDir = path.join(__dirname, '../../uploads');
const docxService = new DocxService(uploadDir);

// Upload DOCX file
router.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const docInfo = await docxService.processUpload(
      req.file.path,
      req.file.originalname
    );

    res.json({
      success: true,
      documentId: docInfo.id,
      originalName: docInfo.originalName,
      textContent: docInfo.textContent,
      uploadedAt: docInfo.uploadedAt
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to upload file'
    });
  }
});

// Anonymize document
router.post('/anonymize/:documentId', async (req: Request, res: Response) => {
  try {
    const { documentId } = req.params;
    const { customMapping } = req.body;

    let result;
    if (customMapping) {
      result = await docxService.anonymizeWithCustomMapping(
        documentId,
        customMapping as MappingGrid
      );
    } else {
      result = await docxService.anonymizeDocument(documentId);
    }

    res.json({
      success: true,
      originalText: result.originalText,
      anonymizedText: result.anonymizedText,
      mappingGrid: result.mappingGrid
    });
  } catch (error) {
    console.error('Anonymization error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to anonymize document'
    });
  }
});

// Download anonymized document
router.get('/download/:documentId', async (req: Request, res: Response) => {
  try {
    const { documentId } = req.params;
    const docInfo = docxService.getDocumentInfo(documentId);

    if (!docInfo) {
      return res.status(404).json({ error: 'Document not found' });
    }

    if (!docInfo.anonymizedPath) {
      return res.status(400).json({ error: 'Document has not been anonymized yet' });
    }

    const baseName = path.basename(docInfo.originalName, path.extname(docInfo.originalName));
    const downloadName = `${baseName}_anonymized.docx`;

    res.download(docInfo.anonymizedPath, downloadName);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to download file'
    });
  }
});

// Export mapping grid as JSON
router.get('/mapping/export/:documentId', async (req: Request, res: Response) => {
  try {
    const { documentId } = req.params;
    const docInfo = docxService.getDocumentInfo(documentId);

    if (!docInfo) {
      return res.status(404).json({ error: 'Document not found' });
    }

    if (!docInfo.mappingGrid) {
      return res.status(400).json({ error: 'No mapping grid available' });
    }

    // Save mapping to file
    const mappingPath = docxService.saveMappingGrid(documentId);
    const baseName = path.basename(docInfo.originalName, path.extname(docInfo.originalName));
    const downloadName = `${baseName}_mapping.json`;

    res.download(mappingPath, downloadName);
  } catch (error) {
    console.error('Export mapping error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to export mapping'
    });
  }
});

// Import mapping grid from JSON
router.post('/mapping/import', upload.single('mapping'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No mapping file uploaded' });
    }

    const mappingGrid = docxService.loadMappingGrid(req.file.path);

    // Clean up uploaded mapping file
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      mappingGrid
    });
  } catch (error) {
    console.error('Import mapping error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to import mapping'
    });
  }
});

// Get document info
router.get('/document/:documentId', async (req: Request, res: Response) => {
  try {
    const { documentId } = req.params;
    const docInfo = docxService.getDocumentInfo(documentId);

    if (!docInfo) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json({
      success: true,
      documentId: docInfo.id,
      originalName: docInfo.originalName,
      textContent: docInfo.textContent,
      uploadedAt: docInfo.uploadedAt,
      hasAnonymizedVersion: !!docInfo.anonymizedPath,
      hasMappingGrid: !!docInfo.mappingGrid
    });
  } catch (error) {
    console.error('Get document error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to get document info'
    });
  }
});

// Update mapping grid
router.put('/mapping/:documentId', async (req: Request, res: Response) => {
  try {
    const { documentId } = req.params;
    const { mappingGrid } = req.body;

    if (!mappingGrid) {
      return res.status(400).json({ error: 'Mapping grid is required' });
    }

    const result = await docxService.anonymizeWithCustomMapping(
      documentId,
      mappingGrid as MappingGrid
    );

    res.json({
      success: true,
      anonymizedText: result.anonymizedText,
      mappingGrid: result.mappingGrid
    });
  } catch (error) {
    console.error('Update mapping error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to update mapping'
    });
  }
});

export default router;
