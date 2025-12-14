import { NextRequest } from 'next/server';
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

    if (!file) {
      return errorResponse('No file provided');
    }

    if (!validateFileSize(file.size)) {
      return errorResponse('File size exceeds 50MB limit');
    }

    // Validate file type and content
    const validation = await validateFileTypeAndContent(file, ['.pdf']);
    if (!validation.valid) {
      return errorResponse(validation.error || 'Invalid file');
    }



    inputPath = await saveUploadedFile(file);
    outputPath = generateTmpPath('.pdf');

    // Compress PDF using Ghostscript with optimized settings
    // -dNumRenderingThreads=4: Use multiple CPU cores
    // -dNOGC: Disable garbage collection for speed
    await execAsync(`gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.7 -dPDFSETTINGS=/ebook -dNOPAUSE -dQUIET -dBATCH -dNumRenderingThreads=4 -dNOGC -sOutputFile="${outputPath}" "${inputPath}"`);

    let finalBuffer: Buffer;
    let finalPath = outputPath;

    // Check if compression actually reduced size
    const crypto = await import('crypto');
    const fs = await import('fs/promises');
    const inputStats = await fs.stat(inputPath);
    const outputStats = await fs.stat(outputPath);

    if (outputStats.size >= inputStats.size) {
      console.log(`Compression failed to reduce size (${outputStats.size} >= ${inputStats.size}). Returning original.`);
      finalBuffer = await readFileAsBuffer(inputPath);
      finalPath = inputPath;
    } else {
      finalBuffer = await readFileAsBuffer(outputPath);
    }

    const outputFilename = file.name.replace(/\.pdf$/i, '-compressed.pdf');

    const response = fileResponse(finalBuffer, outputFilename, 'application/pdf');
    const rateLimitHeaders = createRateLimitHeaders(rateLimit.limit, rateLimit.remaining, rateLimit.reset);
    Object.entries(rateLimitHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  } catch (error) {
    console.error('Compress PDF error:', error);
    return errorResponse('Compression failed. Please try again.', 500);
  } finally {
    await cleanupFiles(inputPath, outputPath);
  }
}
