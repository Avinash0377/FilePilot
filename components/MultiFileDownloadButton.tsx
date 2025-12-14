'use client';

interface MultiDownloadResult {
  blob: Blob;
  filename: string;
}

interface MultiFileDownloadButtonProps {
  results: MultiDownloadResult[];
  disabled?: boolean;
  category?: 'pdf' | 'image' | 'text' | 'archive' | 'audio' | 'video';
}

// Category color configurations
const categoryColors = {
  pdf: {
    gradient: 'from-red-500 to-red-600',
    bg: 'bg-red-50',
    text: 'text-red-600',
    hover: 'hover:text-red-700 hover:bg-red-50'
  },
  image: {
    gradient: 'from-indigo-500 to-indigo-600',
    bg: 'bg-indigo-50',
    text: 'text-indigo-600',
    hover: 'hover:text-indigo-700 hover:bg-indigo-50'
  },
  text: {
    gradient: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    hover: 'hover:text-blue-700 hover:bg-blue-50'
  },
  video: {
    gradient: 'from-pink-500 to-pink-600',
    bg: 'bg-pink-50',
    text: 'text-pink-600',
    hover: 'hover:text-pink-700 hover:bg-pink-50'
  },
  audio: {
    gradient: 'from-amber-500 to-amber-600',
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    hover: 'hover:text-amber-700 hover:bg-amber-50'
  },
  archive: {
    gradient: 'from-teal-500 to-teal-600',
    bg: 'bg-teal-50',
    text: 'text-teal-600',
    hover: 'hover:text-teal-700 hover:bg-teal-50'
  }
};

export default function MultiFileDownloadButton({
  results,
  disabled = false,
  category = 'pdf'
}: MultiFileDownloadButtonProps) {
  const colors = categoryColors[category] || categoryColors.pdf;

  const handleDownloadAll = () => {
    if (results.length === 0) return;

    results.forEach((result, index) => {
      setTimeout(() => {
        const url = URL.createObjectURL(result.blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = result.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, index * 200);
    });
  };

  const handleDownloadSingle = (result: MultiDownloadResult) => {
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (results.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Download All Button */}
      <button
        onClick={handleDownloadAll}
        disabled={disabled || results.length === 0}
        className={`
          group relative w-full min-h-[44px] sm:min-h-[48px] py-3 sm:py-4 px-6 sm:px-8 rounded-xl font-bold text-base sm:text-lg text-white transition-all duration-300 overflow-hidden animate-fade-in
          ${disabled || results.length === 0
            ? 'bg-slate-300 cursor-not-allowed'
            : `bg-gradient-to-r ${colors.gradient} hover:shadow-glow hover:-translate-y-1 hover:scale-[1.02] active:translate-y-0 active:scale-[0.98] shadow-soft-lg`
          }
          touch-manipulation
        `}
      >
        {/* Shine effect */}
        {results.length > 0 && !disabled && (
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        )}

        <span className="relative flex items-center justify-center gap-2 sm:gap-3">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-y-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download All ({results.length} {results.length === 1 ? 'file' : 'files'})
        </span>
      </button>

      {/* Individual File Downloads */}
      {results.length > 1 && (
        <div className="bg-gray-50 rounded-xl p-3 sm:p-4 space-y-2">
          <p className="text-sm text-gray-600 font-medium mb-3">Or download individually:</p>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {results.map((result, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white rounded-lg p-3 sm:p-4 border border-gray-100"
              >
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 ${colors.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <svg className={`w-4 h-4 sm:w-5 sm:h-5 ${colors.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <span className="text-sm sm:text-base text-gray-700 truncate">{result.filename}</span>
                </div>
                <button
                  onClick={() => handleDownloadSingle(result)}
                  className={`min-w-[44px] min-h-[44px] ${colors.text} ${colors.hover} p-2 sm:p-3 rounded-lg transition-colors flex-shrink-0 touch-manipulation active:scale-95`}
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
