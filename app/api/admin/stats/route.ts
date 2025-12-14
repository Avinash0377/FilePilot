import { NextResponse } from 'next/server';
import { getSystemStats, clearStats } from '@/lib/stats';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
    // Check admin cookie
    const cookieStore = await cookies();
    const adminCookie = cookieStore.get('admin');

    if (!adminCookie || adminCookie.value !== '1') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const stats = getSystemStats();

    return NextResponse.json(stats);
}

export async function DELETE() {
    // Check admin cookie
    const cookieStore = await cookies();
    const adminCookie = cookieStore.get('admin');

    if (!adminCookie || adminCookie.value !== '1') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    clearStats();

    return NextResponse.json({ success: true });
}
