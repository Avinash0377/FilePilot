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
  TMP_DIR,
} from '@/lib/fileUtils';
import { checkRateLimit, createRateLimitHeaders, rateLimitResponse, rateLimitConfigs } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  // Check rate limit
  const rateLimit = await checkRateLimit(request, rateLimitConfigs.conversion);

  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit.reset);
  }

  let inputPath = '';
  let outputPath = '';

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return errorResponse('No file provided');
    }

    if (!validateFileSize(file.size)) {
      return errorResponse('File size exceeds 50MB limit');
    }

    // Validate file type and content (checks actual PDF signature)
    const validation = await validateFileTypeAndContent(file, ['.pdf']);
    if (!validation.valid) {
      return errorResponse(validation.error || 'Invalid PDF file');
    }

    inputPath = await saveUploadedFile(file);
    const outputDir = path.dirname(inputPath);

    // Convert PDF to DOCX using LibreOffice
    // Set HOME to tmp dir to avoid permission issues
    const { stdout, stderr } = await execAsync(
      `HOME=${TMP_DIR} libreoffice --headless --infilter="writer_pdf_import" --convert-to docx --outdir "${outputDir}" "${inputPath}"`,
      { timeout: 120000 }
    );

    console.log('LibreOffice stdout:', stdout);
    if (stderr) console.log('LibreOffice stderr:', stderr);

    // Get the output filename
    const baseName = path.basename(inputPath, '.pdf');
    outputPath = path.join(outputDir, `${baseName}.docx`);

    // Check if file exists
    try {
      await fs.access(outputPath);
    } catch {
      // List directory to see what files were created
      const files = await fs.readdir(outputDir);
      console.log('Files in output dir:', files);
      return errorResponse('Conversion failed - output file not created', 500);
    }

    const buffer = await readFileAsBuffer(outputPath);
    const outputFilename = file.name.replace(/\.pdf$/i, '.docx');

    const response = fileResponse(
      buffer,
      outputFilename,
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );

    // Add rate limit headers
    const rateLimitHeaders = createRateLimitHeaders(
      rateLimit.limit,
      rateLimit.remaining,
      rateLimit.reset
    );
    Object.entries(rateLimitHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    console.error('PDF to Word conversion error:', error);
    return errorResponse('Conversion failed. Please try again.', 500);
  } finally {
    await cleanupFiles(inputPath, outputPath);
  }
}
