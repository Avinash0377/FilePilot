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
  const trackingId = trackConversionStart('ppt-to-pdf');

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      trackConversionEnd(trackingId, 'ppt-to-pdf', 'error', Date.now() - startTime, 0, 'No file');
      return errorResponse('No file provided');
    }

    if (!validateFileSize(file.size)) {
      trackConversionEnd(trackingId, 'ppt-to-pdf', 'error', Date.now() - startTime, file.size, 'File too large');
      return errorResponse('File size exceeds 50MB limit');
    }

    if (!validateFileType(file.name, ['.pptx', '.ppt'])) {
      trackConversionEnd(trackingId, 'ppt-to-pdf', 'error', Date.now() - startTime, file.size, 'Invalid file');
      return errorResponse('Only PowerPoint files (.pptx, .ppt) are allowed');
    }

    inputPath = await saveUploadedFile(file);
    const outputDir = path.dirname(inputPath);

    await execAsync(`libreoffice --headless --convert-to pdf --outdir "${outputDir}" "${inputPath}"`);

    const ext = path.extname(inputPath);
    const baseName = path.basename(inputPath, ext);
    outputPath = path.join(outputDir, `${baseName}.pdf`);

    const buffer = await readFileAsBuffer(outputPath);
    const outputFilename = file.name.replace(/\.(pptx?|ppt)$/i, '.pdf');

    trackConversionEnd(trackingId, 'ppt-to-pdf', 'success', Date.now() - startTime, file.size);
    await cleanupFiles(inputPath, outputPath);
    return fileResponse(buffer, outputFilename, 'application/pdf');
  } catch (error) {
    console.error('PowerPoint to PDF conversion error:', error);
    trackConversionEnd(trackingId, 'ppt-to-pdf', 'error', Date.now() - startTime, 0, 'Conversion failed');
    await cleanupFiles(inputPath, outputPath);
    return errorResponse('Conversion failed. Please try again.', 500);
  }
}
