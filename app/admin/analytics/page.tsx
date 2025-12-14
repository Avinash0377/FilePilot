'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart3, TrendingUp, TrendingDown, RefreshCw, Calendar } from 'lucide-react';

interface Stats {
    conversions: {
        total: number;
        success: number;
        errors: number;
        successRate: number;
    };
    toolUsage: Array<{ tool: string; success: number; error: number; total: number }>;
    dailyStats: Array<{ date: string; success: number; failed: number; totalSize: number }>;
}

export default function AnalyticsPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/admin/stats');
                if (res.status === 401) {
                    router.push('/admin/login');
                    return;
                }
                const data = await res.json();
                setStats(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [router]);

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-screen">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    const totalConversions = stats?.conversions.total || 0;
    const successRate = stats?.conversions.successRate || 0;
    const toolUsage = stats?.toolUsage || [];
    const dailyStats = stats?.dailyStats || [];

    // Calculate week over week change
    const thisWeek = dailyStats.slice(0, 7).reduce((sum, d) => sum + d.success + d.failed, 0);
    const lastWeek = dailyStats.slice(7, 14).reduce((sum, d) => sum + d.success + d.failed, 0);
    const weekChange = lastWeek > 0 ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100) : 0;

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#1e1e1e]">Analytics</h1>
                <p className="text-gray-600 mt-1">Detailed conversion statistics and trends</p>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-600">Total Conversions</h3>
                        <BarChart3 className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-3xl font-bold">{totalConversions.toLocaleString()}</p>
                    <div className="flex items-center mt-2 text-sm">
                        {weekChange >= 0 ? (
                            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        ) : (
                            <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                        )}
                        <span className={weekChange >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {weekChange >= 0 ? '+' : ''}{weekChange}% this week
                        </span>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-600">Success Rate</h3>
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                            <span className="text-green-600 font-bold text-sm">{successRate}%</span>
                        </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                            className="bg-green-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${successRate}%` }}
                        />
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                        {stats?.conversions.success.toLocaleString()} successful / {stats?.conversions.errors.toLocaleString()} failed
                    </p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-600">Active Tools</h3>
                        <Calendar className="w-5 h-5 text-purple-600" />
                    </div>
                    <p className="text-3xl font-bold">{toolUsage.length}</p>
                    <p className="text-sm text-gray-600 mt-2">Different conversion tools used</p>
                </div>
            </div>

            {/* Tool Breakdown */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
                <h3 className="text-lg font-semibold mb-4">Tool Usage Breakdown</h3>
                {toolUsage.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No tool usage data yet</p>
                ) : (
                    <div className="space-y-4">
                        {toolUsage.map((tool, i) => {
                            const percentage = totalConversions > 0
                                ? Math.round((tool.total / totalConversions) * 100)
                                : 0;
                            const successPct = tool.total > 0
                                ? Math.round((tool.success / tool.total) * 100)
                                : 100;

                            return (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="w-32 text-sm font-medium text-gray-700 truncate">
                                        {tool.tool.replace(/-/g, ' ')}
                                    </div>
                                    <div className="flex-1">
                                        <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                                            <div
                                                className="h-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div className="w-20 text-right">
                                        <span className="text-sm font-medium">{tool.total}</span>
                                        <span className="text-xs text-gray-500 ml-1">({percentage}%)</span>
                                    </div>
                                    <div className="w-16 text-right">
                                        <span className={`text-xs font-medium ${successPct >= 90 ? 'text-green-600' : 'text-yellow-600'}`}>
                                            {successPct}% ok
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Daily Stats Table */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">Daily Statistics</h3>
                {dailyStats.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No daily statistics yet</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Successful</th>
                                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Failed</th>
                                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Total</th>
                                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Success Rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dailyStats.map((day, i) => {
                                    const total = day.success + day.failed;
                                    const rate = total > 0 ? Math.round((day.success / total) * 100) : 100;
                                    return (
                                        <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4 text-sm">
                                                {new Date(day.date).toLocaleDateString('en', {
                                                    weekday: 'short',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-right text-green-600 font-medium">
                                                {day.success}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-right text-red-600 font-medium">
                                                {day.failed}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-right font-medium">
                                                {total}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-right">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${rate >= 90 ? 'bg-green-100 text-green-700' :
                                                        rate >= 70 ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-red-100 text-red-700'
                                                    }`}>
                                                    {rate}%
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
