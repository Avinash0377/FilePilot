// Type definitions for admin dashboard data structures

export interface DashboardMetrics {
    dailyUsers: number;
    conversionsToday: number;
    conversionsWeek: number;
    successRate: number;
    failureRate: number;
    avgProcessingTime: number;
    cpuLoad: number;
    ramUsage: number;
    diskUsage: number;
}

export interface TrendDataPoint {
    day: string;
    success: number;
    failed: number;
}

export interface ToolUsageData {
    tool: string;
    count: number;
}

export interface LogEntry {
    id: string;
    timestamp: Date;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
}

export interface Alert {
    id: string;
    type: 'warning' | 'error' | 'info';
    message: string;
    timestamp: Date;
}
