import { Icons, toolIconMap } from '@/components/Icons';

export interface Tool {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Icons;
  href: string;
  category: 'pdf' | 'image' | 'text' | 'archive' | 'video' | 'utility';
  supportedFormats: string[];
  maxFileSize: string;
}

export const tools: Tool[] = [
  // PDF Tools
  {
    id: 'pdf-to-word',
    title: 'PDF to Word',
    description: 'Convert PDF documents to editable Word files',
    icon: 'PdfToWord',
    href: '/tools/pdf-to-word',
    category: 'pdf',
    supportedFormats: ['PDF', 'DOCX'],
    maxFileSize: '50MB',
  },
  {
    id: 'word-to-pdf',
    title: 'Word to PDF',
    description: 'Convert Word documents to PDF format',
    icon: 'WordToPdf',
    href: '/tools/word-to-pdf',
    category: 'pdf',
    supportedFormats: ['DOCX', 'DOC', 'PDF'],
    maxFileSize: '50MB',
  },
  {
    id: 'merge-pdf',
    title: 'Merge PDF',
    description: 'Combine multiple PDF files into one',
    icon: 'MergePdf',
    href: '/tools/merge-pdf',
    category: 'pdf',
    supportedFormats: ['PDF'],
    maxFileSize: '100MB',
  },
  {
    id: 'split-pdf',
    title: 'Split PDF',
    description: 'Extract pages from a PDF file',
    icon: 'SplitPdf',
    href: '/tools/split-pdf',
    category: 'pdf',
    supportedFormats: ['PDF'],
    maxFileSize: '100MB',
  },
  {
    id: 'compress-pdf',
    title: 'Compress PDF',
    description: 'Reduce PDF file size',
    icon: 'CompressPdf',
    href: '/tools/compress-pdf',
    category: 'pdf',
    supportedFormats: ['PDF'],
    maxFileSize: '100MB',
  },
  {
    id: 'images-to-pdf',
    title: 'Images to PDF',
    description: 'Convert JPG/PNG images to PDF',
    icon: 'ImagesToPdf',
    href: '/tools/images-to-pdf',
    category: 'pdf',
    supportedFormats: ['JPG', 'PNG', 'PDF'],
    maxFileSize: '50MB',
  },
  {
    id: 'pdf-to-png',
    title: 'PDF to PNG',
    description: 'Convert PDF pages to PNG images',
    icon: 'PdfToPng',
    href: '/tools/pdf-to-png',
    category: 'pdf',
    supportedFormats: ['PDF', 'PNG'],
    maxFileSize: '50MB',
  },
  {
    id: 'ppt-to-pdf',
    title: 'PPT to PDF',
    description: 'Convert PowerPoint presentations to PDF',
    icon: 'PptToPdf',
    href: '/tools/ppt-to-pdf',
    category: 'pdf',
    supportedFormats: ['PPT', 'PPTX', 'PDF'],
    maxFileSize: '50MB',
  },
  {
    id: 'pdf-to-ppt',
    title: 'PDF to PPT',
    description: 'Convert PDF files to PowerPoint presentations',
    icon: 'PdfToPpt',
    href: '/tools/pdf-to-ppt',
    category: 'pdf',
    supportedFormats: ['PDF', 'PPTX'],
    maxFileSize: '50MB',
  },

  // Image Tools
  {
    id: 'jpg-to-png',
    title: 'JPG to PNG',
    description: 'Convert JPG images to PNG format',
    icon: 'JpgToPng',
    href: '/tools/jpg-to-png',
    category: 'image',
    supportedFormats: ['JPG', 'PNG'],
    maxFileSize: '50MB',
  },
  {
    id: 'png-to-jpg',
    title: 'PNG to JPG',
    description: 'Convert PNG images to JPG format',
    icon: 'PngToJpg',
    href: '/tools/png-to-jpg',
    category: 'image',
    supportedFormats: ['PNG', 'JPG'],
    maxFileSize: '50MB',
  },
  {
    id: 'image-compressor',
    title: 'Image Compressor',
    description: 'Compress JPG, PNG, or WebP images',
    icon: 'ImageCompress',
    href: '/tools/image-compressor',
    category: 'image',
    supportedFormats: ['JPG', 'PNG', 'WEBP'],
    maxFileSize: '50MB',
  },
  {
    id: 'image-to-webp',
    title: 'Image to WebP',
    description: 'Convert JPG/PNG to WebP format',
    icon: 'ImageToWebp',
    href: '/tools/image-to-webp',
    category: 'image',
    supportedFormats: ['JPG', 'PNG', 'WEBP'],
    maxFileSize: '50MB',
  },
  {
    id: 'background-remover',
    title: 'Background Remover',
    description: 'Remove background from images automatically',
    icon: 'BackgroundRemove',
    href: '/tools/background-remover',
    category: 'image',
    supportedFormats: ['JPG', 'PNG', 'WEBP'],
    maxFileSize: '10MB',
  },
  {
    id: 'add-background',
    title: 'Add Background',
    description: 'Add solid background color to transparent images',
    icon: 'BackgroundAdd',
    href: '/tools/add-background',
    category: 'image',
    supportedFormats: ['PNG', 'JPG'],
    maxFileSize: '50MB',
  },

  // Text/Doc Tools
  {
    id: 'ocr-image',
    title: 'Image to Text',
    description: 'Extract text from images instantly',
    icon: 'OcrText',
    href: '/tools/ocr-image',
    category: 'text',
    supportedFormats: ['JPG', 'PNG', 'TXT'],
    maxFileSize: '10MB',
  },
  {
    id: 'pdf-to-text',
    title: 'PDF to Text',
    description: 'Extract text content from PDF files',
    icon: 'PdfToText',
    href: '/tools/pdf-to-text',
    category: 'text',
    supportedFormats: ['PDF', 'TXT'],
    maxFileSize: '50MB',
  },

  // Archive Tools
  {
    id: 'zip-files',
    title: 'ZIP Files',
    description: 'Compress multiple files into a ZIP archive',
    icon: 'ZipFiles',
    href: '/tools/zip-files',
    category: 'archive',
    supportedFormats: ['Any', 'ZIP'],
    maxFileSize: '100MB',
  },
  {
    id: 'unzip-files',
    title: 'Unzip Files',
    description: 'Extract files from a ZIP archive',
    icon: 'UnzipFiles',
    href: '/tools/unzip-files',
    category: 'archive',
    supportedFormats: ['ZIP', 'Files'],
    maxFileSize: '100MB',
  },

  // Video Tools
  {
    id: 'video-converter',
    title: 'Video Converter',
    description: 'Convert between MP4 and WebM formats',
    icon: 'VideoConvert',
    href: '/tools/video-converter',
    category: 'video',
    supportedFormats: ['MP4', 'WEBM'],
    maxFileSize: '100MB',
  },
  {
    id: 'video-compressor',
    title: 'Video Compressor',
    description: 'Reduce video file size',
    icon: 'VideoCompress',
    href: '/tools/video-compressor',
    category: 'video',
    supportedFormats: ['MP4', 'WEBM'],
    maxFileSize: '100MB',
  },

  // Utility Tools
  {
    id: 'qr-code-generator',
    title: 'QR Code Generator',
    description: 'Create beautiful styled QR codes',
    icon: 'QrCode',
    href: '/tools/qr-code-generator',
    category: 'utility',
    supportedFormats: ['PNG', 'SVG'],
    maxFileSize: 'N/A',
  },
];

export const categories = [
  { id: 'pdf', name: 'PDF Tools', icon: '📄' },
  { id: 'image', name: 'Image Tools', icon: '🖼️' },
  { id: 'text', name: 'Text Tools', icon: '📝' },
  { id: 'archive', name: 'Archive Tools', icon: '📁' },
  { id: 'video', name: 'Video Tools', icon: '🎬' },
  { id: 'utility', name: 'Utility Tools', icon: '🛠️' },
];
