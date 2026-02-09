import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
    ArrowLeft, ArrowRight, FileText, Target, DollarSign, Eye,
    Instagram, Youtube, Twitter, Hash, CheckCircle, Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../lib/utils';

const STEPS = ['Details', 'Targeting', 'Budget', 'Review'];

export const CreateCampaign: React.FC = () => {
    const navigate = useNavigate();
    const { user: _user } = useAuth();
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [form, setForm] = useState({
        title: '',
        description: '',
        category: '',
        deadline: '',
        // Targeting
        platforms: [] as string[],
        niches: [] as string[],
        minFollowers: '10000',
        location: 'Kenya',
        // Budget
        budgetMin: '',
        budgetMax: '',
        paymentType: 'fixed',
        deliverables: '',
    });

    const platformOptions = [
        { id: 'instagram', label: 'Instagram', icon: Instagram },
        { id: 'youtube', label: 'YouTube', icon: Youtube },
        { id: 'twitter', label: 'Twitter/X', icon: Twitter },
        { id: 'tiktok', label: 'TikTok', icon: Hash },
    ];

    const nicheOptions = ['Lifestyle', 'Tech', 'Fashion', 'Beauty', 'Food', 'Travel', 'Finance', 'Education', 'Health', 'Sports'];
    const categoryOptions = ['Tech & Telecom', 'Lifestyle', 'Fashion', 'Finance', 'Education', 'Retail', 'Food & Beverage', 'Health'];

    const togglePlatform = (id: string) => {
        setForm(prev => ({
            ...prev,
            platforms: prev.platforms.includes(id)
                ? prev.platforms.filter(p => p !== id)
                : [...prev.platforms, id],
        }));
    };

    const toggleNiche = (niche: string) => {
        setForm(prev => ({
            ...prev,
            niches: prev.niches.includes(niche)
                ? prev.niches.filter(n => n !== niche)
                : [...prev.niches, niche],
        }));
    };

    const canProceed = () => {
        switch (currentStep) {
            case 0: return form.title && form.description && form.category && form.deadline;
            case 1: return form.platforms.length > 0;
            case 2: return form.budgetMin && form.budgetMax;
            default: return true;
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        toast.success('Campaign created successfully!', {
            description: 'Your campaign is now in draft mode. Publish it to start receiving applications.',
        });
        navigate('/campaigns');
    };

    return (
        <div className="min-h-screen gradient-mesh py-8 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 glass-card rounded-xl hover:bg-muted/50 transition-all"
                    >
                        <ArrowLeft className="w-5 h-5 text-foreground" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Create Campaign</h1>
                        <p className="text-sm text-muted-foreground">Set up a new influencer marketing campaign</p>
                    </div>
                </div>

                {/* Step Indicator */}
                <div className="glass-card rounded-2xl p-4 mb-8">
                    <div className="flex items-center justify-between">
                        {STEPS.map((step, i) => (
                            <div key={step} className="flex items-center flex-1">
                                <div className="flex items-center gap-2">
                                    <div className={cn(
                                        'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300',
                                        i < currentStep ? 'bg-primary text-white' :
                                            i === currentStep ? 'bg-gradient-to-br from-orange-500 to-amber-400 text-white shadow-lg shadow-orange-500/20' :
                                                'bg-muted text-muted-foreground'
                                    )}>
                                        {i < currentStep ? <CheckCircle className="w-4 h-4" /> : i + 1}
                                    </div>
                                    <span className={cn(
                                        'text-sm font-medium hidden sm:block',
                                        i <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                                    )}>
                                        {step}
                                    </span>
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div className={cn(
                                        'flex-1 h-0.5 mx-3 rounded-full transition-all duration-300',
                                        i < currentStep ? 'bg-primary' : 'bg-muted'
                                    )} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Step Content */}
                <div className="glass-card-strong rounded-3xl p-6 md:p-8 animate-fade-in">
                    {/* Step 1: Details */}
                    {currentStep === 0 && (
                        <div className="space-y-5">
                            <div className="flex items-center gap-2 mb-2">
                                <FileText className="w-5 h-5 text-primary" />
                                <h2 className="text-lg font-bold text-foreground">Campaign Details</h2>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">Campaign Title *</label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    placeholder="e.g., Summer Fashion Collection Launch"
                                    className="w-full glass-input rounded-xl px-4 py-2.5 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">Description *</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    placeholder="Describe what you're looking for, campaign goals, and deliverables..."
                                    rows={4}
                                    className="w-full glass-input rounded-xl px-4 py-2.5 text-sm resize-none"
                                />
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1.5">Category *</label>
                                    <select
                                        value={form.category}
                                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                                        className="w-full glass-input rounded-xl px-4 py-2.5 text-sm"
                                    >
                                        <option value="">Select category</option>
                                        {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1.5">Deadline *</label>
                                    <input
                                        type="date"
                                        value={form.deadline}
                                        onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                                        className="w-full glass-input rounded-xl px-4 py-2.5 text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Targeting */}
                    {currentStep === 1 && (
                        <div className="space-y-5">
                            <div className="flex items-center gap-2 mb-2">
                                <Target className="w-5 h-5 text-primary" />
                                <h2 className="text-lg font-bold text-foreground">Targeting</h2>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Platforms *</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {platformOptions.map((p) => (
                                        <button
                                            key={p.id}
                                            onClick={() => togglePlatform(p.id)}
                                            className={cn(
                                                'flex items-center gap-2.5 p-3 rounded-xl transition-all duration-300 text-sm font-medium',
                                                form.platforms.includes(p.id)
                                                    ? 'bg-primary/10 text-primary ring-2 ring-primary/30'
                                                    : 'glass-card text-muted-foreground hover:bg-muted/50'
                                            )}
                                        >
                                            <p.icon className="w-5 h-5" />
                                            {p.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Preferred Niches</label>
                                <div className="flex flex-wrap gap-2">
                                    {nicheOptions.map((niche) => (
                                        <button
                                            key={niche}
                                            onClick={() => toggleNiche(niche)}
                                            className={cn(
                                                'px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300',
                                                form.niches.includes(niche)
                                                    ? 'bg-primary text-white shadow-sm'
                                                    : 'glass-card text-muted-foreground hover:bg-muted/50'
                                            )}
                                        >
                                            {niche}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1.5">Min. Followers</label>
                                    <input
                                        type="number"
                                        value={form.minFollowers}
                                        onChange={(e) => setForm({ ...form, minFollowers: e.target.value })}
                                        className="w-full glass-input rounded-xl px-4 py-2.5 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1.5">Location</label>
                                    <input
                                        type="text"
                                        value={form.location}
                                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                                        className="w-full glass-input rounded-xl px-4 py-2.5 text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Budget */}
                    {currentStep === 2 && (
                        <div className="space-y-5">
                            <div className="flex items-center gap-2 mb-2">
                                <DollarSign className="w-5 h-5 text-primary" />
                                <h2 className="text-lg font-bold text-foreground">Budget & Payment</h2>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1.5">Minimum Budget (KES) *</label>
                                    <input
                                        type="number"
                                        value={form.budgetMin}
                                        onChange={(e) => setForm({ ...form, budgetMin: e.target.value })}
                                        placeholder="e.g., 50000"
                                        className="w-full glass-input rounded-xl px-4 py-2.5 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1.5">Maximum Budget (KES) *</label>
                                    <input
                                        type="number"
                                        value={form.budgetMax}
                                        onChange={(e) => setForm({ ...form, budgetMax: e.target.value })}
                                        placeholder="e.g., 150000"
                                        className="w-full glass-input rounded-xl px-4 py-2.5 text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Payment Type</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { value: 'fixed', label: 'Fixed Price' },
                                        { value: 'milestone', label: 'Milestones' },
                                        { value: 'performance', label: 'Performance' },
                                    ].map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => setForm({ ...form, paymentType: opt.value })}
                                            className={cn(
                                                'p-3 rounded-xl text-sm font-medium transition-all duration-300',
                                                form.paymentType === opt.value
                                                    ? 'bg-primary/10 text-primary ring-2 ring-primary/30'
                                                    : 'glass-card text-muted-foreground hover:bg-muted/50'
                                            )}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">Deliverables</label>
                                <textarea
                                    value={form.deliverables}
                                    onChange={(e) => setForm({ ...form, deliverables: e.target.value })}
                                    placeholder="e.g., 3 Instagram posts, 2 Stories, 1 Reel"
                                    rows={3}
                                    className="w-full glass-input rounded-xl px-4 py-2.5 text-sm resize-none"
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 4: Review */}
                    {currentStep === 3 && (
                        <div className="space-y-5">
                            <div className="flex items-center gap-2 mb-2">
                                <Eye className="w-5 h-5 text-primary" />
                                <h2 className="text-lg font-bold text-foreground">Review Campaign</h2>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { label: 'Title', value: form.title },
                                    { label: 'Category', value: form.category },
                                    { label: 'Deadline', value: form.deadline ? new Date(form.deadline).toLocaleDateString() : '-' },
                                    { label: 'Platforms', value: form.platforms.join(', ') || '-' },
                                    { label: 'Niches', value: form.niches.join(', ') || 'Any' },
                                    { label: 'Min. Followers', value: Number(form.minFollowers).toLocaleString() },
                                    { label: 'Location', value: form.location },
                                    { label: 'Budget', value: form.budgetMin && form.budgetMax ? `KES ${Number(form.budgetMin).toLocaleString()} – ${Number(form.budgetMax).toLocaleString()}` : '-' },
                                    { label: 'Payment Type', value: form.paymentType },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                                        <span className="text-sm text-muted-foreground">{item.label}</span>
                                        <span className="text-sm font-medium text-foreground capitalize">{item.value}</span>
                                    </div>
                                ))}

                                {form.description && (
                                    <div className="glass-card rounded-xl p-4">
                                        <p className="text-xs text-muted-foreground mb-1">Description</p>
                                        <p className="text-sm text-foreground">{form.description}</p>
                                    </div>
                                )}
                                {form.deliverables && (
                                    <div className="glass-card rounded-xl p-4">
                                        <p className="text-xs text-muted-foreground mb-1">Deliverables</p>
                                        <p className="text-sm text-foreground">{form.deliverables}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/50">
                        <button
                            onClick={() => currentStep === 0 ? navigate(-1) : setCurrentStep(currentStep - 1)}
                            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-muted-foreground glass-card rounded-xl hover:bg-muted/50 transition-all"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            {currentStep === 0 ? 'Cancel' : 'Back'}
                        </button>

                        {currentStep < STEPS.length - 1 ? (
                            <button
                                onClick={() => setCurrentStep(currentStep + 1)}
                                disabled={!canProceed()}
                                className={cn(
                                    'flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300',
                                    canProceed()
                                        ? 'text-white gradient-hero hover:shadow-lg hover:-translate-y-0.5'
                                        : 'bg-muted text-muted-foreground cursor-not-allowed'
                                )}
                            >
                                Next <ArrowRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white gradient-hero rounded-xl hover:shadow-lg transition-all duration-300"
                            >
                                {isSubmitting ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</>
                                ) : (
                                    <><CheckCircle className="w-4 h-4" /> Create Campaign</>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
