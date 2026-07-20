import React, { useState } from 'react';
import { EarningsChart } from '../charts/EarningsChart';
import { EngagementChart } from '../charts/EngagementChart';
import { PerformanceAreaChart } from '../charts/PerformanceAreaChart';
import { PlatformPieChart } from '../charts/PlatformPieChart';
import { ConversionFunnelChart } from '../charts/ConversionFunnelChart';
import {
    TrendingUp, Eye, DollarSign, Users, ArrowUpRight,
    ArrowDownRight, Target, Share2
} from 'lucide-react';
import { cn } from '../../lib/utils';
import * as Tabs from '@radix-ui/react-tabs';

interface CampaignAnalyticsProps {
    campaignId?: string;
    campaignTitle?: string;
}

export const CampaignAnalytics: React.FC<CampaignAnalyticsProps> = ({
    campaignTitle = 'Campaign Analytics'
}) => {
    const [period, setPeriod] = useState('30d');

    // Mock campaign-specific analytics data
    const dailyPerformance = [
        { date: 'Day 1', impressions: 45000, reach: 32000, engagement: 4200 },
        { date: 'Day 3', impressions: 68000, reach: 48000, engagement: 6800 },
        { date: 'Day 5', impressions: 92000, reach: 65000, engagement: 8500 },
        { date: 'Day 7', impressions: 85000, reach: 58000, engagement: 7200 },
        { date: 'Day 10', impressions: 120000, reach: 82000, engagement: 11000 },
        { date: 'Day 14', impressions: 145000, reach: 98000, engagement: 13500 },
        { date: 'Day 21', impressions: 135000, reach: 92000, engagement: 12200 },
        { date: 'Day 28', impressions: 158000, reach: 108000, engagement: 15800 },
    ];

    const influencerPerformance = [
        { name: 'Jane Wanjiku', value: 85000, color: '#EC4899' },
        { name: 'David Ochieng', value: 62000, color: '#39FF14' },
        { name: 'Aisha Mohamed', value: 48000, color: '#22c55e' },
        { name: 'Brian Kimani', value: 35000, color: '#3b82f6' },
        { name: 'Grace Muthoni', value: 28000, color: '#8b5cf6' },
    ];

    const platformBreakdown = [
        { name: 'Instagram', value: 145000, color: '#E4405F' },
        { name: 'TikTok', value: 98000, color: '#000000' },
        { name: 'YouTube', value: 72000, color: '#FF0000' },
        { name: 'Twitter', value: 35000, color: '#1DA1F2' },
    ];

    const funnelData = [
        { name: 'Impressions', value: 850000, color: '#EC4899' },
        { name: 'Reach', value: 540000, color: '#39FF14' },
        { name: 'Engagement', value: 125000, color: '#22c55e' },
        { name: 'Clicks', value: 42000, color: '#3b82f6' },
        { name: 'Conversions', value: 6800, color: '#8b5cf6' },
    ];

    const spendData = [
        { date: 'Week 1', earnings: 45000, previousPeriod: 0 },
        { date: 'Week 2', earnings: 82000, previousPeriod: 45000 },
        { date: 'Week 3', earnings: 125000, previousPeriod: 82000 },
        { date: 'Week 4', earnings: 180000, previousPeriod: 125000 },
    ];

    const kpis = [
        { title: 'Total Impressions', value: '850K', change: 22.5, icon: Eye },
        { title: 'Total Reach', value: '540K', change: 18.3, icon: Users },
        { title: 'Engagement Rate', value: '7.2%', change: 3.1, icon: TrendingUp },
        { title: 'Cost Per Click', value: 'KES 42', change: -12.5, icon: DollarSign },
        { title: 'Conversions', value: '6,800', change: 28.4, icon: Target },
        { title: 'Share of Voice', value: '34%', change: 5.2, icon: Share2 },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <h2 className="text-xl font-bold text-gray-900">{campaignTitle}</h2>
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                    {[
                        { label: '7D', value: '7d' },
                        { label: '30D', value: '30d' },
                        { label: 'All', value: 'all' },
                    ].map((range) => (
                        <button
                            key={range.value}
                            onClick={() => setPeriod(range.value)}
                            className={cn(
                                'px-3 py-1 text-sm font-medium rounded-md transition-all',
                                period === range.value
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                            )}
                        >
                            {range.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {kpis.map((kpi, i) => {
                    const Icon = kpi.icon;
                    return (
                        <div
                            key={i}
                            className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-gray-500">{kpi.title}</p>
                                <div className="p-2 bg-gray-50 rounded-lg">
                                    <Icon className="w-4 h-4 text-orange-500" />
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                            <div className="flex items-center gap-1 mt-1">
                                {kpi.change >= 0 ? (
                                    <ArrowUpRight className="w-3 h-3 text-green-500" />
                                ) : (
                                    <ArrowDownRight className="w-3 h-3 text-red-500" />
                                )}
                                <span className={cn(
                                    'text-xs font-medium',
                                    kpi.change >= 0 ? 'text-green-600' : 'text-red-600'
                                )}>
                                    {kpi.change >= 0 ? '+' : ''}{kpi.change}%
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Tabs */}
            <Tabs.Root defaultValue="performance" className="space-y-4">
                <Tabs.List className="flex border-b border-gray-200">
                    {[
                        { value: 'performance', label: 'Performance' },
                        { value: 'influencers', label: 'Influencers' },
                        { value: 'spend', label: 'Spend' },
                    ].map((tab) => (
                        <Tabs.Trigger
                            key={tab.value}
                            value={tab.value}
                            className={cn(
                                'px-4 py-2.5 text-sm font-medium border-b-2 transition-colors',
                                'data-[state=active]:border-orange-500 data-[state=active]:text-orange-600',
                                'data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500'
                            )}
                        >
                            {tab.label}
                        </Tabs.Trigger>
                    ))}
                </Tabs.List>

                <Tabs.Content value="performance" className="space-y-6">
                    {/* Daily Performance */}
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Performance</h3>
                        <PerformanceAreaChart data={dailyPerformance} />
                    </div>

                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Platform Breakdown */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Platform Breakdown
                            </h3>
                            <PlatformPieChart data={platformBreakdown} />
                        </div>

                        {/* Conversion Funnel */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Conversion Funnel
                            </h3>
                            <ConversionFunnelChart data={funnelData} />
                        </div>
                    </div>
                </Tabs.Content>

                <Tabs.Content value="influencers" className="space-y-6">
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Influencer Performance
                        </h3>
                        <EngagementChart data={influencerPerformance} />
                    </div>

                    {/* Influencer Breakdown Table */}
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Influencer Breakdown
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-gray-500 border-b border-gray-100">
                                        <th className="pb-3 font-medium">Influencer</th>
                                        <th className="pb-3 font-medium">Platform</th>
                                        <th className="pb-3 font-medium">Reach</th>
                                        <th className="pb-3 font-medium">Engagement</th>
                                        <th className="pb-3 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { name: 'Jane Wanjiku', avatar: 'JW', platform: 'Instagram', reach: '85K', engagement: '8.2%', status: 'completed' },
                                        { name: 'David Ochieng', avatar: 'DO', platform: 'TikTok', reach: '62K', engagement: '11.5%', status: 'in_progress' },
                                        { name: 'Aisha Mohamed', avatar: 'AM', platform: 'YouTube', reach: '48K', engagement: '6.8%', status: 'completed' },
                                        { name: 'Brian Kimani', avatar: 'BK', platform: 'Instagram', reach: '35K', engagement: '9.1%', status: 'in_progress' },
                                        { name: 'Grace Muthoni', avatar: 'GM', platform: 'TikTok', reach: '28K', engagement: '13.2%', status: 'pending' },
                                    ].map((inf, i) => (
                                        <tr key={i} className="border-b border-gray-50 last:border-0">
                                            <td className="py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-white">
                                                        {inf.avatar}
                                                    </div>
                                                    <span className="font-medium text-gray-900">{inf.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 text-gray-600">{inf.platform}</td>
                                            <td className="py-3 text-gray-600">{inf.reach}</td>
                                            <td className="py-3 font-medium text-green-600">{inf.engagement}</td>
                                            <td className="py-3">
                                                <span className={cn(
                                                    'px-2 py-1 text-xs font-medium rounded-full capitalize',
                                                    inf.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                        inf.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-yellow-100 text-yellow-700'
                                                )}>
                                                    {inf.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Tabs.Content>

                <Tabs.Content value="spend" className="space-y-6">
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Cumulative Spend
                        </h3>
                        <EarningsChart data={spendData} showComparison currency="KES" />
                    </div>

                    {/* Budget Breakdown */}
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Budget Allocation
                        </h3>
                        <div className="space-y-4">
                            {[
                                { label: 'Influencer Payments', amount: 'KES 120,000', total: 200000, spent: 120000, color: '#EC4899' },
                                { label: 'Content Production', amount: 'KES 35,000', total: 50000, spent: 35000, color: '#8b5cf6' },
                                { label: 'Platform Boost', amount: 'KES 18,000', total: 30000, spent: 18000, color: '#22c55e' },
                                { label: 'Agency Fee', amount: 'KES 7,000', total: 20000, spent: 7000, color: '#3b82f6' },
                            ].map((item, i) => (
                                <div key={i}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium text-gray-700">{item.label}</span>
                                        <span className="text-sm text-gray-500">{item.amount}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                                        <div
                                            className="h-2.5 rounded-full transition-all duration-1000"
                                            style={{
                                                width: `${(item.spent / item.total) * 100}%`,
                                                backgroundColor: item.color,
                                            }}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {((item.spent / item.total) * 100).toFixed(0)}% of KES {item.total.toLocaleString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </Tabs.Content>
            </Tabs.Root>
        </div>
    );
};
