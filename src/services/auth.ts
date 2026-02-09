import { User, LoginData, SignupData } from '../types/auth';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

// ─── Mock Fallback (used when Supabase is not configured) ─────────────────────

const MOCK_USERS: User[] = [
    {
        id: '1',
        email: 'influencer@netfluenz.com',
        name: 'Alex Influencer',
        role: 'influencer',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        isApproved: true,
        createdAt: new Date('2024-01-01'),
    },
    {
        id: '2',
        email: 'brand@netfluenz.com',
        name: 'Brand Manager',
        role: 'brand',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Brand',
        isApproved: true,
        createdAt: new Date('2024-01-01'),
    },
    {
        id: '3',
        email: 'admin@netfluenz.com',
        name: 'Admin User',
        role: 'admin',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
        isApproved: true,
        createdAt: new Date('2024-01-01'),
    },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ─── Auth Service ─────────────────────────────────────────────────────────────

class AuthService {
    private readonly STORAGE_KEY = 'netfluenz_user';

    /**
     * Authenticate user with email and password.
     * Uses Supabase if configured, otherwise falls back to mock.
     */
    async login(data: LoginData): Promise<User> {
        if (isSupabaseConfigured() && supabase) {
            const { data: authData, error } = await supabase.auth.signInWithPassword({
                email: data.email,
                password: data.password,
            });

            if (error) throw new Error(error.message);
            if (!authData.user) throw new Error('Login failed');

            // Fetch profile from profiles table
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', authData.user.id)
                .single();

            const user: User = {
                id: authData.user.id,
                email: authData.user.email || data.email,
                name: profile?.full_name || authData.user.user_metadata?.full_name || 'User',
                role: profile?.role || authData.user.user_metadata?.role || 'influencer',
                avatar: profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${authData.user.email}`,
                isApproved: profile?.is_approved ?? false,
                createdAt: new Date(authData.user.created_at),
            };

            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
            return user;
        }

        // Mock fallback
        await delay(800);
        const user = MOCK_USERS.find((u) => u.email === data.email);
        if (!user) throw new Error('Invalid email or password');
        if (!data.password || data.password.length < 6) throw new Error('Invalid email or password');
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
        return user;
    }

    /**
     * Register new user.
     * Uses Supabase if configured, otherwise falls back to mock.
     */
    async signup(data: SignupData): Promise<User> {
        if (data.password !== data.confirmPassword) {
            throw new Error('Passwords do not match');
        }

        if (isSupabaseConfigured() && supabase) {
            const { data: authData, error } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: {
                        full_name: data.name,
                        role: data.role,
                    },
                },
            });

            if (error) throw new Error(error.message);
            if (!authData.user) throw new Error('Signup failed');

            const user: User = {
                id: authData.user.id,
                email: data.email,
                name: data.name,
                role: data.role,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
                isApproved: false, // New users always start unapproved
                createdAt: new Date(),
            };

            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
            return user;
        }

        // Mock fallback
        await delay(800);
        const existingUser = MOCK_USERS.find((u) => u.email === data.email);
        if (existingUser) throw new Error('An account with this email already exists');

        const newUser: User = {
            id: Math.random().toString(36).substring(7),
            email: data.email,
            name: data.name,
            role: data.role,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
            isApproved: true, // Mock users are auto-approved for demo
            createdAt: new Date(),
        };

        MOCK_USERS.push(newUser);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newUser));
        return newUser;
    }

    /**
     * Logout user.
     */
    async logout(): Promise<void> {
        if (isSupabaseConfigured() && supabase) {
            await supabase.auth.signOut();
        }
        localStorage.removeItem(this.STORAGE_KEY);
    }

    /**
     * Get current user from storage.
     */
    getCurrentUser(): User | null {
        try {
            const userStr = localStorage.getItem(this.STORAGE_KEY);
            if (!userStr) return null;

            const user = JSON.parse(userStr);
            user.createdAt = new Date(user.createdAt);
            return user;
        } catch (error) {
            console.error('Error parsing stored user:', error);
            return null;
        }
    }

    /**
     * Check if user is authenticated.
     */
    isAuthenticated(): boolean {
        return this.getCurrentUser() !== null;
    }
}

export const authService = new AuthService();
