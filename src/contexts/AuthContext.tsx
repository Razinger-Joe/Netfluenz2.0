import React, { createContext, useEffect, useState } from 'react';
import { User } from '../types/auth';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isApproved: boolean;
    login: (data: any) => Promise<void>;
    signup: (data: any) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (data: Partial<User>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // 1. Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session?.user) {
                mapSessionToUser(session.user).then(setUser);
            } else {
                setIsLoading(false);
            }
        });

        // 2. Listen for changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session?.user) {
                mapSessionToUser(session.user).then(setUser);
            } else {
                setUser(null);
                setIsLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // Helper to map Supabase user to our App's User type
    const mapSessionToUser = async (authUser: any): Promise<User> => {
        try {
            // Explicitly type the query result
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', authUser.id)
                .single();

            const profile = data as Profile | null;

            if (error && error.code !== 'PGRST116') {
                console.error('Error fetching profile:', error);
            }

            // Default values if profile is missing
            const role = (profile?.role as 'brand' | 'influencer' | 'admin') || 'influencer';
            const name = profile?.full_name || authUser.user_metadata?.full_name || 'User';
            const avatar = profile?.avatar_url || authUser.user_metadata?.avatar_url;

            const mappedUser: User = {
                id: authUser.id,
                email: authUser.email || '',
                name: name,
                role: role,
                avatar: avatar,
                bio: profile?.username || '', // Using username as bio placeholder or empty
                location: '', // Location not in profile row yet, handle gracefully
                joinedDate: authUser.created_at ? new Date(authUser.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                createdAt: authUser.created_at ? new Date(authUser.created_at) : new Date(),
                // Add extra fields required by User type but not in Supabase yet
                stats: {
                    campaignsCompleted: 0,
                    activeCampaigns: 0,
                    totalEarnings: 0,
                    responseRate: 100
                },
                socialAccounts: [],
                categories: []
            };

            return mappedUser;

        } catch (e) {
            console.error("Error mapping user:", e);
            // Fallback user object
            return {
                id: authUser.id,
                email: authUser.email || '',
                name: 'User',
                role: 'influencer',
                joinedDate: new Date().toISOString().split('T')[0],
                createdAt: new Date(),
                stats: { campaignsCompleted: 0, activeCampaigns: 0, totalEarnings: 0, responseRate: 0 },
                socialAccounts: [],
                categories: []
            };
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (data: any) => {
        console.log("Login triggered in context", data);
    };

    const signup = async (data: any) => {
        console.log("Signup triggered in context", data);
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
    };

    const updateProfile = async (data: Partial<User>) => {
        if (!user) return;

        // Update local state for immediate feedback
        setUser({ ...user, ...data });

        // Update Supabase 'profiles' table
        const { error } = await supabase
            .from('profiles')
            .update({
                full_name: data.name,
                avatar_url: data.avatar,
            })
            .eq('id', user.id);

        if (error) console.error("Error updating profile:", error);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, isApproved: true, login, signup, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};


