import React, { useState } from 'react';
import { StatCard } from '../components/stats/StatCard';
import { EarningsChart } from '../components/charts/EarningsChart';
import { EngagementChart } from '../components/charts/EngagementChart';
import { PlatformPieChart } from '../components/charts/PlatformPieChart';
import { PerformanceAreaChart } from '../components/charts/PerformanceAreaChart';
import { ConversionFunnelChart } from '../components/charts/ConversionFunnelChart';
import { ContentTypeRadarChart } from '../components/charts/ContentTypeRadarChart';
import {
    TrendingUp, Eye, DollarSign, Users, BarChart3,
    ArrowUpRight, ArrowDownRight, Calendar
} from 'lucide-react';
import * as Tabs from '@radix-ui/react-tabs';
import { cn } from '../lib/utils';

// ─── Mock Data ──────────────────────────────────────────────────────────────────

const earningsData = [
    { date: 'Jul', earnings: 45000, previousPeriod: 38000 },
    { date: 'Aug', earnings: 52000, previousPeriod: 42000 },
    { date: 'Sep', earnings: 48000, previousPeriod: 45000 },
    { date: 'Oct', earnings: 61000, previousPeriod: 48000 },
    { date: 'Nov', earnings: 72000, previousPeriod: 55000 },
    { date: 'Dec', earnings: 85000, previousPeriod: 62000 },
    { date: 'Jan', earnings: 78000, previousPeriod: 68000 },
    { date: 'Feb', earnings: 92000, previousPeriod: 75000 },
];

const platformAudience = [
    { name: 'Instagram', value: 125000, color: '#E4405F' },
    { name: 'TikTok', value: 89000, color: '#000000' },
    { name: 'YouTube', value: 67000, color: '#FF0000' },
    { name: 'Twitter', value: 45000, color: '#1DA1F2' },
    { name: 'LinkedIn', value: 23000, color: '#0A66C2' },
];

const performanceData = [
    { date: 'Week 1', impressions: 820000, reach: 540000, engagement: 42000 },
    { date: 'Week 2', impressions: 950000, reach: 610000, engagement: 58000 },
    { date: 'Week 3', impressions: 1100000, reach: 720000, engagement: 65000 },
    { date: 'Week 4', impressions: 880000, reach: 580000, engagement: 48000 },
    { date: 'Week 5', impressions: 1250000, reach: 830000, engagement: 72000 },
    { date: 'Week 6', impressions: 1400000, reach: 920000, engagement: 85000 },
    { date: 'Week 7', impressions: 1180000, reach: 780000, engagement: 69000 },
    { date: 'Week 8', impressions: 1520000, reach: 1010000, engagement: 94000 },
];

const funnelData = [
    { name: 'Impressions', value: 2500000, color: '#EC4899' },
    { name: 'Reach', value: 1650000, color: '#39FF14' },
    { name: 'Engagement', value: 385000, color: '#22c55e' },
    { name: 'Clicks', value: 125000, color: '#3b82f6' },
    { name: 'Conversions', value: 18500, color: '#8b5cf6' },
];

const contentPerformance = [
    { subject: 'Reels', current: 88, benchmark: 72 },
    { subject: 'Stories', current: 65, benchmark: 58 },
    { subject: 'Posts', current: 72, benchmark: 70 },
    { subject: 'Videos', current: 82, benchmark: 65 },
    { subject: 'Carousels', current: 78, benchmark: 60 },
    { subject: 'Live', current: 55, benchmark: 45 },
];

const topContentData = [
    { name: 'Reels', value: 45000 },
    { name: 'Stories', value: 32000 },
    { name: 'Posts', value: 28000 },
    { name: 'Carousels', value: 22000 },
    { name: 'Videos', value: 18000 },
    { name: 'Live', value: 8000 },
];

const bestPostingTimes = [
    { day: 'Mon', time: '9 AM', engagement: 1200 },
    { day: 'Mon', time: '6 PM', engagement: 2400 },
    { day: 'Tue', time: '12 PM', engagement: 1800 },
    { day: 'Wed', time: '3 PM', engagement: 2100 },
    { day: 'Thu', time: '9 AM', engagement: 1500 },
    { day: 'Thu', time: '7 PM', engagement: 2800 },
    { day: 'Fri', time: '11 AM', engagement: 2200 },
    { day: 'Sat', time: '10 AM', engagement: 3200 },
    { day: 'Sun', time: '2 PM', engagement: 2600 },
];

// ─── Component ──────────────────────────────────────────────────────────────────

