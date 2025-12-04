'use client';

import { Icons } from './Icons';
import { useEffect, useState } from 'react';

export type ProgressStatus = 'idle' | 'uploading' | 'converting' | 'done' | 'error';

interface ProgressIndicatorProps {
  status: ProgressStatus;
  message?: string;
  progress?: number; // 0-100
  fileSize?: string; // e.g., "2.5 MB"
  speed?: string; // e.g., "1.2 MB/s"
  timeRemaining?: string; // e.g., "2s"
  onRetry?: () => void; // For error state
}

// Status icons as React components
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
  // Animated progress for converting status
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    if (status === 'converting' && !progress) {
      // Smooth animation from 0 to 95% over time
      const interval = setInterval(() => {
        setAnimatedProgress(prev => {
          if (prev >= 95) return 95; // Cap at 95% until done
          return prev + 1;
        });
      }, 100); // Update every 100ms

      return () => clearInterval(interval);
    } else if (status === 'uploading' && !progress) {
      // Quick animation for uploading
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

  // Use provided progress or animated progress
  const actualProgress = progress || animatedProgress;

  return (
    <div className={`w-full p-6 rounded-2xl ${config.bgColor} shadow-soft-md transition-all duration-300 animate-fade-in`}>
      {/* Header with Icon and Message */}

      {/* Success State - Enhanced */}
      {status === 'done' && (
        <div className="mt-4 pt-4 border-t border-emerald-200">
          <div className="flex items-center gap-2 text-emerald-700">
            <Icons.Check className="w-5 h-5" />
            <span className="text-sm font-medium">Your file is ready to download!</span>
          </div>
        </div>
      )}

      {/* Error State - Enhanced with Retry */}
      {status === 'error' && onRetry && (
        <div className="mt-4 pt-4 border-t border-red-200">
          <button
            onClick={onRetry}
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-all duration-200 hover:shadow-glow"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
