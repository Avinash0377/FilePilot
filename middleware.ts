import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Check if the request is for admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // Allow login page
        if (request.nextUrl.pathname === '/admin/login') {
            // If already logged in, redirect to dashboard
            const sessionCookie = request.cookies.get('admin_session');
            if (sessionCookie && sessionCookie.value) {
                return NextResponse.redirect(new URL('/admin/dashboard', request.url));
            }
            return NextResponse.next();
        }

        // Check for admin session cookie
        const sessionCookie = request.cookies.get('admin_session');

        if (!sessionCookie || !sessionCookie.value) {
            // Redirect to login if not authenticated
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        // Note: Full session validation happens in API routes
        // Middleware only checks cookie presence for performance
    }

    // Check if the request is for admin API routes (except login)
    if (request.nextUrl.pathname.startsWith('/api/admin') &&
        !request.nextUrl.pathname.startsWith('/api/admin/login')) {
        const sessionCookie = request.cookies.get('admin_session');

        if (!sessionCookie || !sessionCookie.value) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/api/admin/:path*'],
};
