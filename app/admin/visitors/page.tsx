'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Users,
    Eye,
    Globe,
    MapPin,
    RefreshCw,
    TrendingUp
} from 'lucide-react';

interface VisitorStats {
    today: { pageViews: number; uniqueVisitors: number };
    allTime: { pageViews: number; uniqueVisitors: number };
    last7Days: Array<{ date: string; pageViews: number; uniqueVisitors: number }>;
    topPages: Array<{ path: string; views: number }>;
    topCountries: Array<{ country: string; countryCode: string; views: number }>;
    recentVisitors: Array<{
        path: string;
        timestamp: number;
        country: string;
        countryCode: string;
        city: string;
    }>;
}

function getFlag(countryCode: string): string {
    if (!countryCode || countryCode === 'XX' || countryCode === 'LO') return '🌍';
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
}

export default function VisitorsPage() {
    const [stats, setStats] = useState<VisitorStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();

    const fetchStats = async (showRefresh = false) => {
        if (showRefresh) setRefreshing(true);

        try {
            const res = await fetch('/api/admin/visitors');

            if (res.status === 401) {
                router.push('/admin/login');
                return;
            }

            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchStats();
        const interval = setInterval(() => fetchStats(), 60000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' });
    };

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-screen">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Visitor Analytics</h1>
                    <p className="text-sm text-gray-600 mt-1">Track website visitors and page views</p>
                </div>
                <button
                    onClick={() => fetchStats(true)}
                    disabled={refreshing}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {stats && (
                <div className="space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white rounded-xl border border-gray-200 p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Eye className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Today&apos;s Views</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.today.pageViews.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-200 p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Users className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Today&apos;s Visitors</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.today.uniqueVisitors.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-200 p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <TrendingUp className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">All-Time Views</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.allTime.pageViews.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-200 p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <Globe className="w-5 h-5 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Visitors</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.allTime.uniqueVisitors.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Last 7 Days Chart */}
                    {stats.last7Days.length > 0 && (
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Last 7 Days</h3>
                            <div className="space-y-3">
                                {stats.last7Days.map((day, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="w-24 text-sm text-gray-600">{formatDate(day.date)}</div>
                                        <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500 rounded-full"
                                                style={{
                                                    width: `${Math.min(100, (day.pageViews / Math.max(...stats.last7Days.map(d => d.pageViews))) * 100)}%`
                                                }}
                                            />
                                        </div>
                                        <div className="w-16 text-sm font-medium text-right">{day.pageViews}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Top Countries */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Globe className="w-4 h-4 text-blue-600" />
                                Top Countries
                            </h3>
                            <div className="space-y-3">
                                {stats.topCountries.slice(0, 10).map((c, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">{getFlag(c.countryCode)}</span>
                                            <span className="text-sm text-gray-700">{c.country}</span>
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">{c.views}</span>
                                    </div>
                                ))}
                                {stats.topCountries.length === 0 && (
                                    <p className="text-sm text-gray-500">No data yet</p>
                                )}
                            </div>
                        </div>

                        {/* Top Pages */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Eye className="w-4 h-4 text-green-600" />
                                Top Pages
                            </h3>
                            <div className="space-y-3">
                                {stats.topPages.slice(0, 10).map((p, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <span className="text-sm text-gray-700 truncate flex-1">{p.path}</span>
                                        <span className="text-sm font-medium text-gray-900 ml-2">{p.views}</span>
                                    </div>
                                ))}
                                {stats.topPages.length === 0 && (
                                    <p className="text-sm text-gray-500">No data yet</p>
                                )}
                            </div>
                        </div>

                        {/* Recent Visitors */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-purple-600" />
                                Recent Visitors
                            </h3>
                            <div className="space-y-3 max-h-80 overflow-y-auto">
                                {stats.recentVisitors.slice(0, 15).map((v, i) => (
                                    <div key={i} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <span>{getFlag(v.countryCode)}</span>
                                            <span className="text-gray-600 truncate max-w-[100px]">{v.city}</span>
                                        </div>
                                        <span className="text-gray-500">{formatTime(v.timestamp)}</span>
                                    </div>
                                ))}
                                {stats.recentVisitors.length === 0 && (
                                    <p className="text-sm text-gray-500">No visitors yet</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
