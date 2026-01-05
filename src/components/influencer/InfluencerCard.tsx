import React from 'react';
import { Influencer } from '../../types/influencer';
import { cn } from '../../lib/utils';
import { MapPin, Star, Users, TrendingUp, CheckCircle } from 'lucide-react';

interface InfluencerCardProps {
    influencer: Influencer;
    onClick?: () => void;
    className?: string;
}

export const InfluencerCard: React.FC<InfluencerCardProps> = ({
    influencer,
    onClick,
    className,
}) => {
    const formatFollowers = (count: number): string => {
        if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
        if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
        return count.toString();
    };

    const formatRate = (rate: number): string => {
        return `KES ${rate.toLocaleString()}`;
    };

    return (
        <div
            onClick={onClick}
            className={cn(
                'bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group',
                className
            )}
        >
            {/* Header with Avatar */}
            <div className="relative h-24 bg-gradient-to-r from-orange-400 to-yellow-400">
                <div className="absolute -bottom-10 left-4">
                    <div className="relative">
                        <img
                            src={influencer.avatar}
                            alt={influencer.name}
                            className="w-20 h-20 rounded-full border-4 border-white shadow-md object-cover"
                        />
                        {influencer.verified && (
                            <div className="absolute -right-1 -bottom-1 bg-blue-500 rounded-full p-1">
                                <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="pt-12 px-4 pb-4">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                            {influencer.name}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                            <MapPin className="w-3 h-3" />
                            <span>{influencer.location}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-medium text-yellow-700">{influencer.rating}</span>
                    </div>
                </div>

                {/* Bio */}
                <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                    {influencer.bio}
                </p>

                {/* Niches */}
                <div className="mt-3 flex flex-wrap gap-1">
                    {influencer.niches.slice(0, 3).map((niche) => (
                        <span
                            key={niche}
                            className="px-2 py-0.5 text-xs font-medium bg-orange-50 text-orange-700 rounded-full capitalize"
                        >
                            {niche}
                        </span>
                    ))}
                    {influencer.niches.length > 3 && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                            +{influencer.niches.length - 3}
                        </span>
                    )}
                </div>

                {/* Stats */}
                <div className="mt-4 grid grid-cols-3 gap-2 border-t border-gray-100 pt-4">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-gray-400">
                            <Users className="w-3 h-3" />
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                            {formatFollowers(influencer.totalFollowers)}
                        </p>
                        <p className="text-xs text-gray-500">Followers</p>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-gray-400">
                            <TrendingUp className="w-3 h-3" />
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                            {influencer.averageEngagement}%
                        </p>
                        <p className="text-xs text-gray-500">Engagement</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-semibold text-orange-600">
                            {formatRate(influencer.ratePerPost)}
                        </p>
                        <p className="text-xs text-gray-500">Per Post</p>
                    </div>
                </div>

                {/* CTA */}
                <button className="mt-4 w-full py-2 px-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-medium rounded-lg hover:from-orange-600 hover:to-yellow-600 transition-all">
                    View Profile
                </button>
            </div>
        </div>
    );
};
