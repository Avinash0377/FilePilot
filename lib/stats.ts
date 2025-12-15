// Comprehensive stats tracking for admin dashboard
// Persists to MongoDB for data survival across restarts

import { getStatsCollection, getLogsCollection } from './mongodb';

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
    toolUsage: Record<string, { success: number; error: number }>;
    dailyStats: DailyStats[];
}

interface StatsDocument {
    docId: string;
    totalConversions: number;
    successCount: number;
    errorCount: number;
    toolUsage: Record<string, { success: number; error: number }>;
    dailyStats: Record<string, { success: number; failed: number; totalSize: number }>;
}

const getToday = () => new Date().toISOString().split('T')[0];

// In-memory cache for active conversions (resets on restart, that's ok)
let activeConversions = 0;
let startTime = Date.now();

// Cache for stats to reduce DB reads
let statsCache: Stats | null = null;
let lastCacheUpdate = 0;
const CACHE_TTL = 30000; // 30 seconds

const STATS_DOC_ID = 'global_stats';

// Initialize or get stats from MongoDB
async function getStats(): Promise<Stats> {
    // Return cache if fresh
    if (statsCache && Date.now() - lastCacheUpdate < CACHE_TTL) {
        return statsCache;
    }

    try {
        const collection = await getStatsCollection();
        const doc = await collection.findOne({ docId: STATS_DOC_ID });

        if (!doc) {
            // Initialize stats document
            const initialDoc: StatsDocument = {
                docId: STATS_DOC_ID,
                totalConversions: 0,
                successCount: 0,
                errorCount: 0,
                toolUsage: {},
                dailyStats: {}
            };
            await collection.insertOne(initialDoc);

            statsCache = {
                activeConversions,
                totalConversions: 0,
                successCount: 0,
                errorCount: 0,
                startTime,
                toolUsage: {},
                dailyStats: []
            };
        } else {
            statsCache = {
                activeConversions,
                totalConversions: doc.totalConversions || 0,
                successCount: doc.successCount || 0,
                errorCount: doc.errorCount || 0,
                startTime,
                toolUsage: doc.toolUsage || {},
                dailyStats: []
            };
        }

        lastCacheUpdate = Date.now();
        return statsCache;
    } catch (error) {
        console.error('[Stats] Failed to get stats from MongoDB:', error);
        // Return default stats on error
        return {
            activeConversions,
            totalConversions: 0,
            successCount: 0,
            errorCount: 0,
            startTime,
            toolUsage: {},
            dailyStats: []
        };
    }
}

export function trackConversionStart(tool: string): string {
    const id = Math.random().toString(36).substring(7);
    activeConversions++;

    // Log to MongoDB (fire and forget)
    logConversion(id, tool, 'processing');

    // Update total count in background
    updateStatsAsync('start');

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
    activeConversions = Math.max(0, activeConversions - 1);

    // Update log entry
    updateLogEntry(id, status, duration, fileSize, errorMessage);

    // Update stats in background
    updateStatsAsync('end', tool, status, fileSize);
}

// Fire-and-forget log entry
async function logConversion(id: string, tool: string, status: string) {
    try {
        const collection = await getLogsCollection();
        await collection.insertOne({
            logId: id,
            tool,
            status,
            timestamp: Date.now()
        });
    } catch (error) {
        console.error('[Stats] Failed to log conversion:', error);
    }
}

// Update log entry when conversion completes
async function updateLogEntry(
    id: string,
    status: string,
    duration?: number,
    fileSize?: number,
    errorMessage?: string
) {
    try {
        const collection = await getLogsCollection();
        await collection.updateOne(
            { logId: id },
            {
                $set: {
                    status,
                    duration,
                    fileSize,
                    errorMessage,
                    completedAt: Date.now()
                }
            }
        );
    } catch (error) {
        console.error('[Stats] Failed to update log entry:', error);
    }
}

