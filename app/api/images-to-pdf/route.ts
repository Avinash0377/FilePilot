import { NextRequest } from 'next/server';
import {
  saveUploadedFiles,
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
  
  const inputPaths: string[] = [];
  let outputPath = '';
  
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    
    if (!files || files.length === 0) {
      return errorResponse('No files provided');
    }
    
    // Validate all files
    for (const file of files) {
      if (!validateFileSize(file.size)) {
        return errorResponse(`File "${file.name}" exceeds 50MB limit`);
      }
      
    }
    
    // Save all files
    const savedPaths = await saveUploadedFiles(files);
    inputPaths.push(...savedPaths);
    
    outputPath = generateTmpPath('.pdf');
    
    // Convert images to PDF using ImageMagick
    const inputArgs = inputPaths.map(p => `"${p}"`).join(' ');
    await execAsync(`convert ${inputArgs} "${outputPath}"`);
    
    const buffer = await readFileAsBuffer(outputPath);
    
    const response = fileResponse(buffer, 'images.pdf', 'application/pdf');

    
    const rateLimitHeaders = createRateLimitHeaders(rateLimit.limit, rateLimit.remaining, rateLimit.reset);

    
    Object.entries(rateLimitHeaders).forEach(([key, value]) => {

    
      response.headers.set(key, value);

    
    });

    
    return response;
  } catch (error) {
    console.error('Images to PDF error:', error);
    return errorResponse('Conversion failed. Please try again.', 500);
  } finally {
    await cleanupFiles(...inputPaths, outputPath);
  }
}
