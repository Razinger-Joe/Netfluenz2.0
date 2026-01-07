import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// Validation schema
const signupSchema = z
    .object({
        name: z
            .string()
            .min(2, 'Name must be at least 2 characters')
            .max(50, 'Name is too long'),
        email: z
            .string()
            .min(1, 'Email is required')
            .email('Please enter a valid email address'),
        password: z
            .string()
            .min(6, 'Password must be at least 6 characters')
            .max(100, 'Password is too long')
            .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
            .regex(/[0-9]/, 'Password must contain at least one number'),
        confirmPassword: z.string().min(1, 'Please confirm your password'),
        role: z.enum(['influencer', 'brand'], {
            errorMap: () => ({ message: 'Please select your account type' }),
        }),
        agreeToTerms: z.boolean().refine((val) => val === true, {
            message: 'You must agree to the terms and conditions',
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

type SignupFormData = z.infer<typeof signupSchema>;

export const SignupForm: React.FC = () => {
    const navigate = useNavigate();
    const { signup, clearError, error: authError } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        setError,
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: undefined,
            agreeToTerms: false,
        },
    });

    const password = watch('password');

    // Clear auth errors when component unmounts
    useEffect(() => {
        return () => clearError();
    }, [clearError]);

    // Calculate password strength
    useEffect(() => {
        if (!password) {
            setPasswordStrength(0);
            return;
        }

        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.length >= 10) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        setPasswordStrength(Math.min(strength, 4));
    }, [password]);

    const getStrengthColor = () => {
        switch (passwordStrength) {
            case 1:
                return 'bg-red-500';
            case 2:
                return 'bg-orange-500';
            case 3:
                return 'bg-yellow-500';
            case 4:
                return 'bg-green-500';
            default:
                return 'bg-gray-200';
        }
    };

    const getStrengthLabel = () => {
        switch (passwordStrength) {
            case 1:
                return 'Weak';
            case 2:
                return 'Fair';
            case 3:
                return 'Good';
            case 4:
                return 'Strong';
            default:
                return '';
        }
    };

    const onSubmit = async (data: SignupFormData) => {
        try {
            setIsSubmitting(true);
            clearError();
            await signup(data);
            navigate('/dashboard', { replace: true });
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
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Join Netfluenz</h2>
                    <p className="text-gray-600">Create your account to get started</p>
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

                {/* Signup Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Account Type Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            I am a...
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <label className="relative cursor-pointer">
                                <input
                                    {...register('role')}
                                    type="radio"
                                    value="influencer"
                                    className="peer sr-only"
                                />
                                <div className="px-4 py-3 rounded-lg border-2 border-gray-200 peer-checked:border-orange-500 peer-checked:bg-orange-50 hover:border-orange-300 transition-all text-center">
                                    <div className="text-2xl mb-1">🎭</div>
                                    <div className="font-semibold text-gray-900">Influencer</div>
                                    <div className="text-xs text-gray-500">Showcase talent</div>
                                </div>
                            </label>
                            <label className="relative cursor-pointer">
                                <input
                                    {...register('role')}
                                    type="radio"
                                    value="brand"
                                    className="peer sr-only"
                                />
                                <div className="px-4 py-3 rounded-lg border-2 border-gray-200 peer-checked:border-orange-500 peer-checked:bg-orange-50 hover:border-orange-300 transition-all text-center">
                                    <div className="text-2xl mb-1">🏢</div>
                                    <div className="font-semibold text-gray-900">Brand</div>
                                    <div className="text-xs text-gray-500">Find talent</div>
                                </div>
                            </label>
                        </div>
                        {errors.role && (
                            <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                        )}
                    </div>

                    {/* Name Field */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                        </label>
                        <input
                            {...register('name')}
                            id="name"
                            type="text"
                            autoComplete="name"
                            className={`w-full px-4 py-3 rounded-lg border ${errors.name
                                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                : 'border-gray-300 focus:ring-orange-500 focus:border-orange-500'
                                } focus:ring-2 focus:outline-none transition-colors`}
                            placeholder="John Doe"
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                        )}
                    </div>

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
                            autoComplete="new-password"
                            className={`w-full px-4 py-3 rounded-lg border ${errors.password
                                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                : 'border-gray-300 focus:ring-orange-500 focus:border-orange-500'
                                } focus:ring-2 focus:outline-none transition-colors`}
                            placeholder="••••••••"
                        />
                        {/* Password Strength Indicator */}
                        {password && (
                            <div className="mt-2">
                                <div className="flex items-center gap-1 mb-1">
                                    {[1, 2, 3, 4].map((level) => (
                                        <div
                                            key={level}
                                            className={`h-1 flex-1 rounded-full transition-colors ${level <= passwordStrength ? getStrengthColor() : 'bg-gray-200'
                                                }`}
                                        />
                                    ))}
                                </div>
                                {passwordStrength > 0 && (
                                    <p className="text-xs text-gray-600">
                                        Password strength: <span className="font-semibold">{getStrengthLabel()}</span>
                                    </p>
                                )}
                            </div>
                        )}
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Confirm Password Field */}
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm Password
                        </label>
                        <input
                            {...register('confirmPassword')}
                            id="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            className={`w-full px-4 py-3 rounded-lg border ${errors.confirmPassword
                                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                : 'border-gray-300 focus:ring-orange-500 focus:border-orange-500'
                                } focus:ring-2 focus:outline-none transition-colors`}
                            placeholder="••••••••"
                        />
                        {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    {/* Terms Agreement */}
                    <div>
                        <label className="flex items-start">
                            <input
                                {...register('agreeToTerms')}
                                type="checkbox"
                                className="mt-1 h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                                I agree to the{' '}
                                <Link to="/terms" className="text-orange-600 hover:text-orange-500 font-medium">
                                    Terms of Service
                                </Link>{' '}
                                and{' '}
                                <Link to="/privacy" className="text-orange-600 hover:text-orange-500 font-medium">
                                    Privacy Policy
                                </Link>
                            </span>
                        </label>
                        {errors.agreeToTerms && (
                            <p className="mt-1 text-sm text-red-600">{errors.agreeToTerms.message}</p>
                        )}
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
                                Creating account...
                            </>
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </form>

                {/* Login Link */}
                <p className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="font-medium text-orange-600 hover:text-orange-500 transition-colors"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};
