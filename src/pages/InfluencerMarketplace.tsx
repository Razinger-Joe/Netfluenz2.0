import React from 'react';
import { useInfluencerSearch } from '../hooks/useInfluencerSearch';
import { InfluencerCard } from '../components/influencer/InfluencerCard';
import { SearchBar } from '../components/search/SearchBar';
import { InfluencerFiltersComponent } from '../components/filters/InfluencerFilters';
import { CardSkeleton } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';
import { Users, ArrowUpDown } from 'lucide-react';

export const InfluencerMarketplace: React.FC = () => {
    const {
        influencers,
        filters,
        sortBy,
        sortDirection,
        isLoading,
        totalResults,
        setFilters,
        resetFilters,
        setSortBy,
        toggleSortDirection,
        searchSuggestions,
    } = useInfluencerSearch();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-orange-500 to-yellow-500 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Discover Influencers
                    </h1>
                    <p className="text-lg text-white/90 mb-6">
                        Find the perfect creators for your brand campaigns
                    </p>
                    <SearchBar
                        value={filters.search}
                        onChange={(value) => setFilters({ search: value })}
                        suggestions={searchSuggestions}
                        placeholder="Search by name, niche, or keyword..."
                        className="max-w-2xl"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar Filters */}
                    <aside className="lg:w-72 flex-shrink-0">
                        <InfluencerFiltersComponent
                            filters={filters}
                            onChange={setFilters}
                            onReset={resetFilters}
                        />
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        {/* Results Header */}
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-gray-600">
                                <span className="font-semibold text-gray-900">{totalResults}</span> influencers found
                            </p>

                            <div className="flex items-center gap-2">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as 'followers' | 'engagement' | 'rate' | 'rating' | 'campaigns')}
                                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
                                >
                                    <option value="followers">Followers</option>
                                    <option value="engagement">Engagement</option>
                                    <option value="rate">Rate</option>
                                    <option value="rating">Rating</option>
                                    <option value="campaigns">Campaigns</option>
                                </select>
                                <button
                                    onClick={toggleSortDirection}
                                    className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                    title={`Sort ${sortDirection === 'asc' ? 'ascending' : 'descending'}`}
                                >
                                    <ArrowUpDown className={`w-4 h-4 text-gray-500 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                </button>
                            </div>
                        </div>

                        {/* Results Grid */}
                        {isLoading ? (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <CardSkeleton key={i} />
                                ))}
                            </div>
                        ) : influencers.length === 0 ? (
                            <EmptyState
                                icon={<Users className="w-full h-full" />}
                                title="No influencers found"
                                description="Try adjusting your filters or search terms to find more creators."
                                action={{
                                    label: 'Reset Filters',
                                    onClick: resetFilters,
                                }}
                                className="py-16"
                            />
                        ) : (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {influencers.map((influencer) => (
                                    <InfluencerCard
                                        key={influencer.id}
                                        influencer={influencer}
                                        onClick={() => console.log('View profile:', influencer.id)}
                                    />
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};
