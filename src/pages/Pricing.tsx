import React from 'react';
import { pricingPlans } from '../services/payments';
import { Check } from 'lucide-react';
import { cn } from '../lib/utils';

export const Pricing: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Simple, Transparent Pricing
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Choose the perfect plan for your influencer marketing needs.
                        All plans include access to our marketplace and basic features.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {pricingPlans.map((plan) => (
                        <div
                            key={plan.id}
                            className={cn(
                                'relative bg-white rounded-2xl border-2 p-6 flex flex-col',
                                plan.popular
                                    ? 'border-orange-500 shadow-xl scale-105'
                                    : 'border-gray-100 shadow-sm'
                            )}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <span className="px-4 py-1 bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-sm font-medium rounded-full">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                                <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
                            </div>

                            <div className="mb-6">
                                <div className="flex items-baseline">
                                    <span className="text-3xl font-bold text-gray-900">
                                        {plan.price === 0 ? 'Free' : `${plan.currency} ${plan.price.toLocaleString()}`}
                                    </span>
                                    {plan.price > 0 && (
                                        <span className="text-gray-500 ml-2">/{plan.interval}</span>
                                    )}
                                </div>
                            </div>

                            <ul className="space-y-3 mb-8 flex-1">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-sm text-gray-600">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                className={cn(
                                    'w-full py-3 px-4 rounded-lg font-medium transition-all',
                                    plan.popular
                                        ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:shadow-lg'
                                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                )}
                            >
                                {plan.price === 0 ? 'Get Started' : 'Subscribe'}
                            </button>
                        </div>
                    ))}
                </div>

                {/* M-Pesa Banner */}
                <div className="mt-16 bg-gradient-to-r from-green-600 to-green-500 rounded-2xl p-8 text-white text-center">
                    <h3 className="text-2xl font-bold mb-2">Pay with M-Pesa</h3>
                    <p className="text-green-100 max-w-xl mx-auto">
                        We accept M-Pesa payments for all subscription plans.
                        Experience seamless, secure payments powered by Kenya's favorite mobile money.
                    </p>
                </div>

                {/* FAQ Section */}
                <div className="mt-16">
                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
                        Frequently Asked Questions
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {[
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
                        ].map((faq, i) => (
                            <div key={i} className="bg-white rounded-xl p-6 border border-gray-100">
                                <h4 className="font-semibold text-gray-900 mb-2">{faq.q}</h4>
                                <p className="text-sm text-gray-600">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
