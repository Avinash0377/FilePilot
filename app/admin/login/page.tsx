
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from '@/components/Icons';

export default function AdminLogin() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        console.log('Login attempt with password:', password);

        // Validate password
        const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'Avinash333@';
        console.log('Expected password:', correctPassword);

        if (password !== correctPassword) {
            console.log('Password mismatch!');
            setError('Invalid password. Please try again.');
            return;
        }

        console.log('Password correct! Setting cookie and redirecting...');

        // Set admin cookie (admin=1)
        document.cookie = `admin=1; path=/; max-age=86400`; // 1 day

        // Redirect to dashboard
        window.location.href = '/admin/dashboard';
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl p-8">
                <div className="flex justify-center mb-8">
                    <div className="w-16 h-16 bg-brand-500/10 rounded-2xl flex items-center justify-center">
                        <Icons.Shield className="w-8 h-8 text-brand-500" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-white text-center mb-2">Admin Access</h1>
                <p className="text-slate-400 text-center mb-8">Enter password to view system stats</p>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Admin Password"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    {error && (
                        <div className="text-red-400 text-sm text-center bg-red-400/10 p-2 rounded-lg">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-brand-600 hover:bg-brand-500 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                        Access Dashboard
                        <Icons.ChevronRight className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </div>
    );
}
