'use client';

import { Icons } from './Icons';

interface ConvertButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
}

export default function ConvertButton({
  onClick,
  disabled = false,
  loading = false,
  children = 'Convert'
}: ConvertButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        group w-full min-h-[44px] sm:min-h-[48px] py-3 sm:py-4 px-6 rounded-xl font-semibold text-base sm:text-lg text-white transition-all duration-300
        ${disabled || loading
          ? 'bg-slate-300 cursor-not-allowed'
          : 'bg-brand-800 hover:bg-brand-900 shadow-soft-md hover:shadow-dark hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.98]'
        }
        ${loading ? 'animate-pulse-glow' : ''}
        touch-manipulation
      `}
    >
      <span className="flex items-center justify-center gap-2 sm:gap-3">
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Processing...</span>
          </>
        ) : (
          <>
            <Icons.Settings className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-90 transition-transform duration-300" />
            {children}
          </>
        )}
      </span>
    </button>
  );
}
