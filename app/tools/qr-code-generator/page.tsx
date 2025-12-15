'use client';

import { useState, useRef } from 'react';
import ToolLayout from '@/components/ToolLayout';
import SimilarTools from '@/components/SimilarTools';
import QRCode from 'qrcode';

// Preset color themes
const colorThemes = [
    { name: 'Classic', fg: '#000000', bg: '#FFFFFF' },
    { name: 'Ocean Blue', fg: '#1E40AF', bg: '#DBEAFE' },
    { name: 'Forest Green', fg: '#166534', bg: '#DCFCE7' },
    { name: 'Sunset', fg: '#EA580C', bg: '#FFF7ED' },
    { name: 'Purple Dream', fg: '#7C3AED', bg: '#F3E8FF' },
    { name: 'Rose Gold', fg: '#BE185D', bg: '#FCE7F3' },
    { name: 'Dark Mode', fg: '#FFFFFF', bg: '#1F2937' },
    { name: 'Gradient Blue', fg: '#3B82F6', bg: '#EFF6FF' },
];

export default function QrCodeGeneratorPage() {
    const [text, setText] = useState('');
    const [qrImage, setQrImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedTheme, setSelectedTheme] = useState(0);
    const [customFg, setCustomFg] = useState('#000000');
    const [customBg, setCustomBg] = useState('#FFFFFF');
    const [useCustomColors, setUseCustomColors] = useState(false);
    const [size, setSize] = useState(300);
    const [margin, setMargin] = useState(2);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const generateQR = async () => {
        if (!text.trim()) {
            setError('Please enter text or URL');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const fgColor = useCustomColors ? customFg : colorThemes[selectedTheme].fg;
            const bgColor = useCustomColors ? customBg : colorThemes[selectedTheme].bg;

            const dataUrl = await QRCode.toDataURL(text, {
                width: size,
                margin: margin,
                color: {
                    dark: fgColor,
                    light: bgColor,
                },
                errorCorrectionLevel: 'H',
            });

            setQrImage(dataUrl);
        } catch (err) {
            setError('Failed to generate QR code');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const downloadQR = () => {
        if (!qrImage) return;

        const link = document.createElement('a');
        link.href = qrImage;
        link.download = 'qr-code.png';
        link.click();
    };

    const downloadSVG = async () => {
        if (!text.trim()) return;

        try {
            const fgColor = useCustomColors ? customFg : colorThemes[selectedTheme].fg;
            const bgColor = useCustomColors ? customBg : colorThemes[selectedTheme].bg;

            const svgString = await QRCode.toString(text, {
                type: 'svg',
                width: size,
                margin: margin,
                color: {
                    dark: fgColor,
                    light: bgColor,
                },
                errorCorrectionLevel: 'H',
            });

            const blob = new Blob([svgString], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'qr-code.svg';
            link.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <ToolLayout
            title="QR Code Generator"
            description="Create beautiful styled QR codes"
            icon="📱"
        >
            <div className="space-y-8">
                {/* Input Section */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Enter Text or URL
                    </label>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="https://example.com or any text..."
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows={3}
                    />
                </div>

                {/* Style Options */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">🎨 Style Options</h3>

                    {/* Theme Presets */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Color Theme
                        </label>
                        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                            {colorThemes.map((theme, index) => (
                                <button
                                    key={theme.name}
                                    onClick={() => {
                                        setSelectedTheme(index);
                                        setUseCustomColors(false);
                                    }}
                                    className={`
                    relative w-12 h-12 rounded-xl border-2 transition-all overflow-hidden
                    ${!useCustomColors && selectedTheme === index
                                            ? 'border-blue-500 ring-2 ring-blue-200'
                                            : 'border-gray-200 hover:border-gray-300'}
                  `}
                                    title={theme.name}
                                >
                                    <div
                                        className="absolute inset-0"
                                        style={{ backgroundColor: theme.bg }}
                                    />
                                    <div
                                        className="absolute inset-2 rounded"
                                        style={{ backgroundColor: theme.fg }}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Custom Colors Toggle */}
                    <div className="mb-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={useCustomColors}
                                onChange={(e) => setUseCustomColors(e.target.checked)}
                                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700">Use Custom Colors</span>
                        </label>
                    </div>

                    {/* Custom Color Pickers */}
                    {useCustomColors && (
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-sm text-gray-600 mb-2">QR Color</label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={customFg}
                                        onChange={(e) => setCustomFg(e.target.value)}
                                        className="w-12 h-10 rounded-lg border border-gray-200 cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={customFg}
                                        onChange={(e) => setCustomFg(e.target.value)}
                                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-2">Background</label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={customBg}
                                        onChange={(e) => setCustomBg(e.target.value)}
                                        className="w-12 h-10 rounded-lg border border-gray-200 cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={customBg}
                                        onChange={(e) => setCustomBg(e.target.value)}
                                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Size and Margin */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-2">
                                Size: {size}px
                            </label>
                            <input
                                type="range"
                                min="150"
                                max="500"
                                value={size}
                                onChange={(e) => setSize(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-2">
                                Margin: {margin}
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="6"
                                value={margin}
                                onChange={(e) => setMargin(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                    </div>
                </div>

                {/* Generate Button */}
                <button
                    onClick={generateQR}
                    disabled={loading || !text.trim()}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/25"
                >
                    {loading ? 'Generating...' : 'Generate QR Code'}
                </button>

                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                        {error}
                    </div>
                )}

                {/* QR Code Preview */}
                {qrImage && (
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                            Your QR Code
                        </h3>

                        <div className="flex justify-center mb-6">
                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <img
                                    src={qrImage}
                                    alt="Generated QR Code"
                                    className="max-w-full h-auto rounded-lg"
                                    style={{ imageRendering: 'pixelated' }}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={downloadQR}
                                className="flex-1 py-3 px-6 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Download PNG
                            </button>
                            <button
                                onClick={downloadSVG}
                                className="flex-1 py-3 px-6 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Download SVG
                            </button>
                        </div>
                    </div>
                )}

                <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>

            <div className="mt-16">
                <SimilarTools currentTool="qr-code-generator" />
            </div>
        </ToolLayout>
    );
}
