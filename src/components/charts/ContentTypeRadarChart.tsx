import React from 'react';
import {
    RadarChart,
    Radar,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from 'recharts';

interface ContentTypeRadarChartProps {
    data: Array<{
        subject: string;
        current: number;
        benchmark: number;
    }>;
    showBenchmark?: boolean;
}

export const ContentTypeRadarChart: React.FC<ContentTypeRadarChartProps> = ({
    data,
    showBenchmark = true,
}) => {
    const CustomTooltip = ({ active, payload, label }: {
        active?: boolean;
        payload?: Array<{ value: number; name: string; color: string }>;
        label?: string;
    }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="text-sm font-semibold text-gray-900 mb-1">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} className="text-xs" style={{ color: entry.color }}>
                            {entry.name}: {entry.value}%
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fontSize: 11, fill: '#6b7280' }}
                    />
                    <PolarRadiusAxis
                        angle={30}
                        domain={[0, 100]}
                        tick={{ fontSize: 10, fill: '#9ca3af' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Radar
                        name="Your Performance"
                        dataKey="current"
                        stroke="#f97316"
                        fill="#f97316"
                        fillOpacity={0.25}
                        strokeWidth={2}
                        animationDuration={1500}
                    />
                    {showBenchmark && (
                        <Radar
                            name="Industry Benchmark"
                            dataKey="benchmark"
                            stroke="#8b5cf6"
                            fill="#8b5cf6"
                            fillOpacity={0.1}
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            animationDuration={1500}
                        />
                    )}
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};
