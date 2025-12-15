import { NextRequest, NextResponse } from 'next/server';
import { trackPageView } from '@/lib/visitors';

export const dynamic = 'force-dynamic';

// Track page view
export async function POST(request: NextRequest) {
    try {
        const { path } = await request.json();

        if (!path || typeof path !== 'string') {
            return NextResponse.json({ error: 'Path is required' }, { status: 400 });
        }

        // Get IP from headers
        const forwarded = request.headers.get('x-forwarded-for');
        const ip = forwarded ? forwarded.split(',')[0].trim() :
            request.headers.get('x-real-ip') ||
            '127.0.0.1';

        const userAgent = request.headers.get('user-agent') || undefined;
        const referer = request.headers.get('referer') || undefined;

        // Track the page view (async, don't wait)
        trackPageView(path, ip, userAgent, referer);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[Track] Error:', error);
        return NextResponse.json({ error: 'Failed to track' }, { status: 500 });
    }
}
