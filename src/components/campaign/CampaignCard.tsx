import React from 'react';
import { Campaign } from '../../types/campaign';
import { cn } from '../../lib/utils';
import { Calendar, Users, DollarSign, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface CampaignCardProps {
    campaign: Campaign;
    onClick?: () => void;
    variant?: 'default' | 'compact';
    className?: string;
}

const statusColors: Record<Campaign['status'], string> = {
    draft: 'bg-gray-100 text-gray-700',
    active: 'bg-green-100 text-green-700',
    paused: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-red-100 text-red-700',
};

export const CampaignCard: React.FC<CampaignCardProps> = ({
    campaign,
    onClick,
    variant = 'default',
    className,
}) => {
    const formatBudget = (amount: number, currency: string): string => {
        return `${currency} ${amount.toLocaleString()}`;
    };

    const budgetProgress = (campaign.budget.spent / campaign.budget.total) * 100;

    if (variant === 'compact') {
        return (
            <div
                onClick={onClick}
                className={cn(
                    'flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-all cursor-pointer',
                    className
                )}
            >
                <img
                    src={campaign.brandLogo}
                    alt={campaign.brandName}
                    className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{campaign.title}</h4>
                    <p className="text-sm text-gray-500">{campaign.brandName}</p>
                </div>
                <span className={cn(
                    'px-2 py-1 text-xs font-medium rounded-full capitalize',
                    statusColors[campaign.status]
                )}>
                    {campaign.status}
                </span>
            </div>
        );
    }

    return (
        <div
            onClick={onClick}
            className={cn(
                'bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group',
                className
            )}
        >
            {/* Header */}
            <div className="p-4 border-b border-gray-50">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <img
                            src={campaign.brandLogo}
                            alt={campaign.brandName}
                            className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                            <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                                {campaign.title}
                            </h3>
                            <p className="text-sm text-gray-500">{campaign.brandName}</p>
                        </div>
                    </div>
                    <span className={cn(
                        'px-3 py-1 text-xs font-medium rounded-full capitalize',
                        statusColors[campaign.status]
                    )}>
                        {campaign.status}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {campaign.description}
                </p>

                {/* Requirements */}
                <div className="flex flex-wrap gap-1 mb-4">
                    {campaign.requirements.niches.slice(0, 3).map((niche) => (
                        <span
                            key={niche}
                            className="px-2 py-0.5 text-xs font-medium bg-orange-50 text-orange-700 rounded-full capitalize"
                        >
                            {niche}
                        </span>
                    ))}
                    {campaign.requirements.platforms.map((platform) => (
                        <span
                            key={platform}
                            className="px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-full capitalize"
                        >
                            {platform}
                        </span>
                    ))}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span>{formatBudget(campaign.budget.total, campaign.budget.currency)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span>{campaign.applicationsCount} applicants</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{format(new Date(campaign.startDate), 'MMM d')} - {format(new Date(campaign.endDate), 'MMM d')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>Deadline: {format(new Date(campaign.applicationDeadline), 'MMM d')}</span>
                    </div>
                </div>

                {/* Budget Progress */}
                <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-500">Budget used</span>
                        <span className="font-medium text-gray-900">{budgetProgress.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full transition-all"
                            style={{ width: `${Math.min(budgetProgress, 100)}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                <button className="w-full py-2 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors">
                    View Details →
                </button>
            </div>
        </div>
    );
};
