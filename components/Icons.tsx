// FilePilot Icon Library - Professional SVG Icons
// Primary Color: Emerald (#10B981) - Professional & Modern

export const Icons = {
  // Brand Logo - Abstract Navigation/Pilot Symbol (Dark Slate)
  Logo: ({ className = "w-8 h-8" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#1e293b" />
      <path d="M20 10L30 25L20 30L10 25L20 10Z" fill="white" fillOpacity="0.95" />
      <path d="M20 30V18" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),

  // Logo Icon Only (no background) - Dark Slate
  LogoMark: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L19 13L12 17L5 13L12 2Z" fill="#1e293b" />
      <path d="M12 17V9" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),

  // PDF Tools Icons
  PdfFile: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="14,2 14,8 20,8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 15h6M9 11h6" strokeLinecap="round" />
    </svg>
  ),

  PdfToWord: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="3" width="8" height="11" rx="1" strokeLinecap="round" />
      <path d="M4 6h4M4 8h4M4 10h2" strokeLinecap="round" />
      <rect x="14" y="10" width="8" height="11" rx="1" strokeLinecap="round" />
      <path d="M16 13h4M16 15h4M16 17h2" strokeLinecap="round" />
      <path d="M10 9l4 4" strokeLinecap="round" />
      <path d="M14 9l-1 1" strokeLinecap="round" />
    </svg>
  ),

  WordToPdf: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="3" width="8" height="11" rx="1" strokeLinecap="round" />
      <path d="M4 6h4M4 8h4M4 10h2" strokeLinecap="round" />
      <rect x="14" y="10" width="8" height="11" rx="1" strokeLinecap="round" />
      <path d="M17 13v5l1.5-2 1.5 2v-5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 9l4 4" strokeLinecap="round" />
      <path d="M14 9l-1 1" strokeLinecap="round" />
    </svg>
  ),

  MergePdf: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="2" width="7" height="9" rx="1" />
      <rect x="15" y="2" width="7" height="9" rx="1" />
      <rect x="8" y="13" width="8" height="9" rx="1" />
      <path d="M5.5 11v2M18.5 11v2M9 11h6" strokeLinecap="round" />
      <path d="M12 11v2" strokeLinecap="round" />
    </svg>
  ),

  SplitPdf: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="8" y="2" width="8" height="9" rx="1" />
      <rect x="2" y="13" width="7" height="9" rx="1" />
      <rect x="15" y="13" width="7" height="9" rx="1" />
      <path d="M12 11v2M5.5 11v2M18.5 11v2" strokeLinecap="round" />
      <path d="M9 13h-4M19 13h-4" strokeLinecap="round" />
    </svg>
  ),

  CompressPdf: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M9 4v16M15 4v16" strokeLinecap="round" />
      <path d="M4 12h16" strokeLinecap="round" />
      <path d="M7 9l2 3-2 3M17 9l-2 3 2 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  ImagesToPdf: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="4" width="10" height="8" rx="1" />
      <circle cx="5" cy="7" r="1" />
      <path d="M2 10l3-2 2 1 3-2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="12" y="12" width="10" height="10" rx="1" />
      <path d="M14 15h6M14 17h6M14 19h3" strokeLinecap="round" />
      <path d="M10 10l4 4" strokeLinecap="round" />
    </svg>
  ),

  PdfToPng: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="4" width="10" height="10" rx="1" />
      <path d="M4 7h6M4 9h6M4 11h3" strokeLinecap="round" />
      <rect x="12" y="10" width="10" height="10" rx="1" />
      <circle cx="15" cy="13" r="1" />
      <path d="M12 18l3-2 2 1 3-2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 10l4 4" strokeLinecap="round" />
    </svg>
  ),

  // Image Tools Icons
  JpgToPng: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="4" width="8" height="8" rx="1" />
      <circle cx="5" cy="7" r="1" />
      <path d="M2 10l2-1.5 2 1 2-1.5" />
      <rect x="14" y="12" width="8" height="8" rx="1" />
      <path d="M10 10l4 4" strokeLinecap="round" />
      <path d="M16 15h4M16 17h2" strokeLinecap="round" />
    </svg>
  ),

  PngToJpg: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="4" width="8" height="8" rx="1" />
      <path d="M4 7h4M4 9h2" strokeLinecap="round" />
      <rect x="14" y="12" width="8" height="8" rx="1" />
      <circle cx="17" cy="15" r="1" />
      <path d="M14 18l2-1.5 2 1 2-1.5" />
      <path d="M10 10l4 4" strokeLinecap="round" />
    </svg>
  ),

  ImageCompress: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8" cy="8" r="2" />
      <path d="M21 15l-5-5-3 3-4-4-6 6" />
      <path d="M8 3v3M16 3v3M8 18v3M16 18v3" strokeLinecap="round" />
    </svg>
  ),

  ImageToWebp: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="4" width="8" height="8" rx="1" />
      <circle cx="5" cy="7" r="1" />
      <path d="M2 10l2-1.5 2 1 2-1.5" />
      <rect x="14" y="12" width="8" height="8" rx="1" />
      <path d="M16 15l1 3 1-2 1 2 1-3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 10l4 4" strokeLinecap="round" />
    </svg>
  ),

  // Text/Doc Tools Icons
  OcrText: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="12" cy="10" r="3" />
      <path d="M8 17h8M10 17v-2M14 17v-2" />
      <path d="M7 7h2M15 7h2M7 13h1M16 13h1" strokeLinecap="round" />
    </svg>
  ),

  PdfToText: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="3" width="9" height="11" rx="1" />
      <path d="M4 6h5M4 8h5M4 10h3" strokeLinecap="round" />
      <path d="M11 9l4 4" strokeLinecap="round" />
      <path d="M14 13h7M14 16h7M14 19h5" strokeLinecap="round" />
    </svg>
  ),

  // Archive Tools Icons
  ZipFiles: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <rect x="10" y="2" width="4" height="3" />
      <rect x="10" y="5" width="4" height="3" />
      <rect x="10" y="8" width="4" height="3" />
      <rect x="10" y="14" width="4" height="5" rx="1" />
      <circle cx="12" cy="16" r="1" />
    </svg>
  ),

  UnzipFiles: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="4" y="4" width="16" height="18" rx="2" />
      <rect x="10" y="7" width="4" height="2" />
      <rect x="10" y="10" width="4" height="2" />
      <path d="M12 2v4M9 4l3-2 3 2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 16h6M9 18h4" strokeLinecap="round" />
    </svg>
  ),

  // Audio Tools Icons
  AudioConvert: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 18V5l12-2v13" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  ),

  // Video Tools Icons
  VideoConvert: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <polygon points="10,8 16,12 10,16" fill="currentColor" stroke="none" />
      <path d="M2 8h2M20 8h2M2 12h2M20 12h2M2 16h2M20 16h2" strokeLinecap="round" />
    </svg>
  ),

  VideoCompress: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <polygon points="10,9 15,12 10,15" fill="currentColor" stroke="none" />
      <path d="M7 5v-2M17 5v-2M7 19v2M17 19v2" strokeLinecap="round" />
      <path d="M3 10h2M19 10h2M3 14h2M19 14h2" strokeLinecap="round" />
    </svg>
  ),

  // Category Icons
  CategoryPdf: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="14,2 14,8 20,8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 12h4M10 16h4" strokeLinecap="round" />
    </svg>
  ),

  Menu: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),

  CategoryImage: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5-11 11" />
    </svg>
  ),

  CategoryText: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14,2 14,8 20,8" />
      <path d="M16 13H8M16 17H8M10 9H8" strokeLinecap="round" />
    </svg>
  ),

  CategoryArchive: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="4" width="20" height="5" rx="1" />
      <path d="M4 9v9a2 2 0 002 2h12a2 2 0 002-2V9" />
      <path d="M10 13h4" strokeLinecap="round" />
    </svg>
  ),

  CategoryAudio: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  ),

  CategoryVideo: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <polygon points="10,8 16,12 10,16" fill="currentColor" stroke="none" />
    </svg>
  ),

  // QR Code Icon
  QrCode: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="3" height="3" />
      <rect x="18" y="14" width="3" height="3" />
      <rect x="14" y="18" width="3" height="3" />
      <rect x="18" y="18" width="3" height="3" />
    </svg>
  ),

  // UI Icons
  Upload: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="17,8 12,3 7,8" />
      <path d="M12 3v12" />
    </svg>
  ),

  Download: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7,10 12,15 17,10" />
      <path d="M12 15V3" />
    </svg>
  ),

  Convert: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 4v5h5" />
      <path d="M20 20v-5h-5" />
      <path d="M4 9a8 8 0 0113.292-5.994" />
      <path d="M20 15a8 8 0 01-13.292 5.994" />
    </svg>
  ),

  Search: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  ),

  Check: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20,6 9,17 4,12" />
    </svg>
  ),

  Close: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  ),

  ArrowRight: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),

  ArrowLeft: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  ),

  Shield: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),

  Bolt: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" fill="currentColor" />
    </svg>
  ),

  Code: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="16,18 22,12 16,6" />
      <polyline points="8,6 2,12 8,18" />
    </svg>
  ),

  File: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14,2 14,8 20,8" />
    </svg>
  ),

  Trash: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="3,6 5,6 21,6" />
      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  ),

  GitHub: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
    </svg>
  ),

  Heart: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  ),

  ChevronRight: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18l6-6-6-6" />
    </svg>
  ),

  Clock: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),

  Settings: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  ),

  // New icons for additional tools
  BackgroundRemove: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="12" cy="12" r="4" />
      <path d="M3 3l18 18" strokeLinecap="round" />
    </svg>
  ),

  BackgroundAdd: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" fill="currentColor" fillOpacity="0.1" />
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 9v6M9 12h6" strokeLinecap="round" />
    </svg>
  ),

  Presentation: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21l4-4 4 4" />
      <path d="M12 17v-4" />
      <circle cx="8" cy="9" r="2" />
      <path d="M13 8h4M13 11h3" />
    </svg>
  ),

  PptToPdf: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="3" width="8" height="10" rx="1" />
      <circle cx="6" cy="7" r="1.5" />
      <path d="M4 10h4" />
      <rect x="14" y="11" width="8" height="10" rx="1" />
      <path d="M16 14h4M16 16h4M16 18h2" />
      <path d="M10 9l4 4" strokeLinecap="round" />
    </svg>
  ),

  PdfToPpt: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="3" width="8" height="10" rx="1" />
      <path d="M4 6h4M4 8h4M4 10h2" />
      <rect x="14" y="11" width="8" height="10" rx="1" />
      <circle cx="18" cy="15" r="1.5" />
      <path d="M16 18h4" />
      <path d="M10 9l4 4" strokeLinecap="round" />
    </svg>
  ),

  Refresh: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21.5 2v6h-6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.5 22v-6h6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 11.5a10 10 0 0118.8-4.3M22 12.5a10 10 0 01-18.8 4.2" strokeLinecap="round" />
    </svg>
  ),

  Home: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="9,22 9,12 15,12 15,22" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  Mail: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

