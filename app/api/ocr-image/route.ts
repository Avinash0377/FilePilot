import { NextRequest } from 'next/server';
import * as path from 'path';
import * as fs from 'fs/promises';
import {
  saveUploadedFile,
  cleanupFiles,
  readFileAsBuffer,
  errorResponse,
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
    
    if (!validateFileType(file.name, ['.png', '.jpg', '.jpeg', '.bmp', '.tiff', '.gif'])) {
      return errorResponse('Only image files (PNG, JPG, BMP, TIFF, GIF) are allowed');
    }
    
    inputPath = await saveUploadedFile(file);
    outputPath = generateTmpPath(''); // Tesseract adds .txt automatically
    
    // OCR using Tesseract
    await execAsync(`tesseract "${inputPath}" "${outputPath}" -l eng`);
    
    // Read the output text file
    const textContent = await fs.readFile(`${outputPath}.txt`, 'utf-8');
    
    // Return as plain text
    return new Response(textContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename="${path.basename(file.name, path.extname(file.name))}.txt"`,
      },
    });
  } catch (error) {
    console.error('OCR error:', error);
    return errorResponse('OCR failed. Please try again.', 500);
  } finally {
    await cleanupFiles(inputPath, `${outputPath}.txt`);
  }
}
