import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';

interface PerformanceAreaChartProps {
    data: Array<{
        date: string;
        impressions: number;
        reach: number;
        engagement: number;
    }>;
    showLegend?: boolean;
}

export const PerformanceAreaChart: React.FC<PerformanceAreaChartProps> = ({
    data,
    showLegend = true,
}) => {
    const formatValue = (value: number) => {
        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
        if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
        return value.toString();
    };

    const CustomTooltip = ({ active, payload, label }: {
        active?: boolean;
        payload?: Array<{ value: number; name: string; color: string }>;
        label?: string;
    }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-xl">
                    <p className="text-sm font-semibold text-gray-900 mb-2">{label}</p>
                    {payload.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2 py-0.5">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="text-xs text-gray-600">{entry.name}:</span>
                            <span className="text-xs font-semibold text-gray-900">{formatValue(Number(entry.value))}</span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#EC4899" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#EC4899" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                        tickLine={false}
                        axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                        tickFormatter={formatValue}
                        tickLine={false}
                        axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    {showLegend && <Legend />}
                    <Area
                        type="monotone"
                        dataKey="impressions"
                        name="Impressions"
                        stroke="#EC4899"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorImpressions)"
                        animationDuration={1500}
                    />
                    <Area
                        type="monotone"
                        dataKey="reach"
                        name="Reach"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorReach)"
                        animationDuration={1500}
                    />
                    <Area
                        type="monotone"
                        dataKey="engagement"
                        name="Engagement"
                        stroke="#22c55e"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorEngagement)"
                        animationDuration={1500}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};
