import { User, LoginData, SignupData } from '../types/auth';

// Mock user database
const MOCK_USERS: User[] = [
    {
        id: '1',
        email: 'influencer@netfluenz.com',
        name: 'Alex Influencer',
        role: 'influencer',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        createdAt: new Date('2024-01-01'),
    },
    {
        id: '2',
        email: 'brand@netfluenz.com',
        name: 'Brand Manager',
        role: 'brand',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Brand',
        createdAt: new Date('2024-01-01'),
    },
];

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class AuthService {
    private readonly STORAGE_KEY = 'netfluenz_user';

    /**
     * Authenticate user with email and password
     */
    async login(data: LoginData): Promise<User> {
        await delay(1000); // Simulate network delay

        // Find user by email
        const user = MOCK_USERS.find((u) => u.email === data.email);

        if (!user) {
            throw new Error('Invalid email or password');
        }

        // In production, verify password hash
        // For mock, accept any password except empty
        if (!data.password || data.password.length < 6) {
            throw new Error('Invalid email or password');
        }

        // Store user in localStorage
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));

        return user;
    }

    /**
     * Register new user
     */
    async signup(data: SignupData): Promise<User> {
        await delay(1200); // Simulate network delay

        // Check if user already exists
        const existingUser = MOCK_USERS.find((u) => u.email === data.email);
        if (existingUser) {
            throw new Error('An account with this email already exists');
        }

        // Validate passwords match
        if (data.password !== data.confirmPassword) {
            throw new Error('Passwords do not match');
        }

        // Create new user
        const newUser: User = {
            id: Math.random().toString(36).substring(7),
            email: data.email,
            name: data.name,
            role: data.role,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
            createdAt: new Date(),
        };

        // Add to mock database
        MOCK_USERS.push(newUser);

        // Store user in localStorage
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newUser));

        return newUser;
    }

    /**
     * Logout user
     */
    async logout(): Promise<void> {
        await delay(300);
        localStorage.removeItem(this.STORAGE_KEY);
    }

    /**
     * Get current user from storage
     */
    getCurrentUser(): User | null {
        try {
            const userStr = localStorage.getItem(this.STORAGE_KEY);
            if (!userStr) return null;

            const user = JSON.parse(userStr);
            // Convert date string back to Date object
            user.createdAt = new Date(user.createdAt);
            return user;
        } catch (error) {
            console.error('Error parsing stored user:', error);
            return null;
        }
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return this.getCurrentUser() !== null;
    }
}

export const authService = new AuthService();
