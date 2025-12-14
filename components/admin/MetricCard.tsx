import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: string;
    suffix?: string;
}

export default function MetricCard({ title, value, icon: Icon, trend, suffix }: MetricCardProps) {
    return (
        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] group">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold text-gray-900">
                            {value}
                            {suffix && <span className="text-lg text-gray-500 ml-1">{suffix}</span>}
                        </h3>
                    </div>
                    {trend && (
                        <p className="text-sm text-green-600 mt-2 font-medium">
                            {trend}
                        </p>
                    )}
                </div>
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <Icon className="w-6 h-6 text-blue-600" />
                </div>
            </div>
        </div>
    );
}
