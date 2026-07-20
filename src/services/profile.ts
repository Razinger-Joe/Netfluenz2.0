import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface UserProfile {
    id: string;
    email: string;
    name: string;
    avatar: string;
    bio: string;
    location: string;
    phone?: string;
    website?: string;
    socialLinks: SocialLink[];
    createdAt: Date;
    updatedAt: Date;
}

export interface SocialLink {
    platform: 'instagram' | 'tiktok' | 'youtube' | 'twitter' | 'linkedin' | 'facebook';
    url: string;
    username: string;
    followers?: number;
    verified?: boolean;
}

export interface PortfolioItem {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    campaignName?: string;
}

export interface UpdateProfileData {
    name?: string;
    bio?: string;
    location?: string;
    phone?: string;
    website?: string;
    socialLinks?: SocialLink[];
}

const PROFILE_KEY = 'netfluenz_profile';

class ProfileService {
    private getStoredProfile(): UserProfile | null {
        try {
            const stored = localStorage.getItem(PROFILE_KEY);
            if (stored) {
                const profile = JSON.parse(stored);
                return {
                    ...profile,
                    createdAt: new Date(profile.createdAt),
                    updatedAt: new Date(profile.updatedAt),
                };
            }
            return null;
        } catch {
            return null;
        }
    }

    private saveProfile(profile: UserProfile): void {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    }

    async getProfile(userId: string): Promise<UserProfile> {
        if (isSupabaseConfigured() && supabase) {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (!error && data) {
                return {
                    id: data.id,
                    email: data.email || 'user@example.com',
                    name: data.full_name || 'User',
                    avatar: data.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
                    bio: data.bio || '',
                    location: data.location || 'Nairobi, Kenya',
                    website: data.website || '',
                    socialLinks: [],
                    createdAt: new Date(data.created_at || Date.now()),
                    updatedAt: new Date(data.updated_at || Date.now()),
                };
            }
        }

        await delay(400);
        const stored = this.getStoredProfile();
        if (stored && stored.id === userId) {
            return stored;
        }

        return {
            id: userId,
            email: 'user@example.com',
            name: 'Demo User',
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
            bio: 'Welcome to my profile!',
            location: 'Nairobi, Kenya',
            socialLinks: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    }

    async updateProfile(userId: string, data: UpdateProfileData): Promise<UserProfile> {
        if (isSupabaseConfigured() && supabase) {
            const updatePayload: any = {
                updated_at: new Date().toISOString(),
            };
            if (data.name !== undefined) updatePayload.full_name = data.name;
            if (data.bio !== undefined) updatePayload.bio = data.bio;
            if (data.location !== undefined) updatePayload.location = data.location;
            if (data.website !== undefined) updatePayload.website = data.website;

            await (supabase.from('profiles') as any)
                .update(updatePayload)
                .eq('id', userId);
        }

        await delay(400);
        const currentProfile = await this.getProfile(userId);
        const updatedProfile: UserProfile = {
            ...currentProfile,
            ...data,
            updatedAt: new Date(),
        };

        this.saveProfile(updatedProfile);
        return updatedProfile;
    }

    async updateAvatar(userId: string, file: File): Promise<string> {
        await delay(600);

        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const result = reader.result as string;
                if (isSupabaseConfigured() && supabase) {
                    await (supabase.from('profiles') as any)
                        .update({ avatar_url: result })
                        .eq('id', userId);
                }
                resolve(result);
            };
            reader.readAsDataURL(file);
        });
    }

    async getPortfolio(userId: string): Promise<PortfolioItem[]> {
        if (isSupabaseConfigured() && supabase) {
            const { data, error } = await supabase
                .from('user_portfolios')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (!error && data) {
                return data.map((item: any) => ({
                    id: item.id,
                    title: item.title,
                    description: item.description || '',
                    imageUrl: item.image_url || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80',
                    campaignName: item.campaign_name,
                }));
            }
        }

        return [
            { id: '1', title: 'Safaricom M-Pesa Showcase', description: 'Tech review reel with 150K views', imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80', campaignName: 'Safaricom' },
            { id: '2', title: 'Tusker Culture Fest', description: 'Cultural storytelling video', imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80', campaignName: 'Tusker' }
        ];
    }

    async addPortfolioItem(userId: string, item: Omit<PortfolioItem, 'id'>): Promise<PortfolioItem> {
        if (isSupabaseConfigured() && supabase) {
            const { data, error } = await (supabase.from('user_portfolios') as any)
                .insert([{
                    user_id: userId,
                    title: item.title,
                    description: item.description,
                    image_url: item.imageUrl,
                    campaign_name: item.campaignName,
                }])
                .select('*')
                .single();

            if (!error && data) {
                return {
                    id: data.id,
                    title: data.title,
                    description: data.description || '',
                    imageUrl: data.image_url || '',
                    campaignName: data.campaign_name,
                };
            }
        }

        return {
            id: Math.random().toString(36).substring(7),
            ...item,
        };
    }

    async connectSocialAccount(_userId: string, platform: SocialLink['platform'], username: string, url: string): Promise<SocialLink> {
        await delay(300);
        return {
            platform,
            username,
            url,
            followers: Math.floor(Math.random() * 50000) + 10000,
            verified: true,
        };
    }

    async disconnectSocialAccount(_userId: string, _platform: SocialLink['platform']): Promise<void> {
        await delay(300);
    }
}

export const profileService = new ProfileService();
