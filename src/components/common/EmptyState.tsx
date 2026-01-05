import React from 'react';
import { cn } from '../../lib/utils';

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon,
    title,
    description,
    action,
    className,
}) => {
    return (
        <div className={cn(
            'flex flex-col items-center justify-center p-8 text-center',
            className
        )}>
            {icon && (
                <div className="w-16 h-16 mb-4 text-gray-300">
                    {icon}
                </div>
            )}
            <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
            {description && (
                <p className="text-sm text-gray-500 max-w-sm mb-4">{description}</p>
            )}
            {action && (
                <button
                    onClick={action.onClick}
                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-medium rounded-lg hover:shadow-lg transition-all"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
};
