import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { password } = await request.json();

        // Get password from environment variable (server-side only)
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Avinash333@';

        if (password !== ADMIN_PASSWORD) {
            return NextResponse.json(
                { error: 'Invalid password' },
                { status: 401 }
            );
        }

        // Create response with admin cookie
        const response = NextResponse.json({ success: true });

        response.cookies.set('admin', '1', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/'
        });

        return response;
    } catch {
        return NextResponse.json(
            { error: 'Invalid request' },
            { status: 400 }
        );
    }
}

export async function DELETE() {
    // Logout - clear the admin cookie
    const response = NextResponse.json({ success: true });

    response.cookies.set('admin', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/'
    });

    return response;
}
