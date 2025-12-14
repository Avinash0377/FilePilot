// Comprehensive stats tracking for admin dashboard
// Persists in memory (resets on server restart)

interface ConversionRecord {
    id: string;
    tool: string;
    status: 'success' | 'error' | 'processing';
    timestamp: number;
    duration?: number;
    fileSize?: number;
    errorMessage?: string;
}

interface DailyStats {
    date: string;
    success: number;
    failed: number;
    totalSize: number;
}

interface Stats {
    activeConversions: number;
    totalConversions: number;
    successCount: number;
    errorCount: number;
    startTime: number;
    recentActivity: ConversionRecord[];
    toolUsage: Record<string, { success: number; error: number }>;
    dailyStats: DailyStats[];
}

// Global scope to persist across hot-reloads in dev
const globalForStats = global as unknown as { appStats: Stats };

const getToday = () => new Date().toISOString().split('T')[0];

export const stats: Stats = globalForStats.appStats || {
    activeConversions: 0,
    totalConversions: 0,
    successCount: 0,
    errorCount: 0,
    startTime: Date.now(),
    recentActivity: [],
    toolUsage: {},
    dailyStats: []
};

if (process.env.NODE_ENV !== 'production') globalForStats.appStats = stats;

export function trackConversionStart(tool: string): string {
    const id = Math.random().toString(36).substring(7);
    stats.activeConversions++;
    stats.totalConversions++;

    stats.recentActivity.unshift({
        id,
        tool,
        status: 'processing',
        timestamp: Date.now()
    });

    // Keep log size manageable
    if (stats.recentActivity.length > 100) {
        stats.recentActivity.pop();
    }

    return id;
}

export function trackConversionEnd(
    id: string,
    tool: string,
    status: 'success' | 'error',
    duration?: number,
    fileSize?: number,
    errorMessage?: string
) {
    stats.activeConversions = Math.max(0, stats.activeConversions - 1);

    if (status === 'success') {
        stats.successCount++;
    } else {
        stats.errorCount++;
    }

    // Update the record
    const record = stats.recentActivity.find(r => r.id === id);
    if (record) {
        record.status = status;
        record.duration = duration;
        record.fileSize = fileSize;
        record.errorMessage = errorMessage;
    }

    // Update tool usage
    if (!stats.toolUsage[tool]) {
        stats.toolUsage[tool] = { success: 0, error: 0 };
    }
    stats.toolUsage[tool][status]++;

    // Update daily stats
    const today = getToday();
    let todayStats = stats.dailyStats.find(d => d.date === today);
    if (!todayStats) {
        todayStats = { date: today, success: 0, failed: 0, totalSize: 0 };
        stats.dailyStats.unshift(todayStats);
        // Keep only last 30 days
        if (stats.dailyStats.length > 30) {
            stats.dailyStats.pop();
        }
    }
    if (status === 'success') {
        todayStats.success++;
        todayStats.totalSize += fileSize || 0;
    } else {
        todayStats.failed++;
    }
}

export function getSystemStats() {
    const memory = process.memoryUsage();
    const uptime = Math.floor((Date.now() - stats.startTime) / 1000);

    // Calculate success rate
    const total = stats.successCount + stats.errorCount;
    const successRate = total > 0 ? Math.round((stats.successCount / total) * 100) : 100;

    // Get tool usage sorted by total usage
    const toolUsageArray = Object.entries(stats.toolUsage)
        .map(([tool, counts]) => ({
            tool,
            success: counts.success,
            error: counts.error,
            total: counts.success + counts.error
        }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 10);

    // Get last 7 days stats
    const last7Days = stats.dailyStats.slice(0, 7).reverse();

    return {
        uptime,
        memory: {
            rss: Math.round(memory.rss / 1024 / 1024),
            heapTotal: Math.round(memory.heapTotal / 1024 / 1024),
            heapUsed: Math.round(memory.heapUsed / 1024 / 1024),
        },
        conversions: {
            active: stats.activeConversions,
            total: stats.totalConversions,
            success: stats.successCount,
            errors: stats.errorCount,
            successRate
        },
        toolUsage: toolUsageArray,
        dailyStats: last7Days,
        recentActivity: stats.recentActivity.slice(0, 20)
    };
}

export function getRecentLogs(limit: number = 50) {
    return stats.recentActivity.slice(0, limit);
}

export function clearStats() {
    stats.activeConversions = 0;
    stats.totalConversions = 0;
    stats.successCount = 0;
    stats.errorCount = 0;
    stats.startTime = Date.now();
    stats.recentActivity = [];
    stats.toolUsage = {};
    stats.dailyStats = [];
}
