'use client';

interface DownloadButtonProps {
  blob: Blob | null;
  filename: string;
  disabled?: boolean;
}

export default function DownloadButton({ blob, filename, disabled = false }: DownloadButtonProps) {
  const handleDownload = () => {
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleDownload}
      disabled={disabled || !blob}
      className={`
        group relative w-full min-h-[44px] sm:min-h-[52px] py-3 sm:py-4 px-6 sm:px-8 rounded-xl font-bold text-base sm:text-lg text-white transition-all duration-300 overflow-hidden touch-manipulation active:scale-95
        ${disabled || !blob
          ? 'bg-slate-300 cursor-not-allowed'
          : 'bg-gradient-to-r from-emerald-500 to-green-600 hover:shadow-2xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-emerald-500/20'
        }
      `}
    >
      {/* Shine effect */}
      {blob && !disabled && (
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      )}

      <span className="relative flex items-center justify-center gap-2 sm:gap-3">
        {blob ? (
          <>
            <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="hidden xs:inline">Download File</span>
            <span className="inline xs:hidden">Download</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="hidden xs:inline">No file to download</span>
            <span className="inline xs:hidden">No file</span>
          </>
        )}
      </span>
    </button>
  );
}
