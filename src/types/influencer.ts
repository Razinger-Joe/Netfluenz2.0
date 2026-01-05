export type InfluencerNiche =
    | 'tech'
    | 'fashion'
    | 'lifestyle'
    | 'food'
    | 'travel'
    | 'fitness'
    | 'beauty'
    | 'business'
    | 'entertainment'
    | 'education';

export interface SocialStats {
    platform: 'instagram' | 'tiktok' | 'youtube' | 'twitter' | 'linkedin';
    followers: number;
    engagementRate: number;
    averageLikes: number;
    averageComments: number;
}

export interface Influencer {
    id: string;
    name: string;
    email: string;
    avatar: string;
    bio: string;
    location: string;
    niches: InfluencerNiche[];
    totalFollowers: number;
    averageEngagement: number;
    socialStats: SocialStats[];
    ratePerPost: number;
    verified: boolean;
    rating: number;
    completedCampaigns: number;
    joinedAt: Date;
    portfolio: PortfolioItem[];
}

export interface PortfolioItem {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    campaignName?: string;
    metrics?: {
        reach: number;
        engagement: number;
        clicks?: number;
    };
}

export interface InfluencerFilters {
    search: string;
    niches: InfluencerNiche[];
    minFollowers: number;
    maxFollowers: number;
    minEngagement: number;
    maxEngagement: number;
    location: string;
    verified: boolean | null;
    minRate: number;
    maxRate: number;
}

export const DEFAULT_FILTERS: InfluencerFilters = {
    search: '',
    niches: [],
    minFollowers: 0,
    maxFollowers: 10000000,
    minEngagement: 0,
    maxEngagement: 100,
    location: '',
    verified: null,
    minRate: 0,
    maxRate: 100000,
};
