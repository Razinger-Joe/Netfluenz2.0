import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
import { InfluencerOnboarding } from './pages/InfluencerOnboarding';
import { Campaigns } from './pages/Campaigns';

// Protected Pages
import { Dashboard } from './pages/Dashboard';
import { Messages } from './pages/Messages';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { CreateCampaign } from './pages/CreateCampaign';
import { CampaignDetails } from './pages/CampaignDetails';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UserManagement } from './pages/admin/UserManagement';

// Error Pages
import { NotFound } from './pages/NotFound';

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
                    <Route path="/onboarding" element={<InfluencerOnboarding />} />
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
