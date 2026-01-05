import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { InfluencerDashboard } from '../components/dashboard/InfluencerDashboard';
import { BrandDashboard } from '../components/dashboard/BrandDashboard';
import { Navigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }

    // Route to appropriate dashboard based on user role
    if (user.role === 'brand') {
        return <BrandDashboard />;
    }

    if (user.role === 'admin') {
        return <Navigate to="/admin" replace />;
    }

    // Default to influencer dashboard
    return <InfluencerDashboard />;
};
