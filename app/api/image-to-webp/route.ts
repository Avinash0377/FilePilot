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
    const validation = await validateFileTypeAndContent(file, ['.jpg', '.jpeg', '.png']);
    if (!validation.valid) {
      return errorResponse(validation.error || 'Invalid file');
    }

    

    inputPath = await saveUploadedFile(file);
    outputPath = generateTmpPath('.webp');

    // Convert to WebP using ImageMagick
    await execAsync(`convert "${inputPath}" "${outputPath}"`);

    const buffer = await readFileAsBuffer(outputPath);
    const outputFilename = file.name.replace(/\.(jpg|jpeg|png)$/i, '.webp');

    const response = fileResponse(buffer, outputFilename, 'image/webp');
    const rateLimitHeaders = createRateLimitHeaders(rateLimit.limit, rateLimit.remaining, rateLimit.reset);
    Object.entries(rateLimitHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  } catch (error) {
    console.error('Image to WebP error:', error);
    return errorResponse('Conversion failed. Please try again.', 500);
  } finally {
    await cleanupFiles(inputPath, outputPath);
  }
}
