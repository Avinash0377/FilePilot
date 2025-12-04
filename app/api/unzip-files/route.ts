import { NextRequest } from 'next/server';
import * as path from 'path';
import * as fs from 'fs/promises';
import {
  saveUploadedFile,
  cleanupFiles,
  cleanupDir,
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
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  const rateLimit = await checkRateLimit(request, rateLimitConfigs.conversion);
  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit.reset);
  }
  
  let inputPath = '';
  let outputDir = '';
  let reZipPath = '';
  
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
    const validation = await validateFileTypeAndContent(file, ['.zip']);
    if (!validation.valid) {
      return errorResponse(validation.error || 'Invalid file');
    }
    
    
    
    inputPath = await saveUploadedFile(file);
    outputDir = path.join(TMP_DIR, uuidv4());
    await fs.mkdir(outputDir, { recursive: true });
    
    // Unzip using unzip command
    await execAsync(`unzip -o "${inputPath}" -d "${outputDir}"`);
    
    // Get all extracted files
    const files = await fs.readdir(outputDir);
    
    if (files.length === 0) {
      return errorResponse('Archive is empty');
    }
    
    if (files.length === 1) {
      // Return single file
      const singlePath = path.join(outputDir, files[0]);
      const stats = await fs.stat(singlePath);
      
      if (stats.isFile()) {
        const buffer = await readFileAsBuffer(singlePath);
        const response = fileResponse(buffer, files[0], 'application/octet-stream');

        const rateLimitHeaders = createRateLimitHeaders(rateLimit.limit, rateLimit.remaining, rateLimit.reset);

        Object.entries(rateLimitHeaders).forEach(([key, value]) => {

          response.headers.set(key, value);

        });

        return response;
      }
    }
    
    // Multiple files - re-zip them with original names
    reZipPath = path.join(TMP_DIR, `${uuidv4()}-extracted.zip`);
    await execAsync(`cd "${outputDir}" && zip -r "${reZipPath}" .`);
    
    const buffer = await readFileAsBuffer(reZipPath);
    const response = fileResponse(buffer, 'extracted-files.zip', 'application/zip');

    const rateLimitHeaders = createRateLimitHeaders(rateLimit.limit, rateLimit.remaining, rateLimit.reset);

    Object.entries(rateLimitHeaders).forEach(([key, value]) => {

      response.headers.set(key, value);

    });

    return response;
  } catch (error) {
    console.error('Unzip error:', error);
    return errorResponse('Extraction failed. Please try again.', 500);
  } finally {
    await cleanupFiles(inputPath, reZipPath);
    await cleanupDir(outputDir);
  }
}
