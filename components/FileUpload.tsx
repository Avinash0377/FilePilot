'use client';

import { useCallback, useState } from 'react';
import { Icons } from './Icons';

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  onFilesSelected: (files: File[]) => void;
  fileType?: string; // e.g., "PDF", "Image", "Video", etc.
}

interface FilePreview {
  file: File;
  preview?: string;
  type: 'image' | 'pdf' | 'document' | 'video' | 'audio' | 'archive' | 'other';
}

export default function FileUpload({
  accept = '*',
  multiple = false,
  maxSize = 50 * 1024 * 1024,
  onFilesSelected,
  fileType = 'file'
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<FilePreview[]>([]);
  const [error, setError] = useState<string | null>(null);

  const getFileType = (file: File): FilePreview['type'] => {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(ext)) return 'image';
    if (ext === 'pdf') return 'pdf';
    if (['doc', 'docx', 'txt'].includes(ext)) return 'document';
    if (['mp4', 'avi', 'mov', 'webm'].includes(ext)) return 'video';
    if (['mp3', 'wav'].includes(ext)) return 'audio';
    if (['zip', 'rar', '7z'].includes(ext)) return 'archive';
    return 'other';
  };

  const generatePreviews = useCallback((files: File[]) => {
    const previews: FilePreview[] = [];

    files.forEach(file => {
      const fileType = getFileType(file);
      const preview: FilePreview = { file, type: fileType };

      // Generate preview for images
      if (fileType === 'image') {
        const reader = new FileReader();
        reader.onloadend = () => {
          preview.preview = reader.result as string;
          setFilePreviews(prev => {
            const updated = [...prev];
            const index = updated.findIndex(p => p.file.name === file.name);
            if (index !== -1) {
              updated[index] = preview;
            }
            return updated;
          });
        };
        reader.readAsDataURL(file);
      }
      // For PDFs, generate a data URL for preview
      else if (fileType === 'pdf') {
        const reader = new FileReader();
        reader.onloadend = () => {
          preview.preview = reader.result as string;
          setFilePreviews(prev => {
            const updated = [...prev];
            const index = updated.findIndex(p => p.file.name === file.name);
            if (index !== -1) {
              updated[index] = preview;
            }
            return updated;
          });
        };
        reader.readAsDataURL(file);
      }

      previews.push(preview);
    });

    setFilePreviews(previews);
  }, []);

  const validateFiles = useCallback((files: File[]): File[] => {
    const validFiles: File[] = [];
    for (const file of files) {
      if (file.size > maxSize) {
        setError(`File "${file.name}" exceeds ${Math.round(maxSize / 1024 / 1024)}MB`);
        continue;
      }
      validFiles.push(file);
    }
    return validFiles;
  }, [maxSize]);

  const handleFiles = useCallback((files: FileList | null) => {
    setError(null);
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const validFiles = validateFiles(fileArray);

    if (validFiles.length > 0) {
      if (multiple) {
        setSelectedFiles(prev => {
          const existingNames = new Set(prev.map(f => f.name));
          const newFiles = validFiles.filter(f => !existingNames.has(f.name));
          const combined = [...prev, ...newFiles];
          onFilesSelected(combined);
          generatePreviews(combined);
          return combined;
        });
      } else {
        setSelectedFiles(validFiles);
        onFilesSelected(validFiles);
        generatePreviews(validFiles);
      }
    }
  }, [validateFiles, onFilesSelected, multiple, generatePreviews]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    e.target.value = '';
  }, [handleFiles]);

  const removeFile = useCallback((index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setFilePreviews(prev => prev.filter((_, i) => i !== index));
    onFilesSelected(newFiles);
  }, [selectedFiles, onFilesSelected]);

  const clearFiles = useCallback(() => {
    setSelectedFiles([]);
    setFilePreviews([]);
    onFilesSelected([]);
    setError(null);
  }, [onFilesSelected]);

  const getFileIcon = (preview?: FilePreview) => {
    if (!preview) return <Icons.PdfFile className="w-5 h-5 text-emerald-600" />;
    switch (preview.type) {
      case 'pdf': return <Icons.PdfFile className="w-5 h-5 text-red-500" />;
      case 'document': return <Icons.WordToPdf className="w-5 h-5 text-blue-500" />;
      case 'video': return <Icons.VideoConvert className="w-5 h-5 text-purple-500" />;
      case 'audio': return <Icons.AudioConvert className="w-5 h-5 text-pink-500" />;
      case 'archive': return <Icons.ZipFiles className="w-5 h-5 text-orange-500" />;
      default: return <Icons.PdfFile className="w-5 h-5 text-emerald-600" />;
    }
  };

  // Check if we should show camera button (only for image tools on mobile)
  const showCameraButton = accept.includes('image') && typeof navigator !== 'undefined' && 'mediaDevices' in navigator;

  return (
    <div className="w-full">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative cursor-pointer border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all duration-200
          ${isDragOver
            ? 'border-brand-500 bg-brand-50 shadow-glow'
            : 'border-slate-300 hover:border-brand-400 hover:bg-slate-50 hover:shadow-soft-md'
          }
        `}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="space-y-4">
          <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl transition-all duration-200 ${isDragOver
            ? 'bg-gradient-to-br from-brand-500 to-accent-600 text-white shadow-glow'
            : 'bg-gradient-to-br from-brand-100 to-accent-100 text-brand-600'
            }`}>
            {isDragOver ? <Icons.Download className="w-6 h-6 sm:w-7 sm:h-7" /> : <Icons.Upload className="w-6 h-6 sm:w-7 sm:h-7" />}
          </div>
          <div>
            {/* Desktop Text */}
            <p className="hidden sm:block text-base sm:text-lg font-semibold text-slate-900 mb-2">
              {isDragOver ? 'Drop your files here' : (multiple ? 'Drag & drop files here' : 'Drag & drop file here')}
            </p>
            {/* Mobile Text */}
            <p className="block sm:hidden text-base font-semibold text-slate-900 mb-2">
              {multiple ? `Select ${fileType} files` : `Select ${fileType} file`}
            </p>
            <p className="text-sm sm:text-base text-slate-600">
              <span className="hidden sm:inline">or </span><span className="text-brand-600 font-semibold">Tap to browse</span><span className="hidden sm:inline"> from your computer</span>
            </p>
          </div>

          {/* Camera Button for Mobile (Image tools only) */}
          {showCameraButton && (
            <div className="pt-2">
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg cursor-pointer transition-colors touch-manipulation active:scale-95 min-h-[44px]">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleInputChange}
                  className="hidden"
                />
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Take Photo
              </label>
            </div>
          )}

          <div className="flex items-center justify-center gap-2 pt-2">
            <p className="text-xs sm:text-sm text-slate-500">
              Supports: <span className="font-medium text-slate-700">{accept === '*' ? 'All formats' : accept.replace(/\./g, '').toUpperCase()}</span> up to {Math.round(maxSize / 1024 / 1024)}MB
            </p>
            {multiple && <span className="px-2 py-1 bg-brand-50 text-brand-700 text-xs font-medium rounded-lg">Multiple files</span>}
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 sm:p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm flex items-center gap-3">
          <Icons.Close className="w-5 h-5 text-red-500 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className="mt-6 space-y-3">
          <div className="flex justify-between items-center gap-2">
            <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <span className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center text-xs font-bold text-white">
                {selectedFiles.length}
              </span>
              Selected Files
            </h4>
            <div className="flex items-center gap-2">
              {multiple && (
                <label className="text-xs font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors btn-press cursor-pointer min-h-[44px] px-3 touch-manipulation active:scale-95">
                  <input
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    onChange={handleInputChange}
                    className="hidden"
                  />
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add more
                </label>
              )}
              <button
                onClick={clearFiles}
                className="text-xs font-medium text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors btn-press min-h-[44px] px-3 touch-manipulation active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear all
              </button>
            </div>
          </div>
          <div className="space-y-2">
            {selectedFiles.map((file, index) => {
              const preview = filePreviews[index];
              const showThumbnail = preview?.type === 'image' && preview.preview;
              const showPDFEmbed = preview?.type === 'pdf' && preview.preview;

              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 sm:p-4 bg-white rounded-xl border border-slate-100 shadow-sm group hover:shadow-md hover:border-emerald-100 transition-all"
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    {showThumbnail ? (
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 border-slate-100 flex-shrink-0 bg-white">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={preview.preview}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : showPDFEmbed ? (
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 border-red-100 flex-shrink-0 bg-red-50 flex items-center justify-center relative">
                        <Icons.PdfFile className="w-7 h-7 sm:w-8 sm:h-8 text-red-500" />
                        <div className="absolute bottom-0 right-0 bg-red-500 text-white text-[8px] font-bold px-1 rounded-tl">
                          PDF
                        </div>
                      </div>
                    ) : (
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        {getFileIcon(preview)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {file.size < 1024 * 1024
                          ? `${(file.size / 1024).toFixed(1)} KB`
                          : `${(file.size / 1024 / 1024).toFixed(2)} MB`
                        }
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="min-w-[44px] min-h-[44px] w-10 h-10 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all flex-shrink-0 touch-manipulation active:scale-90"
                  >
                    <Icons.Close className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              );
            })}
          </div>

          {multiple && (
            <label className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-emerald-200 rounded-xl cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition-all min-h-[44px] touch-manipulation active:scale-98">
              <input
                type="file"
                accept={accept}
                multiple={multiple}
                onChange={handleInputChange}
                className="hidden"
              />
              <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-sm font-medium text-emerald-600">Add More Files</span>
            </label>
          )}
        </div>
      )}
    </div>
  );
}
