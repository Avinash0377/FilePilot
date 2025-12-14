'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, RefreshCw, CheckCircle, XCircle, Clock, Filter } from 'lucide-react';

interface LogEntry {
    id: string;
    tool: string;
    status: 'success' | 'error' | 'processing';
    timestamp: number;
    duration?: number;
    errorMessage?: string;
}

export default function LogsPage() {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'success' | 'error' | 'processing'>('all');
    const router = useRouter();

    const fetchLogs = async () => {
        try {
            const res = await fetch('/api/admin/stats');
            if (res.status === 401) {
                router.push('/admin/login');
                return;
            }
            const data = await res.json();
            setLogs(data.recentActivity || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
        const interval = setInterval(fetchLogs, 10000); // Refresh every 10s
        return () => clearInterval(interval);
    }, []);

    const filteredLogs = filter === 'all'
        ? logs
        : logs.filter(log => log.status === filter);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'error':
                return <XCircle className="w-5 h-5 text-red-500" />;
            case 'processing':
                return <Clock className="w-5 h-5 text-blue-500 animate-pulse" />;
            default:
                return null;
        }
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            success: 'bg-green-100 text-green-700',
            error: 'bg-red-100 text-red-700',
            processing: 'bg-blue-100 text-blue-700'
        };
        return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-700';
    };

    const formatTime = (timestamp: number) => {
        return new Date(timestamp).toLocaleString('en', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-screen">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#1e1e1e]">Activity Logs</h1>
                    <p className="text-gray-600 mt-1">Recent conversion activity and errors</p>
                </div>
                <button
                    onClick={fetchLogs}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 mb-6">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600 mr-2">Filter:</span>
                {(['all', 'success', 'error', 'processing'] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filter === f
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            {/* Stats summary */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <p className="text-green-600 text-sm font-medium">Successful</p>
                    <p className="text-2xl font-bold text-green-700">
                        {logs.filter(l => l.status === 'success').length}
                    </p>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                    <p className="text-red-600 text-sm font-medium">Failed</p>
                    <p className="text-2xl font-bold text-red-700">
                        {logs.filter(l => l.status === 'error').length}
                    </p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-blue-600 text-sm font-medium">Processing</p>
                    <p className="text-2xl font-bold text-blue-700">
                        {logs.filter(l => l.status === 'processing').length}
                    </p>
                </div>
            </div>

            {/* Logs Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {filteredLogs.length === 0 ? (
                    <div className="p-12 text-center">
                        <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500">No logs to display</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Tool</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Time</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Duration</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLogs.map((log) => (
                                <tr key={log.id} className="border-t border-gray-100 hover:bg-gray-50">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(log.status)}
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(log.status)}`}>
                                                {log.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-sm font-medium">
                                        {log.tool.replace(/-/g, ' ')}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-600">
                                        {formatTime(log.timestamp)}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-600">
                                        {log.duration ? `${log.duration}ms` : '-'}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-500">
                                        {log.errorMessage || '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
