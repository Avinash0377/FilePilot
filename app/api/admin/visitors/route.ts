import { NextResponse } from 'next/server';
import { getVisitorStats } from '@/lib/visitors';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
    // Check admin session cookie
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('admin_session');

    if (!sessionCookie || !sessionCookie.value) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const stats = await getVisitorStats();
        return NextResponse.json(stats);
    } catch (error) {
        console.error('[Admin Visitors] Error:', error);
        return NextResponse.json({
            today: { pageViews: 0, uniqueVisitors: 0 },
            allTime: { pageViews: 0, uniqueVisitors: 0 },
            last7Days: [],
            topPages: [],
            topCountries: [],
            recentVisitors: [],
            error: 'Failed to fetch visitor stats'
        });
    }
}
