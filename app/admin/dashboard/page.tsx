import MetricCard from '@/components/admin/MetricCard';
import TrendChart from '@/components/admin/TrendChart';
import ToolUsageChart from '@/components/admin/ToolUsageChart';
import LogStream from '@/components/admin/LogStream';
import AlertsPanel from '@/components/admin/AlertsPanel';
import {
    Users,
    FileCheck,
    TrendingUp,
    CheckCircle2,
    XCircle,
    Clock,
    Cpu,
    HardDrive,
    Database,
    TrendingUp as TrendIcon
} from 'lucide-react';
import {
    dashboardMetrics,
    trendData,
    toolUsageData,
    logEntries,
    systemAlerts,
    trendingTool
} from '@/lib/admin/dummyData';

export default function DashboardPage() {
    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#1e1e1e]">Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome back! Here&apos;s what&apos;s happening with your file conversion platform.</p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <MetricCard
                    title="Daily Active Users"
                    value={dashboardMetrics.dailyUsers.toLocaleString()}
                    icon={Users}
                />
                <MetricCard
                    title="Conversions Today"
                    value={dashboardMetrics.conversionsToday.toLocaleString()}
                    icon={FileCheck}
                />
                <MetricCard
                    title="Conversions This Week"
                    value={dashboardMetrics.conversionsWeek.toLocaleString()}
                    icon={TrendingUp}
                />
                <MetricCard
                    title="Success Rate"
                    value={dashboardMetrics.successRate}
                    suffix="%"
                    icon={CheckCircle2}
                    trend="↑ 2.5% from last week"
                />
                <MetricCard
                    title="Failure Rate"
                    value={dashboardMetrics.failureRate}
                    suffix="%"
                    icon={XCircle}
                />
                <MetricCard
                    title="Avg Processing Time"
                    value={dashboardMetrics.avgProcessingTime}
                    suffix="ms"
                    icon={Clock}
                />
                <MetricCard
                    title="Server CPU Load"
                    value={dashboardMetrics.cpuLoad}
                    suffix="%"
                    icon={Cpu}
                />
                <MetricCard
                    title="Server RAM Usage"
                    value={dashboardMetrics.ramUsage}
                    suffix="MB"
                    icon={Database}
                />
                <MetricCard
                    title="Disk Usage"
                    value={dashboardMetrics.diskUsage}
                    suffix="%"
                    icon={HardDrive}
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <TrendChart data={trendData} />
                <ToolUsageChart data={toolUsageData} />
            </div>

            {/* Trending Tool Spotlight */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 mb-8 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <TrendIcon className="w-5 h-5" />
                            <span className="text-sm font-medium opacity-90">Trending Tool</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-1">{trendingTool.name}</h3>
                        <p className="text-blue-100">
                            Usage: <span className="font-semibold">{trendingTool.change}</span> {trendingTool.period}
                        </p>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                        <FileCheck className="w-8 h-8" />
                    </div>
                </div>
            </div>

            {/* Logs and Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <LogStream logs={logEntries} />
                <AlertsPanel alerts={systemAlerts} />
            </div>
        </div>
    );
}
