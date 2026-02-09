import React, { useState } from 'react';
import { pricingPlans } from '../services/payments';
import { Check, Sparkles, Zap, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

export const Pricing: React.FC = () => {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: 'Can I change plans later?',
            a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.',
        },
        {
            q: 'Is there a free trial?',
            a: 'Our Free plan lets you explore the platform. Upgrade when you need more features.',
        },
        {
            q: 'How do payments work?',
            a: 'We accept M-Pesa, card payments, and bank transfers. All payments are processed securely.',
        },
        {
            q: 'Can I cancel anytime?',
            a: 'Yes, you can cancel your subscription at any time. You\'ll retain access until the end of your billing period.',
        },
        {
            q: 'Do you offer refunds?',
            a: 'We offer a 7-day money-back guarantee on all paid plans. Contact support within 7 days of purchase.',
        },
        {
            q: 'What happens to my data if I cancel?',
            a: 'Your data is retained for 30 days after cancellation. You can export your data at any time from Settings.',
        },
    ];

    return (
        <div className="min-h-screen gradient-mesh py-16 px-4 relative overflow-hidden">
            {/* Floating orbs */}
            <div className="absolute w-80 h-80 rounded-full bg-primary/5 blur-3xl top-10 -right-20 animate-float" />
            <div className="absolute w-64 h-64 rounded-full bg-secondary/5 blur-3xl bottom-40 -left-20 animate-float" style={{ animationDelay: '2s' }} />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <Sparkles className="w-5 h-5 text-secondary animate-twinkle" />
                        <span className="text-sm font-semibold text-primary tracking-wide uppercase">Pricing</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                        Simple, <span className="text-transparent bg-clip-text gradient-hero">Transparent</span> Pricing
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Choose the perfect plan for your influencer marketing needs.
                        All plans include access to our marketplace and basic features.
                    </p>

                    {/* Billing Toggle */}
                    <div className="flex items-center justify-center gap-3 mt-6">
                        <span className={cn('text-sm font-medium', billingCycle === 'monthly' ? 'text-foreground' : 'text-muted-foreground')}>Monthly</span>
                        <button
                            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                            className="relative w-12 h-6 rounded-full bg-muted transition-colors"
                        >
                            <div className={cn(
                                'absolute top-0.5 w-5 h-5 rounded-full bg-primary shadow-md transition-transform',
                                billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0.5'
                            )} />
                        </button>
                        <span className={cn('text-sm font-medium', billingCycle === 'yearly' ? 'text-foreground' : 'text-muted-foreground')}>
                            Yearly <span className="px-1.5 py-0.5 text-xs font-bold text-green-700 bg-green-100 rounded-full ml-1">Save 20%</span>
                        </span>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {pricingPlans.map((plan, index) => {
                        const yearlyPrice = Math.round(plan.price * 0.8 * 12);
                        return (
                            <div
                                key={plan.id}
                                className={cn(
                                    'relative rounded-3xl p-6 flex flex-col transition-all duration-500 animate-fade-in',
                                    plan.popular
                                        ? 'glass-card-strong ring-2 ring-primary/30 shadow-xl shadow-primary/10 scale-[1.02] lg:scale-105'
                                        : 'glass-card-hover'
                                )}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <span className="flex items-center gap-1 px-4 py-1 text-xs font-bold text-white gradient-hero rounded-full shadow-lg">
                                            <Zap className="w-3 h-3" /> Most Popular
                                        </span>
                                    </div>
                                )}

                                <div className="mb-5">
                                    <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                                    <p className="text-xs text-muted-foreground mt-1">{plan.description}</p>
                                </div>

                                <div className="mb-5">
                                    <div className="flex items-baseline">
                                        <span className="text-3xl font-black text-foreground">
                                            {plan.price === 0
                                                ? 'Free'
                                                : `${plan.currency} ${billingCycle === 'yearly'
                                                    ? yearlyPrice.toLocaleString()
                                                    : plan.price.toLocaleString()
                                                }`}
                                        </span>
                                        {plan.price > 0 && (
                                            <span className="text-muted-foreground text-sm ml-1.5">
                                                /{billingCycle === 'yearly' ? 'year' : plan.interval}
                                            </span>
                                        )}
                                    </div>
                                    {billingCycle === 'yearly' && plan.price > 0 && (
                                        <p className="text-xs text-green-600 mt-1">
                                            Save {plan.currency} {(plan.price * 12 - yearlyPrice).toLocaleString()}/year
                                        </p>
                                    )}
                                </div>

                                <ul className="space-y-2.5 mb-8 flex-1">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-xs text-muted-foreground leading-snug">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={() => toast.success(`${plan.name} plan selected!`, { description: 'Payment integration coming soon.' })}
                                    className={cn(
                                        'w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300',
                                        plan.popular
                                            ? 'text-white gradient-hero hover:shadow-lg hover:-translate-y-0.5'
                                            : 'glass-card text-foreground hover:bg-muted/50'
                                    )}
                                >
                                    {plan.price === 0 ? 'Get Started' : 'Subscribe'}
                                    {plan.price > 0 && <ArrowRight className="w-4 h-4 inline ml-1.5" />}
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* M-Pesa Banner */}
                <div className="glass-card-strong rounded-3xl p-8 text-center mb-16 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-green-500/5 rounded-3xl" />
                    <div className="relative z-10">
                        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-green-600 flex items-center justify-center shadow-lg shadow-green-600/20">
                            <span className="text-white text-xs font-black">M-Pesa</span>
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2">Pay with M-Pesa</h3>
                        <p className="text-muted-foreground text-sm max-w-xl mx-auto">
                            We accept M-Pesa payments for all subscription plans.
                            Experience seamless, secure payments powered by Kenya's favorite mobile money.
                        </p>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-foreground">
                            Frequently Asked <span className="text-transparent bg-clip-text gradient-hero">Questions</span>
                        </h2>
                    </div>
                    <div className="space-y-3">
                        {faqs.map((faq, i) => (
                            <div key={i} className="glass-card rounded-2xl overflow-hidden">
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between p-5 text-left"
                                >
                                    <span className="font-semibold text-foreground text-sm">{faq.q}</span>
                                    {openFaq === i ? (
                                        <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                    )}
                                </button>
                                <div className={cn(
                                    'overflow-hidden transition-all duration-300',
                                    openFaq === i ? 'max-h-40 pb-5 px-5' : 'max-h-0'
                                )}>
                                    <p className="text-sm text-muted-foreground">{faq.a}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
