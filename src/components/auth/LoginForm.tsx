import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// Validation schema
const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid email address'),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .max(100, 'Password is too long'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, clearError, error: authError } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const from = (location.state as any)?.from?.pathname || '/dashboard';

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    // Clear auth errors when component unmounts
    useEffect(() => {
        return () => clearError();
    }, [clearError]);

    const onSubmit = async (data: LoginFormData) => {
        try {
            setIsSubmitting(true);
            clearError();
            await login(data);
            navigate(from, { replace: true });
        } catch (error) {
            if (error instanceof Error) {
                setError('root', { message: error.message });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const displayError = errors.root?.message || authError;

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                    <p className="text-gray-600">Sign in to your Netfluenz account</p>
                </div>

                {/* Error Alert */}
                {displayError && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800 flex items-center">
                            <svg
                                className="w-5 h-5 mr-2"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            {displayError}
                        </p>
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <input
                            {...register('email')}
                            id="email"
                            type="email"
                            autoComplete="email"
                            className={`w-full px-4 py-3 rounded-lg border ${errors.email
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                    : 'border-gray-300 focus:ring-orange-500 focus:border-orange-500'
                                } focus:ring-2 focus:outline-none transition-colors`}
                            placeholder="you@example.com"
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            {...register('password')}
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            className={`w-full px-4 py-3 rounded-lg border ${errors.password
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                    : 'border-gray-300 focus:ring-orange-500 focus:border-orange-500'
                                } focus:ring-2 focus:outline-none transition-colors`}
                            placeholder="••••••••"
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Forgot Password Link */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                Remember me
                            </label>
                        </div>
                        <Link
                            to="/forgot-password"
                            className="text-sm font-medium text-orange-600 hover:text-orange-500"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isSubmitting ? (
                            <>
                                <svg
                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                Signing in...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                {/* Demo Credentials */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs font-semibold text-blue-800 mb-2">Demo Credentials:</p>
                    <p className="text-xs text-blue-700">
                        Influencer: influencer@netfluenz.com<br />
                        Brand: brand@netfluenz.com<br />
                        Password: any password (6+ chars)
                    </p>
                </div>

                {/* Signup Link */}
                <p className="mt-6 text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link
                        to="/signup"
                        className="font-medium text-orange-600 hover:text-orange-500 transition-colors"
                    >
                        Sign up for free
                    </Link>
                </p>
            </div>
        </div>
    );
};
