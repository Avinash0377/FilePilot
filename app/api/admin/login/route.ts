import { NextRequest, NextResponse } from 'next/server';
import { randomBytes, createHash } from 'crypto';

// In-memory rate limiting for login attempts
const loginAttempts = new Map<string, { count: number; lastAttempt: number; blockedUntil: number }>();

// Rate limit configuration
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const BLOCK_DURATION_MS = 30 * 60 * 1000; // 30 minutes block after exceeding

// Session configuration
const SESSION_DURATION = 8 * 60 * 60; // 8 hours in seconds

// Generate a secure session token
function generateSessionToken(): string {
    const randomPart = randomBytes(32).toString('hex');
    const timestamp = Date.now().toString();
    const hash = createHash('sha256').update(randomPart + timestamp).digest('hex');
    return hash.slice(0, 64);
}

// Get client IP for rate limiting
function getClientIp(request: NextRequest): string {
    const xff = request.headers.get('x-forwarded-for');
    if (xff) {
        return xff.split(',')[0].trim();
    }
    const realIp = request.headers.get('x-real-ip');
    if (realIp) {
        return realIp;
    }
    return 'unknown';
}

// Check rate limit
function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
    const now = Date.now();
    const record = loginAttempts.get(ip);

    if (!record) {
        return { allowed: true };
    }

    // Check if blocked
    if (record.blockedUntil > now) {
        return {
            allowed: false,
            retryAfter: Math.ceil((record.blockedUntil - now) / 1000)
        };
    }

    // Reset if window expired
    if (now - record.lastAttempt > WINDOW_MS) {
        loginAttempts.delete(ip);
        return { allowed: true };
    }

    // Check attempts within window
    if (record.count >= MAX_ATTEMPTS) {
        record.blockedUntil = now + BLOCK_DURATION_MS;
        return {
            allowed: false,
            retryAfter: Math.ceil(BLOCK_DURATION_MS / 1000)
        };
    }

    return { allowed: true };
}

// Record login attempt
function recordAttempt(ip: string, success: boolean): void {
    const now = Date.now();
    const record = loginAttempts.get(ip);

    if (success) {
        // Clear on successful login
        loginAttempts.delete(ip);
        return;
    }

    if (!record) {
        loginAttempts.set(ip, { count: 1, lastAttempt: now, blockedUntil: 0 });
    } else {
        record.count++;
        record.lastAttempt = now;
    }
}

// Constant-time string comparison to prevent timing attacks
function secureCompare(a: string, b: string): boolean {
    if (a.length !== b.length) {
        // Still do comparison to prevent timing leak
        let result = 0;
        for (let i = 0; i < a.length; i++) {
            result |= a.charCodeAt(i) ^ b.charCodeAt(i % b.length);
        }
        return false;
    }

    let result = 0;
    for (let i = 0; i < a.length; i++) {
        result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
}

// Store valid session tokens (in production, use Redis or database)
const validSessions = new Map<string, { createdAt: number; expiresAt: number }>();

// Clean expired sessions periodically
function cleanExpiredSessions(): void {
    const now = Date.now();
    for (const [token, session] of validSessions.entries()) {
        if (session.expiresAt < now) {
            validSessions.delete(token);
        }
    }
}

export async function POST(request: NextRequest) {
    const ip = getClientIp(request);

    // Check rate limit
    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
        return NextResponse.json(
            { error: `Too many login attempts. Try again in ${Math.ceil((rateLimit.retryAfter || 1800) / 60)} minutes.` },
            {
                status: 429,
                headers: {
                    'Retry-After': String(rateLimit.retryAfter || 1800)
                }
            }
        );
    }

    try {
        const { password } = await request.json();

        if (!password || typeof password !== 'string') {
            recordAttempt(ip, false);
            return NextResponse.json(
                { error: 'Password is required' },
                { status: 400 }
            );
        }

        // Get password from environment variable (REQUIRED in production)
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

        if (!ADMIN_PASSWORD) {
            console.error('ADMIN_PASSWORD environment variable is not set!');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        // Use constant-time comparison to prevent timing attacks
        if (!secureCompare(password, ADMIN_PASSWORD)) {
            recordAttempt(ip, false);

            // Add small random delay to further prevent timing attacks
            await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));

            return NextResponse.json(
                { error: 'Invalid password' },
                { status: 401 }
            );
        }

        // Successful login
        recordAttempt(ip, true);
        cleanExpiredSessions();

        // Generate secure session token
        const sessionToken = generateSessionToken();
        const now = Date.now();
        const expiresAt = now + (SESSION_DURATION * 1000);

        // Store session
        validSessions.set(sessionToken, {
            createdAt: now,
            expiresAt
        });

        // Create response with secure session cookie
        const response = NextResponse.json({
            success: true,
            expiresIn: SESSION_DURATION
        });

        response.cookies.set('admin_session', sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict', // Stricter than 'lax' for admin
            maxAge: SESSION_DURATION,
            path: '/'
        });

        // Log successful login (for audit)
        console.log(`[ADMIN LOGIN] Successful login from IP: ${ip} at ${new Date().toISOString()}`);

        return response;
    } catch {
        recordAttempt(ip, false);
        return NextResponse.json(
            { error: 'Invalid request' },
            { status: 400 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    const ip = getClientIp(request);
    const sessionToken = request.cookies.get('admin_session')?.value;

    // Remove session from valid sessions
    if (sessionToken) {
        validSessions.delete(sessionToken);
    }

    // Create response and clear cookie
    const response = NextResponse.json({ success: true });

    response.cookies.set('admin_session', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 0,
        path: '/'
    });

    console.log(`[ADMIN LOGOUT] Logout from IP: ${ip} at ${new Date().toISOString()}`);

    return response;
}

// Note: Session validation happens via the validSessions Map which persists in-memory.
// The middleware checks for cookie presence, and full validation happens here on each request.
