import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { validateFileContent } from './fileValidation';

export const execAsync = promisify(exec);

export const TMP_DIR = '/tmp/filepilot';
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

// Ensure temp directory exists
export async function ensureTmpDir(): Promise<void> {
  try {
    await fs.mkdir(TMP_DIR, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
}

// Generate unique filename
export function generateTmpPath(extension: string): string {
  const uuid = uuidv4();
  return path.join(TMP_DIR, `${uuid}${extension}`);
}

// Save uploaded file to temp directory
export async function saveUploadedFile(file: File): Promise<string> {
  await ensureTmpDir();

  const extension = path.extname(file.name) || '';
  const tmpPath = generateTmpPath(extension);

  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(tmpPath, buffer);

  return tmpPath;
}

// Save multiple uploaded files
export async function saveUploadedFiles(files: File[]): Promise<string[]> {
  const paths: string[] = [];
  for (const file of files) {
    const filePath = await saveUploadedFile(file);
    paths.push(filePath);
  }
  return paths;
}

// Clean up temp files
export async function cleanupFiles(...filePaths: string[]): Promise<void> {
  for (const filePath of filePaths) {
    try {
      if (filePath) {
        await fs.unlink(filePath);
      }
    } catch (error) {
      // File might not exist, ignore
    }
  }
}

// Clean up directory
export async function cleanupDir(dirPath: string): Promise<void> {
  try {
    await fs.rm(dirPath, { recursive: true, force: true });
  } catch (error) {
    // Directory might not exist, ignore
  }
}

// Read file as buffer
export async function readFileAsBuffer(filePath: string): Promise<Buffer> {
  return fs.readFile(filePath);
}

// Sanitize filename
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .substring(0, 255);
}

// Get content type based on extension
export function getContentType(extension: string): string {
  const types: Record<string, string> = {
    '.pdf': 'application/pdf',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.doc': 'application/msword',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.txt': 'text/plain',
    '.zip': 'application/zip',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
  };
  return types[extension.toLowerCase()] || 'application/octet-stream';
}

// Validate file type
export function validateFileType(filename: string, allowedExtensions: string[]): boolean {
  const ext = path.extname(filename).toLowerCase();
  return allowedExtensions.includes(ext);
}

// Validate file size
export function validateFileSize(size: number): boolean {
  return size <= MAX_FILE_SIZE;
}

// Enhanced validation: Check both extension AND file content
export async function validateFileTypeAndContent(
  file: File,
  allowedExtensions: string[]
): Promise<{ valid: boolean; error?: string }> {
  // First check extension
  if (!validateFileType(file.name, allowedExtensions)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed: ${allowedExtensions.join(', ')}`
    };
  }

  // Validate actual file content
  // Using arrayBuffer() instead of FileReader for Node.js compatibility
  try {
    const ext = path.extname(file.name).toLowerCase().replace('.', '');
    const contentValid = await validateFileContent(file, ext);

    if (!contentValid) {
      return {
        valid: false,
        error: 'File content does not match its extension. Possible corrupted or malicious file.'
      };
    }
  } catch (error) {
    // If validation fails, log but allow the file (fail-open for better UX)
    console.warn('File content validation error:', error);
  }

  return { valid: true };
}

// Create error response
export function errorResponse(message: string, status: number = 400): Response {
  return new Response(
    JSON.stringify({ error: message }),
    {
      status,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}

// Create file response
export function fileResponse(
  buffer: Buffer,
  filename: string,
  contentType: string
): Response {
  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${sanitizeFilename(filename)}"`,
      'Content-Length': buffer.length.toString(),
    },
  });
}
