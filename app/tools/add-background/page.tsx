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

const presetColors = [
  { name: 'White', value: '#FFFFFF' },
  { name: 'Black', value: '#000000' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Green', value: '#22C55E' },
  { name: 'Yellow', value: '#EAB308' },
  { name: 'Purple', value: '#A855F7' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Gray', value: '#6B7280' },
  { name: 'Orange', value: '#F97316' },
];

export default function AddBackgroundPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<ProgressStatus>('idle');
  const [message, setMessage] = useState('');
  const [results, setResults] = useState<ConversionResult[]>([]);
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [outputFormat, setOutputFormat] = useState<'png' | 'jpg'>('png');

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
    setMessage(`Processing ${files.length} image${files.length > 1 ? 's' : ''}...`);
    setResults([]);

    try {
      const convertedResults: ConversionResult[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setStatus('converting');
        setMessage(`Adding background to ${i + 1} of ${files.length}: ${file.name}`);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('color', bgColor);
        formData.append('format', outputFormat);

        const response = await fetch('/api/add-background', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(`Failed to add background to ${file.name}: ${error.error || 'Processing failed'}`);
        }

        const blob = await response.blob();
        const ext = outputFormat === 'jpg' ? 'jpg' : 'png';
        const filename = file.name.replace(/\.(png|webp|gif)$/i, `_bg.${ext}`);
        convertedResults.push({ blob, filename });
      }

      setResults(convertedResults);
      setStatus('done');
      setMessage(`Successfully added background to ${convertedResults.length} image${convertedResults.length > 1 ? 's' : ''}!`);
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const currentStep = status === 'idle' ? 'upload' : status === 'done' ? 'download' : 'convert';

  return (
    <ToolLayout
      title="Add Background Color"
      description="Add solid background color to transparent images - supports multiple files"
    >
      <StepIndicator currentStep={currentStep} />

      <div className="space-y-6">
        <FileUpload
          accept=".png,.webp,.gif"
          multiple={true}
          onFilesSelected={handleFilesSelected}
          fileType="Image"
        />

        {files.length > 0 && (
          <>
            {/* Color Picker Section */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <h3 className="font-medium text-gray-900">Select Background Color</h3>

              {/* Color Presets */}
              <div className="flex flex-wrap gap-2">
                {presetColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setBgColor(color.value)}
                    className={`w-8 h-8 rounded-lg border-2 transition-all ${bgColor === color.value
                        ? 'border-emerald-500 ring-2 ring-emerald-200'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>

              {/* Custom Color Input */}
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-600">Custom Color:</label>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border border-gray-200"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  placeholder="#FFFFFF"
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm w-28 font-mono"
                />
              </div>

              {/* Preview */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Preview:</span>
                <div
                  className="w-16 h-16 rounded-lg border border-gray-200 shadow-inner"
                  style={{ backgroundColor: bgColor }}
                />
              </div>
            </div>

            {/* Output Format */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h3 className="font-medium text-gray-900">Output Format</h3>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="format"
                    value="png"
                    checked={outputFormat === 'png'}
                    onChange={() => setOutputFormat('png')}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700">PNG (Higher quality)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="format"
                    value="jpg"
                    checked={outputFormat === 'jpg'}
                    onChange={() => setOutputFormat('jpg')}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700">JPG (Smaller file size)</span>
                </label>
              </div>
            </div>

            <ConvertButton
              onClick={handleConvert}
              loading={status === 'uploading' || status === 'converting'}
              disabled={files.length === 0}
            >
              Add Background to {files.length} Image{files.length > 1 ? 's' : ''}
            </ConvertButton>
          </>
        )}

        {status !== 'idle' && (
          <ProgressIndicator status={status} message={message} />
        )}

        {results.length > 0 && (
          <MultiFileDownloadButton results={results} />
        )}
      </div>

      <div className="mt-16">
        <SimilarTools currentTool="add-background" />
      </div>
    </ToolLayout>
  );
}
