'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ToolUsageData {
    tool: string;
    count: number;
}

interface ToolUsageChartProps {
    data: ToolUsageData[];
}

export default function ToolUsageChart({ data }: ToolUsageChartProps) {
    return (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Used Tools</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                        type="number"
                        stroke="#6b7280"
                        style={{ fontSize: '12px' }}
                    />
                    <YAxis
                        dataKey="tool"
                        type="category"
                        width={120}
                        stroke="#6b7280"
                        style={{ fontSize: '12px' }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                        cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                    />
                    <Bar
                        dataKey="count"
                        fill="#3b82f6"
                        radius={[0, 8, 8, 0]}
                        name="Conversions"
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
