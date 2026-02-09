import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types/auth';
import { Clock, ShieldCheck, ArrowLeft } from 'lucide-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
}

/**
 * Protected route component that requires authentication.
 * If the user is authenticated but not approved, shows a pending approval screen.
 * Optionally restricts access to specific user roles.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    allowedRoles,
}) => {
    const { isAuthenticated, user, isLoading, isApproved } = useAuth();
    const location = useLocation();

    // Loading spinner
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen gradient-mesh">
                <div className="text-center">
                    <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-primary border-r-transparent" />
                    <p className="mt-4 text-muted-foreground text-sm">Authenticating...</p>
                </div>
            </div>
        );
    }

    // Not logged in → redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Authenticated but NOT approved → show pending screen
    // Admins bypass approval check
    if (!isApproved && user?.role !== 'admin') {
        return (
            <div className="flex items-center justify-center min-h-[80vh] gradient-mesh px-4">
                <div className="glass-card-strong rounded-3xl p-10 max-w-md w-full text-center animate-scale-in">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                        <Clock className="h-10 w-10 text-white" />
                    </div>

                    <h2 className="text-2xl font-bold text-foreground mb-3">
                        Pending Approval
                    </h2>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                        Your account has been created successfully! An admin will review and approve your account shortly.
                        You'll be notified once your account is activated.
                    </p>

                    <div className="glass-card rounded-xl p-4 mb-6">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="w-5 h-5 text-secondary" />
                            <p className="text-sm text-muted-foreground text-left">
                                We verify all users to ensure platform quality and security.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => window.location.href = '/'}
                        className="flex items-center gap-2 mx-auto px-6 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    // Role-based access check
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return (
            <div className="flex items-center justify-center min-h-[80vh] gradient-mesh px-4">
                <div className="glass-card-strong rounded-3xl p-10 max-w-md w-full text-center animate-scale-in">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/20">
                        <ShieldCheck className="h-10 w-10 text-white" />
                    </div>

                    <h2 className="text-2xl font-bold text-foreground mb-3">
                        Access Denied
                    </h2>
                    <p className="text-muted-foreground mb-6">
                        You don't have permission to access this page.
                    </p>

                    <button
                        onClick={() => window.history.back()}
                        className="px-6 py-2.5 text-sm font-semibold text-white gradient-hero rounded-xl hover:shadow-lg transition-all duration-300"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};
