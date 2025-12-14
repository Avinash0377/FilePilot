'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Settings, Shield, Bell, Database, Trash2, LogOut, RefreshCw } from 'lucide-react';

export default function SettingsPage() {
    const [clearing, setClearing] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await fetch('/api/admin/login', { method: 'DELETE' });
            router.push('/admin/login');
        } catch (err) {
            console.error(err);
            setLoggingOut(false);
        }
    };

    const handleClearStats = async () => {
        if (!confirm('Are you sure you want to clear all statistics? This cannot be undone.')) {
            return;
        }

        setClearing(true);
        try {
            await fetch('/api/admin/stats', { method: 'DELETE' });
            alert('Statistics cleared successfully');
        } catch (err) {
            console.error(err);
            alert('Failed to clear statistics');
        } finally {
            setClearing(false);
        }
    };

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#1e1e1e]">Settings</h1>
                <p className="text-gray-600 mt-1">Manage your admin dashboard settings</p>
            </div>

            <div className="max-w-2xl space-y-6">
                {/* Account Section */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Shield className="w-5 h-5 text-blue-600" />
                        <h2 className="text-lg font-semibold">Account</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-gray-100">
                            <div>
                                <p className="font-medium text-gray-900">Admin Session</p>
                                <p className="text-sm text-gray-500">Currently logged in</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                <span className="text-sm text-green-600">Active</span>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            disabled={loggingOut}
                            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                        >
                            {loggingOut ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                                <LogOut className="w-4 h-4" />
                            )}
                            {loggingOut ? 'Logging out...' : 'Logout'}
                        </button>
                    </div>
                </div>

                {/* Data Management */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Database className="w-5 h-5 text-purple-600" />
                        <h2 className="text-lg font-semibold">Data Management</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="py-3 border-b border-gray-100">
                            <p className="font-medium text-gray-900">Statistics Storage</p>
                            <p className="text-sm text-gray-500">
                                Statistics are stored in memory and reset when the server restarts.
                            </p>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <Trash2 className="w-5 h-5 text-yellow-600 mt-0.5" />
                                <div>
                                    <p className="font-medium text-yellow-800">Clear All Statistics</p>
                                    <p className="text-sm text-yellow-700 mb-3">
                                        This will reset all conversion counts, logs, and analytics data.
                                    </p>
                                    <button
                                        onClick={handleClearStats}
                                        disabled={clearing}
                                        className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 text-sm font-medium"
                                    >
                                        {clearing ? 'Clearing...' : 'Clear Statistics'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Info */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Settings className="w-5 h-5 text-gray-600" />
                        <h2 className="text-lg font-semibold">System Information</h2>
                    </div>

                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Application</span>
                            <span className="font-medium">FilePilot Admin</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Version</span>
                            <span className="font-medium">1.0.0</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Environment</span>
                            <span className="font-medium">{process.env.NODE_ENV || 'development'}</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-gray-600">Dashboard</span>
                            <span className="text-blue-600">Real-time Statistics</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
