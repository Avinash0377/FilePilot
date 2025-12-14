
// Simple in-memory stats store
// Note: This resets when the server restarts (which is fine for a simple dashboard)

interface Stats {
    activeConversions: number;
    totalConversions: number;
    startTime: number;
    recentActivity: Array<{
        id: string;
        tool: string;
        status: 'success' | 'error' | 'processing';
        timestamp: number;
    }>;
}

// Global scope to persist across hot-reloads in dev
const globalForStats = global as unknown as { stats: Stats };

export const stats = globalForStats.stats || {
    activeConversions: 0,
    totalConversions: 0,
    startTime: Date.now(),
    recentActivity: []
};

if (process.env.NODE_ENV !== 'production') globalForStats.stats = stats;

export function trackConversionStart() {
    stats.activeConversions++;
    stats.totalConversions++;
}

export function trackConversionEnd(tool: string, status: 'success' | 'error') {
    stats.activeConversions = Math.max(0, stats.activeConversions - 1);

    // Add to log
    stats.recentActivity.unshift({
        id: Math.random().toString(36).substring(7),
        tool,
        status,
        timestamp: Date.now()
    });

    // Keep log size manageable
    if (stats.recentActivity.length > 50) {
        stats.recentActivity.pop();
    }
}

export function getSystemStats() {
    const memory = process.memoryUsage();

    return {
        uptime: Math.floor((Date.now() - stats.startTime) / 1000), // Seconds
        memory: {
            rss: Math.round(memory.rss / 1024 / 1024), // MB
            heapTotal: Math.round(memory.heapTotal / 1024 / 1024), // MB
            heapUsed: Math.round(memory.heapUsed / 1024 / 1024), // MB
        },
        app: {
            active: stats.activeConversions,
            total: stats.totalConversions,
            recent: stats.recentActivity
        }
    };
}
