import React, { createContext, useState, useEffect, useCallback } from 'react';
import { LoginData, SignupData, AuthContextType, AuthState } from '../types/auth';
import { authService } from '../services/auth';

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
};

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [state, setState] = useState<AuthState>(initialState);

    // Initialize auth state on mount
    useEffect(() => {
        const initializeAuth = () => {
            try {
                const user = authService.getCurrentUser();
                setState({
                    user,
                    isAuthenticated: !!user,
                    isLoading: false,
                    error: null,
                });
            } catch (error) {
                console.error('Failed to initialize auth:', error);
                setState({
                    ...initialState,
                    isLoading: false,
                });
            }
        };

        initializeAuth();
    }, []);

    /**
     * Login user
     */
    const login = useCallback(async (data: LoginData) => {
        try {
            setState((prev) => ({ ...prev, isLoading: true, error: null }));

            const user = await authService.login(data);

            setState({
                user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Login failed';
            setState((prev) => ({
                ...prev,
                isLoading: false,
                error: message,
            }));
            throw error;
        }
    }, []);

    /**
     * Signup user
     */
    const signup = useCallback(async (data: SignupData) => {
        try {
            setState((prev) => ({ ...prev, isLoading: true, error: null }));

            const user = await authService.signup(data);

            setState({
                user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Signup failed';
            setState((prev) => ({
                ...prev,
                isLoading: false,
                error: message,
            }));
            throw error;
        }
    }, []);

    /**
     * Logout user
     */
    const logout = useCallback(async () => {
        try {
            await authService.logout();
            setState({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            });
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }, []);

    /**
     * Clear error message
     */
    const clearError = useCallback(() => {
        setState((prev) => ({ ...prev, error: null }));
    }, []);

    const value: AuthContextType = {
        ...state,
        login,
        signup,
        logout,
        clearError,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
