import { Campaign, CampaignApplication, CreateCampaignData, CampaignStatus, CampaignBudget } from '../types/campaign';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

const CAMPAIGNS_KEY = 'netfluenz_campaigns';
const APPLICATIONS_KEY = 'netfluenz_applications';

// Mock campaigns data for offline / unconfigured demo mode
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
            clicks: 120000,
            conversions: 8500,
            roi: 340,
        },
    },
    {
        id: '4',
        brandId: '2',
        brandName: 'Tusker Brewery',
        brandLogo: 'https://api.dicebear.com/7.x/initials/svg?seed=Tusker',
        title: 'Responsible Drinking Campaign',
        description: 'Promote responsible drinking and celebrate Kenyan culture with Tusker.',
        status: 'draft',
        budget: { total: 1000000, spent: 0, currency: 'KES' },
        requirements: {
            minFollowers: 50000,
            niches: ['lifestyle', 'entertainment'],
            platforms: ['instagram', 'twitter'],
            contentType: 'post',
            deliverables: ['4 Posts', '8 Stories'],
        },
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-04-15'),
        applicationDeadline: new Date('2024-02-20'),
        maxInfluencers: 15,
        applicationsCount: 0,
        acceptedCount: 0,
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-05'),
    },
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class CampaignService {
    private getCampaigns(): Campaign[] {
        try {
            const stored = localStorage.getItem(CAMPAIGNS_KEY);
            if (stored) {
                return JSON.parse(stored).map((c: Campaign) => ({
                    ...c,
                    startDate: c.startDate ? new Date(c.startDate) : undefined,
                    endDate: c.endDate ? new Date(c.endDate) : undefined,
                    applicationDeadline: c.applicationDeadline ? new Date(c.applicationDeadline) : undefined,
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
        if (isSupabaseConfigured() && supabase) {
            const { data, error } = await supabase
                .from('campaigns')
                .select('*, profiles!brand_id(full_name, avatar_url)')
                .order('created_at', { ascending: false });

            if (!error && data) {
                return data.map((c: any) => this.mapDbToCampaign(c));
            }
        }

        await delay(500);
        return this.getCampaigns();
    }

    async getById(id: string): Promise<Campaign | undefined> {
        if (isSupabaseConfigured() && supabase) {
            const { data, error } = await supabase
                .from('campaigns')
                .select('*, profiles!brand_id(full_name, avatar_url)')
                .eq('id', id)
                .single();

            if (!error && data) {
                return this.mapDbToCampaign(data);
            }
        }

        await delay(300);
        return this.getCampaigns().find(c => c.id === id);
    }

    async getByBrandId(brandId: string): Promise<Campaign[]> {
        if (isSupabaseConfigured() && supabase) {
            const { data, error } = await supabase
                .from('campaigns')
                .select('*, profiles!brand_id(full_name, avatar_url)')
                .eq('brand_id', brandId)
                .order('created_at', { ascending: false });

            if (!error && data) {
                return data.map((c: any) => this.mapDbToCampaign(c));
            }
        }

        await delay(400);
        return this.getCampaigns().filter(c => c.brandId === brandId);
    }

    async getByStatus(status: CampaignStatus): Promise<Campaign[]> {
        if (isSupabaseConfigured() && supabase) {
            const { data, error } = await supabase
                .from('campaigns')
                .select('*, profiles!brand_id(full_name, avatar_url)')
                .eq('status', status)
                .order('created_at', { ascending: false });

            if (!error && data) {
                return data.map((c: any) => this.mapDbToCampaign(c));
            }
        }

        await delay(400);
        return this.getCampaigns().filter(c => c.status === status);
    }

    async create(data: CreateCampaignData, brandId: string, brandName: string): Promise<Campaign> {
        const budgetTotal = typeof data.budget === 'number' ? data.budget : (data.budget?.total || 0);
        const budgetObj: CampaignBudget = typeof data.budget === 'number'
            ? { total: data.budget, spent: 0, currency: data.currency || 'KES' }
            : data.budget;

        if (isSupabaseConfigured() && supabase) {
            const payload = {
                brand_id: brandId,
                title: data.title,
                description: data.description,
                budget: budgetTotal,
                status: 'draft',
                niches: data.requirements?.niches || [],
                requirements: data.requirements || {},
                start_date: data.startDate ? new Date(data.startDate).toISOString() : null,
                end_date: data.endDate ? new Date(data.endDate).toISOString() : null,
            };

            const { data: created, error } = await (supabase.from('campaigns') as any)
                .insert([payload])
                .select('*, profiles!brand_id(full_name, avatar_url)')
                .single();

            if (!error && created) {
                return this.mapDbToCampaign(created);
            }
        }

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
            budget: budgetObj,
            requirements: data.requirements,
            startDate: data.startDate ? new Date(data.startDate) : undefined,
            endDate: data.endDate ? new Date(data.endDate) : undefined,
            applicationDeadline: data.applicationDeadline ? new Date(data.applicationDeadline) : undefined,
            maxInfluencers: data.maxInfluencers || 10,
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
        if (isSupabaseConfigured() && supabase) {
            const { data, error } = await (supabase.from('campaigns') as any)
                .update({ status })
                .eq('id', id)
                .select('*, profiles!brand_id(full_name, avatar_url)')
                .single();

            if (!error && data) {
                return this.mapDbToCampaign(data);
            }
        }

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
        if (isSupabaseConfigured() && supabase) {
            const { error } = await supabase.from('campaigns').delete().eq('id', id);
            if (!error) return true;
        }

        await delay(400);
        const campaigns = this.getCampaigns();
        const filtered = campaigns.filter(c => c.id !== id);
        if (filtered.length < campaigns.length) {
            this.saveCampaigns(filtered);
            return true;
        }
        return false;
    }

    private mapDbToCampaign(dbRecord: any): Campaign {
        const brandProfile = dbRecord.profiles || {};
        return {
            id: dbRecord.id,
            brandId: dbRecord.brand_id,
            brandName: brandProfile.full_name || 'Brand',
            brandLogo: brandProfile.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${dbRecord.brand_id}`,
            title: dbRecord.title,
            description: dbRecord.description,
            status: dbRecord.status || 'draft',
            budget: {
                total: Number(dbRecord.budget) || 0,
                spent: 0,
                currency: 'KES',
            },
            requirements: {
                minFollowers: dbRecord.requirements?.minFollowers || 0,
                niches: dbRecord.niches || [],
                platforms: dbRecord.requirements?.platforms || ['instagram'],
                contentType: dbRecord.requirements?.contentType || 'post',
                deliverables: dbRecord.requirements?.deliverables || [],
            },
            startDate: dbRecord.start_date ? new Date(dbRecord.start_date) : undefined,
            endDate: dbRecord.end_date ? new Date(dbRecord.end_date) : undefined,
            maxInfluencers: 10,
            applicationsCount: 0,
            acceptedCount: 0,
            createdAt: new Date(dbRecord.created_at),
            updatedAt: new Date(dbRecord.updated_at),
        };
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
        if (isSupabaseConfigured() && supabase) {
            const payload = {
                campaign_id: campaignId,
                influencer_id: influencerId,
                pitch: proposal,
                status: 'pending',
            };

            const { data, error } = await (supabase.from('campaign_applications') as any)
                .insert([payload])
                .select('*')
                .single();

            if (!error && data) {
                return {
                    id: data.id,
                    campaignId: data.campaign_id,
                    influencerId: data.influencer_id,
                    influencerName,
                    influencerAvatar,
                    status: data.status,
                    proposedRate,
                    proposal: data.pitch || proposal,
                    portfolio: [],
                    submittedAt: new Date(data.created_at),
                };
            }
        }

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
        if (isSupabaseConfigured() && supabase) {
            const { data, error } = await supabase
                .from('campaign_applications')
                .select('*, profiles!influencer_id(full_name, avatar_url)')
                .eq('campaign_id', campaignId)
                .order('created_at', { ascending: false });

            if (!error && data) {
                return data.map((a: any) => ({
                    id: a.id,
                    campaignId: a.campaign_id,
                    influencerId: a.influencer_id,
                    influencerName: a.profiles?.full_name || 'Influencer',
                    influencerAvatar: a.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${a.influencer_id}`,
                    status: a.status,
                    proposedRate: 0,
                    proposal: a.pitch || '',
                    portfolio: [],
                    submittedAt: new Date(a.created_at),
                }));
            }
        }

        await delay(400);
        return this.getApplications().filter(a => a.campaignId === campaignId);
    }

    async getByInfluencerId(influencerId: string): Promise<CampaignApplication[]> {
        if (isSupabaseConfigured() && supabase) {
            const { data, error } = await supabase
                .from('campaign_applications')
                .select('*, campaigns!campaign_id(title)')
                .eq('influencer_id', influencerId)
                .order('created_at', { ascending: false });

            if (!error && data) {
                return data.map((a: any) => ({
                    id: a.id,
                    campaignId: a.campaign_id,
                    influencerId: a.influencer_id,
                    influencerName: 'Influencer',
                    influencerAvatar: '',
                    status: a.status,
                    proposedRate: 0,
                    proposal: a.pitch || '',
                    portfolio: [],
                    submittedAt: new Date(a.created_at),
                }));
            }
        }

        await delay(400);
        return this.getApplications().filter(a => a.influencerId === influencerId);
    }

    async updateStatus(
        id: string,
        status: 'accepted' | 'rejected',
        notes?: string
    ): Promise<CampaignApplication | undefined> {
        if (isSupabaseConfigured() && supabase) {
            const { data, error } = await (supabase.from('campaign_applications') as any)
                .update({ status })
                .eq('id', id)
                .select('*')
                .single();

            if (!error && data) {
                return {
                    id: data.id,
                    campaignId: data.campaign_id,
                    influencerId: data.influencer_id,
                    influencerName: 'Influencer',
                    influencerAvatar: '',
                    status: data.status,
                    proposedRate: 0,
                    proposal: data.pitch || '',
                    portfolio: [],
                    submittedAt: new Date(data.created_at),
                    reviewedAt: new Date(),
                    reviewNotes: notes,
                };
            }
        }

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
