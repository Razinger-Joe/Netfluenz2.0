import { Campaign, CampaignApplication, CreateCampaignData, CampaignStatus } from '../types/campaign';

const CAMPAIGNS_KEY = 'netfluenz_campaigns';
const APPLICATIONS_KEY = 'netfluenz_applications';

// Mock campaigns data
const initialCampaigns: Campaign[] = [
    {
        id: '1',
        brandId: '2',
        brandName: 'Safaricom',
        brandLogo: 'https://api.dicebear.com/7.x/initials/svg?seed=Safaricom',
        title: 'M-Pesa Digital Campaign',
        description: 'Looking for tech influencers to promote M-Pesa app features to young professionals.',
        status: 'active',
        budget: { total: 500000, spent: 150000, currency: 'KES' },
        requirements: {
            minFollowers: 50000,
            niches: ['tech', 'business'],
            platforms: ['instagram', 'tiktok'],
            contentType: 'reel',
            deliverables: ['3 Instagram Reels', '2 TikTok videos', '5 Stories'],
        },
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-02-28'),
        applicationDeadline: new Date('2024-01-10'),
        maxInfluencers: 10,
        applicationsCount: 24,
        acceptedCount: 6,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-05'),
        metrics: {
            impressions: 1250000,
            reach: 890000,
            engagement: 4.5,
            clicks: 34000,
            conversions: 2800,
            roi: 185,
        },
    },
    {
        id: '2',
        brandId: '2',
        brandName: 'Kenya Airways',
        brandLogo: 'https://api.dicebear.com/7.x/initials/svg?seed=KQ',
        title: 'Explore Kenya Travel Campaign',
        description: 'Seeking travel influencers to showcase domestic tourism destinations.',
        status: 'active',
        budget: { total: 800000, spent: 320000, currency: 'KES' },
        requirements: {
            minFollowers: 100000,
            niches: ['travel', 'lifestyle'],
            platforms: ['instagram', 'youtube'],
            contentType: 'video',
            deliverables: ['2 YouTube vlogs', '10 Instagram posts', '15 Stories'],
        },
        startDate: new Date('2024-01-20'),
        endDate: new Date('2024-03-31'),
        applicationDeadline: new Date('2024-01-15'),
        maxInfluencers: 5,
        applicationsCount: 45,
        acceptedCount: 4,
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-08'),
        metrics: {
            impressions: 2100000,
            reach: 1450000,
            engagement: 5.2,
            clicks: 67000,
            conversions: 1200,
            roi: 210,
        },
    },
    {
        id: '3',
        brandId: '2',
        brandName: 'Jumia Kenya',
        brandLogo: 'https://api.dicebear.com/7.x/initials/svg?seed=Jumia',
        title: 'Black Friday Sales Push',
        description: 'Fashion and lifestyle influencers needed for massive sales campaign.',
        status: 'completed',
        budget: { total: 300000, spent: 295000, currency: 'KES' },
        requirements: {
            minFollowers: 30000,
            niches: ['fashion', 'lifestyle', 'beauty'],
            platforms: ['instagram', 'tiktok'],
            contentType: 'post',
            deliverables: ['5 Feed posts', '10 Stories', '2 Reels'],
        },
        startDate: new Date('2023-11-20'),
        endDate: new Date('2023-11-30'),
        applicationDeadline: new Date('2023-11-15'),
        maxInfluencers: 20,
        applicationsCount: 78,
        acceptedCount: 18,
        createdAt: new Date('2023-11-01'),
        updatedAt: new Date('2023-12-01'),
        metrics: {
            impressions: 4500000,
            reach: 3200000,
            engagement: 6.8,
            clicks: 156000,
            conversions: 12500,
            roi: 420,
        },
    },
    {
        id: '4',
        brandId: '2',
        brandName: 'Tusker Brewery',
        brandLogo: 'https://api.dicebear.com/7.x/initials/svg?seed=Tusker',
        title: 'Responsible Drinking Campaign',
        description: 'Entertainment influencers for responsible drinking awareness.',
        status: 'draft',
        budget: { total: 1000000, spent: 0, currency: 'KES' },
        requirements: {
            minFollowers: 200000,
            niches: ['entertainment', 'lifestyle'],
            platforms: ['instagram', 'youtube', 'tiktok'],
            contentType: 'video',
            deliverables: ['1 YouTube video', '3 Instagram Reels', '5 TikToks'],
        },
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-04-30'),
        applicationDeadline: new Date('2024-02-20'),
        maxInfluencers: 8,
        applicationsCount: 0,
        acceptedCount: 0,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10'),
    },
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class CampaignService {
    private getCampaigns(): Campaign[] {
        try {
            const stored = localStorage.getItem(CAMPAIGNS_KEY);
            if (stored) {
                const campaigns = JSON.parse(stored);
                return campaigns.map((c: Campaign) => ({
                    ...c,
                    startDate: new Date(c.startDate),
                    endDate: new Date(c.endDate),
                    applicationDeadline: new Date(c.applicationDeadline),
                    createdAt: new Date(c.createdAt),
                    updatedAt: new Date(c.updatedAt),
                }));
            }
            localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(initialCampaigns));
            return initialCampaigns;
        } catch {
            return initialCampaigns;
        }
    }

    private saveCampaigns(campaigns: Campaign[]): void {
        localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(campaigns));
    }

    async getAll(): Promise<Campaign[]> {
        await delay(500);
        return this.getCampaigns();
    }

    async getById(id: string): Promise<Campaign | undefined> {
        await delay(300);
        return this.getCampaigns().find(c => c.id === id);
    }

    async getByBrandId(brandId: string): Promise<Campaign[]> {
        await delay(400);
        return this.getCampaigns().filter(c => c.brandId === brandId);
    }

    async getByStatus(status: CampaignStatus): Promise<Campaign[]> {
        await delay(400);
        return this.getCampaigns().filter(c => c.status === status);
    }

    async create(data: CreateCampaignData, brandId: string, brandName: string): Promise<Campaign> {
        await delay(800);
        const campaigns = this.getCampaigns();
        const newCampaign: Campaign = {
            id: Math.random().toString(36).substring(7),
            brandId,
            brandName,
            brandLogo: `https://api.dicebear.com/7.x/initials/svg?seed=${brandName}`,
            title: data.title,
            description: data.description,
            status: 'draft',
            budget: { total: data.budget, spent: 0, currency: data.currency },
            requirements: data.requirements,
            startDate: data.startDate,
            endDate: data.endDate,
            applicationDeadline: data.applicationDeadline,
            maxInfluencers: data.maxInfluencers,
            applicationsCount: 0,
            acceptedCount: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        campaigns.push(newCampaign);
        this.saveCampaigns(campaigns);
        return newCampaign;
    }

    async updateStatus(id: string, status: CampaignStatus): Promise<Campaign | undefined> {
        await delay(400);
        const campaigns = this.getCampaigns();
        const index = campaigns.findIndex(c => c.id === id);
        if (index !== -1) {
            campaigns[index].status = status;
            campaigns[index].updatedAt = new Date();
            this.saveCampaigns(campaigns);
            return campaigns[index];
        }
        return undefined;
    }

    async delete(id: string): Promise<boolean> {
        await delay(400);
        const campaigns = this.getCampaigns();
        const filtered = campaigns.filter(c => c.id !== id);
        if (filtered.length < campaigns.length) {
            this.saveCampaigns(filtered);
            return true;
        }
        return false;
    }
}

