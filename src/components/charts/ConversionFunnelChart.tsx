import React from 'react';

interface FunnelStage {
    name: string;
    value: number;
    color: string;
}

interface ConversionFunnelChartProps {
    data: FunnelStage[];
    title?: string;
}

export const ConversionFunnelChart: React.FC<ConversionFunnelChartProps> = ({ data }) => {
    const maxValue = Math.max(...data.map(d => d.value));

    return (
        <div className="w-full space-y-3">
            {data.map((stage, index) => {
                const widthPercent = (stage.value / maxValue) * 100;
                const conversionRate = index > 0
                    ? ((stage.value / data[index - 1].value) * 100).toFixed(1)
                    : '100';

                return (
                    <div key={stage.name} className="relative group">
                        <div className="flex items-center gap-4">
                            <div className="w-28 text-right">
                                <p className="text-sm font-medium text-gray-700">{stage.name}</p>
                            </div>
                            <div className="flex-1 relative">
                                <div className="w-full bg-gray-100 rounded-full h-10 overflow-hidden">
                                    <div
                                        className="h-full rounded-full flex items-center justify-end px-3 transition-all duration-1000 ease-out"
                                        style={{
                                            width: `${widthPercent}%`,
                                            backgroundColor: stage.color,
                                            minWidth: '60px',
                                        }}
                                    >
                                        <span className="text-white text-sm font-bold drop-shadow-sm">
                                            {stage.value >= 1000000
                                                ? `${(stage.value / 1000000).toFixed(1)}M`
                                                : stage.value >= 1000
                                                    ? `${(stage.value / 1000).toFixed(0)}K`
                                                    : stage.value.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="w-16 text-right">
                                {index > 0 && (
                                    <span className="text-xs font-medium text-gray-500">
                                        {conversionRate}%
                                    </span>
                                )}
                            </div>
                        </div>
                        {index < data.length - 1 && (
                            <div className="flex items-center gap-4 py-1">
                                <div className="w-28" />
                                <div className="flex-1 flex justify-center">
                                    <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
                                        <path d="M10 0L20 8L10 16L0 8L10 0Z" fill="#e5e7eb" opacity="0.5" />
                                        <path d="M10 4L16 8L10 12L4 8L10 4Z" fill="#d1d5db" />
                                    </svg>
                                </div>
                                <div className="w-16" />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};
