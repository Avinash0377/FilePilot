import { NextRequest } from 'next/server';

// Rate limit configuration
export interface RateLimitConfig {
    interval: number; // Time window in milliseconds
    uniqueTokenPerInterval: number; // Max requests per interval
}

// Default configurations for different endpoint types
export const rateLimitConfigs = {
    // File conversion endpoints - more restrictive
    conversion: {
        interval: 15 * 60 * 1000, // 15 minutes
        uniqueTokenPerInterval: 20, // 20 requests per 15 minutes
    },

    // Burst protection - very short window
    burst: {
        interval: 60 * 1000, // 1 minute
        uniqueTokenPerInterval: 5, // 5 requests per minute
    },

    // General API endpoints
    general: {
        interval: 15 * 60 * 1000, // 15 minutes
        uniqueTokenPerInterval: 100, // 100 requests per 15 minutes
    },
} as const;

// Storage for rate limit data
interface RateLimitEntry {
    count: number;
    resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    const entries = Array.from(rateLimitStore.entries());
    for (const [key, entry] of entries) {
        if (entry.resetTime < now) {
            rateLimitStore.delete(key);
        }
    }
}, 5 * 60 * 1000);

/**
 * Get client IP address from request
 */
export function getClientIp(request: NextRequest): string {
    // Try to get real IP from headers (for proxies/load balancers)
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');

    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }

    if (realIp) {
        return realIp;
    }

    // Fallback to a default (shouldn't happen in production)
    return 'unknown';
}

/**
 * Check if request should be rate limited
 * Returns null if allowed, or error response if rate limited
 */
export async function checkRateLimit(
    request: NextRequest,
    config: RateLimitConfig = rateLimitConfigs.conversion
): Promise<{ allowed: boolean; limit: number; remaining: number; reset: number }> {
    const ip = getClientIp(request);
    const key = `${ip}:${request.nextUrl.pathname}`;
    const now = Date.now();

    let entry = rateLimitStore.get(key);

    // Create new entry if doesn't exist or expired
    if (!entry || entry.resetTime < now) {
        entry = {
            count: 0,
            resetTime: now + config.interval,
        };
        rateLimitStore.set(key, entry);
    }

    // Increment count
    entry.count++;

    const allowed = entry.count <= config.uniqueTokenPerInterval;
    const remaining = Math.max(0, config.uniqueTokenPerInterval - entry.count);

    return {
        allowed,
        limit: config.uniqueTokenPerInterval,
        remaining,
        reset: Math.floor(entry.resetTime / 1000), // Unix timestamp in seconds
    };
}

/**
 * Create rate limit headers
 */
export function createRateLimitHeaders(
    limit: number,
    remaining: number,
    reset: number
): Record<string, string> {
    return {
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': reset.toString(),
    };
}

/**
 * Create rate limit error response
 */
export function rateLimitResponse(reset: number): Response {
    const retryAfter = Math.max(1, reset - Math.floor(Date.now() / 1000));

    return new Response(
        JSON.stringify({
            error: 'Too many requests. Please try again later.',
            retryAfter,
        }),
        {
            status: 429,
            headers: {
                'Content-Type': 'application/json',
                'Retry-After': retryAfter.toString(),
            },
        }
    );
}
