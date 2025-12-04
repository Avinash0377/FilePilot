'use client';

import { Icons } from './Icons';
import { useEffect, useState } from 'react';

export type ProgressStatus = 'idle' | 'uploading' | 'converting' | 'done' | 'error';

interface ProgressIndicatorProps {
  status: ProgressStatus;
  message?: string;
  progress?: number;
  fileSize?: string;
  speed?: string;
  timeRemaining?: string;
  onRetry?: () => void;
}

const StatusIcons = {
  idle: () => <Icons.Clock className="w-5 h-5" />,
  uploading: () => <Icons.Upload className="w-5 h-5 animate-bounce-subtle" />,
  converting: () => <Icons.Settings className="w-5 h-5 animate-spin" />,
  done: () => <Icons.Check className="w-5 h-5" />,
  error: () => <Icons.Close className="w-5 h-5" />,
};

export default function ProgressIndicator({
  status,
  message,
  progress = 0,
  fileSize,
  speed,
  timeRemaining,
  onRetry
}: ProgressIndicatorProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    if (status === 'converting' && !progress) {
      const interval = setInterval(() => {
        setAnimatedProgress(prev => {
          if (prev >= 95) return 95;
          return prev + 1;
        });
      }, 100);
      return () => clearInterval(interval);
    } else if (status === 'uploading' && !progress) {
      const interval = setInterval(() => {
        setAnimatedProgress(prev => {
          if (prev >= 30) return 30;
          return prev + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    } else if (status === 'idle') {
      setAnimatedProgress(0);
    } else if (status === 'done') {
      setAnimatedProgress(100);
    }
  }, [status, progress]);

  const statusConfig = {
    idle: {
      barClass: 'bg-slate-300',
      bgColor: 'bg-white border border-slate-200',
      textColor: 'text-slate-600',
      iconBg: 'bg-slate-100 text-slate-500',
      defaultMessage: 'Ready to convert',
    },
    uploading: {
      barClass: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50 border border-blue-200',
      textColor: 'text-blue-700',
      iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-glow',
      defaultMessage: 'Uploading file...',
    },
    converting: {
      barClass: 'bg-gradient-to-r from-brand-700 to-brand-800 animate-pulse',
      bgColor: 'bg-slate-50 border border-slate-200',
      textColor: 'text-slate-700',
      iconBg: 'bg-gradient-to-br from-brand-700 to-brand-800 text-white shadow-glow',
      defaultMessage: 'Converting...',
    },
    done: {
      barClass: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50 border-2 border-emerald-300',
      textColor: 'text-emerald-700',
      iconBg: 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-glow',
      defaultMessage: 'Conversion complete!',
    },
    error: {
      barClass: 'bg-gradient-to-r from-red-500 to-red-600',
      bgColor: 'bg-red-50 border-2 border-red-300',
      textColor: 'text-red-700',
      iconBg: 'bg-gradient-to-br from-red-500 to-red-600 text-white',
      defaultMessage: 'An error occurred',
    },
  };

  const config = statusConfig[status];
  const StatusIcon = StatusIcons[status];
  const actualProgress = progress || animatedProgress;

  return (
    <div className={`w-full p-4 sm:p-6 rounded-xl sm:rounded-2xl ${config.bgColor} shadow-soft-md transition-all duration-300 animate-fade-in`}>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center ${config.iconBg} transition-all duration-300 flex-shrink-0`}>
            <StatusIcon />
          </div>
          <div className="min-w-0 flex-1">
            <span className={`text-sm sm:text-base font-semibold ${config.textColor} block truncate`}>
              {message || config.defaultMessage}
            </span>
            {fileSize && (
              <span className="text-xs sm:text-sm text-slate-500 mt-0.5 block">
                {fileSize}
              </span>
            )}
          </div>
        </div>
        {(status === 'uploading' || status === 'converting') && (
          <div className={`text-lg sm:text-2xl font-bold ${config.textColor} ml-2`}>
            {Math.round(actualProgress)}%
          </div>
        )}
      </div>

      <div className="relative h-2 sm:h-3 bg-slate-200 rounded-full overflow-hidden shadow-inner mb-2 sm:mb-3">
        <div
          className={`h-full ${config.barClass} transition-all duration-500 rounded-full`}
          style={{ width: `${actualProgress}%` }}
        />
      </div>

      {(speed || timeRemaining) && (
        <div className="flex items-center justify-between text-xs sm:text-sm text-slate-600">
          {speed && (
            <div className="flex items-center gap-1.5">
              <Icons.Bolt className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{speed}</span>
            </div>
          )}
          {timeRemaining && (
            <div className="flex items-center gap-1.5">
              <Icons.Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{timeRemaining} remaining</span>
            </div>
          )}
        </div>
      )}

      {status === 'done' && (
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-emerald-200">
          <div className="flex items-center gap-2 text-emerald-700">
            <Icons.Check className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm font-medium">Your file is ready to download!</span>
          </div>
        </div>
      )}

      {status === 'error' && onRetry && (
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-red-200">
          <button
            onClick={onRetry}
            className="w-full min-h-[44px] px-4 py-2 sm:py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm sm:text-base font-medium rounded-lg sm:rounded-xl transition-all duration-200 hover:shadow-glow touch-manipulation active:scale-95"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
