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
import { checkRateLimit, createRateLimitHeaders, rateLimitResponse, rateLimitConfigs, getClientIp } from '@/lib/rateLimit';
import conversionQueue from '@/lib/conversionQueue';
import { randomUUID } from 'crypto';
import { trackConversionStart, trackConversionEnd } from '@/lib/stats';

export async function POST(request: NextRequest) {
  const rateLimit = await checkRateLimit(request, rateLimitConfigs.conversion);
  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit.reset);
  }

  const startTime = Date.now();
  let trackingId = '';

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const crf = formData.get('crf') as string | null;
    const jobId = formData.get('jobId') as string | null;

    if (!file) {
      trackingId = trackConversionStart('video-compressor');
      trackConversionEnd(trackingId, 'video-compressor', 'error', Date.now() - startTime, 0, 'No file');
      return errorResponse('No file provided');
    }

    if (!validateFileSize(file.size)) {
      trackingId = trackConversionStart('video-compressor');
      trackConversionEnd(trackingId, 'video-compressor', 'error', Date.now() - startTime, file.size, 'File too large');
      return errorResponse('File size exceeds 50MB limit');
    }

    const validation = await validateFileTypeAndContent(file, ['mp4', 'webm', 'avi', 'mov']);
    if (!validation.valid) {
      trackingId = trackConversionStart('video-compressor');
      trackConversionEnd(trackingId, 'video-compressor', 'error', Date.now() - startTime, file.size, 'Invalid file');
      return errorResponse(validation.error || 'Invalid file');
    }

    const userId = getClientIp(request);
    const currentJobId = jobId || randomUUID();

    if (!jobId) {
      const queueResult = conversionQueue.addJob(currentJobId, 'video-compress', userId);

      if (!queueResult.success) {
        return errorResponse(queueResult.error || 'Failed to add to queue', 503);
      }

      return new Response(
        JSON.stringify({
          jobId: currentJobId,
          status: 'queued',
          position: queueResult.position,
          message: 'Added to compression queue',
        }),
        {
          status: 202,
          headers: {
            'Content-Type': 'application/json',
            ...createRateLimitHeaders(rateLimit.limit, rateLimit.remaining, rateLimit.reset),
          },
        }
      );
    }

    if (!conversionQueue.canProcess(currentJobId)) {
      return errorResponse('Job not ready for processing', 425);
    }

    // Start tracking when processing begins
    trackingId = trackConversionStart('video-compressor');
    let inputPath = '';
    let outputPath = '';

    try {
      const crfValue = parseInt(crf || '28', 10);
      if (isNaN(crfValue) || crfValue < 0 || crfValue > 51) {
        conversionQueue.completeJob(currentJobId, 'Invalid CRF value');
        trackConversionEnd(trackingId, 'video-compressor', 'error', Date.now() - startTime, file.size, 'Invalid CRF');
        return errorResponse('CRF must be between 0 and 51');
      }

      inputPath = await saveUploadedFile(file);
      outputPath = generateTmpPath('.mp4');

      await execAsync(`ffmpeg -i "${inputPath}" -vcodec libx264 -crf ${crfValue} -y "${outputPath}"`);

      const buffer = await readFileAsBuffer(outputPath);
      const outputFilename = file.name.replace(/\.(mp4|webm|avi|mov)$/i, '-compressed.mp4');

      conversionQueue.completeJob(currentJobId);

      const response = fileResponse(buffer, outputFilename, 'video/mp4');

      const rateLimitHeaders = createRateLimitHeaders(rateLimit.limit, rateLimit.remaining, rateLimit.reset);
      Object.entries(rateLimitHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      trackConversionEnd(trackingId, 'video-compressor', 'success', Date.now() - startTime, file.size);
      await cleanupFiles(inputPath, outputPath);
      return response;
    } catch (error) {
      console.error('Video compression error:', error);
      conversionQueue.completeJob(currentJobId, 'Compression failed');
      trackConversionEnd(trackingId, 'video-compressor', 'error', Date.now() - startTime, file?.size || 0, 'Compression failed');
      await cleanupFiles(inputPath, outputPath);
      return errorResponse('Compression failed. Please try again.', 500);
    }
  } catch (error) {
    console.error('Video compression error:', error);
    if (trackingId) {
      trackConversionEnd(trackingId, 'video-compressor', 'error', Date.now() - startTime, 0, 'Compression failed');
    }
    return errorResponse('Compression failed. Please try again.', 500);
  }
}
