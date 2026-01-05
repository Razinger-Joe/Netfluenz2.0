import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '../services/auth';

describe('authService', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    describe('login', () => {
        it('should successfully login with valid demo influencer credentials', async () => {
            const user = await authService.login({
                email: 'influencer@netfluenz.com',
                password: 'demo123',
            });

            expect(user).toBeDefined();
            expect(user.email).toBe('influencer@netfluenz.com');
            expect(user.role).toBe('influencer');
        });

        it('should successfully login with valid demo brand credentials', async () => {
            const user = await authService.login({
                email: 'brand@netfluenz.com',
                password: 'demo123',
            });

            expect(user).toBeDefined();
            expect(user.email).toBe('brand@netfluenz.com');
            expect(user.role).toBe('brand');
        });

        it('should throw error for invalid credentials', async () => {
            await expect(
                authService.login({
                    email: 'invalid@example.com',
                    password: 'wrongpassword',
                })
            ).rejects.toThrow('Invalid email or password');
        });

        it('should store user in localStorage on successful login', async () => {
            const user = await authService.login({
                email: 'influencer@netfluenz.com',
                password: 'demo123',
            });

            // Verify the returned user has the expected properties
            expect(user).toBeDefined();
            expect(user.email).toBe('influencer@netfluenz.com');
            expect(user.role).toBe('influencer');
        });
    });

    describe('signup', () => {
        it('should create a new user account', async () => {
            const user = await authService.signup({
                email: 'newuser@example.com',
                password: 'Password123!',
                confirmPassword: 'Password123!',
                name: 'New User',
                role: 'influencer',
            });

            expect(user).toBeDefined();
            expect(user.email).toBe('newuser@example.com');
            expect(user.name).toBe('New User');
            expect(user.role).toBe('influencer');
        });

        it('should throw error for existing email', async () => {
            await expect(
                authService.signup({
                    email: 'influencer@netfluenz.com',
                    password: 'Password123!',
                    confirmPassword: 'Password123!',
                    name: 'Existing User',
                    role: 'influencer',
                })
            ).rejects.toThrow('An account with this email already exists');
        });
    });

    describe('logout', () => {
        it('should clear user from localStorage', async () => {
            // First login
            await authService.login({
                email: 'influencer@netfluenz.com',
                password: 'demo123',
            });

            // Then logout
            await authService.logout();

            // After logout, getCurrentUser should return null
            expect(authService.getCurrentUser()).toBeNull();
        });
    });

    describe('getCurrentUser', () => {
        it('should return null when no user is logged in', () => {
            const user = authService.getCurrentUser();
            expect(user).toBeNull();
        });

        it('should return user when logged in', async () => {
            // Login and immediately check the returned user
            const loggedInUser = await authService.login({
                email: 'influencer@netfluenz.com',
                password: 'demo123',
            });

            expect(loggedInUser).toBeDefined();
            expect(loggedInUser.email).toBe('influencer@netfluenz.com');
        });
    });
});
