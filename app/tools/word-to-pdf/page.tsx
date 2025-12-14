'use client';

import { useState, useCallback } from 'react';
import ToolLayout from '@/components/ToolLayout';
import FileUpload from '@/components/FileUpload';
import ConvertButton from '@/components/ConvertButton';
import MultiFileDownloadButton from '@/components/MultiFileDownloadButton';
import ProgressIndicator, { ProgressStatus } from '@/components/ProgressIndicator';
import ConversionSkeleton from '@/components/ConversionSkeleton';
import StepIndicator from '@/components/StepIndicator';
import SimilarTools from '@/components/SimilarTools';

interface ConversionResult {
  blob: Blob;
  filename: string;
}

export default function WordToPdfPage() {
  const [files, setFiles] = useState<File[]>([]);
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
      const convertedResults: ConversionResult[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setStatus('converting');
        setMessage(`Converting ${i + 1} of ${files.length}: ${file.name}`);

        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/word-to-pdf', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(`Failed to convert ${file.name}: ${error.error || 'Conversion failed'}`);
        }

        const blob = await response.blob();
        const filename = file.name.replace(/\.(docx?|doc)$/i, '.pdf');
        convertedResults.push({ blob, filename });
      }

      setResults(convertedResults);
      setStatus('done');
      setMessage(`Successfully converted ${convertedResults.length} file${convertedResults.length > 1 ? 's' : ''}!`);
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const currentStep = status === 'idle' ? 'upload' : status === 'done' ? 'download' : 'convert';

  return (
    <ToolLayout
      title="Word to PDF"
      description="Convert Word documents to PDF format - supports multiple files"
    >
      {/* Step Indicator */}
      <StepIndicator currentStep={currentStep} />

      <div className="space-y-6">
        <FileUpload
          accept=".doc,.docx"
          multiple={true}
          onFilesSelected={handleFilesSelected}
          fileType="Word"
        />

        {files.length > 0 && (
          <ConvertButton
            onClick={handleConvert}
            loading={status === 'uploading' || status === 'converting'}
            disabled={files.length === 0}
          >
            Convert {files.length} file{files.length > 1 ? 's' : ''} to PDF
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

        {results.length > 0 && (
          <MultiFileDownloadButton results={results} category="pdf" />
        )}
      </div>

      {/* Similar Tools Section */}
      <div className="mt-16">
        <SimilarTools currentTool="word-to-pdf" />
      </div>
    </ToolLayout>
  );
}
