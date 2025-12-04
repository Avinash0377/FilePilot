'use client';

import { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import FileUpload from '@/components/FileUpload';
import ConvertButton from '@/components/ConvertButton';
import DownloadButton from '@/components/DownloadButton';
import ProgressIndicator, { ProgressStatus } from '@/components/ProgressIndicator';
import StepIndicator from '@/components/StepIndicator';
import SimilarTools from '@/components/SimilarTools';

export default function OcrImagePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<ProgressStatus>('idle');
  const [message, setMessage] = useState('');
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultFilename, setResultFilename] = useState('');
  const [extractedText, setExtractedText] = useState('');

  const handleConvert = async () => {
    if (files.length === 0) return;

    setStatus('uploading');
    setMessage('Uploading file...');
    setResultBlob(null);
    setExtractedText('');

    try {
      const formData = new FormData();
      formData.append('file', files[0]);

      setStatus('converting');
      setMessage('Extracting text with OCR...');

      const response = await fetch('/api/ocr-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'OCR failed');
      }

      const text = await response.text();
      const blob = new Blob([text], { type: 'text/plain' });
      const filename = files[0].name.replace(/\.[^.]+$/, '.txt');

      setExtractedText(text);
      setResultBlob(blob);
      setResultFilename(filename);
      setStatus('done');
      setMessage('Text extraction complete!');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const currentStep = status === 'idle' ? 'upload' : status === 'done' ? 'download' : 'convert';

  return (
    <ToolLayout
      title="OCR Image to Text"
      description="Extract text from images using OCR"
      icon="👁️"
    >
      <StepIndicator currentStep={currentStep} />

      <div className="space-y-6">
        <FileUpload
          accept=".png,.jpg,.jpeg,.bmp,.tiff,.gif"
          multiple={false}
          onFilesSelected={setFiles}
        />

        {files.length > 0 && (
          <ConvertButton
            onClick={handleConvert}
            loading={status === 'uploading' || status === 'converting'}
            disabled={files.length === 0}
          >
            Extract Text
          </ConvertButton>
        )}

        {status !== 'idle' && (
          <ProgressIndicator status={status} message={message} />
        )}

        {extractedText && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-charcoal mb-2">Extracted Text:</h3>
            <pre className="text-sm text-gray-700 whitespace-pre-wrap max-h-64 overflow-y-auto">
              {extractedText}
            </pre>
          </div>
        )}

        {resultBlob && (
          <DownloadButton blob={resultBlob} filename={resultFilename} />
        )}
      </div>

      <div className="mt-16">
        <SimilarTools currentTool="ocr-image" />
      </div>
    </ToolLayout>
  );
}
