'use client';

import { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import FileUpload from '@/components/FileUpload';
import ConvertButton from '@/components/ConvertButton';
import DownloadButton from '@/components/DownloadButton';
import ProgressIndicator, { ProgressStatus } from '@/components/ProgressIndicator';
import StepIndicator from '@/components/StepIndicator';
import SimilarTools from '@/components/SimilarTools';

export default function SplitPdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [startPage, setStartPage] = useState('1');
  const [endPage, setEndPage] = useState('1');
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
      formData.append('startPage', startPage);
      formData.append('endPage', endPage);

      setStatus('converting');
      setMessage('Splitting PDF...');

      const response = await fetch('/api/split-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Split failed');
      }

      const blob = await response.blob();
      const contentDisposition = response.headers.get('content-disposition');
      const filename = contentDisposition?.match(/filename="(.+)"/)?.[1] || 'split-pages.zip';

      setResultBlob(blob);
      setResultFilename(filename);
      setStatus('done');
      setMessage('Split complete!');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const currentStep = status === 'idle' ? 'upload' : status === 'done' ? 'download' : 'convert';

  return (
    <ToolLayout
      title="Split PDF"
      description="Extract pages from a PDF file"
      icon="✂️"
    >
      <StepIndicator currentStep={currentStep} />

      <div className="space-y-6">
        <FileUpload
          accept=".pdf"
          multiple={false}
          onFilesSelected={setFiles}
        />

        {files.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Start Page
              </label>
              <input
                type="number"
                min="1"
                value={startPage}
                onChange={(e) => setStartPage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                End Page
              </label>
              <input
                type="number"
                min="1"
                value={endPage}
                onChange={(e) => setEndPage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        )}

        {files.length > 0 && (
          <ConvertButton
            onClick={handleConvert}
            loading={status === 'uploading' || status === 'converting'}
            disabled={files.length === 0}
          >
            Extract Pages
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
        <SimilarTools currentTool="split-pdf" />
      </div>
    </ToolLayout>
  );
}
