import { NextRequest } from 'next/server';
import * as path from 'path';
import * as fs from 'fs/promises';
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
  getContentType,
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
  const trackingId = trackConversionStart('image-compressor');

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const targetPercent = formData.get('targetPercent') as string | null;

    if (!file) {
      trackConversionEnd(trackingId, 'image-compressor', 'error', Date.now() - startTime, 0, 'No file');
      return errorResponse('No file provided');
    }

    if (!validateFileSize(file.size)) {
      trackConversionEnd(trackingId, 'image-compressor', 'error', Date.now() - startTime, file.size, 'File too large');
      return errorResponse('File size exceeds 50MB limit');
    }

    const validation = await validateFileTypeAndContent(file, ['.jpg', '.jpeg', '.png', '.webp']);
    if (!validation.valid) {
      trackConversionEnd(trackingId, 'image-compressor', 'error', Date.now() - startTime, file.size, 'Invalid file');
      return errorResponse(validation.error || 'Invalid file');
    }

    const targetPercentValue = parseInt(targetPercent || '50', 10);
    if (isNaN(targetPercentValue) || targetPercentValue < 5 || targetPercentValue > 100) {
      trackConversionEnd(trackingId, 'image-compressor', 'error', Date.now() - startTime, file.size, 'Invalid target');
      return errorResponse('Target percentage must be between 5 and 100');
    }

    inputPath = await saveUploadedFile(file);
    const ext = path.extname(file.name).toLowerCase();
    const originalSize = file.size;
    const targetSize = Math.floor(originalSize * (targetPercentValue / 100));

    outputPath = generateTmpPath(ext === '.png' ? '.png' : '.jpg');

    if (ext === '.png') {
      let bestOutput = '';
      let bestSize = originalSize;

      for (const qualityRange of ['20-40', '30-50', '40-60', '50-70', '60-80', '70-90', '80-100']) {
        const tempOutput = generateTmpPath('.png');
        try {
          await execAsync(`pngquant --quality=${qualityRange} --force --output "${tempOutput}" "${inputPath}" 2>/dev/null || convert "${inputPath}" -quality 80 "${tempOutput}"`);
          const stats = await fs.stat(tempOutput);

          if (stats.size <= targetSize && stats.size < bestSize) {
            if (bestOutput) await cleanupFiles(bestOutput);
            bestOutput = tempOutput;
            bestSize = stats.size;
            break;
          } else if (stats.size < bestSize) {
            if (bestOutput) await cleanupFiles(bestOutput);
            bestOutput = tempOutput;
            bestSize = stats.size;
          } else {
            await cleanupFiles(tempOutput);
          }
        } catch {
          await cleanupFiles(tempOutput);
        }
      }

      if (bestOutput) {
        outputPath = bestOutput;
      } else {
        const scaleFactor = Math.sqrt(targetPercentValue / 100);
        const resizePercent = Math.floor(scaleFactor * 100);
        await execAsync(`convert "${inputPath}" -resize ${resizePercent}% -quality 85 "${outputPath}"`);
      }
    } else {
      let low = 5;
      let high = 95;
      let bestQuality = 60;
      let bestOutput = '';
      let bestSize = originalSize;

      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const tempOutput = generateTmpPath(ext === '.webp' ? '.webp' : '.jpg');

        try {
          await execAsync(`convert "${inputPath}" -quality ${mid} "${tempOutput}"`);
          const stats = await fs.stat(tempOutput);

          if (Math.abs(stats.size - targetSize) < Math.abs(bestSize - targetSize)) {
            if (bestOutput) await cleanupFiles(bestOutput);
            bestOutput = tempOutput;
            bestSize = stats.size;
            bestQuality = mid;
          } else {
            await cleanupFiles(tempOutput);
          }

          if (stats.size > targetSize) {
            high = mid - 1;
          } else if (stats.size < targetSize * 0.9) {
            low = mid + 1;
          } else {
            break;
          }
        } catch {
          await cleanupFiles(tempOutput);
          high = mid - 1;
        }
      }

      if (bestOutput) {
        outputPath = bestOutput;
      } else {
        await execAsync(`convert "${inputPath}" -quality 60 "${outputPath}"`);
      }

      const finalStats = await fs.stat(outputPath);
      if (finalStats.size > targetSize * 1.2) {
        const scaleFactor = Math.sqrt(targetSize / finalStats.size);
        const resizePercent = Math.max(50, Math.floor(scaleFactor * 100));
        const resizedOutput = generateTmpPath(ext === '.webp' ? '.webp' : '.jpg');
        await execAsync(`convert "${outputPath}" -resize ${resizePercent}% -quality ${bestQuality} "${resizedOutput}"`);
        await cleanupFiles(outputPath);
        outputPath = resizedOutput;
      }
    }

    const buffer = await readFileAsBuffer(outputPath);
    const outputFilename = file.name.replace(/(\.[^.]+)$/, '-compressed$1');

    const response = fileResponse(buffer, outputFilename, getContentType(ext));

    const rateLimitHeaders = createRateLimitHeaders(rateLimit.limit, rateLimit.remaining, rateLimit.reset);

    Object.entries(rateLimitHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    trackConversionEnd(trackingId, 'image-compressor', 'success', Date.now() - startTime, file.size);
    await cleanupFiles(inputPath, outputPath);
    return response;
  } catch (error) {
    console.error('Image compression error:', error);
    trackConversionEnd(trackingId, 'image-compressor', 'error', Date.now() - startTime, 0, 'Compression failed');
    await cleanupFiles(inputPath, outputPath);
    return errorResponse('Compression failed. Please try again.', 500);
  }
}

