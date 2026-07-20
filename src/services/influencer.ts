import { Influencer } from '../types/influencer';
import { mockInfluencers } from '../data/mockInfluencers';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

class InfluencerService {
    async getAll(): Promise<Influencer[]> {
        if (isSupabaseConfigured() && supabase) {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('role', 'influencer')
                .eq('is_approved', true)
                .is('rejected_at', null)
                .order('follower_count', { ascending: false });

            if (!error && data && data.length > 0) {
                return data.map((p: any) => this.mapProfileToInfluencer(p));
            }
        }

        return mockInfluencers;
    }

    async getById(id: string): Promise<Influencer | undefined> {
        if (isSupabaseConfigured() && supabase) {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', id)
                .single();

            if (!error && data) {
                return this.mapProfileToInfluencer(data);
            }
        }

        return mockInfluencers.find(i => i.id === id);
    }

    private mapProfileToInfluencer(p: any): Influencer {
        return {
            id: p.id,
            name: p.full_name || 'Influencer',
            email: p.email || '',
            avatar: p.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.id}`,
            bio: p.bio || '',
            location: p.location || 'Nairobi, Kenya',
            niches: p.niches || ['lifestyle'],
            totalFollowers: p.follower_count || 10000,
            averageEngagement: Number(p.engagement_rate) || 4.2,
            socialStats: [
                {
                    platform: 'instagram',
                    followers: p.follower_count || 10000,
                    engagementRate: Number(p.engagement_rate) || 4.2,
                    averageLikes: 500,
                    averageComments: 50,
                }
            ],
            ratePerPost: 15000,
            verified: p.verified ?? true,
            rating: Number(p.rating) || 4.8,
            completedCampaigns: p.completed_campaigns || 0,
            joinedAt: p.created_at ? new Date(p.created_at) : new Date(),
            portfolio: [],
        };
    }
}

export const influencerService = new InfluencerService();
