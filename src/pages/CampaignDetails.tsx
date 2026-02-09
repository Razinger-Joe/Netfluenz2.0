import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
    ArrowLeft, Calendar, DollarSign, Users, MapPin, Target,
    CheckCircle, Send, Star, TrendingUp, Eye, MessageSquare,
    Instagram, Youtube, Twitter, Share2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import * as Tabs from '@radix-ui/react-tabs';

// Mock campaign data
const CAMPAIGNS_DATA: Record<string, any> = {
    '1': {
        id: '1', title: 'Safaricom Brand Ambassador', brand: 'Safaricom',
        brandAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Safaricom',
        budget: 'KES 150,000 – 300,000', status: 'active', applicants: 24,
        deadline: '2026-03-15', category: 'Tech & Telecom', location: 'Kenya',
        description: 'Looking for lifestyle influencers to promote our new data bundles across Instagram and TikTok. We want authentic content creators who can showcase how Safaricom data keeps them connected to what matters most.',
        deliverables: ['3 Instagram Reels', '5 Instagram Stories', '2 TikTok Videos', '1 YouTube Integration'],
        platforms: ['instagram', 'tiktok', 'youtube'],
        requirements: ['Min 50K followers', 'Based in Kenya', 'Lifestyle or Tech niche', '3%+ engagement rate'],
    },
    '2': {
        id: '2', title: 'Tusker Celebrate Local Culture', brand: 'East African Breweries',
        brandAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Tusker',
        budget: 'KES 200,000 – 500,000', status: 'active', applicants: 42,
        deadline: '2026-03-01', category: 'Lifestyle', location: 'East Africa',
        description: 'Campaign celebrating Kenyan culture through authentic storytelling. We\'re looking for creators who can share genuine stories about what makes Kenyan culture special.',
        deliverables: ['2 YouTube Videos (5-10 min)', '4 Instagram Posts', '6 Stories'],
        platforms: ['youtube', 'instagram'],
        requirements: ['Min 100K followers', 'Cultural/Lifestyle niche', 'Based in East Africa'],
    },
};

// Default fallback for unknown IDs
const DEFAULT_CAMPAIGN = {
    id: '0', title: 'Sample Campaign', brand: 'Netfluenz',
    brandAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Netfluenz',
    budget: 'KES 100,000 – 200,000', status: 'active', applicants: 10,
    deadline: '2026-04-01', category: 'General', location: 'Kenya',
    description: 'This is a sample campaign for demonstration purposes.',
    deliverables: ['3 Social Media Posts', '2 Stories'],
    platforms: ['instagram'],
    requirements: ['Min 10K followers'],
};

