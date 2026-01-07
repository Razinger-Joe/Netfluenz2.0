import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { StatCard } from '../stats/StatCard';
import { EarningsChart } from '../charts/EarningsChart';
import { EngagementChart } from '../charts/EngagementChart';
import { CampaignCard } from '../campaign/CampaignCard';
import { DollarSign, TrendingUp, Eye, Briefcase } from 'lucide-react';
import { campaignService, applicationService } from '../../services/campaigns';
import { Campaign, CampaignApplication } from '../../types/campaign';

export const InfluencerDashboard: React.FC = () => {
    const { user } = useAuth();
    const [activeCampaigns, setActiveCampaigns] = useState<Campaign[]>([]);
    const [applications, setApplications] = useState<CampaignApplication[]>([]);

    useEffect(() => {
        const loadData = async () => {
            if (!user) return;
            try {
                const [campaigns, apps] = await Promise.all([
                    campaignService.getByStatus('active'),
                    applicationService.getByInfluencerId(user.id),
                ]);
                setActiveCampaigns(campaigns.slice(0, 3));
                setApplications(apps);
            } catch (error) {
                console.error('Failed to load dashboard data:', error);
            }
        };
        loadData();
    }, [user]);

    // Mock earnings data
    const earningsData = [
        { date: 'Jan', earnings: 45000, previousPeriod: 38000 },
        { date: 'Feb', earnings: 52000, previousPeriod: 42000 },
        { date: 'Mar', earnings: 48000, previousPeriod: 45000 },
        { date: 'Apr', earnings: 61000, previousPeriod: 48000 },
        { date: 'May', earnings: 55000, previousPeriod: 52000 },
        { date: 'Jun', earnings: 67000, previousPeriod: 55000 },
    ];

    const engagementData = [
        { name: 'Instagram', value: 45000, color: '#E4405F' },
        { name: 'TikTok', value: 32000, color: '#000000' },
        { name: 'YouTube', value: 28000, color: '#FF0000' },
        { name: 'Twitter', value: 15000, color: '#1DA1F2' },
    ];

    return (
        <div className="p-6 space-y-6">
            {/* Welcome Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Welcome back, {user?.name?.split(' ')[0]}! 👋
                </h1>
                <p className="text-gray-500 mt-1">Here's your performance overview</p>
            </div>

            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Earnings"
                    value="KES 328,000"
                    change={12.5}
                    changeLabel="vs last month"
                    icon={DollarSign}
                />
                <StatCard
                    title="Engagement Rate"
                    value="6.8%"
                    change={2.3}
                    changeLabel="vs last month"
                    icon={TrendingUp}
                />
                <StatCard
                    title="Profile Views"
                    value="12,847"
                    change={-5.2}
                    changeLabel="vs last month"
                    icon={Eye}
                />
                <StatCard
                    title="Active Campaigns"
                    value={applications.filter(a => a.status === 'accepted').length}
                    icon={Briefcase}
                />
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Earnings Overview</h3>
                    <EarningsChart data={earningsData} showComparison />
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement by Platform</h3>
                    <EngagementChart data={engagementData} />
                </div>
            </div>

            {/* Active Campaigns */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Available Campaigns</h3>
                    <a href="/campaigns" className="text-sm text-orange-600 hover:text-orange-700">
                        View all →
                    </a>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeCampaigns.map((campaign) => (
                        <CampaignCard key={campaign.id} campaign={campaign} />
                    ))}
                </div>
            </div>

            {/* Recent Applications */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Applications</h3>
                {applications.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No applications yet</p>
                ) : (
                    <div className="space-y-3">
                        {applications.slice(0, 5).map((app) => (
                            <div
                                key={app.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                                <div>
                                    <p className="font-medium text-gray-900">Campaign Application</p>
                                    <p className="text-sm text-gray-500">Proposed: KES {app.proposedRate.toLocaleString()}</p>
                                </div>
                                <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                    app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                        'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {app.status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
