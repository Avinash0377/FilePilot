'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MetricCard from '@/components/admin/MetricCard';
import TrendChart from '@/components/admin/TrendChart';
import ToolUsageChart from '@/components/admin/ToolUsageChart';
import LogStream from '@/components/admin/LogStream';
import AlertsPanel from '@/components/admin/AlertsPanel';
import {
    FileCheck,
    TrendingUp,
    CheckCircle2,
    XCircle,
    Cpu,
    HardDrive,
    RefreshCw,
    Activity
} from 'lucide-react';

interface Stats {
    uptime: number;
    memory: {
        rss: number;
        heapTotal: number;
        heapUsed: number;
    };
    conversions: {
        active: number;
        total: number;
        success: number;
        errors: number;
        successRate: number;
    };
    toolUsage: Array<{ tool: string; success: number; error: number; total: number }>;
    dailyStats: Array<{ date: string; success: number; failed: number }>;
    recentActivity: Array<{
        id: string;
        tool: string;
        status: 'success' | 'error' | 'processing';
        timestamp: number;
        duration?: number;
        errorMessage?: string;
    }>;
}

export default function DashboardPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();

    const fetchStats = async (showRefresh = false) => {
        if (showRefresh) setRefreshing(true);

        try {
            const res = await fetch('/api/admin/stats');

            if (res.status === 401) {
                router.push('/admin/login');
                return;
            }

            if (!res.ok) throw new Error('Failed to fetch stats');

            const data = await res.json();
            setStats(data);
            setError('');
        } catch (err) {
            setError('Failed to load stats');
            console.error(err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchStats();

        // Auto-refresh every 30 seconds
        const interval = setInterval(() => fetchStats(), 30000);
        return () => clearInterval(interval);
    }, []);

    const formatUptime = (seconds: number) => {
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const mins = Math.floor((seconds % 3600) / 60);

        if (days > 0) return `${days}d ${hours}h`;
        if (hours > 0) return `${hours}h ${mins}m`;
        return `${mins}m`;
    };

    // Transform data for charts
    const trendData = stats?.dailyStats.map(d => ({
        day: new Date(d.date).toLocaleDateString('en', { weekday: 'short' }),
        success: d.success,
        failed: d.failed
    })) || [];

    const toolUsageData = stats?.toolUsage.map(t => ({
        tool: t.tool.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        count: t.total
    })) || [];

    const logEntries = stats?.recentActivity.map(a => ({
        id: a.id,
        timestamp: new Date(a.timestamp),
        message: a.status === 'processing'
            ? `${a.tool} started`
            : `${a.tool} ${a.status}${a.duration ? ` in ${a.duration}ms` : ''}`,
        type: a.status === 'processing' ? 'info' as const : a.status
    })) || [];

    // Generate alerts from recent errors
    const alerts = stats?.recentActivity
        .filter(a => a.status === 'error')
        .slice(0, 5)
        .map(a => ({
            id: a.id,
            type: 'error' as const,
            message: `${a.tool} failed${a.errorMessage ? `: ${a.errorMessage}` : ''}`,
            timestamp: new Date(a.timestamp)
        })) || [];

    if (loading) {
        return (
            <div className="p-4 sm:p-8 flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-4" />
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 sm:p-8 flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => fetchStats()}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 min-h-[48px] touch-manipulation active:scale-95"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            {/* Header - Mobile Optimized */}
            <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#1e1e1e]">Dashboard</h1>
                    <p className="text-sm sm:text-base text-gray-600 mt-1">Real-time system statistics</p>
                </div>
                <button
                    onClick={() => fetchStats(true)}
                    disabled={refreshing}
                    className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 min-h-[48px] font-medium touch-manipulation active:scale-95 w-full sm:w-auto"
                >
                    <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {/* Live Status - Mobile Optimized */}
            <div className="mb-6 p-3 sm:p-4 bg-white rounded-xl border border-gray-200">
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-green-500" />
                        <span className="text-gray-600">Uptime:</span>
                        <span className="font-semibold">{formatUptime(stats?.uptime || 0)}</span>
                    </div>
                    <div className="hidden sm:block text-gray-300">|</div>
                    <div className="flex items-center gap-2">
                        <span className="text-gray-600">Active:</span>
                        <span className="font-semibold text-blue-600">{stats?.conversions.active || 0}</span>
                    </div>
                </div>
            </div>

            {/* Metrics Grid - Mobile: 2 cols, Tablet: 3 cols */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
                <MetricCard
                    title="Total Conversions"
                    value={stats?.conversions.total.toLocaleString() || '0'}
                    icon={FileCheck}
                />
                <MetricCard
                    title="Successful"
                    value={stats?.conversions.success.toLocaleString() || '0'}
                    icon={CheckCircle2}
                    trend={`${stats?.conversions.successRate || 100}%`}
                />
                <MetricCard
                    title="Failed"
                    value={stats?.conversions.errors.toLocaleString() || '0'}
                    icon={XCircle}
                />
                <MetricCard
                    title="Memory Used"
                    value={stats?.memory.heapUsed || 0}
                    suffix="MB"
                    icon={Cpu}
                />
                <MetricCard
                    title="Total Memory"
                    value={stats?.memory.rss || 0}
                    suffix="MB"
                    icon={HardDrive}
                />
                <MetricCard
                    title="Active Now"
                    value={stats?.conversions.active || 0}
                    icon={TrendingUp}
                />
            </div>

            {/* Charts Row - Stack on Mobile */}
            {trendData.length > 0 && toolUsageData.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    <TrendChart data={trendData} />
                    <ToolUsageChart data={toolUsageData} />
                </div>
            )}

            {/* No data message */}
            {trendData.length === 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 mb-6 sm:mb-8 text-center">
                    <FileCheck className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No conversion data yet</h3>
                    <p className="text-sm sm:text-base text-gray-600">Charts will appear once users start converting files.</p>
                </div>
            )}

            {/* Logs and Alerts - Stack on Mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <LogStream logs={logEntries} />
                <AlertsPanel alerts={alerts} />
            </div>
        </div>
    );
}
