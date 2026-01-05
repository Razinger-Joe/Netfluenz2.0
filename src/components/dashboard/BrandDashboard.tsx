import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { StatCard } from '../stats/StatCard';
import { EarningsChart } from '../charts/EarningsChart';
import { EngagementChart } from '../charts/EngagementChart';
import { CampaignCard } from '../campaign/CampaignCard';
import { DollarSign, Users, Target, TrendingUp, Plus } from 'lucide-react';
import { campaignService, applicationService } from '../../services/campaigns';
import { Campaign, CampaignApplication } from '../../types/campaign';
import { Link } from 'react-router-dom';

export const BrandDashboard: React.FC = () => {
    const { user } = useAuth();
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [applications, setApplications] = useState<CampaignApplication[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            if (!user) return;
            try {
                const campaignData = await campaignService.getByBrandId(user.id);
                setCampaigns(campaignData);

                // Get applications for all campaigns
                const allApps = await Promise.all(
                    campaignData.map(c => applicationService.getByCampaignId(c.id))
                );
                setApplications(allApps.flat());
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [user]);

    const activeCampaigns = campaigns.filter(c => c.status === 'active');
    const totalSpent = campaigns.reduce((sum, c) => sum + c.budget.spent, 0);
    const totalBudget = campaigns.reduce((sum, c) => sum + c.budget.total, 0);
    const pendingApps = applications.filter(a => a.status === 'pending');

    // Mock ROI data
    const roiData = [
        { date: 'Jan', earnings: 180, previousPeriod: 150 },
        { date: 'Feb', earnings: 220, previousPeriod: 180 },
        { date: 'Mar', earnings: 195, previousPeriod: 200 },
        { date: 'Apr', earnings: 280, previousPeriod: 220 },
        { date: 'May', earnings: 310, previousPeriod: 250 },
        { date: 'Jun', earnings: 350, previousPeriod: 280 },
    ];

    const campaignPerformance = [
        { name: 'Impressions', value: 2500000 },
        { name: 'Reach', value: 1800000 },
        { name: 'Engagement', value: 450000 },
        { name: 'Clicks', value: 125000 },
    ];

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Welcome back, {user?.name?.split(' ')[0]}! 📊
                    </h1>
                    <p className="text-gray-500 mt-1">Manage your influencer campaigns</p>
                </div>
                <Link
                    to="/campaigns/create"
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-medium rounded-lg hover:shadow-lg transition-all"
                >
                    <Plus className="w-5 h-5" />
                    New Campaign
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Campaigns"
                    value={campaigns.length}
                    change={8}
                    changeLabel="vs last month"
                    icon={Target}
                />
                <StatCard
                    title="Active Campaigns"
                    value={activeCampaigns.length}
                    icon={TrendingUp}
                />
                <StatCard
                    title="Budget Spent"
                    value={`KES ${(totalSpent / 1000).toFixed(0)}K`}
                    change={-12}
                    changeLabel={`of ${(totalBudget / 1000).toFixed(0)}K`}
                    icon={DollarSign}
                />
                <StatCard
                    title="Pending Applications"
                    value={pendingApps.length}
                    icon={Users}
                />
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">ROI Trend (%)</h3>
                    <EarningsChart data={roiData} showComparison currency="%" />
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Performance</h3>
                    <EngagementChart data={campaignPerformance} horizontal />
                </div>
            </div>

            {/* Campaigns Section */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Your Campaigns</h3>
                    <Link to="/campaigns" className="text-sm text-orange-600 hover:text-orange-700">
                        View all →
                    </Link>
                </div>
                {campaigns.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
                        <p className="text-gray-500 mb-4">No campaigns yet</p>
                        <Link
                            to="/campaigns/create"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                        >
                            <Plus className="w-4 h-4" />
                            Create your first campaign
                        </Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {campaigns.slice(0, 3).map((campaign) => (
                            <CampaignCard key={campaign.id} campaign={campaign} />
                        ))}
                    </div>
                )}
            </div>

            {/* Recent Applications */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Applications</h3>
                {applications.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No applications received yet</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
                                    <th className="pb-3 font-medium">Influencer</th>
                                    <th className="pb-3 font-medium">Proposed Rate</th>
                                    <th className="pb-3 font-medium">Status</th>
                                    <th className="pb-3 font-medium">Date</th>
                                    <th className="pb-3 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.slice(0, 5).map((app) => (
                                    <tr key={app.id} className="border-b border-gray-50 last:border-0">
                                        <td className="py-3">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={app.influencerAvatar}
                                                    alt={app.influencerName}
                                                    className="w-8 h-8 rounded-full"
                                                />
                                                <span className="font-medium text-gray-900">{app.influencerName}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 text-gray-600">
                                            KES {app.proposedRate.toLocaleString()}
                                        </td>
                                        <td className="py-3">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                                    app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="py-3 text-gray-500 text-sm">
                                            {new Date(app.submittedAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-3">
                                            <button className="text-sm text-orange-600 hover:text-orange-700">
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};
