import { NextRequest } from 'next/server';
import * as path from 'path';
import {
  saveUploadedFile,
  cleanupFiles,
  readFileAsBuffer,
  errorResponse,
  fileResponse,
  validateFileType,
  validateFileSize,
  execAsync,
} from '@/lib/fileUtils';
import { trackConversionStart, trackConversionEnd } from '@/lib/stats';

export async function POST(request: NextRequest) {
  let inputPath = '';
  let outputPath = '';
  const startTime = Date.now();
  const trackingId = trackConversionStart('add-background');

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const bgColor = formData.get('color') as string || '#FFFFFF';
    const outputFormat = formData.get('format') as string || 'png';

    if (!file) {
      trackConversionEnd(trackingId, 'add-background', 'error', Date.now() - startTime, 0, 'No file');
      return errorResponse('No file provided');
    }

    if (!validateFileSize(file.size)) {
      trackConversionEnd(trackingId, 'add-background', 'error', Date.now() - startTime, file.size, 'File too large');
      return errorResponse('File size exceeds 50MB limit');
    }

    if (!validateFileType(file.name, ['.png', '.webp', '.gif'])) {
      trackConversionEnd(trackingId, 'add-background', 'error', Date.now() - startTime, file.size, 'Invalid file');
      return errorResponse('Only PNG, WEBP, or GIF files with transparency are allowed');
    }

    const colorRegex = /^#[0-9A-Fa-f]{6}$/;
    if (!colorRegex.test(bgColor)) {
      trackConversionEnd(trackingId, 'add-background', 'error', Date.now() - startTime, file.size, 'Invalid color');
      return errorResponse('Invalid color format. Use hex format like #FFFFFF');
    }

    inputPath = await saveUploadedFile(file);
    const ext = path.extname(inputPath);
    const baseName = path.basename(inputPath, ext);
    const outputDir = path.dirname(inputPath);
    const outExt = outputFormat === 'jpg' ? 'jpg' : 'png';
    outputPath = path.join(outputDir, `${baseName}_bg.${outExt}`);

    if (outputFormat === 'jpg') {
      await execAsync(`convert "${inputPath}" -background "${bgColor}" -flatten -quality 95 "${outputPath}"`);
    } else {
      await execAsync(`convert "${inputPath}" -background "${bgColor}" -flatten "${outputPath}"`);
    }

    const buffer = await readFileAsBuffer(outputPath);
    const mimeType = outputFormat === 'jpg' ? 'image/jpeg' : 'image/png';
    const outputFilename = file.name.replace(/\.(png|webp|gif)$/i, `_bg.${outExt}`);

    trackConversionEnd(trackingId, 'add-background', 'success', Date.now() - startTime, file.size);
    await cleanupFiles(inputPath, outputPath);
    return fileResponse(buffer, outputFilename, mimeType);
  } catch (error) {
    console.error('Add background error:', error);
    trackConversionEnd(trackingId, 'add-background', 'error', Date.now() - startTime, 0, 'Add BG failed');
    await cleanupFiles(inputPath, outputPath);
    return errorResponse('Failed to add background. Please try again.', 500);
  }
}
