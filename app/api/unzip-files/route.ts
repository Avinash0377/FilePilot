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
  TMP_DIR,
} from '@/lib/fileUtils';
import { checkRateLimit, createRateLimitHeaders, rateLimitResponse, rateLimitConfigs } from '@/lib/rateLimit';
import { v4 as uuidv4 } from 'uuid';
import { trackConversionStart, trackConversionEnd } from '@/lib/stats';

export async function POST(request: NextRequest) {
  const rateLimit = await checkRateLimit(request, rateLimitConfigs.conversion);
  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit.reset);
  }

  let inputPath = '';
  let outputDir = '';
  let reZipPath = '';
  const startTime = Date.now();
  const trackingId = trackConversionStart('unzip-files');

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      trackConversionEnd(trackingId, 'unzip-files', 'error', Date.now() - startTime, 0, 'No file');
      return errorResponse('No file provided');
    }

    if (!validateFileSize(file.size)) {
      trackConversionEnd(trackingId, 'unzip-files', 'error', Date.now() - startTime, file.size, 'File too large');
      return errorResponse('File size exceeds 50MB limit');
    }

    const validation = await validateFileTypeAndContent(file, ['.zip']);
    if (!validation.valid) {
      trackConversionEnd(trackingId, 'unzip-files', 'error', Date.now() - startTime, file.size, 'Invalid file');
      return errorResponse(validation.error || 'Invalid file');
    }

    inputPath = await saveUploadedFile(file);
    outputDir = path.join(TMP_DIR, uuidv4());
    await fs.mkdir(outputDir, { recursive: true });

    await execAsync(`unzip -o "${inputPath}" -d "${outputDir}"`);

    const files = await fs.readdir(outputDir);

    if (files.length === 0) {
      trackConversionEnd(trackingId, 'unzip-files', 'error', Date.now() - startTime, file.size, 'Empty archive');
      return errorResponse('Archive is empty');
    }

    let response;
    if (files.length === 1) {
      const singlePath = path.join(outputDir, files[0]);
      const stats = await fs.stat(singlePath);

      if (stats.isFile()) {
        const buffer = await readFileAsBuffer(singlePath);
        response = fileResponse(buffer, files[0], 'application/octet-stream');
      } else {
        reZipPath = path.join(TMP_DIR, `${uuidv4()}-extracted.zip`);
        await execAsync(`cd "${outputDir}" && zip -r "${reZipPath}" .`);
        const buffer = await readFileAsBuffer(reZipPath);
        response = fileResponse(buffer, 'extracted-files.zip', 'application/zip');
      }
    } else {
      reZipPath = path.join(TMP_DIR, `${uuidv4()}-extracted.zip`);
      await execAsync(`cd "${outputDir}" && zip -r "${reZipPath}" .`);
      const buffer = await readFileAsBuffer(reZipPath);
      response = fileResponse(buffer, 'extracted-files.zip', 'application/zip');
    }

    const rateLimitHeaders = createRateLimitHeaders(rateLimit.limit, rateLimit.remaining, rateLimit.reset);
    Object.entries(rateLimitHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    trackConversionEnd(trackingId, 'unzip-files', 'success', Date.now() - startTime, file.size);
    await cleanupFiles(inputPath, reZipPath);
    await cleanupDir(outputDir);
    return response;
  } catch (error) {
    console.error('Unzip error:', error);
    trackConversionEnd(trackingId, 'unzip-files', 'error', Date.now() - startTime, 0, 'Extraction failed');
    await cleanupFiles(inputPath, reZipPath);
    await cleanupDir(outputDir);
    return errorResponse('Extraction failed. Please try again.', 500);
  }
}
