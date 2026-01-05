import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    Cell,
} from 'recharts';

interface EngagementChartProps {
    data: Array<{
        name: string;
        value: number;
        color?: string;
    }>;
    showLegend?: boolean;
    horizontal?: boolean;
}

const defaultColors = ['#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'];

export const EngagementChart: React.FC<EngagementChartProps> = ({
    data,
    showLegend = true,
    horizontal = false,
}) => {
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="text-sm font-medium text-gray-900">{payload[0].payload.name}</p>
                    <p className="text-sm" style={{ color: payload[0].fill }}>
                        {payload[0].value.toLocaleString()}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    layout={horizontal ? 'vertical' : 'horizontal'}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    {horizontal ? (
                        <>
                            <XAxis
                                type="number"
                                tick={{ fontSize: 12, fill: '#6b7280' }}
                                tickLine={false}
                                axisLine={{ stroke: '#e5e7eb' }}
                            />
                            <YAxis
                                dataKey="name"
                                type="category"
                                tick={{ fontSize: 12, fill: '#6b7280' }}
                                tickLine={false}
                                axisLine={{ stroke: '#e5e7eb' }}
                                width={100}
                            />
                        </>
                    ) : (
                        <>
                            <XAxis
                                dataKey="name"
                                tick={{ fontSize: 12, fill: '#6b7280' }}
                                tickLine={false}
                                axisLine={{ stroke: '#e5e7eb' }}
                            />
                            <YAxis
                                tick={{ fontSize: 12, fill: '#6b7280' }}
                                tickLine={false}
                                axisLine={{ stroke: '#e5e7eb' }}
                            />
                        </>
                    )}
                    <Tooltip content={<CustomTooltip />} />
                    {showLegend && <Legend />}
                    <Bar
                        dataKey="value"
                        name="Engagement"
                        radius={[4, 4, 0, 0]}
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.color || defaultColors[index % defaultColors.length]}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
