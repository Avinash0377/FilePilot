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

export default function VideoConverterPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [outputFormat, setOutputFormat] = useState<'mp4' | 'webm'>('webm');
  const [status, setStatus] = useState<ProgressStatus>('idle');
  const [message, setMessage] = useState('');
  const [results, setResults] = useState<ConversionResult[]>([]);

  const handleFilesSelected = useCallback((selectedFiles: File[]) => {
    setFiles(selectedFiles);
    if (selectedFiles.length > 0) {
      setResults([]);
      setStatus('idle');
      setMessage('');
      // Auto-set output format based on first file
      const ext = selectedFiles[0].name.toLowerCase();
      if (ext.endsWith('.mp4')) {
        setOutputFormat('webm');
      } else if (ext.endsWith('.webm')) {
        setOutputFormat('mp4');
      }
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
        setMessage(`Converting ${i + 1} of ${files.length}: ${file.name} (this may take a while)`);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('outputFormat', outputFormat);

        const response = await fetch('/api/video-converter', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(`Failed to convert ${file.name}: ${error.error || 'Conversion failed'}`);
        }

        const blob = await response.blob();
        const filename = file.name.replace(/\.(mp4|webm)$/i, `.${outputFormat}`);
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
      title="Video Converter"
      description="Convert between MP4 and WebM formats - supports multiple files"
    >
      <StepIndicator currentStep={currentStep} />

      <div className="space-y-6">
        <FileUpload
          accept=".mp4,.webm"
          multiple={true}
          onFilesSelected={handleFilesSelected}
          fileType="Video"
        />

        {files.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Output Format
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="format"
                  value="mp4"
                  checked={outputFormat === 'mp4'}
                  onChange={() => setOutputFormat('mp4')}
                  className="w-4 h-4 text-emerald-600"
                />
                <span>MP4</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="format"
                  value="webm"
                  checked={outputFormat === 'webm'}
                  onChange={() => setOutputFormat('webm')}
                  className="w-4 h-4 text-emerald-600"
                />
                <span>WebM</span>
              </label>
            </div>
          </div>
        )}

        {files.length > 0 && (
          <ConvertButton
            onClick={handleConvert}
            loading={status === 'uploading' || status === 'converting'}
            disabled={files.length === 0}
          >
            Convert {files.length} file{files.length > 1 ? 's' : ''} to {outputFormat.toUpperCase()}
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
        <SimilarTools currentTool="video-converter" />
      </div>
    </ToolLayout>
  );
}
