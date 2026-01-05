import React from 'react';
import { cn } from '../../lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    change?: number;
    changeLabel?: string;
    icon?: LucideIcon;
    iconColor?: string;
    className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    change,
    changeLabel,
    icon: Icon,
    iconColor = 'text-orange-500',
    className,
}) => {
    const isPositive = change !== undefined && change >= 0;

    return (
        <div className={cn(
            'bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow',
            className
        )}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
                    {change !== undefined && (
                        <div className="mt-2 flex items-center gap-1">
                            <span className={cn(
                                'text-sm font-medium',
                                isPositive ? 'text-green-600' : 'text-red-600'
                            )}>
                                {isPositive ? '+' : ''}{change}%
                            </span>
                            {changeLabel && (
                                <span className="text-sm text-gray-500">{changeLabel}</span>
                            )}
                        </div>
                    )}
                </div>
                {Icon && (
                    <div className={cn('p-3 rounded-lg bg-gray-50', iconColor)}>
                        <Icon className="w-6 h-6" />
                    </div>
                )}
            </div>
        </div>
    );
};
