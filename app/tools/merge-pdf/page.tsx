'use client';

import { useState, useCallback } from 'react';
import ToolLayout from '@/components/ToolLayout';
import FileUpload from '@/components/FileUpload';
import ConvertButton from '@/components/ConvertButton';
import DownloadButton from '@/components/DownloadButton';
import ProgressIndicator, { ProgressStatus } from '@/components/ProgressIndicator';
import ConversionSkeleton from '@/components/ConversionSkeleton';
import StepIndicator from '@/components/StepIndicator';
import SimilarTools from '@/components/SimilarTools';

export default function MergePdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<ProgressStatus>('idle');
  const [message, setMessage] = useState('');
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleFilesSelected = useCallback((newFiles: File[]) => {
    setFiles(newFiles);
    setResultBlob(null);
    setStatus('idle');
  }, []);

  const moveFile = useCallback((fromIndex: number, toIndex: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      const [movedFile] = newFiles.splice(fromIndex, 1);
      newFiles.splice(toIndex, 0, movedFile);
      return newFiles;
    });
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleConvert = async () => {
    if (files.length < 2) return;

    setStatus('uploading');
    setMessage('Uploading files...');
    setResultBlob(null);

    try {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));

      setStatus('converting');
      setMessage('Merging PDFs...');

      const response = await fetch('/api/merge-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Merge failed');
      }

      const blob = await response.blob();

      setResultBlob(blob);
      setStatus('done');
      setMessage('Merge complete!');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const currentStep = status === 'idle' ? 'upload' : status === 'done' ? 'download' : 'convert';

  return (
    <ToolLayout
      title="Merge PDF"
      description="Combine multiple PDF files into one"
      icon="📚"
    >
      <StepIndicator currentStep={currentStep} />

      <div className="space-y-6">
        <FileUpload
          accept=".pdf"
          multiple={true}
          onFilesSelected={handleFilesSelected}
          fileType="PDF"
        />

        {files.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-charcoal flex items-center gap-2">
                <span className="w-6 h-6 bg-primary-100 rounded-lg flex items-center justify-center text-xs font-bold text-primary-600">
                  {files.length}
                </span>
                Files to Merge
              </h4>
              <p className="text-xs text-slate-400">Drag to reorder</p>
            </div>

            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  draggable
                  onDragStart={() => setDraggedIndex(index)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    if (draggedIndex !== null && draggedIndex !== index) {
                      moveFile(draggedIndex, index);
                      setDraggedIndex(index);
                    }
                  }}
                  onDragEnd={() => setDraggedIndex(null)}
                  className={`flex items-center justify-between p-4 bg-white rounded-xl border shadow-sm group cursor-move transition-all ${draggedIndex === index
                    ? 'border-primary-400 shadow-glow scale-[1.02]'
                    : 'border-slate-100 hover:border-primary-200 hover:shadow-md'
                    }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </span>
                      <svg className="w-4 h-4 text-slate-300" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
                      </svg>
                    </div>
                    <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                      <span className="text-lg">📄</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-charcoal truncate">
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
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {files.length > 0 && files.length < 2 && (
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            <p className="text-amber-700 text-sm font-medium">Please add at least 2 PDF files to merge.</p>
          </div>
        )}

        {files.length >= 2 && (
          <ConvertButton
            onClick={handleConvert}
            loading={status === 'uploading' || status === 'converting'}
            disabled={files.length < 2}
          >
            Merge {files.length} PDFs
          </ConvertButton>
        )}

        {status !== 'idle' && (
          <ProgressIndicator status={status} message={message} />
        )}

        {status === 'converting' && (
          <div className="fade-up">
            <ConversionSkeleton />
          </div>
        )}

        {resultBlob && (
          <DownloadButton blob={resultBlob} filename="merged.pdf" />
        )}
      </div>

      <div className="mt-16">
        <SimilarTools currentTool="merge-pdf" />
      </div>
    </ToolLayout>
  );
}
