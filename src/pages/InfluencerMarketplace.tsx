import React from 'react';
import { useInfluencerSearch } from '../hooks/useInfluencerSearch';
import { InfluencerCard } from '../components/influencer/InfluencerCard';
import { SearchBar } from '../components/search/SearchBar';
import { InfluencerFiltersComponent } from '../components/filters/InfluencerFilters';
import { CardSkeleton } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';
import { Users, ArrowUpDown, Sparkles } from 'lucide-react';

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
        <div className="min-h-screen gradient-mesh">
            {/* Hero Section */}
            <div className="relative overflow-hidden py-14 px-4">
                {/* Floating orbs */}
                <div className="absolute w-64 h-64 rounded-full bg-primary/10 blur-3xl -top-16 -right-16 animate-float" />
                <div className="absolute w-48 h-48 rounded-full bg-secondary/10 blur-3xl bottom-0 left-10 animate-float" style={{ animationDelay: '3s' }} />

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <Sparkles className="w-5 h-5 text-secondary animate-twinkle" />
                        <span className="text-sm font-semibold text-primary tracking-wide uppercase">Marketplace</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                        Discover <span className="text-transparent bg-clip-text gradient-hero">Top Influencers</span>
                    </h1>
                    <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                        Find the perfect creators for your brand campaigns
                    </p>
                    <div className="max-w-2xl mx-auto">
                        <SearchBar
                            value={filters.search}
                            onChange={(value) => setFilters({ search: value })}
                            suggestions={searchSuggestions}
                            placeholder="Search by name, niche, or keyword..."
                            className="max-w-2xl"
                        />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar Filters */}
                    <aside className="lg:w-72 flex-shrink-0">
                        <div className="glass-card rounded-2xl p-1">
                            <InfluencerFiltersComponent
                                filters={filters}
                                onChange={setFilters}
                                onReset={resetFilters}
                            />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        {/* Results Header */}
                        <div className="flex items-center justify-between mb-6 glass-card rounded-xl p-3">
                            <p className="text-sm text-muted-foreground">
                                <span className="font-bold text-foreground">{totalResults}</span> influencers found
                            </p>

                            <div className="flex items-center gap-2">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as 'followers' | 'engagement' | 'rate' | 'rating' | 'campaigns')}
                                    className="px-3 py-1.5 glass-input rounded-lg text-sm focus:outline-none"
                                >
                                    <option value="followers">Followers</option>
                                    <option value="engagement">Engagement</option>
                                    <option value="rate">Rate</option>
                                    <option value="rating">Rating</option>
                                    <option value="campaigns">Campaigns</option>
                                </select>
                                <button
                                    onClick={toggleSortDirection}
                                    className="p-2 glass-card rounded-lg hover:bg-muted/50 transition-colors"
                                    title={`Sort ${sortDirection === 'asc' ? 'ascending' : 'descending'}`}
                                >
                                    <ArrowUpDown className={`w-4 h-4 text-muted-foreground ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
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
