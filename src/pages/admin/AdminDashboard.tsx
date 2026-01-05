import React, { useEffect, useState } from 'react';
import { adminService, PlatformStats } from '../../services/admin';
import { StatCard } from '../../components/stats/StatCard';
import { EarningsChart } from '../../components/charts/EarningsChart';
import { EngagementChart } from '../../components/charts/EngagementChart';
import { Users, Target, DollarSign, TrendingUp } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<PlatformStats | null>(null);
    const [analytics, setAnalytics] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [platformStats, analyticsData] = await Promise.all([
                    adminService.getPlatformStats(),
                    adminService.getAnalytics('month'),
                ]);
                setStats(platformStats);
                setAnalytics(analyticsData);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    if (isLoading || !stats) {
        return <div className="p-6">Loading...</div>;
    }

    const revenueData = analytics?.revenue?.slice(-7).map((d: any) => ({
        date: d.date,
        earnings: d.amount,
    })) || [];

    const userDistribution = [
        { name: 'Influencers', value: stats.totalInfluencers, color: '#f97316' },
        { name: 'Brands', value: stats.totalBrands, color: '#3b82f6' },
    ];

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-500 mt-1">Platform overview and metrics</p>
            </div>

            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Users"
                    value={stats.totalUsers}
                    change={stats.monthlyGrowth}
                    changeLabel="monthly growth"
                    icon={Users}
                />
                <StatCard
                    title="Total Campaigns"
                    value={stats.totalCampaigns}
                    icon={Target}
                />
                <StatCard
                    title="Active Campaigns"
                    value={stats.activeCampaigns}
                    icon={TrendingUp}
                />
                <StatCard
                    title="Platform Revenue"
                    value={`KES ${(stats.totalRevenue / 1000000).toFixed(1)}M`}
                    icon={DollarSign}
                />
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue (Last 7 Days)</h3>
                    <EarningsChart data={revenueData} />
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">User Distribution</h3>
                    <EngagementChart data={userDistribution} />
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Completed Campaigns</h4>
                    <p className="text-3xl font-bold text-gray-900">{stats.completedCampaigns}</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Total Influencers</h4>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalInfluencers}</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Total Brands</h4>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalBrands}</p>
                </div>
            </div>
        </div>
    );
};
