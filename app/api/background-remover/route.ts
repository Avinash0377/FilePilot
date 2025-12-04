import { NextRequest } from 'next/server';
import * as path from 'path';
import {
  saveUploadedFile,
  cleanupFiles,
  readFileAsBuffer,
  errorResponse,
  fileResponse,
  validateFileType,
  validateFileSize,
  execAsync,
} from '@/lib/fileUtils';

export async function POST(request: NextRequest) {
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
    
    if (!validateFileType(file.name, ['.png', '.jpg', '.jpeg', '.webp'])) {
      return errorResponse('Only image files (PNG, JPG, WEBP) are allowed');
    }
    
    inputPath = await saveUploadedFile(file);
    const ext = path.extname(inputPath);
    const baseName = path.basename(inputPath, ext);
    const outputDir = path.dirname(inputPath);
    outputPath = path.join(outputDir, `${baseName}_nobg.png`);
    
    // Remove background using ImageMagick
    // This uses flood fill to remove similar colored pixels from corners
    // For better results, we use a combination of techniques
    await execAsync(`convert "${inputPath}" -fuzz 10% -transparent white "${outputPath}"`);
    
    // Alternative: More sophisticated edge detection approach
    // Try to detect and remove the most common edge color (likely background)
    const tempPath = path.join(outputDir, `${baseName}_temp.png`);
    try {
      // Get the corner pixel color and make it transparent
      await execAsync(`convert "${inputPath}" -alpha set -channel RGBA -fuzz 15% -fill none -floodfill +0+0 white -floodfill +0+0 "$(convert "${inputPath}" -format "%[pixel:p{0,0}]" info:)" "${outputPath}"`);
    } catch {
      // Fallback to simpler approach
      await execAsync(`convert "${inputPath}" -fuzz 20% -transparent white "${outputPath}"`);
    }
    
    const buffer = await readFileAsBuffer(outputPath);
    const outputFilename = file.name.replace(/\.(png|jpg|jpeg|webp)$/i, '_nobg.png');
    
    return fileResponse(buffer, outputFilename, 'image/png');
  } catch (error) {
    console.error('Background removal error:', error);
    return errorResponse('Background removal failed. Please try again.', 500);
  } finally {
    await cleanupFiles(inputPath, outputPath);
  }
}
