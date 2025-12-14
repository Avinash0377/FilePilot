import { NextRequest } from 'next/server';
import {
  saveUploadedFiles,
  cleanupFiles,
  readFileAsBuffer,
  errorResponse,
  fileResponse,
  validateFileSize,
  execAsync,
  generateTmpPath,
} from '@/lib/fileUtils';
import * as path from 'path';
import * as fs from 'fs/promises';
import { trackConversionStart, trackConversionEnd } from '@/lib/stats';

export async function POST(request: NextRequest) {
  const inputPaths: string[] = [];
  let outputPath = '';
  let tempDir = '';
  const startTime = Date.now();
  const trackingId = trackConversionStart('zip-files');

  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      trackConversionEnd(trackingId, 'zip-files', 'error', Date.now() - startTime, 0, 'No files');
      return errorResponse('No files provided');
    }

    let totalSize = 0;
    for (const file of files) {
      if (!validateFileSize(file.size)) {
        trackConversionEnd(trackingId, 'zip-files', 'error', Date.now() - startTime, totalSize, 'File too large');
        return errorResponse(`File "${file.name}" exceeds 50MB limit`);
      }
      totalSize += file.size;
    }

    tempDir = generateTmpPath('_zipdir');
    await fs.mkdir(tempDir, { recursive: true });

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const filePath = path.join(tempDir, file.name);
      await fs.writeFile(filePath, buffer);
      inputPaths.push(filePath);
    }

    outputPath = generateTmpPath('.zip');

    const fileNames = files.map(f => `"${f.name}"`).join(' ');
    await execAsync(`cd "${tempDir}" && zip -j "${outputPath}" ${fileNames}`);

    const stats = await fs.stat(outputPath);
    if (stats.size === 0) {
      throw new Error('ZIP file is empty');
    }

    const buffer = await readFileAsBuffer(outputPath);

    trackConversionEnd(trackingId, 'zip-files', 'success', Date.now() - startTime, totalSize);
    await cleanupFiles(...inputPaths, outputPath);
    if (tempDir) {
      try { await fs.rm(tempDir, { recursive: true, force: true }); } catch (e) { }
    }
    return fileResponse(buffer, 'archive.zip', 'application/zip');
  } catch (error) {
    console.error('ZIP error:', error);
    trackConversionEnd(trackingId, 'zip-files', 'error', Date.now() - startTime, 0, 'ZIP failed');
    await cleanupFiles(...inputPaths, outputPath);
    if (tempDir) {
      try { await fs.rm(tempDir, { recursive: true, force: true }); } catch (e) { }
    }
    return errorResponse('ZIP creation failed. Please try again.', 500);
  }
}
