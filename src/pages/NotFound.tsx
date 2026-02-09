import React from 'react';
import { Link } from 'react-router-dom';
import { Home as HomeIcon, ArrowLeft, Sparkles, Compass } from 'lucide-react';

export const NotFound: React.FC = () => {
    return (
        <div className="min-h-screen gradient-mesh flex items-center justify-center px-4 relative overflow-hidden">
            {/* Floating orbs */}
            <div className="absolute w-72 h-72 rounded-full bg-primary/10 blur-3xl -top-20 -left-20 animate-float" />
            <div className="absolute w-96 h-96 rounded-full bg-secondary/10 blur-3xl -bottom-32 -right-32 animate-float" style={{ animationDelay: '2s' }} />
            <div className="absolute w-40 h-40 rounded-full bg-accent/10 blur-3xl top-1/3 right-1/4 animate-float" style={{ animationDelay: '4s' }} />

            <div className="glass-card-strong rounded-3xl p-10 md:p-16 text-center max-w-lg mx-auto relative z-10 animate-scale-in">
                {/* 404 Number */}
                <div className="relative mb-6">
                    <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text gradient-hero select-none">
                        404
                    </h1>
                    <Sparkles className="absolute top-0 right-1/4 w-6 h-6 text-secondary animate-twinkle" />
                    <Compass className="absolute bottom-2 left-1/4 w-5 h-5 text-primary/40 animate-float" style={{ animationDelay: '1s' }} />
                </div>

                {/* Message */}
                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                    Page Not Found
                </h2>
                <p className="text-muted-foreground mb-8 text-sm leading-relaxed max-w-sm mx-auto">
                    The page you're looking for doesn't exist or has been moved.
                    Let's get you back on track.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
                    <Link
                        to="/"
                        className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white gradient-hero rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                    >
                        <HomeIcon className="w-4 h-4" /> Go Home
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-foreground glass-card rounded-xl hover:bg-muted/50 transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" /> Go Back
                    </button>
                </div>

                {/* Quick Links */}
                <div className="border-t border-border/30 pt-6">
                    <p className="text-xs text-muted-foreground mb-3">Or try one of these:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {[
                            { to: '/marketplace', label: 'Marketplace' },
                            { to: '/campaigns', label: 'Campaigns' },
                            { to: '/pricing', label: 'Pricing' },
                        ].map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="px-3 py-1.5 text-xs font-medium text-muted-foreground glass-card rounded-lg hover:text-foreground hover:bg-muted/50 transition-all"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
