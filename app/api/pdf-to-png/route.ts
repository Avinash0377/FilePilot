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
  let zipPath = '';
  
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
    outputDir = path.join(TMP_DIR, uuidv4());
    await fs.mkdir(outputDir, { recursive: true });
    
    const baseName = path.basename(file.name, '.pdf');
    const outputPattern = path.join(outputDir, `${baseName}.png`);
    
    // Convert PDF to PNG using ImageMagick
    await execAsync(`convert -density 150 "${inputPath}" "${outputPattern}"`);
    
    // Get all generated files
    const files = await fs.readdir(outputDir);
    const pngFiles = files.filter(f => f.endsWith('.png'));
    
    if (pngFiles.length === 0) {
      return errorResponse('Conversion failed. No images generated.');
    }
    
    if (pngFiles.length === 1) {
      // Return single PNG
      const singlePath = path.join(outputDir, pngFiles[0]);
      const buffer = await readFileAsBuffer(singlePath);
      const response = fileResponse(buffer, `${baseName}.png`, 'image/png');

      const rateLimitHeaders = createRateLimitHeaders(rateLimit.limit, rateLimit.remaining, rateLimit.reset);

      Object.entries(rateLimitHeaders).forEach(([key, value]) => {

        response.headers.set(key, value);

      });

      return response;
    }
    
    // Multiple pages - create zip
    zipPath = path.join(TMP_DIR, `${uuidv4()}.zip`);
    const pngPaths = pngFiles.map(f => `"${path.join(outputDir, f)}"`).join(' ');
    await execAsync(`zip -j "${zipPath}" ${pngPaths}`);
    
    const buffer = await readFileAsBuffer(zipPath);
    const response = fileResponse(buffer, `${baseName}-images.zip`, 'application/zip');

    const rateLimitHeaders = createRateLimitHeaders(rateLimit.limit, rateLimit.remaining, rateLimit.reset);

    Object.entries(rateLimitHeaders).forEach(([key, value]) => {

      response.headers.set(key, value);

    });

    return response;
  } catch (error) {
    console.error('PDF to PNG error:', error);
    return errorResponse('Conversion failed. Please try again.', 500);
  } finally {
    await cleanupFiles(inputPath, zipPath);
    await cleanupDir(outputDir);
  }
}