export const Analytics: React.FC = () => {
    const [dateRange, setDateRange] = useState('30d');

    const dateRanges = [
        { label: '7D', value: '7d' },
        { label: '30D', value: '30d' },
        { label: '90D', value: '90d' },
        { label: '12M', value: '12m' },
    ];

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <BarChart3 className="w-7 h-7 text-orange-500" />
                        Analytics
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Track your performance across all platforms
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1">
                    {dateRanges.map((range) => (
                        <button
                            key={range.value}
                            onClick={() => setDateRange(range.value)}
                            className={cn(
                                'px-3 py-1.5 text-sm font-medium rounded-md transition-all',
                                dateRange === range.value
                                    ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            )}
                        >
                            {range.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* KPI Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Reach"
                    value="349K"
                    change={18.2}
                    changeLabel="vs last period"
                    icon={Eye}
                />
                <StatCard
                    title="Engagement Rate"
                    value="6.8%"
                    change={2.3}
                    changeLabel="vs last period"
                    icon={TrendingUp}
                />
                <StatCard
                    title="Total Earnings"
                    value="KES 553K"
                    change={24.5}
                    changeLabel="vs last period"
                    icon={DollarSign}
                />
                <StatCard
                    title="Total Followers"
                    value="349K"
                    change={5.8}
                    changeLabel="vs last period"
                    icon={Users}
                />
            </div>

            {/* Tabs for Different Analytics Views */}
            <Tabs.Root defaultValue="overview" className="space-y-6">
                <Tabs.List className="flex border-b border-gray-200 overflow-x-auto">
                    {[
                        { value: 'overview', label: 'Overview' },
                        { value: 'campaigns', label: 'Campaigns' },
                        { value: 'content', label: 'Content' },
                        { value: 'audience', label: 'Audience' },
                    ].map((tab) => (
                        <Tabs.Trigger
                            key={tab.value}
                            value={tab.value}
                            className={cn(
                                'px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                                'data-[state=active]:border-orange-500 data-[state=active]:text-orange-600',
                                'data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-700'
                            )}
                        >
                            {tab.label}
                        </Tabs.Trigger>
                    ))}
                </Tabs.List>

                {/* ── Overview Tab ────────────────────────────────────────── */}
                <Tabs.Content value="overview" className="space-y-6">
                    {/* Performance Area Chart */}
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Performance Overview
                            </h3>
                            <div className="flex items-center gap-1 text-sm text-green-600">
                                <ArrowUpRight className="w-4 h-4" />
                                <span className="font-medium">+18.2%</span>
                            </div>
                        </div>
                        <PerformanceAreaChart data={performanceData} />
                    </div>

                    {/* Row: Earnings + Platform Distribution */}
                    <div className="grid lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Earnings Trend
                            </h3>
                            <EarningsChart data={earningsData} showComparison />
                        </div>
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Audience by Platform
                            </h3>
                            <PlatformPieChart data={platformAudience} />
                        </div>
                    </div>

                    {/* Conversion Funnel */}
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Conversion Funnel
                            </h3>
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Last {dateRange === '7d' ? '7 days' : dateRange === '30d' ? '30 days' : dateRange === '90d' ? '90 days' : '12 months'}
                            </span>
                        </div>
                        <ConversionFunnelChart data={funnelData} />
                    </div>
                </Tabs.Content>

                {/* ── Campaigns Tab ───────────────────────────────────────── */}
                <Tabs.Content value="campaigns" className="space-y-6">
                    {/* Campaign Performance Metrics */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            { title: 'Active Campaigns', value: '4', change: 2, icon: '🎯' },
                            { title: 'Avg Campaign ROI', value: '342%', change: 15.3, icon: '📈' },
                            { title: 'Total Applications', value: '127', change: -5.2, icon: '📋' },
                            { title: 'Acceptance Rate', value: '68%', change: 8.1, icon: '✅' },
                            { title: 'Avg Completion Time', value: '12 days', change: -18, icon: '⏱️' },
                            { title: 'Revenue Generated', value: 'KES 1.2M', change: 32.5, icon: '💰' },
                        ].map((metric, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">{metric.title}</p>
                                        <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                                    </div>
                                    <span className="text-2xl">{metric.icon}</span>
                                </div>
                                <div className="mt-3 flex items-center gap-1">
                                    {metric.change >= 0 ? (
                                        <ArrowUpRight className="w-4 h-4 text-green-500" />
                                    ) : (
                                        <ArrowDownRight className="w-4 h-4 text-red-500" />
                                    )}
                                    <span className={cn(
                                        'text-sm font-medium',
                                        metric.change >= 0 ? 'text-green-600' : 'text-red-600'
                                    )}>
                                        {metric.change >= 0 ? '+' : ''}{metric.change}%
                                    </span>
                                    <span className="text-xs text-gray-400">vs last period</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Campaign ROI over time + Campaign breakdown */}
                    <div className="grid lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Campaign ROI Trend
                            </h3>
                            <EarningsChart
                                data={[
                                    { date: 'Jan', earnings: 180, previousPeriod: 150 },
                                    { date: 'Feb', earnings: 220, previousPeriod: 180 },
                                    { date: 'Mar', earnings: 195, previousPeriod: 200 },
                                    { date: 'Apr', earnings: 280, previousPeriod: 220 },
                                    { date: 'May', earnings: 310, previousPeriod: 250 },
                                    { date: 'Jun', earnings: 350, previousPeriod: 280 },
                                    { date: 'Jul', earnings: 420, previousPeriod: 310 },
                                    { date: 'Aug', earnings: 385, previousPeriod: 340 },
                                ]}
                                showComparison
                                currency="%"
                            />
                        </div>
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Campaign Status Breakdown
                            </h3>
                            <EngagementChart
                                data={[
                                    { name: 'Active', value: 4, color: '#22c55e' },
                                    { name: 'Draft', value: 2, color: '#39FF14' },
                                    { name: 'Completed', value: 8, color: '#3b82f6' },
                                    { name: 'Paused', value: 1, color: '#EC4899' },
                                ]}
                            />
                        </div>
                    </div>

                    {/* Top Performing Campaigns Table */}
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Top Performing Campaigns
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
                                        <th className="pb-3 font-medium">Campaign</th>
                                        <th className="pb-3 font-medium">Status</th>
                                        <th className="pb-3 font-medium">Impressions</th>
                                        <th className="pb-3 font-medium">Engagement</th>
                                        <th className="pb-3 font-medium">ROI</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { name: 'Safaricom Brand Ambassador', status: 'active', impressions: '1.2M', engagement: '6.8%', roi: '385%' },
                                        { name: 'Tusker Celebrate Culture', status: 'active', impressions: '890K', engagement: '5.2%', roi: '312%' },
                                        { name: 'KCB Youth Banking', status: 'completed', impressions: '2.1M', engagement: '4.5%', roi: '428%' },
                                        { name: 'M-PESA Go Global', status: 'active', impressions: '650K', engagement: '7.1%', roi: '295%' },
                                        { name: 'Kenya Airways Explorer', status: 'completed', impressions: '1.8M', engagement: '3.9%', roi: '267%' },
                                    ].map((campaign, i) => (
                                        <tr key={i} className="border-b border-gray-50 last:border-0">
                                            <td className="py-3 font-medium text-gray-900">{campaign.name}</td>
                                            <td className="py-3">
                                                <span className={cn(
                                                    'px-2 py-1 text-xs font-medium rounded-full capitalize',
                                                    campaign.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                                )}>
                                                    {campaign.status}
                                                </span>
                                            </td>
                                            <td className="py-3 text-gray-600">{campaign.impressions}</td>
                                            <td className="py-3 text-gray-600">{campaign.engagement}</td>
                                            <td className="py-3">
                                                <span className="text-green-600 font-semibold">{campaign.roi}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Tabs.Content>

                {/* ── Content Tab ─────────────────────────────────────────── */}
                <Tabs.Content value="content" className="space-y-6">
                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Content Type Performance Radar */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Content Type Performance
                            </h3>
                            <ContentTypeRadarChart data={contentPerformance} />
                        </div>

                        {/* Content Engagement Breakdown */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Engagement by Content Type
                            </h3>
                            <EngagementChart data={topContentData} />
                        </div>
                    </div>

                    {/* Best Posting Times Heatmap */}
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Best Posting Times
                        </h3>
                        <div className="grid grid-cols-7 gap-2">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                                <div key={day} className="text-center">
                                    <p className="text-xs font-medium text-gray-500 mb-2">{day}</p>
                                    {['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'].map((time) => {
                                        const entry = bestPostingTimes.find(
                                            (e) => e.day === day && e.time === time
                                        );
                                        const intensity = entry
                                            ? Math.min(entry.engagement / 3200, 1)
                                            : 0;
                                        return (
                                            <div
                                                key={`${day}-${time}`}
                                                className="h-8 rounded-md mb-1 flex items-center justify-center cursor-pointer transition-all hover:scale-105"
                                                style={{
                                                    backgroundColor: entry
                                                        ? `rgba(249, 115, 22, ${0.15 + intensity * 0.85})`
                                                        : '#f3f4f6',
                                                }}
                                                title={entry ? `${day} ${time}: ${entry.engagement} engagements` : `${day} ${time}`}
                                            >
                                                <span className="text-[10px] text-gray-500">
                                                    {time}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Performing Content List */}
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Top Performing Content
                        </h3>
                        <div className="space-y-4">
                            {[
                                { title: 'Safaricom 5G Launch Reel', type: 'Reel', platform: 'Instagram', views: '245K', engagement: '12.3%', earnings: 'KES 45,000' },
                                { title: 'Kenya Travel Vlog Episode 5', type: 'Video', platform: 'YouTube', views: '189K', engagement: '8.7%', earnings: 'KES 38,000' },
                                { title: 'M-PESA Tips Carousel', type: 'Carousel', platform: 'Instagram', views: '156K', engagement: '15.1%', earnings: 'KES 32,000' },
                                { title: 'Nairobi Food Guide', type: 'Post', platform: 'TikTok', views: '320K', engagement: '9.4%', earnings: 'KES 52,000' },
                            ].map((content, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-xl flex items-center justify-center text-white font-bold shadow-sm">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{content.title}</p>
                                            <p className="text-sm text-gray-500">{content.type} • {content.platform}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 text-sm">
                                        <div className="text-center">
                                            <p className="font-semibold text-gray-900">{content.views}</p>
                                            <p className="text-gray-500">Views</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="font-semibold text-green-600">{content.engagement}</p>
                                            <p className="text-gray-500">Engagement</p>
                                        </div>
                                        <div className="text-center hidden sm:block">
                                            <p className="font-semibold text-gray-900">{content.earnings}</p>
                                            <p className="text-gray-500">Earnings</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Tabs.Content>

                {/* ── Audience Tab ────────────────────────────────────────── */}
                <Tabs.Content value="audience" className="space-y-6">
                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Audience Distribution */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Audience Distribution
                            </h3>
                            <PlatformPieChart data={platformAudience} />
                        </div>

                        {/* Demographics */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Age Demographics
                            </h3>
                            <EngagementChart
                                data={[
                                    { name: '13-17', value: 12000, color: '#EC4899' },
                                    { name: '18-24', value: 89000, color: '#39FF14' },
                                    { name: '25-34', value: 125000, color: '#22c55e' },
                                    { name: '35-44', value: 78000, color: '#3b82f6' },
                                    { name: '45-54', value: 32000, color: '#8b5cf6' },
                                    { name: '55+', value: 13000, color: '#ec4899' },
                                ]}
                            />
                        </div>
                    </div>

                    {/* Growth Trend */}
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Follower Growth Trend
                        </h3>
                        <PerformanceAreaChart
                            data={[
                                { date: 'Jan', impressions: 280000, reach: 180000, engagement: 25000 },
                                { date: 'Feb', impressions: 295000, reach: 192000, engagement: 28000 },
                                { date: 'Mar', impressions: 310000, reach: 205000, engagement: 31000 },
                                { date: 'Apr', impressions: 318000, reach: 215000, engagement: 29000 },
                                { date: 'May', impressions: 325000, reach: 225000, engagement: 33000 },
                                { date: 'Jun', impressions: 332000, reach: 238000, engagement: 35000 },
                                { date: 'Jul', impressions: 340000, reach: 248000, engagement: 37000 },
                                { date: 'Aug', impressions: 349000, reach: 260000, engagement: 42000 },
                            ]}
                        />
                    </div>

                    {/* Audience Insights Grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: 'Top Country', value: 'Kenya', subtext: '68% of audience', color: 'bg-green-50 text-green-700' },
                            { label: 'Top City', value: 'Nairobi', subtext: '42% of audience', color: 'bg-blue-50 text-blue-700' },
                            { label: 'Gender Split', value: '58% / 42%', subtext: 'Female / Male', color: 'bg-purple-50 text-purple-700' },
                            { label: 'Peak Activity', value: 'Thu 7 PM', subtext: 'Highest engagement', color: 'bg-orange-50 text-orange-700' },
                        ].map((insight, i) => (
                            <div key={i} className={cn(
                                'rounded-xl p-5 border border-gray-100',
                                insight.color.split(' ')[0]
                            )}>
                                <p className="text-sm text-gray-500">{insight.label}</p>
                                <p className={cn('text-xl font-bold mt-1', insight.color.split(' ')[1])}>
                                    {insight.value}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">{insight.subtext}</p>
                            </div>
                        ))}
                    </div>
                </Tabs.Content>
            </Tabs.Root>
        </div>
    );
};
