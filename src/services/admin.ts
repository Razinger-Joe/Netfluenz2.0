import { User, UserRole } from '../types/auth';
import { mockInfluencers } from '../data/mockInfluencers';
import { Campaign } from '../types/campaign';
import { campaignService } from './campaigns';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface PlatformStats {
    totalUsers: number;
    totalInfluencers: number;
    totalBrands: number;
    totalCampaigns: number;
    activeCampaigns: number;
    completedCampaigns: number;
    totalRevenue: number;
    monthlyGrowth: number;
}

export interface AdminUser extends User {
    status: 'active' | 'suspended' | 'pending';
    lastLogin?: Date;
    campaignsCount: number;
    totalSpent?: number;
    totalEarned?: number;
}

class AdminService {
    async getPlatformStats(): Promise<PlatformStats> {
        await delay(500);
        const campaigns = await campaignService.getAll();

        return {
            totalUsers: mockInfluencers.length + 15, // Influencers + mock brands
            totalInfluencers: mockInfluencers.length,
            totalBrands: 15,
            totalCampaigns: campaigns.length,
            activeCampaigns: campaigns.filter(c => c.status === 'active').length,
            completedCampaigns: campaigns.filter(c => c.status === 'completed').length,
            totalRevenue: 12500000,
            monthlyGrowth: 23.5,
        };
    }

    async getAllUsers(): Promise<AdminUser[]> {
        await delay(600);

        // Convert influencers to admin users
        const influencerUsers: AdminUser[] = mockInfluencers.map(inf => ({
            id: inf.id,
            email: inf.email,
            name: inf.name,
            role: 'influencer' as UserRole,
            avatar: inf.avatar,
            createdAt: inf.joinedAt,
            status: inf.verified ? 'active' : 'pending',
            lastLogin: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 7),
            campaignsCount: inf.completedCampaigns,
            totalEarned: inf.completedCampaigns * inf.ratePerPost,
        }));

        // Add mock brand users
        const brandUsers: AdminUser[] = [
            {
                id: 'brand-1',
                email: 'marketing@safaricom.co.ke',
                name: 'Safaricom Marketing',
                role: 'brand',
                avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Safaricom',
                createdAt: new Date('2023-06-01'),
                status: 'active',
                lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 2),
                campaignsCount: 8,
                totalSpent: 4500000,
            },
            {
                id: 'brand-2',
                email: 'brand@kenya-airways.com',
                name: 'Kenya Airways',
                role: 'brand',
                avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=KQ',
                createdAt: new Date('2023-07-15'),
                status: 'active',
                lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24),
                campaignsCount: 5,
                totalSpent: 3200000,
            },
        ];

        return [...influencerUsers, ...brandUsers];
    }

    async updateUserStatus(userId: string, status: 'active' | 'suspended'): Promise<void> {
        await delay(400);
        console.log(`User ${userId} status updated to ${status}`);
    }

    async getAllCampaigns(): Promise<Campaign[]> {
        return campaignService.getAll();
    }

    async approveCampaign(campaignId: string): Promise<void> {
        await delay(400);
        await campaignService.updateStatus(campaignId, 'active');
    }

    async rejectCampaign(campaignId: string, reason: string): Promise<void> {
        await delay(400);
        await campaignService.updateStatus(campaignId, 'cancelled');
        console.log(`Campaign ${campaignId} rejected: ${reason}`);
    }

    async getAnalytics(period: 'week' | 'month' | 'year'): Promise<{
        userGrowth: { date: string; users: number }[];
        revenue: { date: string; amount: number }[];
        campaigns: { date: string; count: number }[];
    }> {
        await delay(600);

        const days = period === 'week' ? 7 : period === 'month' ? 30 : 365;
        const data = [];

        for (let i = days; i > 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            data.push({
                date: date.toISOString().split('T')[0],
                users: Math.floor(50 + Math.random() * 20),
                revenue: Math.floor(100000 + Math.random() * 50000),
                campaigns: Math.floor(2 + Math.random() * 5),
            });
        }

        return {
            userGrowth: data.map(d => ({ date: d.date, users: d.users })),
            revenue: data.map(d => ({ date: d.date, amount: d.revenue })),
            campaigns: data.map(d => ({ date: d.date, count: d.campaigns })),
        };
    }
}

export const adminService = new AdminService();
