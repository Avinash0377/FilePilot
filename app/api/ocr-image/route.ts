import { NextRequest } from 'next/server';
import * as path from 'path';
import * as fs from 'fs/promises';
import {
  saveUploadedFile,
  cleanupFiles,
  errorResponse,
  validateFileTypeAndContent,
  validateFileSize,
  execAsync,
  generateTmpPath,
} from '@/lib/fileUtils';
import { checkRateLimit, createRateLimitHeaders, rateLimitResponse, rateLimitConfigs } from '@/lib/rateLimit';
import { trackConversionStart, trackConversionEnd } from '@/lib/stats';

export async function POST(request: NextRequest) {
  const rateLimit = await checkRateLimit(request, rateLimitConfigs.conversion);
  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit.reset);
  }

  let inputPath = '';
  let outputPath = '';
  const startTime = Date.now();
  const trackingId = trackConversionStart('ocr-image');

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      trackConversionEnd(trackingId, 'ocr-image', 'error', Date.now() - startTime, 0, 'No file');
      return errorResponse('No file provided');
    }

    if (!validateFileSize(file.size)) {
      trackConversionEnd(trackingId, 'ocr-image', 'error', Date.now() - startTime, file.size, 'File too large');
      return errorResponse('File size exceeds 50MB limit');
    }

    const validation = await validateFileTypeAndContent(file, ['.jpg', '.jpeg', '.png']);
    if (!validation.valid) {
      trackConversionEnd(trackingId, 'ocr-image', 'error', Date.now() - startTime, file.size, 'Invalid file');
      return errorResponse(validation.error || 'Invalid file');
    }

    inputPath = await saveUploadedFile(file);
    outputPath = generateTmpPath('');

    await execAsync(`tesseract "${inputPath}" "${outputPath}" -l eng`);

    const textContent = await fs.readFile(`${outputPath}.txt`, 'utf-8');

    trackConversionEnd(trackingId, 'ocr-image', 'success', Date.now() - startTime, file.size);
    await cleanupFiles(inputPath, `${outputPath}.txt`);

    return new Response(textContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename="${path.basename(file.name, path.extname(file.name))}.txt"`,
      },
    });
  } catch (error) {
    console.error('OCR error:', error);
    trackConversionEnd(trackingId, 'ocr-image', 'error', Date.now() - startTime, 0, 'OCR failed');
    await cleanupFiles(inputPath, `${outputPath}.txt`);
    return errorResponse('OCR failed. Please try again.', 500);
  }
}
