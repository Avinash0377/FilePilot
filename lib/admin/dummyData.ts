import type { DashboardMetrics, TrendDataPoint, ToolUsageData, LogEntry, Alert } from './types';

// Dashboard Metrics
export const dashboardMetrics: DashboardMetrics = {
    dailyUsers: 1345,
    conversionsToday: 2280,
    conversionsWeek: 15892,
    successRate: 94,
    failureRate: 6,
    avgProcessingTime: 420,
    cpuLoad: 37,
    ramUsage: 1024,
    diskUsage: 64
};

// 7-Day Trend Data
export const trendData: TrendDataPoint[] = [
    { day: "Mon", success: 300, failed: 20 },
    { day: "Tue", success: 420, failed: 12 },
    { day: "Wed", success: 390, failed: 18 },
    { day: "Thu", success: 510, failed: 22 },
    { day: "Fri", success: 460, failed: 10 },
    { day: "Sat", success: 620, failed: 15 },
    { day: "Sun", success: 700, failed: 25 }
];

// Tool Usage Data
export const toolUsageData: ToolUsageData[] = [
    { tool: "PDF to Word", count: 820 },
    { tool: "Word to PDF", count: 760 },
    { tool: "Compress PDF", count: 540 },
    { tool: "JPG to PNG", count: 480 },
    { tool: "PNG to JPG", count: 470 },
    { tool: "OCR", count: 220 }
];

// Real-time Log Stream (dummy data)
export const logEntries: LogEntry[] = [
    {
        id: '1',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        message: 'PDF to Word completed in 342ms',
        type: 'success'
    },
    {
        id: '2',
        timestamp: new Date(Date.now() - 1000 * 60 * 4),
        message: 'JPG to PNG failed (invalid header)',
        type: 'error'
    },
    {
        id: '3',
        timestamp: new Date(Date.now() - 1000 * 60 * 3),
        message: 'Video compression started',
        type: 'info'
    },
    {
        id: '4',
        timestamp: new Date(Date.now() - 1000 * 60 * 2),
        message: 'CPU spike detected: 82%',
        type: 'warning'
    },
    {
        id: '5',
        timestamp: new Date(Date.now() - 1000 * 60),
        message: 'Compress PDF completed in 1240ms',
        type: 'success'
    },
    {
        id: '6',
        timestamp: new Date(Date.now() - 1000 * 30),
        message: 'Background removal started',
        type: 'info'
    },
    {
        id: '7',
        timestamp: new Date(Date.now() - 1000 * 10),
        message: 'Word to PDF completed in 520ms',
        type: 'success'
    }
];

// System Alerts
export const systemAlerts: Alert[] = [
    {
        id: '1',
        type: 'warning',
        message: 'High CPU load (92%) at 12:22PM',
        timestamp: new Date(Date.now() - 1000 * 60 * 30)
    },
    {
        id: '2',
        type: 'error',
        message: '14 failed conversions in last 10 minutes',
        timestamp: new Date(Date.now() - 1000 * 60 * 15)
    },
    {
        id: '3',
        type: 'warning',
        message: 'Disk usage above 80%',
        timestamp: new Date(Date.now() - 1000 * 60 * 5)
    }
];

// Trending Tool Info
export const trendingTool = {
    name: 'PDF to Word',
    change: '+32%',
    period: 'today'
};