const MOCK_APPLICANTS = [
    { id: 'a1', name: 'Jane Wanjiku', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane', followers: '85K', engagement: '4.2%', status: 'pending', rating: 4.8 },
    { id: 'a2', name: 'Kevin Ochieng', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kevin', followers: '120K', engagement: '5.1%', status: 'accepted', rating: 4.9 },
    { id: 'a3', name: 'Amina Hassan', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amina', followers: '65K', engagement: '6.3%', status: 'pending', rating: 4.7 },
    { id: 'a4', name: 'Brian Kiprop', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Brian', followers: '200K', engagement: '3.8%', status: 'rejected', rating: 4.5 },
];

const platformIcons: Record<string, React.ElementType> = {
    instagram: Instagram,
    youtube: Youtube,
    twitter: Twitter,
    tiktok: Target,
};

export const CampaignDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [hasApplied, setHasApplied] = useState(false);

    const campaign = CAMPAIGNS_DATA[id || ''] || { ...DEFAULT_CAMPAIGN, id, title: `Campaign #${id}` };

    const handleApply = () => {
        setHasApplied(true);
        toast.success('Application submitted!', {
            description: 'The brand will review your profile and respond within 48 hours.',
        });
    };

    const handleApplicantAction = (_applicantId: string, action: 'accept' | 'reject') => {
        toast.success(`Applicant ${action === 'accept' ? 'accepted' : 'rejected'}!`);
    };

    return (
        <div className="min-h-screen gradient-mesh py-8 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1.5 px-3 py-1.5 mb-6 text-sm font-medium text-muted-foreground glass-card rounded-xl hover:bg-muted/50 transition-all"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Campaigns
                </button>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Campaign Header */}
                        <div className="glass-card-strong rounded-3xl p-6 md:p-8">
                            <div className="flex items-start gap-4 mb-6">
                                <img
                                    src={campaign.brandAvatar}
                                    alt={campaign.brand}
                                    className="w-14 h-14 rounded-2xl ring-2 ring-border/30"
                                />
                                <div className="flex-1">
                                    <h1 className="text-xl md:text-2xl font-bold text-foreground">{campaign.title}</h1>
                                    <p className="text-muted-foreground">{campaign.brand}</p>
                                </div>
                                <button
                                    onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }}
                                    className="p-2 glass-card rounded-xl hover:bg-muted/50 transition-all"
                                >
                                    <Share2 className="w-4 h-4 text-muted-foreground" />
                                </button>
                            </div>

                            <p className="text-muted-foreground text-sm leading-relaxed mb-6">{campaign.description}</p>

                            {/* Meta Row */}
                            <div className="flex flex-wrap gap-4 text-sm">
                                <span className="flex items-center gap-1.5 text-muted-foreground">
                                    <DollarSign className="w-4 h-4 text-primary" /> {campaign.budget}
                                </span>
                                <span className="flex items-center gap-1.5 text-muted-foreground">
                                    <Calendar className="w-4 h-4 text-primary" /> {new Date(campaign.deadline).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1.5 text-muted-foreground">
                                    <MapPin className="w-4 h-4 text-primary" /> {campaign.location}
                                </span>
                                <span className="flex items-center gap-1.5 text-muted-foreground">
                                    <Users className="w-4 h-4 text-primary" /> {campaign.applicants} applicants
                                </span>
                            </div>
                        </div>

                        {/* Tabs: Details & Applicants */}
                        <Tabs.Root defaultValue="details">
                            <Tabs.List className="flex gap-1 p-1 glass-card rounded-xl w-fit mb-4">
                                <Tabs.Trigger
                                    value="details"
                                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:text-muted-foreground"
                                >
                                    Details
                                </Tabs.Trigger>
                                <Tabs.Trigger
                                    value="applicants"
                                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:text-muted-foreground"
                                >
                                    Applicants ({campaign.applicants})
                                </Tabs.Trigger>
                            </Tabs.List>

                            <Tabs.Content value="details" className="space-y-4">
                                {/* Deliverables */}
                                <div className="glass-card rounded-2xl p-6">
                                    <h3 className="text-sm font-bold text-foreground mb-3">Deliverables</h3>
                                    <ul className="space-y-2">
                                        {campaign.deliverables.map((d: string, i: number) => (
                                            <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                {d}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Requirements */}
                                <div className="glass-card rounded-2xl p-6">
                                    <h3 className="text-sm font-bold text-foreground mb-3">Requirements</h3>
                                    <ul className="space-y-2">
                                        {campaign.requirements.map((r: string, i: number) => (
                                            <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Target className="w-4 h-4 text-primary flex-shrink-0" />
                                                {r}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Platforms */}
                                <div className="glass-card rounded-2xl p-6">
                                    <h3 className="text-sm font-bold text-foreground mb-3">Platforms</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {campaign.platforms.map((p: string) => {
                                            const Icon = platformIcons[p] || Target;
                                            return (
                                                <span
                                                    key={p}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 glass-card-hover rounded-lg text-sm text-foreground capitalize"
                                                >
                                                    <Icon className="w-4 h-4" /> {p}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                            </Tabs.Content>

                            <Tabs.Content value="applicants">
                                <div className="space-y-3">
                                    {MOCK_APPLICANTS.map((applicant) => (
                                        <div key={applicant.id} className="glass-card-hover rounded-2xl p-4">
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={applicant.avatar}
                                                    alt={applicant.name}
                                                    className="w-12 h-12 rounded-xl ring-2 ring-border/30"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-foreground text-sm">{applicant.name}</p>
                                                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                                                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {applicant.followers}</span>
                                                        <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> {applicant.engagement}</span>
                                                        <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-500" /> {applicant.rating}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {applicant.status === 'pending' && (user?.role === 'brand' || user?.role === 'admin') ? (
                                                        <>
                                                            <button
                                                                onClick={() => handleApplicantAction(applicant.id, 'accept')}
                                                                className="px-3 py-1.5 text-xs font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                                                            >
                                                                Accept
                                                            </button>
                                                            <button
                                                                onClick={() => handleApplicantAction(applicant.id, 'reject')}
                                                                className="px-3 py-1.5 text-xs font-medium text-muted-foreground glass-card rounded-lg hover:bg-muted/50 transition-colors"
                                                            >
                                                                Decline
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <span className={cn(
                                                            'px-2.5 py-1 text-xs font-semibold rounded-full capitalize',
                                                            applicant.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                                                applicant.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                                    'bg-yellow-100 text-yellow-700'
                                                        )}>
                                                            {applicant.status}
                                                        </span>
                                                    )}
                                                    <button
                                                        onClick={() => { navigate('/messages'); toast.info(`Opening chat with ${applicant.name}`); }}
                                                        className="p-2 glass-card rounded-lg hover:bg-muted/50 transition-all"
                                                    >
                                                        <MessageSquare className="w-4 h-4 text-muted-foreground" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Tabs.Content>
                        </Tabs.Root>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        {/* Apply Card */}
                        <div className="glass-card-strong rounded-2xl p-6 sticky top-24">
                            <div className="text-center mb-4">
                                <p className="text-2xl font-bold text-foreground">{campaign.budget}</p>
                                <p className="text-xs text-muted-foreground mt-1">Campaign Budget</p>
                            </div>

                            {user?.role === 'influencer' || !user ? (
                                <button
                                    onClick={hasApplied ? undefined : handleApply}
                                    disabled={hasApplied}
                                    className={cn(
                                        'w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300',
                                        hasApplied
                                            ? 'bg-green-100 text-green-700 cursor-default'
                                            : 'text-white gradient-hero hover:shadow-lg hover:-translate-y-0.5'
                                    )}
                                >
                                    {hasApplied ? (
                                        <span className="flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4" /> Applied</span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2"><Send className="w-4 h-4" /> Apply Now</span>
                                    )}
                                </button>
                            ) : (
                                <button
                                    onClick={() => toast.info('Campaign management tools coming soon!')}
                                    className="w-full py-3 rounded-xl font-semibold text-sm text-white gradient-hero hover:shadow-lg transition-all duration-300"
                                >
                                    <span className="flex items-center justify-center gap-2"><Eye className="w-4 h-4" /> Manage Campaign</span>
                                </button>
                            )}

                            <div className="mt-4 space-y-3 text-sm">
                                <div className="flex items-center justify-between py-2 border-b border-border/30">
                                    <span className="text-muted-foreground">Category</span>
                                    <span className="font-medium text-foreground">{campaign.category}</span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-border/30">
                                    <span className="text-muted-foreground">Status</span>
                                    <span className="font-medium text-foreground capitalize">{campaign.status}</span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-border/30">
                                    <span className="text-muted-foreground">Applicants</span>
                                    <span className="font-medium text-foreground">{campaign.applicants}</span>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <span className="text-muted-foreground">Deadline</span>
                                    <span className="font-medium text-foreground">{new Date(campaign.deadline).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Brand Contact */}
                        <div className="glass-card rounded-2xl p-5">
                            <h3 className="text-sm font-bold text-foreground mb-3">About {campaign.brand}</h3>
                            <div className="flex items-center gap-3 mb-3">
                                <img src={campaign.brandAvatar} alt={campaign.brand} className="w-10 h-10 rounded-xl" />
                                <div>
                                    <p className="font-semibold text-foreground text-sm">{campaign.brand}</p>
                                    <p className="text-xs text-muted-foreground">Verified Brand</p>
                                </div>
                            </div>
                            <button
                                onClick={() => { navigate('/messages'); toast.info(`Opening chat with ${campaign.brand}`); }}
                                className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-primary glass-card rounded-xl hover:bg-primary/5 transition-all"
                            >
                                <MessageSquare className="w-4 h-4" /> Contact Brand
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
