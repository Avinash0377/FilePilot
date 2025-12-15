'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    BarChart3,
    FileText,
    Settings,
    Menu,
    X,
    LogOut,
    Home
} from 'lucide-react';
import { useState, useEffect } from 'react';

const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Logs', href: '/admin/logs', icon: FileText },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);

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

    return (
        <>
            {/* Mobile Header Bar */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4">
                <Link href="/admin/dashboard" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">FP</span>
                    </div>
                    <span className="font-bold text-gray-900">Admin</span>
                </Link>

                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="min-w-[48px] min-h-[48px] flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors touch-manipulation active:scale-95"
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? (
                        <X className="w-6 h-6 text-gray-600" />
                    ) : (
                        <Menu className="w-6 h-6 text-gray-600" />
                    )}
                </button>
            </div>

            {/* Sidebar - Desktop: Always visible, Mobile: Slide-in */}
            <aside
                className={`
                    fixed lg:static inset-y-0 left-0 z-50
                    w-[280px] lg:w-64 bg-white border-r border-gray-200
                    transform transition-transform duration-300 ease-in-out
                    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                <div className="flex flex-col h-full">
                    {/* Logo - Desktop only */}
                    <div className="hidden lg:block px-6 py-6 border-b border-gray-200">
                        <Link href="/admin/dashboard" className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">FP</span>
                            </div>
                            <div>
                                <h1 className="font-bold text-gray-900">FilePilot</h1>
                                <p className="text-xs text-gray-500">Admin Panel</p>
                            </div>
                        </Link>
                    </div>

                    {/* Mobile: Close button and title */}
                    <div className="lg:hidden px-4 py-4 border-b border-gray-200 flex items-center justify-between">
                        <span className="font-bold text-lg text-gray-900">Menu</span>
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="min-w-[48px] min-h-[48px] flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors touch-manipulation active:scale-95"
                        >
                            <X className="w-6 h-6 text-gray-600" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-3 lg:px-4 py-4 lg:py-6 space-y-1">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`
                                        flex items-center gap-3 px-4 py-4 lg:py-3 rounded-xl text-base lg:text-sm font-medium
                                        transition-colors duration-150 touch-manipulation active:scale-98
                                        ${isActive
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                                        }
                                    `}
                                >
                                    <Icon className="w-5 h-5" />
                                    {item.name}
                                </Link>
                            );
                        })}

                        {/* Back to Site Link */}
                        <Link
                            href="/"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-4 lg:py-3 rounded-xl text-base lg:text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors touch-manipulation active:scale-98"
                        >
                            <Home className="w-5 h-5" />
                            Back to Site
                        </Link>
                    </nav>

                    {/* Logout Button */}
                    <div className="px-3 lg:px-4 py-4 border-t border-gray-200">
                        <button
                            onClick={handleLogout}
                            disabled={loggingOut}
                            className="w-full flex items-center gap-3 px-4 py-4 lg:py-3 rounded-xl text-base lg:text-sm font-medium text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors disabled:opacity-50 touch-manipulation active:scale-98"
                        >
                            <LogOut className="w-5 h-5" />
                            {loggingOut ? 'Logging out...' : 'Logout'}
                        </button>
                    </div>

                    {/* Footer - Desktop only */}
                    <div className="hidden lg:block px-6 py-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500">
                            © 2024 FilePilot
                        </p>
                    </div>
                </div>
            </aside>

            {/* Mobile overlay */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-hidden="true"
                />
            )}
        </>
    );
}
