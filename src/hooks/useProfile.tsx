import { useState, useCallback, useEffect } from 'react';
import { UserProfile, SocialLink, UpdateProfileData, profileService } from '../services/profile';
import { useAuth } from './useAuth';

interface UseProfileReturn {
    profile: UserProfile | null;
    isLoading: boolean;
    isUpdating: boolean;
    error: string | null;
    updateProfile: (data: UpdateProfileData) => Promise<void>;
    updateAvatar: (file: File) => Promise<void>;
    connectSocial: (platform: SocialLink['platform'], username: string, url: string) => Promise<void>;
    disconnectSocial: (platform: SocialLink['platform']) => Promise<void>;
    refreshProfile: () => Promise<void>;
}

export const useProfile = (): UseProfileReturn => {
    const { user } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refreshProfile = useCallback(async () => {
        if (!user) return;
        try {
            setIsLoading(true);
            const data = await profileService.getProfile(user.id);
            setProfile(data);
            setError(null);
        } catch (err) {
            setError('Failed to load profile');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        refreshProfile();
    }, [refreshProfile]);

    const updateProfile = useCallback(async (data: UpdateProfileData) => {
        if (!user) return;
        try {
            setIsUpdating(true);
            const updated = await profileService.updateProfile(user.id, data);
            setProfile(updated);
            setError(null);
        } catch (err) {
            setError('Failed to update profile');
            throw err;
        } finally {
            setIsUpdating(false);
        }
    }, [user]);

    const updateAvatar = useCallback(async (file: File) => {
        if (!user) return;
        try {
            setIsUpdating(true);
            const avatarUrl = await profileService.updateAvatar(user.id, file);
            setProfile(prev => prev ? { ...prev, avatar: avatarUrl } : null);
        } catch (err) {
            setError('Failed to update avatar');
            throw err;
        } finally {
            setIsUpdating(false);
        }
    }, [user]);

    const connectSocial = useCallback(async (
        platform: SocialLink['platform'],
        username: string,
        url: string
    ) => {
        if (!user) return;
        try {
            setIsUpdating(true);
            const newLink = await profileService.connectSocialAccount(user.id, platform, username, url);
            setProfile(prev => {
                if (!prev) return null;
                const existingIndex = prev.socialLinks.findIndex(l => l.platform === platform);
                const newLinks = [...prev.socialLinks];
                if (existingIndex !== -1) {
                    newLinks[existingIndex] = newLink;
                } else {
                    newLinks.push(newLink);
                }
                return { ...prev, socialLinks: newLinks };
            });
        } catch (err) {
            setError('Failed to connect social account');
            throw err;
        } finally {
            setIsUpdating(false);
        }
    }, [user]);

    const disconnectSocial = useCallback(async (platform: SocialLink['platform']) => {
        if (!user) return;
        try {
            setIsUpdating(true);
            await profileService.disconnectSocialAccount(user.id, platform);
            setProfile(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    socialLinks: prev.socialLinks.filter(l => l.platform !== platform),
                };
            });
        } catch (err) {
            setError('Failed to disconnect social account');
            throw err;
        } finally {
            setIsUpdating(false);
        }
    }, [user]);

    return {
        profile,
        isLoading,
        isUpdating,
        error,
        updateProfile,
        updateAvatar,
        connectSocial,
        disconnectSocial,
        refreshProfile,
    };
};
