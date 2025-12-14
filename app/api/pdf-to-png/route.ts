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
  let zipPath = '';
  const startTime = Date.now();
  const trackingId = trackConversionStart('pdf-to-png');

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      trackConversionEnd(trackingId, 'pdf-to-png', 'error', Date.now() - startTime, 0, 'No file');
      return errorResponse('No file provided');
    }

    if (!validateFileSize(file.size)) {
      trackConversionEnd(trackingId, 'pdf-to-png', 'error', Date.now() - startTime, file.size, 'File too large');
      return errorResponse('File size exceeds 50MB limit');
    }

    const validation = await validateFileTypeAndContent(file, ['.pdf']);
    if (!validation.valid) {
      trackConversionEnd(trackingId, 'pdf-to-png', 'error', Date.now() - startTime, file.size, 'Invalid file');
      return errorResponse(validation.error || 'Invalid file');
    }

    inputPath = await saveUploadedFile(file);
    outputDir = path.join(TMP_DIR, uuidv4());
    await fs.mkdir(outputDir, { recursive: true });

    const baseName = path.basename(file.name, '.pdf');
    const outputPattern = path.join(outputDir, `${baseName}.png`);

    await execAsync(`convert -density 300 -quality 100 "${inputPath}" "${outputPattern}"`);

    const files = await fs.readdir(outputDir);
    const pngFiles = files.filter(f => f.endsWith('.png'));

    if (pngFiles.length === 0) {
      trackConversionEnd(trackingId, 'pdf-to-png', 'error', Date.now() - startTime, file.size, 'No output');
      return errorResponse('Conversion failed. No images generated.');
    }

    let response;
    if (pngFiles.length === 1) {
      const singlePath = path.join(outputDir, pngFiles[0]);
      const buffer = await readFileAsBuffer(singlePath);
      response = fileResponse(buffer, `${baseName}.png`, 'image/png');
    } else {
      zipPath = path.join(TMP_DIR, `${uuidv4()}.zip`);
      const pngPaths = pngFiles.map(f => `"${path.join(outputDir, f)}"`).join(' ');
      await execAsync(`zip -j "${zipPath}" ${pngPaths}`);
      const buffer = await readFileAsBuffer(zipPath);
      response = fileResponse(buffer, `${baseName}-images.zip`, 'application/zip');
    }

    const rateLimitHeaders = createRateLimitHeaders(rateLimit.limit, rateLimit.remaining, rateLimit.reset);
    Object.entries(rateLimitHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    trackConversionEnd(trackingId, 'pdf-to-png', 'success', Date.now() - startTime, file.size);
    await cleanupFiles(inputPath, zipPath);
    await cleanupDir(outputDir);
    return response;
  } catch (error) {
    console.error('PDF to PNG error:', error);
    trackConversionEnd(trackingId, 'pdf-to-png', 'error', Date.now() - startTime, 0, 'Conversion failed');
    await cleanupFiles(inputPath, zipPath);
    await cleanupDir(outputDir);
    return errorResponse('Conversion failed. Please try again.', 500);
  }
}
