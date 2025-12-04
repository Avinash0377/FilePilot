'use client';

import { useState, useCallback } from 'react';
import ToolLayout from '@/components/ToolLayout';
import FileUpload from '@/components/FileUpload';
import ConvertButton from '@/components/ConvertButton';
import DownloadButton from '@/components/DownloadButton';
import ProgressIndicator, { ProgressStatus } from '@/components/ProgressIndicator';
import StepIndicator from '@/components/StepIndicator';
import SimilarTools from '@/components/SimilarTools';

export default function ZipFilesPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<ProgressStatus>('idle');
  const [message, setMessage] = useState('');
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const handleFilesSelected = useCallback((selectedFiles: File[]) => {
    setFiles(selectedFiles);
    if (selectedFiles.length > 0) {
      setResultBlob(null);
      setStatus('idle');
      setMessage('');
    }
  }, []);

  const handleConvert = async () => {
    if (files.length === 0) return;

    setStatus('uploading');
    setMessage(`Uploading ${files.length} file${files.length > 1 ? 's' : ''}...`);
    setResultBlob(null);

    try {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));

      setStatus('converting');
      setMessage('Creating ZIP archive...');

      const response = await fetch('/api/zip-files', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'ZIP creation failed');
      }

      const blob = await response.blob();

      if (blob.size === 0) {
        throw new Error('ZIP file is empty');
      }

      setResultBlob(blob);
      setStatus('done');
      setMessage(`ZIP archive created! (${(blob.size / 1024).toFixed(1)} KB)`);
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const currentStep = status === 'idle' ? 'upload' : status === 'done' ? 'download' : 'convert';

  return (
    <ToolLayout
      title="ZIP Files"
      description="Compress multiple files into a ZIP archive"
    >
      <StepIndicator currentStep={currentStep} />

      <div className="space-y-6">
        <FileUpload
          accept="*"
          multiple={true}
          onFilesSelected={handleFilesSelected}
          fileType="file"
        />

        {files.length > 0 && (
          <ConvertButton
            onClick={handleConvert}
            loading={status === 'uploading' || status === 'converting'}
            disabled={files.length === 0}
          >
            Create ZIP with {files.length} File{files.length > 1 ? 's' : ''}
          </ConvertButton>
        )}

        {status !== 'idle' && (
          <ProgressIndicator status={status} message={message} />
        )}

        {resultBlob && (
          <DownloadButton blob={resultBlob} filename="archive.zip" />
        )}
      </div>

      <div className="mt-16">
        <SimilarTools currentTool="zip-files" />
      </div>
    </ToolLayout>
  );
}
