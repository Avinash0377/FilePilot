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

export default function BackgroundRemoverPage() {
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
        setMessage(`Removing background ${i + 1} of ${files.length}: ${file.name}`);

        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/background-remover', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(`Failed to process ${file.name}: ${error.error || 'Background removal failed'}`);
        }

        const blob = await response.blob();
        const filename = file.name.replace(/\.(png|jpg|jpeg|webp)$/i, '_nobg.png');
        convertedResults.push({ blob, filename });
      }

      setResults(convertedResults);
      setStatus('done');
      setMessage(`Successfully processed ${convertedResults.length} file${convertedResults.length > 1 ? 's' : ''}!`);
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const currentStep = status === 'idle' ? 'upload' : status === 'done' ? 'download' : 'convert';

  return (
    <ToolLayout
      title="Background Remover"
      description="Remove background from images - supports multiple files"
    >
      <StepIndicator currentStep={currentStep} />

      <div className="space-y-6">
        <FileUpload
          accept=".png,.jpg,.jpeg,.webp"
          multiple={true}
          onFilesSelected={handleFilesSelected}
          fileType="Image"
        />

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-amber-800 text-sm">
            <strong>Note:</strong> This tool works best with images that have solid or uniform backgrounds.
            For complex backgrounds, results may vary.
          </p>
        </div>

        {files.length > 0 && (
          <ConvertButton
            onClick={handleConvert}
            loading={status === 'uploading' || status === 'converting'}
            disabled={files.length === 0}
          >
            Remove Background from {files.length} image{files.length > 1 ? 's' : ''}
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
        <SimilarTools currentTool="background-remover" />
      </div>
    </ToolLayout>
  );
}
