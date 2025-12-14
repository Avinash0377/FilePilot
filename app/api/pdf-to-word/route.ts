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
    const baseName = path.basename(inputPath, '.pdf');
    outputPath = path.join(outputDir, `${baseName}.docx`);

    // Convert PDF to DOCX using LibreOffice
    // Using simple, reliable command without complex filters
    const command = `libreoffice --headless --infilter="writer_pdf_import" --convert-to docx --outdir "${outputDir}" "${inputPath}"`;

    console.log('Running LibreOffice command:', command);

    const { stdout, stderr } = await execAsync(command, {
      timeout: 120000, // 2 minutes timeout
      env: {
        ...process.env,
        HOME: '/tmp', // LibreOffice needs a writable HOME
      }
    });

    console.log('LibreOffice stdout:', stdout);
    if (stderr) console.log('LibreOffice stderr:', stderr);

    // Small delay to ensure file is fully written
    await new Promise(resolve => setTimeout(resolve, 500));

    // List directory to see what was created
    const files = await fs.readdir(outputDir);
    console.log('Files in output dir:', files);

    // Find the .docx file that was created
    const docxFile = files.find(f => f.endsWith('.docx') && f.includes(baseName));
    if (docxFile) {
      outputPath = path.join(outputDir, docxFile);
      console.log('Found docx file:', outputPath);
    } else {
      // Fallback: find any .docx file
      const anyDocx = files.find(f => f.endsWith('.docx'));
      if (anyDocx) {
        outputPath = path.join(outputDir, anyDocx);
        console.log('Found fallback docx file:', outputPath);
      } else {
        return errorResponse('Conversion failed - no DOCX file created', 500);
      }
    }

    // Verify file exists and is readable
    const stats = await fs.stat(outputPath);
    console.log('Output file size:', stats.size);

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

    // Cleanup AFTER reading buffer into memory
    await cleanupFiles(inputPath, outputPath);

    return response;
  } catch (error) {
    console.error('PDF to Word conversion error:', error);
    // Cleanup on error too
    await cleanupFiles(inputPath, outputPath);
    return errorResponse('Conversion failed. Please try again.', 500);
  }
}
