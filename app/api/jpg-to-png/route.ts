import { NextRequest } from 'next/server';
import {
  saveUploadedFile,
  cleanupFiles,
  readFileAsBuffer,
  errorResponse,
  fileResponse,
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
  const trackingId = trackConversionStart('jpg-to-png');

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      trackConversionEnd(trackingId, 'jpg-to-png', 'error', Date.now() - startTime, 0, 'No file');
      return errorResponse('No file provided');
    }

    if (!validateFileSize(file.size)) {
      trackConversionEnd(trackingId, 'jpg-to-png', 'error', Date.now() - startTime, file.size, 'File too large');
      return errorResponse('File size exceeds 50MB limit');
    }

    const validation = await validateFileTypeAndContent(file, ['.jpg', '.jpeg']);
    if (!validation.valid) {
      trackConversionEnd(trackingId, 'jpg-to-png', 'error', Date.now() - startTime, file.size, 'Invalid file');
      return errorResponse(validation.error || 'Invalid file');
    }

    inputPath = await saveUploadedFile(file);
    outputPath = generateTmpPath('.png');

    await execAsync(`convert "${inputPath}" "${outputPath}"`);

    const buffer = await readFileAsBuffer(outputPath);
    const outputFilename = file.name.replace(/\.(jpg|jpeg)$/i, '.png');

    const response = fileResponse(buffer, outputFilename, 'image/png');
    const rateLimitHeaders = createRateLimitHeaders(rateLimit.limit, rateLimit.remaining, rateLimit.reset);
    Object.entries(rateLimitHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    trackConversionEnd(trackingId, 'jpg-to-png', 'success', Date.now() - startTime, file.size);
    await cleanupFiles(inputPath, outputPath);
    return response;
  } catch (error) {
    console.error('JPG to PNG error:', error);
    trackConversionEnd(trackingId, 'jpg-to-png', 'error', Date.now() - startTime, 0, 'Conversion failed');
    await cleanupFiles(inputPath, outputPath);
    return errorResponse('Conversion failed. Please try again.', 500);
  }
}
