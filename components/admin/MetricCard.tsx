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
        <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] group">
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 sm:mb-2 truncate">{title}</p>
                    <div className="flex items-baseline gap-1">
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
                            {value}
                            {suffix && <span className="text-sm sm:text-lg text-gray-500 ml-0.5 sm:ml-1">{suffix}</span>}
                        </h3>
                    </div>
                    {trend && (
                        <p className="text-xs sm:text-sm text-green-600 mt-1 sm:mt-2 font-medium truncate">
                            {trend}
                        </p>
                    )}
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors flex-shrink-0">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
            </div>
        </div>
    );
}
