import { useState, useCallback, useMemo } from 'react';
import { Influencer, InfluencerFilters, DEFAULT_FILTERS } from '../types/influencer';
import { mockInfluencers } from '../data/mockInfluencers';

type SortOption = 'followers' | 'engagement' | 'rate' | 'rating' | 'campaigns';
type SortDirection = 'asc' | 'desc';

interface UseInfluencerSearchReturn {
    influencers: Influencer[];
    filters: InfluencerFilters;
    sortBy: SortOption;
    sortDirection: SortDirection;
    isLoading: boolean;
    totalResults: number;
    setFilters: (filters: Partial<InfluencerFilters>) => void;
    resetFilters: () => void;
    setSortBy: (sort: SortOption) => void;
    toggleSortDirection: () => void;
    searchSuggestions: string[];
}

export const useInfluencerSearch = (): UseInfluencerSearchReturn => {
    const [filters, setFiltersState] = useState<InfluencerFilters>(DEFAULT_FILTERS);
    const [sortBy, setSortBy] = useState<SortOption>('followers');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    const [isLoading, setIsLoading] = useState(false);

    const setFilters = useCallback((newFilters: Partial<InfluencerFilters>) => {
        setIsLoading(true);
        setFiltersState(prev => ({ ...prev, ...newFilters }));
        // Simulate loading
        setTimeout(() => setIsLoading(false), 300);
    }, []);

    const resetFilters = useCallback(() => {
        setFiltersState(DEFAULT_FILTERS);
    }, []);

    const toggleSortDirection = useCallback(() => {
        setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    }, []);

    const filteredInfluencers = useMemo(() => {
        let result = [...mockInfluencers];

        // Search filter
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            result = result.filter(inf =>
                inf.name.toLowerCase().includes(searchLower) ||
                inf.bio.toLowerCase().includes(searchLower) ||
                inf.niches.some(n => n.toLowerCase().includes(searchLower))
            );
        }

        // Niche filter
        if (filters.niches.length > 0) {
            result = result.filter(inf =>
                filters.niches.some(niche => inf.niches.includes(niche))
            );
        }

        // Followers filter
        result = result.filter(inf =>
            inf.totalFollowers >= filters.minFollowers &&
            inf.totalFollowers <= filters.maxFollowers
        );

        // Engagement filter
        result = result.filter(inf =>
            inf.averageEngagement >= filters.minEngagement &&
            inf.averageEngagement <= filters.maxEngagement
        );

        // Location filter
        if (filters.location) {
            result = result.filter(inf =>
                inf.location.toLowerCase().includes(filters.location.toLowerCase())
            );
        }

        // Verified filter
        if (filters.verified !== null) {
            result = result.filter(inf => inf.verified === filters.verified);
        }

        // Rate filter
        result = result.filter(inf =>
            inf.ratePerPost >= filters.minRate &&
            inf.ratePerPost <= filters.maxRate
        );

        // Sorting
        result.sort((a, b) => {
            let comparison = 0;
            switch (sortBy) {
                case 'followers':
                    comparison = a.totalFollowers - b.totalFollowers;
                    break;
                case 'engagement':
                    comparison = a.averageEngagement - b.averageEngagement;
                    break;
                case 'rate':
                    comparison = a.ratePerPost - b.ratePerPost;
                    break;
                case 'rating':
                    comparison = a.rating - b.rating;
                    break;
                case 'campaigns':
                    comparison = a.completedCampaigns - b.completedCampaigns;
                    break;
            }
            return sortDirection === 'asc' ? comparison : -comparison;
        });

        return result;
    }, [filters, sortBy, sortDirection]);

    const searchSuggestions = useMemo(() => {
        if (!filters.search || filters.search.length < 2) return [];

        const searchLower = filters.search.toLowerCase();
        const suggestions = new Set<string>();

        mockInfluencers.forEach(inf => {
            if (inf.name.toLowerCase().includes(searchLower)) {
                suggestions.add(inf.name);
            }
            inf.niches.forEach(niche => {
                if (niche.toLowerCase().includes(searchLower)) {
                    suggestions.add(niche);
                }
            });
        });

        return Array.from(suggestions).slice(0, 5);
    }, [filters.search]);

    return {
        influencers: filteredInfluencers,
        filters,
        sortBy,
        sortDirection,
        isLoading,
        totalResults: filteredInfluencers.length,
        setFilters,
        resetFilters,
        setSortBy,
        toggleSortDirection,
        searchSuggestions,
    };
};
