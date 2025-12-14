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
  const trackingId = trackConversionStart('audio-converter');

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const outputFormat = formData.get('outputFormat') as string | null;

    if (!file) {
      trackConversionEnd(trackingId, 'audio-converter', 'error', Date.now() - startTime, 0, 'No file');
      return errorResponse('No file provided');
    }

    if (!validateFileSize(file.size)) {
      trackConversionEnd(trackingId, 'audio-converter', 'error', Date.now() - startTime, file.size, 'File too large');
      return errorResponse('File size exceeds 50MB limit');
    }

    const validation = await validateFileTypeAndContent(file, ['.mp3', '.wav']);
    if (!validation.valid) {
      trackConversionEnd(trackingId, 'audio-converter', 'error', Date.now() - startTime, file.size, 'Invalid file');
      return errorResponse(validation.error || 'Invalid file');
    }

    const inputExt = file.name.toLowerCase().endsWith('.mp3') ? 'mp3' : 'wav';
    const outputExt = outputFormat === 'wav' ? 'wav' : outputFormat === 'mp3' ? 'mp3' : (inputExt === 'mp3' ? 'wav' : 'mp3');

    inputPath = await saveUploadedFile(file);
    outputPath = generateTmpPath(`.${outputExt}`);

    await execAsync(`ffmpeg -i "${inputPath}" -y "${outputPath}"`);

    const buffer = await readFileAsBuffer(outputPath);
    const outputFilename = file.name.replace(/\.(mp3|wav)$/i, `.${outputExt}`);

    const response = fileResponse(
      buffer,
      outputFilename,
      outputExt === 'mp3' ? 'audio/mpeg' : 'audio/wav'
    );

    const rateLimitHeaders = createRateLimitHeaders(rateLimit.limit, rateLimit.remaining, rateLimit.reset);
    Object.entries(rateLimitHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    trackConversionEnd(trackingId, 'audio-converter', 'success', Date.now() - startTime, file.size);
    await cleanupFiles(inputPath, outputPath);
    return response;
  } catch (error) {
    console.error('Audio conversion error:', error);
    trackConversionEnd(trackingId, 'audio-converter', 'error', Date.now() - startTime, 0, 'Conversion failed');
    await cleanupFiles(inputPath, outputPath);
    return errorResponse('Conversion failed. Please try again.', 500);
  }
}
