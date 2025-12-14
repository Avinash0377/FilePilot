
import { NextRequest, NextResponse } from 'next/server';
import { getSystemStats } from '@/lib/stats';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    // Simple auth check
    const cookieStore = cookies();
    const session = cookieStore.get('admin_session');
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

    if (!session || session.value !== ADMIN_PASSWORD) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const stats = getSystemStats();

    return NextResponse.json(stats);
}
