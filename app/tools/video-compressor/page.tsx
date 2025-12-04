'use client';

import { useState, useCallback } from 'react';
import ToolLayout from '@/components/ToolLayout';
import FileUpload from '@/components/FileUpload';
import ConvertButton from '@/components/ConvertButton';
import MultiFileDownloadButton from '@/components/MultiFileDownloadButton';
import ProgressIndicator, { ProgressStatus } from '@/components/ProgressIndicator';
import StepIndicator from '@/components/StepIndicator';
import SimilarTools from '@/components/SimilarTools';

interface ConversionResult {
  blob: Blob;
  filename: string;
}

export default function VideoCompressorPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [crf, setCrf] = useState(28);
  const [status, setStatus] = useState<ProgressStatus>('idle');
  const [message, setMessage] = useState('');
  const [results, setResults] = useState<ConversionResult[]>([]);

  const handleFilesSelected = useCallback((selectedFiles: File[]) => {
    setFiles(selectedFiles);
    if (selectedFiles.length > 0) {
      setResults([]);
      setStatus('idle');
      setMessage('');
    }
  }, []);

  const handleConvert = async () => {
    if (files.length === 0) return;

    setStatus('uploading');
    setMessage(`Processing ${files.length} file${files.length > 1 ? 's' : ''}...`);
    setResults([]);

    try {
      const compressedResults: ConversionResult[] = [];
      let totalOriginalSize = 0;
      let totalCompressedSize = 0;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        totalOriginalSize += file.size;
        setStatus('converting');
        setMessage(`Compressing ${i + 1} of ${files.length}: ${file.name} (this may take a while)`);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('crf', crf.toString());

        const response = await fetch('/api/video-compressor', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(`Failed to compress ${file.name}: ${error.error || 'Compression failed'}`);
        }

        const blob = await response.blob();
        totalCompressedSize += blob.size;
        const filename = file.name.replace(/\.mp4$/i, '-compressed.mp4');
        compressedResults.push({ blob, filename });
      }

      setResults(compressedResults);
      setStatus('done');
      const savedPercent = ((1 - totalCompressedSize / totalOriginalSize) * 100).toFixed(0);
      setMessage(`Compressed ${compressedResults.length} file${compressedResults.length > 1 ? 's' : ''}! Saved ${savedPercent}% (${(totalOriginalSize / 1024 / 1024).toFixed(1)}MB → ${(totalCompressedSize / 1024 / 1024).toFixed(1)}MB)`);
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const currentStep = status === 'idle' ? 'upload' : status === 'done' ? 'download' : 'convert';

  return (
    <ToolLayout
      title="Video Compressor"
      description="Reduce video file size - supports multiple files"
    >
      <StepIndicator currentStep={currentStep} />

      <div className="space-y-6">
        <FileUpload
          accept=".mp4"
          multiple={true}
          onFilesSelected={handleFilesSelected}
          fileType="Video"
        />

        {files.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Compression Level (CRF: {crf})
            </label>
            <input
              type="range"
              min="18"
              max="40"
              value={crf}
              onChange={(e) => setCrf(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Better quality (larger)</span>
              <span>Smaller file (lower quality)</span>
            </div>
          </div>
        )}

        {files.length > 0 && (
          <ConvertButton
            onClick={handleConvert}
            loading={status === 'uploading' || status === 'converting'}
            disabled={files.length === 0}
          >
            Compress {files.length} Video{files.length > 1 ? 's' : ''}
          </ConvertButton>
        )}

        {status !== 'idle' && (
          <ProgressIndicator status={status} message={message} />
        )}

        {results.length > 0 && (
          <MultiFileDownloadButton results={results} />
        )}
      </div>

      <div className="mt-16">
        <SimilarTools currentTool="video-compressor" />
      </div>
    </ToolLayout>
  );
}
