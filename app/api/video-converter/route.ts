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
    const outputFormat = formData.get('outputFormat') as string | null;
    
    if (!file) {
      return errorResponse('No file provided');
    }
    
    if (!validateFileSize(file.size)) {
      return errorResponse('File size exceeds 50MB limit');
    }

    // Validate file type and content
    const validation = await validateFileTypeAndContent(file, ['.mp4', '.webm', '.avi']);
    if (!validation.valid) {
      return errorResponse(validation.error || 'Invalid file');
    }
    
    
    
    const inputExt = file.name.toLowerCase().endsWith('.mp4') ? 'mp4' : 'webm';
    const outputExt = outputFormat === 'webm' ? 'webm' : outputFormat === 'mp4' ? 'mp4' : (inputExt === 'mp4' ? 'webm' : 'mp4');
    
    inputPath = await saveUploadedFile(file);
    outputPath = generateTmpPath(`.${outputExt}`);
    
    // Convert video using FFmpeg
    await execAsync(`ffmpeg -i "${inputPath}" -y "${outputPath}"`);
    
    const buffer = await readFileAsBuffer(outputPath);
    const outputFilename = file.name.replace(/\.(mp4|webm)$/i, `.${outputExt}`);
    
    const response = fileResponse(
      buffer, 
      outputFilename, 
      outputExt === 'mp4' ? 'video/mp4' : 'video/webm'
    );

    
    const rateLimitHeaders = createRateLimitHeaders(rateLimit.limit, rateLimit.remaining, rateLimit.reset);

    
    Object.entries(rateLimitHeaders).forEach(([key, value]) => {

    
      response.headers.set(key, value);

    
    });

    
    return response;
  } catch (error) {
    console.error('Video conversion error:', error);
    return errorResponse('Conversion failed. Please try again.', 500);
  } finally {
    await cleanupFiles(inputPath, outputPath);
  }
}
