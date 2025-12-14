import { NextRequest } from 'next/server';
import {
  saveUploadedFiles,
  cleanupFiles,
  readFileAsBuffer,
  errorResponse,
  fileResponse,
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

  const inputPaths: string[] = [];
  let outputPath = '';
  const startTime = Date.now();
  const trackingId = trackConversionStart('merge-pdf');

  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length < 2) {
      trackConversionEnd(trackingId, 'merge-pdf', 'error', Date.now() - startTime, 0, 'Need 2+ files');
      return errorResponse('At least 2 PDF files are required');
    }

    let totalSize = 0;
    for (const file of files) {
      if (!validateFileSize(file.size)) {
        trackConversionEnd(trackingId, 'merge-pdf', 'error', Date.now() - startTime, totalSize, 'File too large');
        return errorResponse(`File "${file.name}" exceeds 50MB limit`);
      }
      totalSize += file.size;
    }

    const savedPaths = await saveUploadedFiles(files);
    inputPaths.push(...savedPaths);

    outputPath = generateTmpPath('.pdf');

    const inputArgs = inputPaths.map(p => `"${p}"`).join(' ');
    await execAsync(`pdfunite ${inputArgs} "${outputPath}"`);

    const buffer = await readFileAsBuffer(outputPath);

    const response = fileResponse(buffer, 'merged.pdf', 'application/pdf');
    const rateLimitHeaders = createRateLimitHeaders(rateLimit.limit, rateLimit.remaining, rateLimit.reset);
    Object.entries(rateLimitHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    trackConversionEnd(trackingId, 'merge-pdf', 'success', Date.now() - startTime, totalSize);
    await cleanupFiles(...inputPaths, outputPath);
    return response;
  } catch (error) {
    console.error('Merge PDF error:', error);
    trackConversionEnd(trackingId, 'merge-pdf', 'error', Date.now() - startTime, 0, 'Merge failed');
    await cleanupFiles(...inputPaths, outputPath);
    return errorResponse('Merge failed. Please try again.', 500);
  }
}
