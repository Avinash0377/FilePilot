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

    const stats = getSystemStats();

    return NextResponse.json(stats);
}

export async function DELETE() {
    // Check admin session cookie
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('admin_session');

    if (!sessionCookie || !sessionCookie.value) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    clearStats();

    return NextResponse.json({ success: true });
}