// Update stats in MongoDB
async function updateStatsAsync(
    type: 'start' | 'end',
    tool?: string,
    status?: 'success' | 'error',
    fileSize?: number
) {
    try {
        const collection = await getStatsCollection();
        const today = getToday();

        if (type === 'start') {
            await collection.updateOne(
                { docId: STATS_DOC_ID },
                { $inc: { totalConversions: 1 } },
                { upsert: true }
            );
        } else if (type === 'end' && tool && status) {
            // Clean tool name for MongoDB field (replace dots with underscores)
            const cleanTool = tool.replace(/\./g, '_');

            const updates: Record<string, number> = {};

            if (status === 'success') {
                updates.successCount = 1;
                updates[`toolUsage.${cleanTool}.success`] = 1;
            } else {
                updates.errorCount = 1;
                updates[`toolUsage.${cleanTool}.error`] = 1;
            }

            await collection.updateOne(
                { docId: STATS_DOC_ID },
                { $inc: updates },
                { upsert: true }
            );

            // Update daily stats
            await collection.updateOne(
                { docId: STATS_DOC_ID },
                {
                    $inc: {
                        [`dailyStats.${today}.${status === 'success' ? 'success' : 'failed'}`]: 1,
                        [`dailyStats.${today}.totalSize`]: fileSize || 0
                    }
                }
            );
        }

        // Invalidate cache
        statsCache = null;
    } catch (error) {
        console.error('[Stats] Failed to update stats:', error);
    }
}

export async function getSystemStats() {
    const stats = await getStats();
    const memory = process.memoryUsage();
    const uptime = Math.floor((Date.now() - startTime) / 1000);

    // Calculate success rate
    const total = stats.successCount + stats.errorCount;
    const successRate = total > 0 ? Math.round((stats.successCount / total) * 100) : 100;

    // Get tool usage sorted by total usage
    const toolUsageArray = Object.entries(stats.toolUsage || {})
        .map(([tool, counts]) => ({
            tool,
            success: counts.success || 0,
            error: counts.error || 0,
            total: (counts.success || 0) + (counts.error || 0)
        }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 10);

    // Get recent logs from MongoDB
    let recentActivity: ConversionRecord[] = [];
    try {
        const logsCollection = await getLogsCollection();
        const logs = await logsCollection
            .find({})
            .sort({ timestamp: -1 })
            .limit(20)
            .toArray();

        recentActivity = logs.map(log => ({
            id: log.logId || log.id,
            tool: log.tool,
            status: log.status,
            timestamp: log.timestamp,
            duration: log.duration,
            fileSize: log.fileSize,
            errorMessage: log.errorMessage
        }));
    } catch (error) {
        console.error('[Stats] Failed to get recent logs:', error);
    }

    // Get last 7 days stats from MongoDB
    let last7Days: Array<{ date: string; success: number; failed: number }> = [];
    try {
        const collection = await getStatsCollection();
        const doc = await collection.findOne({ docId: STATS_DOC_ID });
        const dailyStatsObj = doc?.dailyStats || {};

        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const dayStats = dailyStatsObj[dateStr] || { success: 0, failed: 0 };
            last7Days.push({
                date: dateStr,
                success: dayStats.success || 0,
                failed: dayStats.failed || 0
            });
        }
    } catch (error) {
        console.error('[Stats] Failed to get daily stats:', error);
        // Fallback to empty array
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            last7Days.push({
                date: date.toISOString().split('T')[0],
                success: 0,
                failed: 0
            });
        }
    }

    return {
        uptime,
        memory: {
            rss: Math.round(memory.rss / 1024 / 1024),
            heapTotal: Math.round(memory.heapTotal / 1024 / 1024),
            heapUsed: Math.round(memory.heapUsed / 1024 / 1024),
        },
        conversions: {
            active: activeConversions,
            total: stats.totalConversions,
            success: stats.successCount,
            errors: stats.errorCount,
            successRate
        },
        toolUsage: toolUsageArray,
        dailyStats: last7Days,
        recentActivity
    };
}

export async function getRecentLogs(limit: number = 50) {
    try {
        const collection = await getLogsCollection();
        const logs = await collection
            .find({})
            .sort({ timestamp: -1 })
            .limit(limit)
            .toArray();
        return logs;
    } catch (error) {
        console.error('[Stats] Failed to get logs:', error);
        return [];
    }
}

export async function clearStats() {
    try {
        const statsCollection = await getStatsCollection();
        const logsCollection = await getLogsCollection();

        await statsCollection.deleteMany({});
        await logsCollection.deleteMany({});

        statsCache = null;
        startTime = Date.now();

        console.log('[Stats] Stats cleared');
    } catch (error) {
        console.error('[Stats] Failed to clear stats:', error);
    }
}
