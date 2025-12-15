// Visitor tracking for admin dashboard
// Stores page views, unique visitors, and locations in MongoDB

import { connectToDatabase } from './mongodb';

interface GeoLocation {
    country: string;
    countryCode: string;
    city: string;
    region: string;
}

// Simple hash function for IP (privacy-friendly - doesn't store actual IP)
function hashIP(ip: string): string {
    let hash = 0;
    const salt = 'filepilot-2024';
    const str = ip + salt;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
}

// Get location from IP using free API
async function getLocationFromIP(ip: string): Promise<GeoLocation | null> {
    try {
        // Skip for local/private IPs
        if (ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
            return { country: 'Local', countryCode: 'LO', city: 'Development', region: '' };
        }

        // Use ip-api.com (free, 45 requests/min for non-commercial)
        const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,regionName,city`, {
            signal: AbortSignal.timeout(3000) // 3 second timeout
        });

        if (!response.ok) return null;

        const data = await response.json();

        if (data.status === 'success') {
            return {
                country: data.country || 'Unknown',
                countryCode: data.countryCode || 'XX',
                city: data.city || 'Unknown',
                region: data.regionName || ''
            };
        }
        return null;
    } catch (error) {
        console.error('[Visitors] Geolocation failed:', error);
        return null;
    }
}

// Track a page view
export async function trackPageView(
    path: string,
    ip: string,
    userAgent?: string,
    referer?: string
): Promise<void> {
    try {
        const { db } = await connectToDatabase();
        const collection = db.collection('pageviews');

        const visitorHash = hashIP(ip);
        const today = new Date().toISOString().split('T')[0];

        // Get location (fire and forget if slow)
        const location = await getLocationFromIP(ip);

        // Insert page view
        await collection.insertOne({
            path,
            timestamp: Date.now(),
            date: today,
            visitorHash,
            userAgent: userAgent?.substring(0, 200),
            referer: referer?.substring(0, 500),
            country: location?.country || 'Unknown',
            countryCode: location?.countryCode || 'XX',
            city: location?.city || 'Unknown'
        });

        // Update daily aggregates
        const aggregates = db.collection('visitor_stats');

        // Update page views and unique visitors
        await aggregates.updateOne(
            { date: today },
            {
                $inc: {
                    pageViews: 1,
                    [`countries.${location?.countryCode || 'XX'}`]: 1
                },
                $addToSet: { uniqueVisitors: visitorHash },
                $setOnInsert: { date: today }
            },
            { upsert: true }
        );
    } catch (error) {
        console.error('[Visitors] Failed to track page view:', error);
    }
}

// Get visitor statistics
export async function getVisitorStats() {
    try {
        const { db } = await connectToDatabase();
        const aggregates = db.collection('visitor_stats');
        const pageviews = db.collection('pageviews');

        // Get today's stats
        const today = new Date().toISOString().split('T')[0];
        const todayStats = await aggregates.findOne({ date: today });

        // Get last 7 days
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const dayStats = await aggregates.findOne({ date: dateStr });
            last7Days.push({
                date: dateStr,
                pageViews: dayStats?.pageViews || 0,
                uniqueVisitors: dayStats?.uniqueVisitors?.length || 0
            });
        }

        // Get all-time totals
        const allTimeStats = await aggregates.aggregate([
            {
                $group: {
                    _id: null,
                    totalPageViews: { $sum: '$pageViews' },
                    allVisitors: { $push: '$uniqueVisitors' }
                }
            }
        ]).toArray();

        // Get unique visitor count
        let totalUniqueVisitors = 0;
        if (allTimeStats.length > 0 && allTimeStats[0].allVisitors) {
            const allVisitorsFlat = allTimeStats[0].allVisitors.flat();
            totalUniqueVisitors = new Set(allVisitorsFlat).size;
        }

        // Get top pages
        const topPages = await pageviews.aggregate([
            {
                $group: {
                    _id: '$path',
                    views: { $sum: 1 }
                }
            },
            { $sort: { views: -1 } },
            { $limit: 10 }
        ]).toArray();

        // Get visitors by country
        const countryStats = await pageviews.aggregate([
            {
                $group: {
                    _id: { country: '$country', countryCode: '$countryCode' },
                    views: { $sum: 1 }
                }
            },
            { $sort: { views: -1 } },
            { $limit: 10 }
        ]).toArray();

        // Get recent visitors with location
        const recentVisitors = await pageviews
            .find({})
            .sort({ timestamp: -1 })
            .limit(20)
            .toArray();

        return {
            today: {
                pageViews: todayStats?.pageViews || 0,
                uniqueVisitors: todayStats?.uniqueVisitors?.length || 0
            },
            allTime: {
                pageViews: allTimeStats[0]?.totalPageViews || 0,
                uniqueVisitors: totalUniqueVisitors
            },
            last7Days,
            topPages: topPages.map(p => ({ path: p._id, views: p.views })),
            topCountries: countryStats.map(c => ({
                country: c._id.country,
                countryCode: c._id.countryCode,
                views: c.views
            })),
            recentVisitors: recentVisitors.map(v => ({
                path: v.path,
                timestamp: v.timestamp,
                country: v.country,
                countryCode: v.countryCode,
                city: v.city
            }))
        };
    } catch (error) {
        console.error('[Visitors] Failed to get stats:', error);
        return {
            today: { pageViews: 0, uniqueVisitors: 0 },
            allTime: { pageViews: 0, uniqueVisitors: 0 },
            last7Days: [],
            topPages: [],
            topCountries: [],
            recentVisitors: []
        };
    }
}
