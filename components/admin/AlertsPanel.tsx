import { AlertTriangle, XCircle, Info } from 'lucide-react';

interface Alert {
    id: string;
    type: 'warning' | 'error' | 'info';
    message: string;
    timestamp: Date;
}

interface AlertsPanelProps {
    alerts: Alert[];
}

const iconMap = {
    warning: AlertTriangle,
    error: XCircle,
    info: Info
};

const colorMap = {
    warning: {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        icon: 'text-yellow-600',
        text: 'text-yellow-900'
    },
    error: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: 'text-red-600',
        text: 'text-red-900'
    },
    info: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: 'text-blue-600',
        text: 'text-blue-900'
    }
};

export default function AlertsPanel({ alerts }: AlertsPanelProps) {
    return (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Alerts</h3>
            <div className="space-y-3">
                {alerts.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-4">No active alerts</p>
                ) : (
                    alerts.map((alert) => {
                        const Icon = iconMap[alert.type];
                        const colors = colorMap[alert.type];

                        return (
                            <div
                                key={alert.id}
                                className={`flex items-start gap-3 p-4 rounded-lg border ${colors.bg} ${colors.border}`}
                            >
                                <Icon className={`w-5 h-5 flex-shrink-0 ${colors.icon}`} />
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium ${colors.text}`}>
                                        {alert.message}
                                    </p>
                                    <p className="text-xs text-gray-600 mt-1">
                                        {alert.timestamp.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
