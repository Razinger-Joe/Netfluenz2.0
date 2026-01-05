import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

// Layout
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminSidebar } from './components/admin/AdminSidebar';

// Public Pages
import { Home } from './pages/Home';
import { Login } from './pages/Auth/Login';
import { Signup } from './pages/Auth/Signup';
import { Pricing } from './pages/Pricing';
import { InfluencerMarketplace } from './pages/InfluencerMarketplace';

// Protected Pages
import { Dashboard } from './pages/Dashboard';
import { Messages } from './pages/Messages';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UserManagement } from './pages/admin/UserManagement';

// Placeholder pages
const Campaigns = () => <div className="p-8">Campaigns - Coming Soon</div>;
const Profile = () => <div className="p-8">Profile - Coming Soon</div>;
const Settings = () => <div className="p-8">Settings - Coming Soon</div>;
const CreateCampaign = () => <div className="p-8">Create Campaign - Coming Soon</div>;
const CampaignDetails = () => <div className="p-8">Campaign Details - Coming Soon</div>;
const NotFound = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-200 mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-4">Page not found</p>
            <a href="/" className="text-orange-600 hover:text-orange-700">Go home →</a>
        </div>
    </div>
);

// Admin Layout wrapper
const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 bg-gray-50">{children}</main>
    </div>
);

function App() {
    return (
        <>
            <Toaster position="top-right" richColors />
            <Routes>
                {/* Public Routes with Layout */}
                <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/marketplace" element={<InfluencerMarketplace />} />
                    <Route path="/campaigns" element={<Campaigns />} />
                    <Route path="/pricing" element={<Pricing />} />
                </Route>

                {/* Auth Routes (no header/footer) */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected Routes with Layout */}
                <Route element={<Layout />}>
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/messages"
                        element={
                            <ProtectedRoute>
                                <Messages />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/settings"
                        element={
                            <ProtectedRoute>
                                <Settings />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/campaigns/create"
                        element={
                            <ProtectedRoute allowedRoles={['brand', 'admin']}>
                                <CreateCampaign />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/campaigns/:id"
                        element={
                            <ProtectedRoute>
                                <CampaignDetails />
                            </ProtectedRoute>
                        }
                    />
                </Route>

                {/* Admin Routes */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminLayout>
                                <AdminDashboard />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/users"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminLayout>
                                <UserManagement />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/*"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminLayout>
                                <div className="p-6">Admin section coming soon</div>
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
}

export default App;
