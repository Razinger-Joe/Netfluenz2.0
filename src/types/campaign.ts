export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
export type ApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn';

export interface CampaignBudget {
    total: number;
    spent: number;
    currency: 'KES' | 'USD';
}

export interface CampaignRequirements {
    minFollowers: number;
    niches: string[];
    platforms: string[];
    contentType: 'post' | 'story' | 'reel' | 'video' | 'blog';
    deliverables: string[];
}

export interface Campaign {
    id: string;
    brandId: string;
    brandName: string;
    brandLogo: string;
    title: string;
    description: string;
    status: CampaignStatus;
    budget: CampaignBudget;
    requirements: CampaignRequirements;
    startDate: Date;
    endDate: Date;
    applicationDeadline: Date;
    maxInfluencers: number;
    applicationsCount: number;
    acceptedCount: number;
    createdAt: Date;
    updatedAt: Date;
    metrics?: CampaignMetrics;
}

export interface CampaignMetrics {
    impressions: number;
    reach: number;
    engagement: number;
    clicks: number;
    conversions: number;
    roi: number;
}

export interface CampaignApplication {
    id: string;
    campaignId: string;
    influencerId: string;
    influencerName: string;
    influencerAvatar: string;
    status: ApplicationStatus;
    proposedRate: number;
    proposal: string;
    portfolio: string[];
    submittedAt: Date;
    reviewedAt?: Date;
    reviewNotes?: string;
}

export interface CreateCampaignData {
    title: string;
    description: string;
    budget: number;
    currency: 'KES' | 'USD';
    requirements: CampaignRequirements;
    startDate: Date;
    endDate: Date;
    applicationDeadline: Date;
    maxInfluencers: number;
}