// Tool Icon Mapping
export const toolIconMap: Record<string, keyof typeof Icons> = {
  'pdf-to-word': 'PdfToWord',
  'word-to-pdf': 'WordToPdf',
  'merge-pdf': 'MergePdf',
  'split-pdf': 'SplitPdf',
  'compress-pdf': 'CompressPdf',
  'images-to-pdf': 'ImagesToPdf',
  'pdf-to-png': 'PdfToPng',
  'ppt-to-pdf': 'PptToPdf',
  'pdf-to-ppt': 'PdfToPpt',
  'jpg-to-png': 'JpgToPng',
  'png-to-jpg': 'PngToJpg',
  'image-compressor': 'ImageCompress',
  'image-to-webp': 'ImageToWebp',
  'background-remover': 'BackgroundRemove',
  'add-background': 'BackgroundAdd',
  'ocr-image': 'OcrText',
  'pdf-to-text': 'PdfToText',
  'zip-files': 'ZipFiles',
  'unzip-files': 'UnzipFiles',
  'qr-code-generator': 'QrCode',
  'video-converter': 'VideoConvert',
  'video-compressor': 'VideoCompress',
};

// Category Icon Mapping
export const categoryIconMap: Record<string, keyof typeof Icons> = {
  'pdf': 'CategoryPdf',
  'image': 'CategoryImage',
  'text': 'CategoryText',
  'archive': 'CategoryArchive',
  'video': 'CategoryVideo',
};

export default Icons;
