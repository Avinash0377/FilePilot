import { NextRequest } from 'next/server';
import { removeBackground } from '@imgly/background-removal-node';
import {
  errorResponse,
  fileResponse,
  validateFileType,
  validateFileSize,
} from '@/lib/fileUtils';
import { trackConversionStart, trackConversionEnd } from '@/lib/stats';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const trackingId = trackConversionStart('background-remover');

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      trackConversionEnd(trackingId, 'background-remover', 'error', Date.now() - startTime, 0, 'No file');
      return errorResponse('No file provided');
    }

    if (!validateFileSize(file.size)) {
      trackConversionEnd(trackingId, 'background-remover', 'error', Date.now() - startTime, file.size, 'File too large');
      return errorResponse('File size exceeds 10MB limit (AI Model Limit)');
    }

    if (!validateFileType(file.name, ['.png', '.jpg', '.jpeg', '.webp'])) {
      trackConversionEnd(trackingId, 'background-remover', 'error', Date.now() - startTime, file.size, 'Invalid file');
      return errorResponse('Only image files (PNG, JPG, WEBP) are allowed');
    }

    console.log(`Starting background removal for: ${file.name}`);

    const fileBuffer = await file.arrayBuffer();
    const fileBlob = new Blob([fileBuffer], { type: file.type || 'image/jpeg' });

    const resultBlob = await removeBackground(fileBlob, {
      debug: true,
      progress: (key, current, total) => {
        console.log(`BG Removal Progress: ${key} ${current}/${total}`);
      }
    });

    const buffer = Buffer.from(await resultBlob.arrayBuffer());
    const outputFilename = file.name.replace(/\.(png|jpg|jpeg|webp)$/i, '_nobg.png');

    trackConversionEnd(trackingId, 'background-remover', 'success', Date.now() - startTime, file.size);
    return fileResponse(buffer, outputFilename, 'image/png');
  } catch (error) {
    console.error('Background removal error:', error);
    trackConversionEnd(trackingId, 'background-remover', 'error', Date.now() - startTime, 0, 'BG removal failed');
    return errorResponse('Background removal failed. Please try again.', 500);
  }
}
