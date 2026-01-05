import React from 'react';
import { cn } from '../../lib/utils';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
    className,
    variant = 'text',
    width,
    height,
}) => {
    const baseClasses = 'animate-pulse bg-gray-200';

    const variantClasses = {
        text: 'rounded h-4',
        circular: 'rounded-full',
        rectangular: 'rounded-lg',
    };

    const style: React.CSSProperties = {
        width: width,
        height: height,
    };

    return (
        <div
            className={cn(baseClasses, variantClasses[variant], className)}
            style={style}
        />
    );
};

// Common skeleton patterns
export const CardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
    <div className={cn('bg-white rounded-xl border border-gray-100 p-4', className)}>
        <div className="flex items-center gap-3 mb-4">
            <Skeleton variant="circular" width={48} height={48} />
            <div className="flex-1">
                <Skeleton className="w-32 h-5 mb-2" />
                <Skeleton className="w-24 h-3" />
            </div>
        </div>
        <Skeleton className="w-full h-4 mb-2" />
        <Skeleton className="w-3/4 h-4 mb-4" />
        <div className="flex gap-2">
            <Skeleton className="w-16 h-6 rounded-full" />
            <Skeleton className="w-20 h-6 rounded-full" />
        </div>
    </div>
);

export const TableRowSkeleton: React.FC<{ columns?: number }> = ({ columns = 5 }) => (
    <tr>
        {Array.from({ length: columns }).map((_, i) => (
            <td key={i} className="px-4 py-3">
                <Skeleton className="h-4" />
            </td>
        ))}
    </tr>
);

export const ProfileSkeleton: React.FC = () => (
    <div className="space-y-6">
        <div className="flex items-center gap-4">
            <Skeleton variant="circular" width={80} height={80} />
            <div>
                <Skeleton className="w-48 h-6 mb-2" />
                <Skeleton className="w-32 h-4" />
            </div>
        </div>
        <Skeleton variant="rectangular" className="w-full h-24" />
        <div className="grid grid-cols-3 gap-4">
            <Skeleton variant="rectangular" className="h-20" />
            <Skeleton variant="rectangular" className="h-20" />
            <Skeleton variant="rectangular" className="h-20" />
        </div>
    </div>
);

export const ChartSkeleton: React.FC<{ className?: string }> = ({ className }) => (
    <div className={cn('bg-white rounded-xl border border-gray-100 p-4', className)}>
        <Skeleton className="w-32 h-6 mb-4" />
        <Skeleton variant="rectangular" className="w-full h-64" />
    </div>
);
