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
  const trackingId = trackConversionStart('compress-pdf');

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      trackConversionEnd(trackingId, 'compress-pdf', 'error', Date.now() - startTime, 0, 'No file');
      return errorResponse('No file provided');
    }

    if (!validateFileSize(file.size)) {
      trackConversionEnd(trackingId, 'compress-pdf', 'error', Date.now() - startTime, file.size, 'File too large');
      return errorResponse('File size exceeds 50MB limit');
    }

    const validation = await validateFileTypeAndContent(file, ['.pdf']);
    if (!validation.valid) {
      trackConversionEnd(trackingId, 'compress-pdf', 'error', Date.now() - startTime, file.size, 'Invalid file');
      return errorResponse(validation.error || 'Invalid file');
    }

    inputPath = await saveUploadedFile(file);
    outputPath = generateTmpPath('.pdf');

    await execAsync(`gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.7 -dPDFSETTINGS=/ebook -dNOPAUSE -dQUIET -dBATCH -dNumRenderingThreads=4 -dNOGC -sOutputFile="${outputPath}" "${inputPath}"`);

    let finalBuffer: Buffer;
    const fs = await import('fs/promises');
    const inputStats = await fs.stat(inputPath);
    const outputStats = await fs.stat(outputPath);

    if (outputStats.size >= inputStats.size) {
      finalBuffer = await readFileAsBuffer(inputPath);
    } else {
      finalBuffer = await readFileAsBuffer(outputPath);
    }

    const outputFilename = file.name.replace(/\.pdf$/i, '-compressed.pdf');

    const response = fileResponse(finalBuffer, outputFilename, 'application/pdf');
    const rateLimitHeaders = createRateLimitHeaders(rateLimit.limit, rateLimit.remaining, rateLimit.reset);
    Object.entries(rateLimitHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    trackConversionEnd(trackingId, 'compress-pdf', 'success', Date.now() - startTime, file.size);
    await cleanupFiles(inputPath, outputPath);
    return response;
  } catch (error) {
    console.error('Compress PDF error:', error);
    trackConversionEnd(trackingId, 'compress-pdf', 'error', Date.now() - startTime, 0, 'Compression failed');
    await cleanupFiles(inputPath, outputPath);
    return errorResponse('Compression failed. Please try again.', 500);
  }
}
