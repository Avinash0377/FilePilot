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
    
    if (!validateFileType(file.name, ['.pdf'])) {
      return errorResponse('Only PDF files are allowed');
    }
    
    inputPath = await saveUploadedFile(file);
    const outputDir = path.dirname(inputPath);
    
    // Convert PDF to PowerPoint using LibreOffice
    // LibreOffice converts PDF to ODP (OpenDocument Presentation) first, then we convert to PPTX
    await execAsync(`libreoffice --headless --infilter="impress_pdf_import" --convert-to pptx --outdir "${outputDir}" "${inputPath}"`);
    
    // Get the output filename
    const ext = path.extname(inputPath);
    const baseName = path.basename(inputPath, ext);
    outputPath = path.join(outputDir, `${baseName}.pptx`);
    
    const buffer = await readFileAsBuffer(outputPath);
    const outputFilename = file.name.replace(/\.pdf$/i, '.pptx');
    
    return fileResponse(buffer, outputFilename, 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
  } catch (error) {
    console.error('PDF to PowerPoint conversion error:', error);
    return errorResponse('Conversion failed. Please try again.', 500);
  } finally {
    await cleanupFiles(inputPath, outputPath);
  }
}
