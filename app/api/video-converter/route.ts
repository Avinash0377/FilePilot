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
    const outputFormat = formData.get('outputFormat') as string | null;
    const jobId = formData.get('jobId') as string | null;

    if (!file) {
      trackingId = trackConversionStart('video-converter');
      trackConversionEnd(trackingId, 'video-converter', 'error', Date.now() - startTime, 0, 'No file');
      return errorResponse('No file provided');
    }

    if (!validateFileSize(file.size)) {
      trackingId = trackConversionStart('video-converter');
      trackConversionEnd(trackingId, 'video-converter', 'error', Date.now() - startTime, file.size, 'File too large');
      return errorResponse('File size exceeds 50MB limit');
    }

    const validation = await validateFileTypeAndContent(file, ['mp4', 'webm', 'avi', 'mov']);
    if (!validation.valid) {
      trackingId = trackConversionStart('video-converter');
      trackConversionEnd(trackingId, 'video-converter', 'error', Date.now() - startTime, file.size, 'Invalid file');
      return errorResponse(validation.error || 'Invalid file');
    }

    const userId = getClientIp(request);
    const currentJobId = jobId || randomUUID();

    if (!jobId) {
      const queueResult = conversionQueue.addJob(currentJobId, 'video-convert', userId);

      if (!queueResult.success) {
        return errorResponse(queueResult.error || 'Failed to add to queue', 503);
      }

      return new Response(
        JSON.stringify({
          jobId: currentJobId,
          status: 'queued',
          position: queueResult.position,
          message: 'Added to conversion queue',
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
    trackingId = trackConversionStart('video-converter');
    let inputPath = '';
    let outputPath = '';

    try {
      const inputExt = file.name.toLowerCase().endsWith('.mp4') ? 'mp4' : 'webm';
      const outputExt = outputFormat === 'webm' ? 'webm' : outputFormat === 'mp4' ? 'mp4' : (inputExt === 'mp4' ? 'webm' : 'mp4');

      inputPath = await saveUploadedFile(file);
      outputPath = generateTmpPath(`.${outputExt}`);

      await execAsync(`ffmpeg -i "${inputPath}" -y "${outputPath}"`);

      const buffer = await readFileAsBuffer(outputPath);
      const outputFilename = file.name.replace(/\.(mp4|webm|avi|mov)$/i, `.${outputExt}`);

      conversionQueue.completeJob(currentJobId);

      const response = fileResponse(
        buffer,
        outputFilename,
        outputExt === 'mp4' ? 'video/mp4' : 'video/webm'
      );

      const rateLimitHeaders = createRateLimitHeaders(rateLimit.limit, rateLimit.remaining, rateLimit.reset);
      Object.entries(rateLimitHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      trackConversionEnd(trackingId, 'video-converter', 'success', Date.now() - startTime, file.size);
      await cleanupFiles(inputPath, outputPath);
      return response;
    } catch (error) {
      console.error('Video conversion error:', error);
      conversionQueue.completeJob(currentJobId, 'Conversion failed');
      trackConversionEnd(trackingId, 'video-converter', 'error', Date.now() - startTime, file?.size || 0, 'Conversion failed');
      await cleanupFiles(inputPath, outputPath);
      return errorResponse('Conversion failed. Please try again.', 500);
    }
  } catch (error) {
    console.error('Video conversion error:', error);
    if (trackingId) {
      trackConversionEnd(trackingId, 'video-converter', 'error', Date.now() - startTime, 0, 'Conversion failed');
    }
    return errorResponse('Conversion failed. Please try again.', 500);
  }
}
