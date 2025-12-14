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
import { useUploadProgress } from '@/hooks/useUploadProgress';

interface ConversionResult {
  blob: Blob;
  filename: string;
}

export default function PdfToWordPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<ProgressStatus>('idle');
  const [message, setMessage] = useState('');
  const [results, setResults] = useState<ConversionResult[]>([]);
  const { uploadProgress, uploadSpeed, timeRemaining, uploadFile, resetProgress } = useUploadProgress();

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
    setMessage(`Uploading ${files.length} file${files.length > 1 ? 's' : ''}...`);
    setResults([]);
    resetProgress();

    try {
      const convertedResults: ConversionResult[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setStatus('uploading');
        setMessage(`Uploading ${file.name} (${i + 1}/${files.length})...`);

        const formData = new FormData();
        formData.append('file', file);

        const response = await uploadFile('/api/pdf-to-word', formData);

        if (!response.ok) {
          const error = await response.json();
          throw new Error(`Failed to convert ${file.name}: ${error.error || 'Conversion failed'}`);
        }

        setStatus('converting');
        setMessage(`Processing ${file.name}... Please wait.`);
        // Don't reset progress - keep upload progress visible

        const blob = await response.blob();

        // Extract filename from Content-Disposition header
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = file.name.replace(/\.pdf$/i, '.docx');
        if (contentDisposition) {
          // Try multiple patterns to extract filename
          // Pattern 1: filename*=UTF-8''<encoded-name> (RFC 5987)
          let match = contentDisposition.match(/filename\*=(?:UTF-8''|utf-8'')([^;\n]+)/i);
          if (match && match[1]) {
            try {
              filename = decodeURIComponent(match[1].trim());
            } catch {
              filename = match[1].trim();
            }
          } else {
            // Pattern 2: filename="<name>" (quoted)
            match = contentDisposition.match(/filename="([^"]+)"/i);
            if (match && match[1]) {
              filename = match[1].trim();
            } else {
              // Pattern 3: filename=<name> (unquoted)
              match = contentDisposition.match(/filename=([^;\s\n]+)/i);
              if (match && match[1]) {
                filename = match[1].trim().replace(/^["']|["']$/g, '');
              }
            }
          }
        }

        // Ensure filename has .docx extension
        if (!filename.toLowerCase().endsWith('.docx')) {
          filename = file.name.replace(/\.pdf$/i, '.docx');
        }

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
      title="PDF to Word"
      description="Convert PDF documents to editable Word files - supports multiple files"
    >
      {/* Step Indicator */}
      <StepIndicator currentStep={currentStep} />

      <div className="space-y-6">
        <FileUpload
          accept=".pdf"
          multiple={true}
          onFilesSelected={handleFilesSelected}
          fileType="PDF"
        />

        {files.length > 0 && (
          <ConvertButton
            onClick={handleConvert}
            loading={status === 'uploading' || status === 'converting'}
            disabled={files.length === 0}
          >
            Convert {files.length} file{files.length > 1 ? 's' : ''} to Word
          </ConvertButton>
        )}

        {status !== 'idle' && (
          <ProgressIndicator
            status={status}
            message={message}
            progress={uploadProgress}
            speed={uploadSpeed}
            timeRemaining={timeRemaining}
          />
        )}

        {status === 'converting' && (
          <div className="fade-up">
            <ConversionSkeleton />
          </div>
        )}

        {results.length > 0 && (
          <MultiFileDownloadButton results={results} />
        )}
      </div>

      {/* Similar Tools Section */}
      <div className="mt-16">
        <SimilarTools currentTool="pdf-to-word" />
      </div>
    </ToolLayout>
  );
}
