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
  validateFileTypeAndContent,
  validateFileSize,
  execAsync,
  generateTmpPath,
  TMP_DIR,
} from '@/lib/fileUtils';
import { v4 as uuidv4 } from 'uuid';
import { checkRateLimit, createRateLimitHeaders, rateLimitResponse, rateLimitConfigs } from '@/lib/rateLimit';
import { trackConversionStart, trackConversionEnd } from '@/lib/stats';

export async function POST(request: NextRequest) {
  const rateLimit = await checkRateLimit(request, rateLimitConfigs.conversion);
  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit.reset);
  }

  let inputPath = '';
  let outputDir = '';
  let zipPath = '';
  const startTime = Date.now();
  const trackingId = trackConversionStart('split-pdf');

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const startPage = formData.get('startPage') as string | null;
    const endPage = formData.get('endPage') as string | null;

    if (!file) {
      trackConversionEnd(trackingId, 'split-pdf', 'error', Date.now() - startTime, 0, 'No file');
      return errorResponse('No file provided');
    }

    if (!validateFileSize(file.size)) {
      trackConversionEnd(trackingId, 'split-pdf', 'error', Date.now() - startTime, file.size, 'File too large');
      return errorResponse('File size exceeds 50MB limit');
    }

    const validation = await validateFileTypeAndContent(file, ['.pdf']);
    if (!validation.valid) {
      trackConversionEnd(trackingId, 'split-pdf', 'error', Date.now() - startTime, file.size, 'Invalid file');
      return errorResponse(validation.error || 'Invalid file');
    }

    const start = parseInt(startPage || '1', 10);
    const end = parseInt(endPage || '1', 10);

    if (isNaN(start) || isNaN(end) || start < 1 || end < start) {
      trackConversionEnd(trackingId, 'split-pdf', 'error', Date.now() - startTime, file.size, 'Invalid range');
      return errorResponse('Invalid page range');
    }

    inputPath = await saveUploadedFile(file);
    outputDir = path.join(TMP_DIR, uuidv4());
    await fs.mkdir(outputDir, { recursive: true });

    const outputPattern = path.join(outputDir, 'page-%d.pdf');
    await execAsync(`pdfseparate -f ${start} -l ${end} "${inputPath}" "${outputPattern}"`);

    const files = await fs.readdir(outputDir);
    const pdfFiles = files.filter(f => f.endsWith('.pdf'));

    if (pdfFiles.length === 0) {
      trackConversionEnd(trackingId, 'split-pdf', 'error', Date.now() - startTime, file.size, 'No pages');
      return errorResponse('No pages extracted. Check page range.');
    }

    let response;
    if (pdfFiles.length === 1) {
      const singlePath = path.join(outputDir, pdfFiles[0]);
      const buffer = await readFileAsBuffer(singlePath);
      response = fileResponse(buffer, `extracted-page.pdf`, 'application/pdf');
    } else {
      zipPath = generateTmpPath('.zip');
      const pdfPaths = pdfFiles.map(f => `"${path.join(outputDir, f)}"`).join(' ');
      await execAsync(`zip -j "${zipPath}" ${pdfPaths}`);
      const buffer = await readFileAsBuffer(zipPath);
      response = fileResponse(buffer, 'split-pages.zip', 'application/zip');
    }

    const rateLimitHeaders = createRateLimitHeaders(rateLimit.limit, rateLimit.remaining, rateLimit.reset);
    Object.entries(rateLimitHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    trackConversionEnd(trackingId, 'split-pdf', 'success', Date.now() - startTime, file.size);
    await cleanupFiles(inputPath, zipPath);
    await cleanupDir(outputDir);
    return response;
  } catch (error) {
    console.error('Split PDF error:', error);
    trackConversionEnd(trackingId, 'split-pdf', 'error', Date.now() - startTime, 0, 'Split failed');
    await cleanupFiles(inputPath, zipPath);
    await cleanupDir(outputDir);
    return errorResponse('Split failed. Please try again.', 500);
  }
}
