import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
    Search, Plus, Target, Calendar, DollarSign, Users,
    Clock, CheckCircle, XCircle, TrendingUp
} from 'lucide-react';
import { cn } from '../lib/utils';
import * as Tabs from '@radix-ui/react-tabs';

interface Campaign {
    id: string;
    title: string;
    brand: string;
    brandAvatar: string;
    budget: string;
    status: 'draft' | 'active' | 'in_progress' | 'completed' | 'cancelled';
    applicants: number;
    deadline: string;
    category: string;
    description: string;
}

const MOCK_CAMPAIGNS: Campaign[] = [
    {
        id: '1', title: 'Safaricom Brand Ambassador', brand: 'Safaricom',
        brandAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Safaricom',
        budget: 'KES 150,000 – 300,000', status: 'active', applicants: 24,
        deadline: '2026-03-15', category: 'Tech & Telecom',
        description: 'Looking for lifestyle influencers to promote our new data bundles across Instagram and TikTok.',
    },
    {
        id: '2', title: 'Tusker Celebrate Local Culture', brand: 'East African Breweries',
        brandAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Tusker',
        budget: 'KES 200,000 – 500,000', status: 'active', applicants: 42,
        deadline: '2026-03-01', category: 'Lifestyle',
        description: 'Campaign celebrating Kenyan culture through authentic storytelling. YouTube and Instagram.',
    },
    {
        id: '3', title: 'Equity Bank Financial Literacy', brand: 'Equity Bank',
        brandAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Equity',
        budget: 'KES 100,000 – 180,000', status: 'in_progress', applicants: 8,
        deadline: '2026-02-28', category: 'Finance',
        description: 'Educating youth on saving and investing. Twitter and Instagram Reels.',
    },
    {
        id: '4', title: 'JKUAT Campus Life Series', brand: 'JKUAT',
        brandAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=JKUAT',
        budget: 'KES 50,000 – 80,000', status: 'completed', applicants: 15,
        deadline: '2026-01-30', category: 'Education',
        description: 'Showcase campus life, student experiences, and academic programs.',
    },
    {
        id: '5', title: 'Fashion Forward Nairobi', brand: 'KikoRomeo',
        brandAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=KikoRomeo',
        budget: 'KES 80,000 – 150,000', status: 'draft', applicants: 0,
        deadline: '2026-04-01', category: 'Fashion',
        description: 'Showcasing Kenyan fashion designers and sustainable style.',
    },
    {
        id: '6', title: 'Naivas Back to School', brand: 'Naivas Supermarket',
        brandAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Naivas',
        budget: 'KES 60,000 – 120,000', status: 'cancelled', applicants: 5,
        deadline: '2026-01-15', category: 'Retail',
        description: 'Back-to-school campaign promoting affordable school supplies.',
    },
];

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
    draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400', icon: Clock },
    active: { label: 'Active', color: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400', icon: CheckCircle },
    in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400', icon: TrendingUp },
    completed: { label: 'Completed', color: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400', icon: CheckCircle },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400', icon: XCircle },
};

export const Campaigns: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');

    const categories = ['all', ...new Set(MOCK_CAMPAIGNS.map(c => c.category))];

    const filterCampaigns = (status?: string) => {
        return MOCK_CAMPAIGNS.filter(c => {
            const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
                c.brand.toLowerCase().includes(search.toLowerCase());
            const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;
            const matchesStatus = !status || c.status === status;
            return matchesSearch && matchesCategory && matchesStatus;
        });
    };

    const CampaignCard: React.FC<{ campaign: Campaign }> = ({ campaign }) => {
        const status = statusConfig[campaign.status];
        const StatusIcon = status.icon;

        return (
            <div
                className="glass-card-hover rounded-2xl p-5 cursor-pointer animate-fade-in"
                onClick={() => navigate(`/campaigns/${campaign.id}`)}
            >
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <img
                            src={campaign.brandAvatar}
                            alt={campaign.brand}
                            className="w-10 h-10 rounded-xl ring-2 ring-border/30"
                        />
                        <div>
                            <h3 className="font-semibold text-foreground text-sm line-clamp-1">{campaign.title}</h3>
                            <p className="text-xs text-muted-foreground">{campaign.brand}</p>
                        </div>
                    </div>
                    <span className={cn('flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full', status.color)}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                    </span>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{campaign.description}</p>

                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5" /> {campaign.budget}
                    </span>
                    <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {new Date(campaign.deadline).toLocaleDateString()}
                    </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="w-3.5 h-3.5" />
                        <span>{campaign.applicants} applicants</span>
                    </div>
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-muted text-muted-foreground">
                        {campaign.category}
                    </span>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen gradient-mesh py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Campaigns</h1>
                        <p className="text-muted-foreground mt-1">Discover and manage influencer campaigns</p>
                    </div>
                    {user && (user.role === 'brand' || user.role === 'admin') && (
                        <button
                            onClick={() => navigate('/campaigns/create')}
                            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white gradient-hero rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                        >
                            <Plus className="w-4 h-4" /> Create Campaign
                        </button>
                    )}
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search campaigns..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 glass-input rounded-xl text-sm focus:outline-none"
                        />
                    </div>
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-4 py-2.5 glass-input rounded-xl text-sm focus:outline-none capitalize"
                    >
                        {categories.map(c => (
                            <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>
                        ))}
                    </select>
                </div>

                {/* Tabs */}
                <Tabs.Root defaultValue="all">
                    <Tabs.List className="flex gap-1 mb-6 p-1 glass-card rounded-xl w-fit overflow-x-auto">
                        {[
                            { value: 'all', label: `All (${filterCampaigns().length})` },
                            { value: 'active', label: `Active (${filterCampaigns('active').length})` },
                            { value: 'in_progress', label: `In Progress (${filterCampaigns('in_progress').length})` },
                            { value: 'completed', label: `Completed (${filterCampaigns('completed').length})` },
                        ].map((tab) => (
                            <Tabs.Trigger
                                key={tab.value}
                                value={tab.value}
                                className="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground"
                            >
                                {tab.label}
                            </Tabs.Trigger>
                        ))}
                    </Tabs.List>

                    {['all', 'active', 'in_progress', 'completed'].map((status) => (
                        <Tabs.Content key={status} value={status}>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {filterCampaigns(status === 'all' ? undefined : status).map(c => (
                                    <CampaignCard key={c.id} campaign={c} />
                                ))}
                            </div>
                            {filterCampaigns(status === 'all' ? undefined : status).length === 0 && (
                                <div className="glass-card rounded-2xl p-12 text-center">
                                    <Target className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                                    <p className="text-muted-foreground">No campaigns found</p>
                                </div>
                            )}
                        </Tabs.Content>
                    ))}
                </Tabs.Root>
            </div>
        </div>
    );
};
