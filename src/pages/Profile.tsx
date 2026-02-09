import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import {
    User, Mail, MapPin, Calendar, Camera, Edit2, Save, X,
    Instagram, Youtube, Twitter, Globe, LinkIcon, Star,
    TrendingUp, Users, Target, Award
} from 'lucide-react';
import { toast } from 'sonner';

export const Profile: React.FC = () => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        bio: 'Passionate content creator focused on lifestyle, tech, and African culture. Helping brands tell authentic stories. 🌍',
        location: 'Nairobi, Kenya',
        website: 'https://example.com',
        instagram: '@netfluenz',
        youtube: 'Netfluenz',
        twitter: '@netfluenz',
    });

    if (!user) return <Navigate to="/login" replace />;

    const stats = [
        { label: 'Followers', value: '125K', icon: Users, color: 'from-orange-500 to-amber-400' },
        { label: 'Engagement', value: '4.8%', icon: TrendingUp, color: 'from-teal-500 to-cyan-400' },
        { label: 'Campaigns', value: '24', icon: Target, color: 'from-violet-500 to-purple-400' },
        { label: 'Rating', value: '4.9', icon: Star, color: 'from-yellow-500 to-orange-400' },
    ];

    const portfolio = [
        { id: 1, brand: 'Safaricom', title: 'Digital Kenya Campaign', reach: '500K', type: 'Instagram' },
        { id: 2, brand: 'JKUAT', title: 'University Life Series', reach: '200K', type: 'YouTube' },
        { id: 3, brand: 'Tusker', title: 'Celebrate Local Culture', reach: '350K', type: 'TikTok' },
        { id: 4, brand: 'Equity Bank', title: 'Financial Literacy', reach: '180K', type: 'Twitter' },
    ];

    const handleSave = () => {
        setIsEditing(false);
        toast.success('Profile updated successfully!');
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData({
            name: user.name,
            bio: 'Passionate content creator focused on lifestyle, tech, and African culture. Helping brands tell authentic stories. 🌍',
            location: 'Nairobi, Kenya',
            website: 'https://example.com',
            instagram: '@netfluenz',
            youtube: 'Netfluenz',
            twitter: '@netfluenz',
        });
    };

    return (
        <div className="min-h-screen gradient-mesh py-8 px-4">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Profile Header Card */}
                <div className="glass-card-strong rounded-3xl p-8 relative overflow-hidden">
                    {/* Banner gradient */}
                    <div className="absolute top-0 left-0 right-0 h-32 gradient-hero opacity-80 rounded-t-3xl" />

                    <div className="relative z-10 flex flex-col md:flex-row items-start gap-6 pt-16">
                        {/* Avatar */}
                        <div className="relative group">
                            <img
                                src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                                alt={user.name}
                                className="w-28 h-28 rounded-2xl ring-4 ring-white shadow-xl"
                            />
                            <button
                                className="absolute bottom-2 right-2 p-2 bg-primary text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                onClick={() => toast.info('Photo upload coming with Supabase Storage')}
                            >
                                <Camera className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                                {isEditing ? (
                                    <input
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="text-2xl font-bold glass-input rounded-xl px-3 py-1"
                                    />
                                ) : (
                                    <h1 className="text-2xl font-bold text-foreground">{formData.name}</h1>
                                )}

                                <div className="flex gap-2">
                                    {isEditing ? (
                                        <>
                                            <button
                                                onClick={handleSave}
                                                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white gradient-hero rounded-xl hover:shadow-lg transition-all duration-300"
                                            >
                                                <Save className="w-4 h-4" /> Save
                                            </button>
                                            <button
                                                onClick={handleCancel}
                                                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-muted-foreground glass-card rounded-xl hover:bg-muted/50 transition-all"
                                            >
                                                <X className="w-4 h-4" /> Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-foreground glass-card rounded-xl hover:bg-muted/50 transition-all"
                                        >
                                            <Edit2 className="w-4 h-4" /> Edit Profile
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                                <span className="flex items-center gap-1 capitalize">
                                    <User className="w-4 h-4" /> {user.role}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Mail className="w-4 h-4" /> {user.email}
                                </span>
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" /> {formData.location}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" /> Joined {user.createdAt?.toLocaleDateString() || 'Jan 2024'}
                                </span>
                            </div>

                            {isEditing ? (
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    rows={3}
                                    className="w-full glass-input rounded-xl px-3 py-2 text-sm resize-none"
                                />
                            ) : (
                                <p className="text-muted-foreground text-sm leading-relaxed">{formData.bio}</p>
                            )}
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="relative z-10 flex flex-wrap gap-3 mt-6 pt-6 border-t border-border/50">
                        {[
                            { icon: Instagram, value: formData.instagram, color: 'hover:text-pink-500' },
                            { icon: Youtube, value: formData.youtube, color: 'hover:text-red-500' },
                            { icon: Twitter, value: formData.twitter, color: 'hover:text-sky-500' },
                            { icon: Globe, value: formData.website, color: 'hover:text-primary' },
                        ].map((social, i) => (
                            <button
                                key={i}
                                onClick={() => toast.info(`Opening ${social.value}`)}
                                className={`flex items-center gap-2 px-3 py-1.5 glass-card rounded-lg text-sm text-muted-foreground ${social.color} transition-colors`}
                            >
                                <social.icon className="w-4 h-4" />
                                {social.value}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((stat, i) => (
                        <div key={i} className="glass-card-hover rounded-2xl p-5 text-center">
                            <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                            <p className="text-xs text-muted-foreground font-medium mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Portfolio / Past Campaigns */}
                <div className="glass-card rounded-3xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-foreground">Campaign Portfolio</h2>
                            <p className="text-sm text-muted-foreground">Past collaborations and results</p>
                        </div>
                        <button
                            onClick={() => toast.info('Portfolio builder coming soon!')}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary glass-card rounded-lg hover:bg-primary/5 transition-colors"
                        >
                            <LinkIcon className="w-4 h-4" /> Add Work
                        </button>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        {portfolio.map((item) => (
                            <div
                                key={item.id}
                                className="glass-card-hover rounded-xl p-4 cursor-pointer"
                                onClick={() => toast.info(`Viewing ${item.title} details`)}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <p className="font-semibold text-foreground text-sm">{item.title}</p>
                                        <p className="text-xs text-muted-foreground">{item.brand}</p>
                                    </div>
                                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary">
                                        {item.type}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 text-sm">
                                    <Award className="w-3.5 h-3.5 text-secondary" />
                                    <span className="text-muted-foreground">{item.reach} reach</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
