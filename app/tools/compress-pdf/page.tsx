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
}

export default function CompressPdfPage() {
  const [files, setFiles] = useState<File[]>([]);
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
        setMessage(`Compressing ${i + 1} of ${files.length}: ${file.name}`);

        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/compress-pdf', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(`Failed to compress ${file.name}: ${error.error || 'Compression failed'}`);
        }

        const blob = await response.blob();
        const filename = file.name.replace(/\.pdf$/i, '-compressed.pdf');

        totalOriginal += file.size;
        totalCompressed += blob.size;

        compressedResults.push({ blob, filename });
      }

      setResults(compressedResults);
      setStatus('done');
      const savedPercent = ((totalOriginal - totalCompressed) / totalOriginal * 100).toFixed(1);
      setMessage(`Compressed ${compressedResults.length} file${compressedResults.length > 1 ? 's' : ''}! Total saved: ${savedPercent}% (${(totalOriginal / 1024).toFixed(1)}KB → ${(totalCompressed / 1024).toFixed(1)}KB)`);
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const currentStep = status === 'idle' ? 'upload' : status === 'done' ? 'download' : 'convert';

  return (
    <ToolLayout
      title="Compress PDF"
      description="Reduce PDF file size - supports multiple files"
    >
      <StepIndicator currentStep={currentStep} />

      <div className="space-y-6">
        <FileUpload
          accept=".pdf"
          multiple={true}
          onFilesSelected={handleFilesSelected}
        />

        {files.length > 0 && (
          <ConvertButton
            onClick={handleConvert}
            loading={status === 'uploading' || status === 'converting'}
            disabled={files.length === 0}
          >
            Compress {files.length} PDF{files.length > 1 ? 's' : ''}
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
        <SimilarTools currentTool="compress-pdf" />
      </div>
    </ToolLayout>
  );
}
