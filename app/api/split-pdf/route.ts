import { NextRequest } from 'next/server';
import * as path from 'path';
import * as fs from 'fs/promises';
import {
  saveUploadedFile,
  cleanupFiles,
  cleanupDir,
  readFileAsBuffer,
  errorResponse,
  fileResponse,
  validateFileType,
  validateFileTypeAndContent,
  validateFileSize,
  execAsync,
  generateTmpPath,
  TMP_DIR,
} from '@/lib/fileUtils';
import { v4 as uuidv4 } from 'uuid';
import { checkRateLimit, createRateLimitHeaders, rateLimitResponse, rateLimitConfigs } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  const rateLimit = await checkRateLimit(request, rateLimitConfigs.conversion);
  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit.reset);
  }

  let inputPath = '';
  let outputDir = '';
  let zipPath = '';

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const startPage = formData.get('startPage') as string | null;
    const endPage = formData.get('endPage') as string | null;

    if (!file) {
      return errorResponse('No file provided');
    }

    if (!validateFileSize(file.size)) {
      return errorResponse('File size exceeds 50MB limit');
    }

    // Validate file type and content
    const validation = await validateFileTypeAndContent(file, ['.pdf']);
    if (!validation.valid) {
      return errorResponse(validation.error || 'Invalid file');
    }

    

    const start = parseInt(startPage || '1', 10);
    const end = parseInt(endPage || '1', 10);

    if (isNaN(start) || isNaN(end) || start < 1 || end < start) {
      return errorResponse('Invalid page range');
    }

    inputPath = await saveUploadedFile(file);
    outputDir = path.join(TMP_DIR, uuidv4());
    await fs.mkdir(outputDir, { recursive: true });

    const outputPattern = path.join(outputDir, 'page-%d.pdf');

    // Split PDF using pdfseparate
    await execAsync(`pdfseparate -f ${start} -l ${end} "${inputPath}" "${outputPattern}"`);

    // Get all generated files
    const files = await fs.readdir(outputDir);
    const pdfFiles = files.filter(f => f.endsWith('.pdf'));

    if (pdfFiles.length === 0) {
      return errorResponse('No pages extracted. Check page range.');
    }

    if (pdfFiles.length === 1) {
      // Return single PDF
      const singlePath = path.join(outputDir, pdfFiles[0]);
      const buffer = await readFileAsBuffer(singlePath);
      const response = fileResponse(buffer, `extracted-page.pdf`, 'application/pdf');
      const rateLimitHeaders = createRateLimitHeaders(rateLimit.limit, rateLimit.remaining, rateLimit.reset);
      Object.entries(rateLimitHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    }

    // Multiple pages - create zip
    zipPath = generateTmpPath('.zip');
    const pdfPaths = pdfFiles.map(f => `"${path.join(outputDir, f)}"`).join(' ');
    await execAsync(`zip -j "${zipPath}" ${pdfPaths}`);

    const buffer = await readFileAsBuffer(zipPath);
    const response = fileResponse(buffer, 'split-pages.zip', 'application/zip');
    const rateLimitHeaders = createRateLimitHeaders(rateLimit.limit, rateLimit.remaining, rateLimit.reset);
    Object.entries(rateLimitHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  } catch (error) {
    console.error('Split PDF error:', error);
    return errorResponse('Split failed. Please try again.', 500);
  } finally {
    await cleanupFiles(inputPath, zipPath);
    await cleanupDir(outputDir);
  }
}
