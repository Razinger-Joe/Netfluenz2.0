import { User, UserRole } from '../types/auth';
import { mockInfluencers } from '../data/mockInfluencers';
import { Campaign } from '../types/campaign';
import { campaignService } from './campaigns';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

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
        if (isSupabaseConfigured() && supabase) {
            const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
            const { count: campaignCount } = await supabase.from('campaigns').select('*', { count: 'exact', head: true });
            const { count: activeCount } = await supabase.from('campaigns').select('*', { count: 'exact', head: true }).eq('status', 'active');
            const { count: completedCount } = await supabase.from('campaigns').select('*', { count: 'exact', head: true }).eq('status', 'completed');
            const { count: influencerCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'influencer');
            const { count: brandCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'brand');

            return {
                totalUsers: userCount || (mockInfluencers.length + 15),
                totalInfluencers: influencerCount || mockInfluencers.length,
                totalBrands: brandCount || 15,
                totalCampaigns: campaignCount || 6,
                activeCampaigns: activeCount || 4,
                completedCampaigns: completedCount || 2,
                totalRevenue: 12500000,
                monthlyGrowth: 23.5,
            };
        }

        await delay(500);
        const campaigns = await campaignService.getAll();

        return {
            totalUsers: mockInfluencers.length + 15,
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
        if (isSupabaseConfigured() && supabase) {
            const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
            if (data && data.length > 0) {
                return data.map((p: any) => ({
                    id: p.id,
                    email: p.email || 'user@example.com',
                    name: p.full_name || 'User',
                    role: (p.role || 'influencer') as UserRole,
                    avatar: p.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.id}`,
                    createdAt: new Date(p.created_at || Date.now()),
                    status: p.is_approved ? 'active' : p.rejected_at ? 'suspended' : 'pending',
                    campaignsCount: p.completed_campaigns || 0,
                }));
            }
        }

        await delay(600);
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

        return influencerUsers;
    }

    async updateUserStatus(userId: string, status: 'active' | 'suspended'): Promise<void> {
        if (isSupabaseConfigured() && supabase) {
            await (supabase.from('profiles') as any)
                .update({
                    is_approved: status === 'active',
                    rejected_at: status === 'suspended' ? new Date().toISOString() : null,
                })
                .eq('id', userId);
        }
        await delay(400);
    }

    async getAllCampaigns(): Promise<Campaign[]> {
        return campaignService.getAll();
    }

    async updateCampaignStatus(campaignId: string, status: Campaign['status']): Promise<Campaign | undefined> {
        if (isSupabaseConfigured() && supabase) {
            await (supabase.from('campaigns') as any)
                .update({ status })
                .eq('id', campaignId);
        }
        return campaignService.updateStatus(campaignId, status as any);
    }

    async getAnalytics(_period: 'week' | 'month' | 'year' = 'month') {
        await delay(400);
        return {
            revenue: [
                { date: '2024-01-01', amount: 1200000 },
                { date: '2024-01-02', amount: 1500000 },
                { date: '2024-01-03', amount: 1800000 },
                { date: '2024-01-04', amount: 2100000 },
                { date: '2024-01-05', amount: 2500000 },
                { date: '2024-01-06', amount: 1900000 },
                { date: '2024-01-07', amount: 2800000 },
            ],
            userGrowth: [
                { date: '2024-01', count: 120 },
                { date: '2024-02', count: 250 },
                { date: '2024-03', count: 420 },
            ],
            campaignStats: {
                active: 14,
                completed: 42,
                draft: 5,
            },
        };
    }
}

export const adminService = new AdminService();
