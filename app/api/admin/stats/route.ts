import { NextResponse } from 'next/server';
import { getSystemStats, clearStats } from '@/lib/stats';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
    // Check admin session cookie (validated by middleware, but double-check)
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('admin_session');

    if (!sessionCookie || !sessionCookie.value) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const stats = await getSystemStats();
        return NextResponse.json(stats);
    } catch (error) {
        console.error('[Admin Stats] Error fetching stats:', error);
        // Return fallback stats on error
        return NextResponse.json({
            uptime: 0,
            memory: { rss: 0, heapTotal: 0, heapUsed: 0 },
            conversions: { active: 0, total: 0, success: 0, errors: 0, successRate: 100 },
            toolUsage: [],
            dailyStats: [],
            recentActivity: [],
            error: 'Database connection issue - stats may be unavailable'
        });
    }
}

export async function DELETE() {
    // Check admin session cookie
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('admin_session');

    if (!sessionCookie || !sessionCookie.value) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await clearStats();
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[Admin Stats] Error clearing stats:', error);
        return NextResponse.json({ error: 'Failed to clear stats' }, { status: 500 });
    }
}
