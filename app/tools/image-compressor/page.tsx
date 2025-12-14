'use client';

import { useState, useCallback } from 'react';
import ToolLayout from '@/components/ToolLayout';
import FileUpload from '@/components/FileUpload';
import ConvertButton from '@/components/ConvertButton';
import MultiFileDownloadButton from '@/components/MultiFileDownloadButton';
import ProgressIndicator, { ProgressStatus } from '@/components/ProgressIndicator';
import StepIndicator from '@/components/StepIndicator';
import SimilarTools from '@/components/SimilarTools';

interface CompressionResult {
  blob: Blob;
  filename: string;
  originalSize: number;
  compressedSize: number;
}

export default function ImageCompressorPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [targetPercent, setTargetPercent] = useState(50);
  const [status, setStatus] = useState<ProgressStatus>('idle');
  const [message, setMessage] = useState('');
  const [results, setResults] = useState<CompressionResult[]>([]);

  const handleFilesSelected = useCallback((selectedFiles: File[]) => {
    setFiles(selectedFiles);
    if (selectedFiles.length > 0) {
      setResults([]);
      setStatus('idle');
      setMessage('');
    }
  }, []);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  const handleConvert = async () => {
    if (files.length === 0) return;

    setStatus('uploading');
    setMessage(`Processing ${files.length} file${files.length > 1 ? 's' : ''}...`);
    setResults([]);

    try {
      const compressedResults: CompressionResult[] = [];
      let totalOriginal = 0;
      let totalCompressed = 0;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setStatus('converting');
        setMessage(`Compressing ${i + 1} of ${files.length}: ${file.name} (target: ${targetPercent}% of original)`);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('targetPercent', targetPercent.toString());

        const response = await fetch('/api/image-compressor', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(`Failed to compress ${file.name}: ${error.error || 'Compression failed'}`);
        }

        const blob = await response.blob();
        const filename = file.name.replace(/(\.[^.]+)$/, '-compressed$1');

        totalOriginal += file.size;
        totalCompressed += blob.size;

        compressedResults.push({
          blob,
          filename,
          originalSize: file.size,
          compressedSize: blob.size
        });
      }

      setResults(compressedResults);
      setStatus('done');
      const savedPercent = ((totalOriginal - totalCompressed) / totalOriginal * 100).toFixed(1);
      setMessage(`Compressed ${compressedResults.length} file${compressedResults.length > 1 ? 's' : ''}! Saved ${savedPercent}% (${formatSize(totalOriginal)} → ${formatSize(totalCompressed)})`);
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  // Calculate estimated size for display
  const estimatedSize = files.length > 0
    ? files.reduce((sum, f) => sum + f.size, 0) * (targetPercent / 100)
    : 0;
  const totalOriginalSize = files.reduce((sum, f) => sum + f.size, 0);

  const currentStep = status === 'idle' ? 'upload' : status === 'done' ? 'download' : 'convert';

  return (
    <ToolLayout
      title="Image Compressor"
      description="Compress JPG, PNG, or WebP images to a target size - supports multiple files"
    >
      <StepIndicator currentStep={currentStep} />

      <div className="space-y-6">
        <FileUpload
          accept=".jpg,.jpeg,.png,.webp"
          multiple={true}
          onFilesSelected={handleFilesSelected}
          fileType="Image"
        />

        {files.length > 0 && (
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-900">
                Target Size: {targetPercent}% of original
              </label>
              <span className="text-sm text-emerald-600 font-medium">
                ~{formatSize(estimatedSize)}
              </span>
            </div>

            <input
              type="range"
              min="10"
              max="90"
              step="5"
              value={targetPercent}
              onChange={(e) => setTargetPercent(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />

            <div className="flex justify-between text-xs text-gray-500">
              <span>10% (max compression)</span>
              <span>90% (minimal compression)</span>
            </div>

            {/* Visual indicator */}
            <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">Original</div>
                  <div className="h-3 bg-blue-200 rounded-full"></div>
                  <div className="text-xs font-medium text-gray-700 mt-1">{formatSize(totalOriginalSize)}</div>
                </div>
                <div className="text-gray-400">→</div>
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">Target</div>
                  <div className="h-3 bg-emerald-400 rounded-full" style={{ width: `${targetPercent}%` }}></div>
                  <div className="text-xs font-medium text-emerald-600 mt-1">~{formatSize(estimatedSize)}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {files.length > 0 && (
          <ConvertButton
            onClick={handleConvert}
            loading={status === 'uploading' || status === 'converting'}
            disabled={files.length === 0}
          >
            Compress to {targetPercent}% ({files.length} image{files.length > 1 ? 's' : ''})
          </ConvertButton>
        )}

        {status !== 'idle' && (
          <ProgressIndicator status={status} message={message} />
        )}

        {results.length > 0 && (
          <div className="space-y-4">
            {/* Results summary */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <h3 className="font-semibold text-emerald-800 mb-2">Compression Results</h3>
              <div className="space-y-2">
                {results.map((result, index) => {
                  const savedPercent = ((result.originalSize - result.compressedSize) / result.originalSize * 100).toFixed(1);
                  return (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700 truncate flex-1 mr-2">{result.filename}</span>
                      <span className="text-gray-500">{formatSize(result.originalSize)}</span>
                      <span className="mx-2 text-gray-400">→</span>
                      <span className="text-emerald-600 font-medium">{formatSize(result.compressedSize)}</span>
                      <span className="ml-2 text-emerald-700 font-semibold">(-{savedPercent}%)</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <MultiFileDownloadButton results={results} category="image" />
          </div>
        )}
      </div>

      <div className="mt-16">
        <SimilarTools currentTool="image-compressor" />
      </div>
    </ToolLayout>
  );
}
