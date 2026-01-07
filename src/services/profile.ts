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
        await delay(400);

        const stored = this.getStoredProfile();
        if (stored && stored.id === userId) {
            return stored;
        }

        // Return mock profile
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
        await delay(600);

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
        await delay(800);

        // In production, this would upload to a CDN
        // For mock, we'll create a data URL
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async () => {
                const avatarUrl = reader.result as string;
                const profile = await this.getProfile(userId);
                profile.avatar = avatarUrl;
                profile.updatedAt = new Date();
                this.saveProfile(profile);
                resolve(avatarUrl);
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });
    }

    async connectSocialAccount(
        userId: string,
        platform: SocialLink['platform'],
        username: string,
        url: string
    ): Promise<SocialLink> {
        await delay(1000);

        const profile = await this.getProfile(userId);
        const newLink: SocialLink = {
            platform,
            url,
            username,
            followers: Math.floor(Math.random() * 100000),
            verified: Math.random() > 0.5,
        };

        const existingIndex = profile.socialLinks.findIndex(l => l.platform === platform);
        if (existingIndex !== -1) {
            profile.socialLinks[existingIndex] = newLink;
        } else {
            profile.socialLinks.push(newLink);
        }

        profile.updatedAt = new Date();
        this.saveProfile(profile);
        return newLink;
    }

    async disconnectSocialAccount(userId: string, platform: SocialLink['platform']): Promise<void> {
        await delay(400);

        const profile = await this.getProfile(userId);
        profile.socialLinks = profile.socialLinks.filter(l => l.platform !== platform);
        profile.updatedAt = new Date();
        this.saveProfile(profile);
    }
}

export const profileService = new ProfileService();
