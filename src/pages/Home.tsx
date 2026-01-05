import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Target, TrendingUp, Shield, Star, CheckCircle } from 'lucide-react';

export const Home: React.FC = () => {
    const stats = [
        { value: '10K+', label: 'Active Influencers' },
        { value: '500+', label: 'Brands' },
        { value: 'KES 50M+', label: 'Paid to Creators' },
        { value: '95%', label: 'Success Rate' },
    ];

    const features = [
        {
            icon: Users,
            title: 'Discover Talent',
            description: 'Find the perfect influencers for your brand from our curated network of Kenyan creators.',
        },
        {
            icon: Target,
            title: 'Launch Campaigns',
            description: 'Create and manage campaigns with detailed briefs, budgets, and performance tracking.',
        },
        {
            icon: TrendingUp,
            title: 'Track Results',
            description: 'Real-time analytics and ROI tracking to measure your campaign success.',
        },
        {
            icon: Shield,
            title: 'Secure Payments',
            description: 'Safe and secure payments via M-Pesa, cards, or bank transfer with escrow protection.',
        },
    ];

    const testimonials = [
        {
            quote: "Netfluenz helped us reach over 2 million Kenyans through influencer marketing. The ROI was incredible!",
            author: 'Sarah Mwangi',
            role: 'Marketing Director, Safaricom',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        },
        {
            quote: "As an influencer, I've earned more through Netfluenz in 6 months than I did in 2 years elsewhere.",
            author: 'Brian Otieno',
            role: 'Fashion Influencer, 150K followers',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Brian',
        },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-400 to-yellow-400 py-20 lg:py-32">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                        backgroundSize: '40px 40px'
                    }} />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                            Connect Brands with
                            <br />
                            <span className="text-yellow-200">Influential Creators</span>
                        </h1>
                        <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
                            Kenya's leading influencer marketing platform. Discover creators,
                            launch campaigns, and grow your brand with authentic partnerships.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to="/signup"
                                className="px-8 py-4 bg-white text-orange-600 font-semibold rounded-xl hover:shadow-xl transition-all flex items-center gap-2"
                            >
                                Get Started Free
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                to="/marketplace"
                                className="px-8 py-4 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-all backdrop-blur-sm"
                            >
                                Browse Influencers
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <p className="text-3xl md:text-4xl font-bold text-gray-900">{stat.value}</p>
                                <p className="text-gray-500 mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Everything You Need to Succeed
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Powerful tools for brands and creators to collaborate effectively
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow"
                            >
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                                    <feature.icon className="w-6 h-6 text-orange-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                                <p className="text-gray-600 text-sm">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            How It Works
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { step: '01', title: 'Create Your Profile', desc: 'Sign up as a brand or influencer and complete your profile.' },
                            { step: '02', title: 'Connect & Collaborate', desc: 'Brands launch campaigns, influencers apply and get selected.' },
                            { step: '03', title: 'Grow Together', desc: 'Create amazing content, track results, and get paid securely.' },
                        ].map((item, index) => (
                            <div key={index} className="relative text-center">
                                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                                <p className="text-gray-600">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Loved by Brands & Creators
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-gray-700 mb-4">"{testimonial.quote}"</p>
                                <div className="flex items-center gap-3">
                                    <img
                                        src={testimonial.avatar}
                                        alt={testimonial.author}
                                        className="w-12 h-12 rounded-full"
                                    />
                                    <div>
                                        <p className="font-semibold text-gray-900">{testimonial.author}</p>
                                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-orange-500 to-yellow-500">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Ready to Go Global?
                    </h2>
                    <p className="text-xl text-white/90 mb-8">
                        Join thousands of brands and creators already using Netfluenz
                    </p>
                    <Link
                        to="/signup"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-orange-600 font-semibold rounded-xl hover:shadow-xl transition-all"
                    >
                        Start Free Today
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </div>
    );
};