class ApplicationService {
    private getApplications(): CampaignApplication[] {
        try {
            const stored = localStorage.getItem(APPLICATIONS_KEY);
            if (stored) {
                return JSON.parse(stored).map((a: CampaignApplication) => ({
                    ...a,
                    submittedAt: new Date(a.submittedAt),
                    reviewedAt: a.reviewedAt ? new Date(a.reviewedAt) : undefined,
                }));
            }
            return [];
        } catch {
            return [];
        }
    }

    private saveApplications(applications: CampaignApplication[]): void {
        localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(applications));
    }

    async submit(
        campaignId: string,
        influencerId: string,
        influencerName: string,
        influencerAvatar: string,
        proposal: string,
        proposedRate: number
    ): Promise<CampaignApplication> {
        await delay(600);
        const applications = this.getApplications();
        const newApp: CampaignApplication = {
            id: Math.random().toString(36).substring(7),
            campaignId,
            influencerId,
            influencerName,
            influencerAvatar,
            status: 'pending',
            proposedRate,
            proposal,
            portfolio: [],
            submittedAt: new Date(),
        };
        applications.push(newApp);
        this.saveApplications(applications);
        return newApp;
    }

    async getByCampaignId(campaignId: string): Promise<CampaignApplication[]> {
        await delay(400);
        return this.getApplications().filter(a => a.campaignId === campaignId);
    }

    async getByInfluencerId(influencerId: string): Promise<CampaignApplication[]> {
        await delay(400);
        return this.getApplications().filter(a => a.influencerId === influencerId);
    }

    async updateStatus(
        id: string,
        status: 'accepted' | 'rejected',
        notes?: string
    ): Promise<CampaignApplication | undefined> {
        await delay(400);
        const applications = this.getApplications();
        const index = applications.findIndex(a => a.id === id);
        if (index !== -1) {
            applications[index].status = status;
            applications[index].reviewedAt = new Date();
            applications[index].reviewNotes = notes;
            this.saveApplications(applications);
            return applications[index];
        }
        return undefined;
    }
}

export const campaignService = new CampaignService();
export const applicationService = new ApplicationService();
