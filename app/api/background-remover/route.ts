import { NextRequest } from 'next/server';
import { removeBackground } from '@imgly/background-removal-node';
import {
  errorResponse,
  fileResponse,
  validateFileType,
  validateFileSize,
} from '@/lib/fileUtils';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return errorResponse('No file provided');
    }

    if (!validateFileSize(file.size)) {
      return errorResponse('File size exceeds 10MB limit (AI Model Limit)');
    }

    if (!validateFileType(file.name, ['.png', '.jpg', '.jpeg', '.webp'])) {
      return errorResponse('Only image files (PNG, JPG, WEBP) are allowed');
    }

    console.log(`Starting background removal for: ${file.name}`);

    // Convert File to Blob for the library
    const fileBuffer = await file.arrayBuffer();
    const fileBlob = new Blob([fileBuffer], { type: file.type || 'image/jpeg' });

    // Remove background using AI model
    // publicPath is important for locating the WASM/ONNX files
    const resultBlob = await removeBackground(fileBlob, {
      debug: true,
      progress: (key, current, total) => {
        console.log(`BG Removal Progress: ${key} ${current}/${total}`);
      }
    });

    // Convert result Blob back to Buffer
    const buffer = Buffer.from(await resultBlob.arrayBuffer());

    const outputFilename = file.name.replace(/\.(png|jpg|jpeg|webp)$/i, '_nobg.png');

    return fileResponse(buffer, outputFilename, 'image/png');
  } catch (error) {
    console.error('Background removal error:', error);
    return errorResponse('Background removal failed. Please try again.', 500);
  }
}
