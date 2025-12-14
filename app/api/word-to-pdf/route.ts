import { NextRequest } from 'next/server';
import * as path from 'path';
import {
  saveUploadedFile,
  cleanupFiles,
  readFileAsBuffer,
  errorResponse,
  fileResponse,
  validateFileTypeAndContent,
  validateFileSize,
  execAsync,
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
  const trackingId = trackConversionStart('word-to-pdf');

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      trackConversionEnd(trackingId, 'word-to-pdf', 'error', Date.now() - startTime, 0, 'No file');
      return errorResponse('No file provided');
    }

    if (!validateFileSize(file.size)) {
      trackConversionEnd(trackingId, 'word-to-pdf', 'error', Date.now() - startTime, file.size, 'File too large');
      return errorResponse('File size exceeds 50MB limit');
    }

    const validation = await validateFileTypeAndContent(file, ['.docx', '.doc']);
    if (!validation.valid) {
      trackConversionEnd(trackingId, 'word-to-pdf', 'error', Date.now() - startTime, file.size, 'Invalid file');
      return errorResponse(validation.error || 'Invalid Word file');
    }

    inputPath = await saveUploadedFile(file);
    const outputDir = path.dirname(inputPath);

    await execAsync(`libreoffice --headless --convert-to pdf --outdir "${outputDir}" "${inputPath}"`);

    const ext = path.extname(inputPath);
    const baseName = path.basename(inputPath, ext);
    outputPath = path.join(outputDir, `${baseName}.pdf`);

    const buffer = await readFileAsBuffer(outputPath);
    const outputFilename = file.name.replace(/\.(docx?|doc)$/i, '.pdf');

    const response = fileResponse(buffer, outputFilename, 'application/pdf');
    const rateLimitHeaders = createRateLimitHeaders(rateLimit.limit, rateLimit.remaining, rateLimit.reset);
    Object.entries(rateLimitHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    trackConversionEnd(trackingId, 'word-to-pdf', 'success', Date.now() - startTime, file.size);
    await cleanupFiles(inputPath, outputPath);
    return response;
  } catch (error) {
    console.error('Word to PDF conversion error:', error);
    trackConversionEnd(trackingId, 'word-to-pdf', 'error', Date.now() - startTime, 0, 'Conversion failed');
    await cleanupFiles(inputPath, outputPath);
    return errorResponse('Conversion failed. Please try again.', 500);
  }
}
