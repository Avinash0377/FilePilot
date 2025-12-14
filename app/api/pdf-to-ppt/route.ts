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
  const trackingId = trackConversionStart('pdf-to-ppt');

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      trackConversionEnd(trackingId, 'pdf-to-ppt', 'error', Date.now() - startTime, 0, 'No file');
      return errorResponse('No file provided');
    }

    if (!validateFileSize(file.size)) {
      trackConversionEnd(trackingId, 'pdf-to-ppt', 'error', Date.now() - startTime, file.size, 'File too large');
      return errorResponse('File size exceeds 50MB limit');
    }

    if (!validateFileType(file.name, ['.pdf'])) {
      trackConversionEnd(trackingId, 'pdf-to-ppt', 'error', Date.now() - startTime, file.size, 'Invalid file');
      return errorResponse('Only PDF files are allowed');
    }

    inputPath = await saveUploadedFile(file);
    const outputDir = path.dirname(inputPath);

    await execAsync(`libreoffice --headless --infilter="impress_pdf_import" --convert-to pptx --outdir "${outputDir}" "${inputPath}"`);

    const ext = path.extname(inputPath);
    const baseName = path.basename(inputPath, ext);
    outputPath = path.join(outputDir, `${baseName}.pptx`);

    const buffer = await readFileAsBuffer(outputPath);
    const outputFilename = file.name.replace(/\.pdf$/i, '.pptx');

    trackConversionEnd(trackingId, 'pdf-to-ppt', 'success', Date.now() - startTime, file.size);
    await cleanupFiles(inputPath, outputPath);
    return fileResponse(buffer, outputFilename, 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
  } catch (error) {
    console.error('PDF to PowerPoint conversion error:', error);
    trackConversionEnd(trackingId, 'pdf-to-ppt', 'error', Date.now() - startTime, 0, 'Conversion failed');
    await cleanupFiles(inputPath, outputPath);
    return errorResponse('Conversion failed. Please try again.', 500);
  }
}
