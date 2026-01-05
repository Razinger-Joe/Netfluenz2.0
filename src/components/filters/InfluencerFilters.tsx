import React from 'react';
import { InfluencerFilters, InfluencerNiche } from '../../types/influencer';
import { cn } from '../../lib/utils';
import { Filter, X, ChevronDown } from 'lucide-react';

interface InfluencerFiltersProps {
    filters: InfluencerFilters;
    onChange: (filters: Partial<InfluencerFilters>) => void;
    onReset: () => void;
    className?: string;
}

const NICHES: { value: InfluencerNiche; label: string }[] = [
    { value: 'tech', label: 'Technology' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'lifestyle', label: 'Lifestyle' },
    { value: 'food', label: 'Food' },
    { value: 'travel', label: 'Travel' },
    { value: 'fitness', label: 'Fitness' },
    { value: 'beauty', label: 'Beauty' },
    { value: 'business', label: 'Business' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'education', label: 'Education' },
];

const LOCATIONS = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Malindi', 'Nyeri'];

const FOLLOWER_RANGES = [
    { min: 0, max: 10000, label: 'Micro (< 10K)' },
    { min: 10000, max: 50000, label: 'Small (10K - 50K)' },
    { min: 50000, max: 100000, label: 'Medium (50K - 100K)' },
    { min: 100000, max: 500000, label: 'Large (100K - 500K)' },
    { min: 500000, max: 10000000, label: 'Mega (500K+)' },
];

export const InfluencerFiltersComponent: React.FC<InfluencerFiltersProps> = ({
    filters,
    onChange,
    onReset,
    className,
}) => {
    const [isExpanded, setIsExpanded] = React.useState(false);

    const activeFiltersCount = [
        filters.niches.length > 0,
        filters.location !== '',
        filters.verified !== null,
        filters.minFollowers > 0 || filters.maxFollowers < 10000000,
        filters.minEngagement > 0,
    ].filter(Boolean).length;

    const toggleNiche = (niche: InfluencerNiche) => {
        const newNiches = filters.niches.includes(niche)
            ? filters.niches.filter(n => n !== niche)
            : [...filters.niches, niche];
        onChange({ niches: newNiches });
    };

    const setFollowerRange = (min: number, max: number) => {
        onChange({ minFollowers: min, maxFollowers: max });
    };

    return (
        <div className={cn('bg-white rounded-xl border border-gray-100 shadow-sm', className)}>
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-4"
            >
                <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-gray-500" />
                    <span className="font-medium text-gray-900">Filters</span>
                    {activeFiltersCount > 0 && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-700 rounded-full">
                            {activeFiltersCount}
                        </span>
                    )}
                </div>
                <ChevronDown className={cn(
                    'w-5 h-5 text-gray-400 transition-transform',
                    isExpanded && 'rotate-180'
                )} />
            </button>

            {/* Filter content */}
            {isExpanded && (
                <div className="px-4 pb-4 space-y-6">
                    {/* Niches */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Niche</label>
                        <div className="flex flex-wrap gap-2">
                            {NICHES.map(({ value, label }) => (
                                <button
                                    key={value}
                                    onClick={() => toggleNiche(value)}
                                    className={cn(
                                        'px-3 py-1.5 text-sm font-medium rounded-full transition-colors',
                                        filters.niches.includes(value)
                                            ? 'bg-orange-500 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    )}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <select
                            value={filters.location}
                            onChange={(e) => onChange({ location: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        >
                            <option value="">All locations</option>
                            {LOCATIONS.map((loc) => (
                                <option key={loc} value={loc}>{loc}</option>
                            ))}
                        </select>
                    </div>

                    {/* Follower Range */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Followers</label>
                        <div className="grid grid-cols-2 gap-2">
                            {FOLLOWER_RANGES.map(({ min, max, label }) => (
                                <button
                                    key={label}
                                    onClick={() => setFollowerRange(min, max)}
                                    className={cn(
                                        'px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                                        filters.minFollowers === min && filters.maxFollowers === max
                                            ? 'bg-orange-500 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    )}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Engagement Rate */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Min Engagement Rate: {filters.minEngagement}%
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="15"
                            step="0.5"
                            value={filters.minEngagement}
                            onChange={(e) => onChange({ minEngagement: parseFloat(e.target.value) })}
                            className="w-full accent-orange-500"
                        />
                    </div>

                    {/* Verified */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Verification</label>
                        <div className="flex gap-2">
                            {[
                                { value: null, label: 'All' },
                                { value: true, label: 'Verified' },
                                { value: false, label: 'Unverified' },
                            ].map(({ value, label }) => (
                                <button
                                    key={label}
                                    onClick={() => onChange({ verified: value })}
                                    className={cn(
                                        'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                                        filters.verified === value
                                            ? 'bg-orange-500 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    )}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Reset Button */}
                    <button
                        onClick={onReset}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
                    >
                        <X className="w-4 h-4" />
                        Reset all filters
                    </button>
                </div>
            )}
        </div>
    );
};
