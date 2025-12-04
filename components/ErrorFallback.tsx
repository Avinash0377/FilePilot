'use client';

import { useEffect } from 'react';
import { Icons } from './Icons';

interface ErrorPageProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function ErrorFallback({ error, reset }: ErrorPageProps) {
    useEffect(() => {
        // Log error to console in development
        console.error('Error caught by error.tsx:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-lg w-full bg-white rounded-xl border border-slate-200 shadow-lg p-8">
                {/* Error Icon */}
                <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full">
                    <Icons.Close className="w-10 h-10 text-red-600" />
                </div>

                {/* Error Message */}
                <h1 className="text-3xl font-bold text-slate-900 text-center mb-3">
                    Something went wrong!
                </h1>

                <p className="text-slate-600 text-center mb-6 leading-relaxed">
                    We encountered an unexpected error while processing your request.
                    Your files are safe and haven&apos;t been uploaded or modified.
                </p>

                {/* Error Details (Development Only) */}
                {process.env.NODE_ENV === 'development' && (
                    <details className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <summary className="cursor-pointer font-semibold text-sm text-slate-700 mb-2">
                            Technical Details
                        </summary>
                        <div className="mt-2 space-y-2">
                            <p className="text-xs text-slate-600">
                                <strong>Error:</strong> {error.message}
                            </p>
                            {error.digest && (
                                <p className="text-xs text-slate-600">
                                    <strong>Digest:</strong> {error.digest}
                                </p>
                            )}
                            <pre className="text-xs text-red-600 overflow-auto p-2 bg-white rounded border border-slate-200">
                                {error.stack}
                            </pre>
                        </div>
                    </details>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={reset}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-brand-600 text-white font-semibold rounded-lg hover:bg-brand-700 transition-colors"
                    >
                        <Icons.Refresh className="w-5 h-5" />
                        Try Again
                    </button>
                    <a
                        href="/"
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 font-semibold rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                        <Icons.Home className="w-5 h-5" />
                        Go Home
                    </a>
                </div>

                {/* Help Text */}
                <p className="text-xs text-slate-500 text-center mt-6">
                    If this problem persists, please try refreshing the page or contact support.
                </p>
            </div>
        </div>
    );
}
