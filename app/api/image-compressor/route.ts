import { NextRequest } from 'next/server';
import * as path from 'path';
import * as fs from 'fs/promises';
import {
  saveUploadedFile,
  cleanupFiles,
  readFileAsBuffer,
  errorResponse,
  fileResponse,
  validateFileType,
  validateFileTypeAndContent,
  validateFileSize,
  execAsync,
  generateTmpPath,
  getContentType,
} from '@/lib/fileUtils';
import { checkRateLimit, createRateLimitHeaders, rateLimitResponse, rateLimitConfigs } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  const rateLimit = await checkRateLimit(request, rateLimitConfigs.conversion);
  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit.reset);
  }
  
  let inputPath = '';
  let outputPath = '';
  
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const targetPercent = formData.get('targetPercent') as string | null;
    
    if (!file) {
      return errorResponse('No file provided');
    }
    
    if (!validateFileSize(file.size)) {
      return errorResponse('File size exceeds 50MB limit');
    }

    // Validate file type and content
    const validation = await validateFileTypeAndContent(file, ['.jpg', '.jpeg', '.png', '.webp']);
    if (!validation.valid) {
      return errorResponse(validation.error || 'Invalid file');
    }
    
    const targetPercentValue = parseInt(targetPercent || '50', 10);
    if (isNaN(targetPercentValue) || targetPercentValue < 5 || targetPercentValue > 100) {
      return errorResponse('Target percentage must be between 5 and 100');
    }
    
    inputPath = await saveUploadedFile(file);
    const ext = path.extname(file.name).toLowerCase();
    const originalSize = file.size;
    const targetSize = Math.floor(originalSize * (targetPercentValue / 100));
    
    // For JPEG images, we can use quality to control size
    // For PNG, we'll convert to JPEG for better compression or use pngquant
    
    outputPath = generateTmpPath(ext === '.png' ? '.png' : '.jpg');
    
    if (ext === '.png') {
      // For PNG: Use pngquant for lossy compression with target size
      // First try with different quality levels to achieve target size
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
            break; // Found good enough compression
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
        // Fallback: use ImageMagick with resize if needed
        const scaleFactor = Math.sqrt(targetPercentValue / 100);
        const resizePercent = Math.floor(scaleFactor * 100);
        await execAsync(`convert "${inputPath}" -resize ${resizePercent}% -quality 85 "${outputPath}"`);
      }
    } else {
      // For JPEG/WebP: Binary search for the right quality level
      let low = 5;
      let high = 95;
      let bestQuality = 60;
      let bestOutput = '';
      let bestSize = originalSize;
      
      // Try a few quality levels to find one that gets close to target
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
            break; // Close enough
          }
        } catch {
          await cleanupFiles(tempOutput);
          high = mid - 1;
        }
      }
      
      if (bestOutput) {
        outputPath = bestOutput;
      } else {
        // Fallback with default quality
        await execAsync(`convert "${inputPath}" -quality 60 "${outputPath}"`);
      }
      
      // If still too large, resize the image
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
    
    return response;
  } catch (error) {
    console.error('Image compression error:', error);
    return errorResponse('Compression failed. Please try again.', 500);
  } finally {
    await cleanupFiles(inputPath, outputPath);
  }
}
