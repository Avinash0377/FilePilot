'use client';

import { useEffect, useState } from 'react';
import { Icons } from './Icons';

interface QueueIndicatorProps {
    jobId: string;
    onStatusChange?: (status: string) => void;
}

interface QueueStatus {
    status: 'queued' | 'processing' | 'completed' | 'error';
    position: number;
    estimatedWait: number;
    error?: string;
}

export default function QueueIndicator({ jobId, onStatusChange }: QueueIndicatorProps) {
    const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        const checkStatus = async () => {
            try {
                const response = await fetch(`/api/queue/status?jobId=${jobId}`);
                if (response.ok) {
                    const data = await response.json();
                    setQueueStatus({
                        status: data.status,
                        position: data.position,
                        estimatedWait: data.estimatedWait,
                        error: data.error,
                    });

                    // Notify parent of status change
                    if (onStatusChange) {
                        onStatusChange(data.status);
                    }

                    // Stop polling if completed or error
                    if (data.status === 'completed' || data.status === 'error') {
                        clearInterval(interval);
                    }
                }
            } catch (error) {
                console.error('Failed to check queue status:', error);
            } finally {
                setLoading(false);
            }
        };

        // Initial check
        checkStatus();

        // Poll every 2 seconds
        interval = setInterval(checkStatus, 2000);

        return () => clearInterval(interval);
    }, [jobId, onStatusChange]);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-4 bg-slate-50 rounded-lg">
                <Icons.Clock className="w-5 h-5 text-slate-400 animate-spin" />
                <span className="ml-2 text-sm text-slate-600">Checking queue...</span>
            </div>
        );
    }

    if (!queueStatus) return null;

    // Queued state
    if (queueStatus.status === 'queued') {
        const minutes = Math.ceil(queueStatus.estimatedWait / 60);

        return (
            <div className="p-4 sm:p-6 bg-blue-50 border-2 border-blue-200 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white">
                        <Icons.Clock className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-semibold text-blue-900">In Queue</h3>
                        <p className="text-xs sm:text-sm text-blue-700">Your video is waiting to be processed</p>
                    </div>
                </div>

                <div className="space-y-2 text-sm sm:text-base">
                    <div className="flex items-center justify-between p-2 sm:p-3 bg-white rounded-lg">
                        <span className="text-slate-600">Position in queue:</span>
                        <span className="font-bold text-blue-700">#{queueStatus.position}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 sm:p-3 bg-white rounded-lg">
                        <span className="text-slate-600">Estimated wait:</span>
                        <span className="font-bold text-blue-700">~{minutes} min{minutes !== 1 ? 's' : ''}</span>
                    </div>
                </div>

                <p className="mt-3 text-xs sm:text-sm text-blue-600 text-center">
                    ⏳ Processing will start automatically when ready
                </p>
            </div>
        );
    }

    // Processing state
    if (queueStatus.status === 'processing') {
        return (
            <div className="p-4 sm:p-6 bg-brand-50 border-2 border-brand-200 rounded-xl">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center text-white">
                        <Icons.Settings className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-semibold text-brand-900">Processing</h3>
                        <p className="text-xs sm:text-sm text-brand-700">Your video is being converted now...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (queueStatus.status === 'error') {
        return (
            <div className="p-4 sm:p-6 bg-red-50 border-2 border-red-200 rounded-xl">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white">
                        <Icons.Close className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-semibold text-red-900">Queue Error</h3>
                        <p className="text-xs sm:text-sm text-red-700">{queueStatus.error || 'An error occurred'}</p>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
