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
    const crf = formData.get('crf') as string | null;
    
    if (!file) {
      return errorResponse('No file provided');
    }
    
    if (!validateFileSize(file.size)) {
      return errorResponse('File size exceeds 50MB limit');
    }

    // Validate file type and content
    const validation = await validateFileTypeAndContent(file, ['.mp4', '.webm']);
    if (!validation.valid) {
      return errorResponse(validation.error || 'Invalid file');
    }
    
    
    
    // CRF: 0 (lossless) to 51 (worst), 23 is default, 28 is reasonable for compression
    const crfValue = parseInt(crf || '28', 10);
    if (isNaN(crfValue) || crfValue < 0 || crfValue > 51) {
      return errorResponse('CRF must be between 0 and 51');
    }
    
    inputPath = await saveUploadedFile(file);
    outputPath = generateTmpPath('.mp4');
    
    // Compress video using FFmpeg with CRF
    await execAsync(`ffmpeg -i "${inputPath}" -vcodec libx264 -crf ${crfValue} -y "${outputPath}"`);
    
    const buffer = await readFileAsBuffer(outputPath);
    const outputFilename = file.name.replace(/\.mp4$/i, '-compressed.mp4');
    
    const response = fileResponse(buffer, outputFilename, 'video/mp4');

    
    const rateLimitHeaders = createRateLimitHeaders(rateLimit.limit, rateLimit.remaining, rateLimit.reset);

    
    Object.entries(rateLimitHeaders).forEach(([key, value]) => {

    
      response.headers.set(key, value);

    
    });

    
    return response;
  } catch (error) {
    console.error('Video compression error:', error);
    return errorResponse('Compression failed. Please try again.', 500);
  } finally {
    await cleanupFiles(inputPath, outputPath);
  }
}
