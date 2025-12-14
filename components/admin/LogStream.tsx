'use client';

import { useEffect, useRef } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info } from 'lucide-react';

interface LogEntry {
    id: string;
    timestamp: Date;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
}

interface LogStreamProps {
    logs: LogEntry[];
}

const iconMap = {
    success: CheckCircle2,
    error: XCircle,
    warning: AlertTriangle,
    info: Info
};

const colorMap = {
    success: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600'
};

export default function LogStream({ logs }: LogStreamProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">Real-Time Activity Log</h3>
            </div>
            <div
                ref={scrollRef}
                className="p-4 space-y-2 max-h-[400px] overflow-y-auto font-mono text-sm"
            >
                {logs.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No recent activity</p>
                ) : (
                    logs.map((log) => {
                        const Icon = iconMap[log.type];
                        return (
                            <div key={log.id} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded">
                                <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${colorMap[log.type]}`} />
                                <div className="flex-1 min-w-0">
                                    <span className="text-gray-500">
                                        [{log.timestamp.toLocaleTimeString()}]
                                    </span>
                                    <span className="text-gray-900 ml-2">{log.message}</span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
