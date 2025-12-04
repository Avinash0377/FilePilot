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
    const bgColor = formData.get('color') as string || '#FFFFFF';
    const outputFormat = formData.get('format') as string || 'png';
    
    if (!file) {
      return errorResponse('No file provided');
    }
    
    if (!validateFileSize(file.size)) {
      return errorResponse('File size exceeds 50MB limit');
    }
    
    if (!validateFileType(file.name, ['.png', '.webp', '.gif'])) {
      return errorResponse('Only PNG, WEBP, or GIF files with transparency are allowed');
    }
    
    // Validate color format (hex color)
    const colorRegex = /^#[0-9A-Fa-f]{6}$/;
    if (!colorRegex.test(bgColor)) {
      return errorResponse('Invalid color format. Use hex format like #FFFFFF');
    }
    
    inputPath = await saveUploadedFile(file);
    const ext = path.extname(inputPath);
    const baseName = path.basename(inputPath, ext);
    const outputDir = path.dirname(inputPath);
    const outExt = outputFormat === 'jpg' ? 'jpg' : 'png';
    outputPath = path.join(outputDir, `${baseName}_bg.${outExt}`);
    
    // Add background color using ImageMagick
    // First flatten the image onto the background color
    if (outputFormat === 'jpg') {
      // For JPG output, flatten to remove transparency
      await execAsync(`convert "${inputPath}" -background "${bgColor}" -flatten -quality 95 "${outputPath}"`);
    } else {
      // For PNG, keep the file but with background
      await execAsync(`convert "${inputPath}" -background "${bgColor}" -flatten "${outputPath}"`);
    }
    
    const buffer = await readFileAsBuffer(outputPath);
    const mimeType = outputFormat === 'jpg' ? 'image/jpeg' : 'image/png';
    const outputFilename = file.name.replace(/\.(png|webp|gif)$/i, `_bg.${outExt}`);
    
    return fileResponse(buffer, outputFilename, mimeType);
  } catch (error) {
    console.error('Add background error:', error);
    return errorResponse('Failed to add background. Please try again.', 500);
  } finally {
    await cleanupFiles(inputPath, outputPath);
  }
}
