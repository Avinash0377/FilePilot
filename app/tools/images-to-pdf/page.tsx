'use client';

import { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import FileUpload from '@/components/FileUpload';
import ConvertButton from '@/components/ConvertButton';
import DownloadButton from '@/components/DownloadButton';
import ProgressIndicator, { ProgressStatus } from '@/components/ProgressIndicator';
import StepIndicator from '@/components/StepIndicator';
import SimilarTools from '@/components/SimilarTools';

export default function ImagesToPdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<ProgressStatus>('idle');
  const [message, setMessage] = useState('');
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const handleConvert = async () => {
    if (files.length === 0) return;

    setStatus('uploading');
    setMessage('Uploading images...');
    setResultBlob(null);

    try {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));

      setStatus('converting');
      setMessage('Converting images to PDF...');

      const response = await fetch('/api/images-to-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Conversion failed');
      }

      const blob = await response.blob();

      setResultBlob(blob);
      setStatus('done');
      setMessage('Conversion complete!');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const currentStep = status === 'idle' ? 'upload' : status === 'done' ? 'download' : 'convert';

  return (
    <ToolLayout
      title="Images to PDF"
      description="Convert JPG/PNG images to PDF"
      icon="🖼️"
    >
      <StepIndicator currentStep={currentStep} />

      <div className="space-y-6">
        <FileUpload
          accept=".jpg,.jpeg,.png"
          multiple={true}
          onFilesSelected={setFiles}
          fileType="Image"
        />

        {files.length > 0 && (
          <ConvertButton
            onClick={handleConvert}
            loading={status === 'uploading' || status === 'converting'}
            disabled={files.length === 0}
          >
            Convert {files.length} Image{files.length > 1 ? 's' : ''} to PDF
          </ConvertButton>
        )}

        {status !== 'idle' && (
          <ProgressIndicator status={status} message={message} />
        )}

        {resultBlob && (
          <DownloadButton blob={resultBlob} filename="images.pdf" />
        )}
      </div>

      <div className="mt-16">
        <SimilarTools currentTool="images-to-pdf" />
      </div>
    </ToolLayout>
  );
}
