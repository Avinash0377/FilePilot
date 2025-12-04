'use client';

import { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import FileUpload from '@/components/FileUpload';
import ConvertButton from '@/components/ConvertButton';
import DownloadButton from '@/components/DownloadButton';
import ProgressIndicator, { ProgressStatus } from '@/components/ProgressIndicator';
import StepIndicator from '@/components/StepIndicator';
import SimilarTools from '@/components/SimilarTools';

export default function UnzipFilesPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<ProgressStatus>('idle');
  const [message, setMessage] = useState('');
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultFilename, setResultFilename] = useState('');

  const handleConvert = async () => {
    if (files.length === 0) return;

    setStatus('uploading');
    setMessage('Uploading file...');
    setResultBlob(null);

    try {
      const formData = new FormData();
      formData.append('file', files[0]);

      setStatus('converting');
      setMessage('Extracting ZIP archive...');

      const response = await fetch('/api/unzip-files', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Extraction failed');
      }

      const blob = await response.blob();
      const contentDisposition = response.headers.get('content-disposition');
      const filename = contentDisposition?.match(/filename="(.+)"/)?.[1] || 'extracted-files.zip';

      setResultBlob(blob);
      setResultFilename(filename);
      setStatus('done');
      setMessage('Extraction complete!');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const currentStep = status === 'idle' ? 'upload' : status === 'done' ? 'download' : 'convert';

  return (
    <ToolLayout
      title="Unzip Files"
      description="Extract files from a ZIP archive"
      icon="📂"
    >
      <StepIndicator currentStep={currentStep} />

      <div className="space-y-6">
        <FileUpload
          accept=".zip"
          multiple={false}
          onFilesSelected={setFiles}
          fileType="ZIP"
        />

        {files.length > 0 && (
          <ConvertButton
            onClick={handleConvert}
            loading={status === 'uploading' || status === 'converting'}
            disabled={files.length === 0}
          >
            Extract Files
          </ConvertButton>
        )}

        {status !== 'idle' && (
          <ProgressIndicator status={status} message={message} />
        )}

        {resultBlob && (
          <DownloadButton blob={resultBlob} filename={resultFilename} />
        )}
      </div>

      <div className="mt-16">
        <SimilarTools currentTool="unzip-files" />
      </div>
    </ToolLayout>
  );
}
