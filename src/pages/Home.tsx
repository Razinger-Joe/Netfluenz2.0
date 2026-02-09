import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Users, TrendingUp, BarChart3, Shield, Zap, Globe, ArrowRight, Sparkles, Star } from "lucide-react";

export const Home = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: BarChart3,
            title: "Real-Time Analytics",
            description: "Track campaign performance with detailed metrics on reach, engagement, and conversions in real-time.",
            gradient: "from-orange-500 to-amber-400",
        },
        {
            icon: Shield,
            title: "Verified Partners",
            description: "Work with confidence knowing all influencers and brands are verified and vetted by our team.",
            gradient: "from-teal-500 to-cyan-400",
        },
        {
            icon: Zap,
            title: "Instant Matching",
            description: "AI-powered matching connects brands with the perfect influencers based on niche, audience, and goals.",
            gradient: "from-orange-600 to-rose-400",
        },
    ];

    const stats = [
        { value: "500+", label: "Active Influencers", color: "text-gradient" },
        { value: "200+", label: "Brand Partners", color: "text-secondary" },
        { value: "1,000+", label: "Campaigns Completed", color: "text-primary" },
        { value: "50M+", label: "Total Reach", color: "text-gradient" },
    ];

    return (
        <div className="min-h-screen">
            {/* ============ HERO SECTION ============ */}
            <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
                {/* Animated gradient mesh background */}
                <div className="absolute inset-0 gradient-hero animate-gradient-shift" />

                {/* Mesh overlay for depth */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.15)_0%,_transparent_60%)]" />

                {/* Grid pattern overlay */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0di0yaDJ2MmgtMnptMC00di0yaDJ2MmgtMnptLTQgNHYtMmgydjJoLTJ6bS00IDB2LTJoMnYyaC0yem0tNCAwdi0yaDJ2MmgtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />

                {/* Floating glass orbs */}
                <div className="absolute top-20 left-[10%] animate-float hidden lg:block">
                    <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-xl" />
                </div>
                <div className="absolute top-40 right-[15%] animate-float hidden lg:block" style={{ animationDelay: "2s" }}>
                    <div className="w-14 h-14 rounded-full bg-white/15 backdrop-blur-md border border-white/20" />
                </div>
                <div className="absolute bottom-32 left-[20%] animate-float hidden lg:block" style={{ animationDelay: "4s" }}>
                    <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/15" />
                </div>
                <div className="absolute bottom-20 right-[10%] animate-float hidden lg:block" style={{ animationDelay: "1s" }}>
                    <div className="w-24 h-24 rounded-full bg-white/8 backdrop-blur-lg border border-white/10" />
                </div>

                {/* Sparkle accents */}
                <div className="absolute top-1/4 right-1/4 animate-pulse-glow hidden md:block">
                    <Sparkles className="w-6 h-6 text-white/40" />
                </div>
                <div className="absolute bottom-1/3 left-1/3 animate-pulse-glow hidden md:block" style={{ animationDelay: "1.5s" }}>
                    <Star className="w-5 h-5 text-white/30" />
                </div>

                {/* Hero Content */}
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        {/* Badge */}
                        <div className="animate-fade-in mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium">
                            <Sparkles className="w-4 h-4" />
                            Kenya's #1 Influencer Marketing Platform
                        </div>

                        <h1 className="animate-slide-up text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-6 leading-[1.05] tracking-tight">
                            Connect.<br className="hidden sm:block" />
                            Collaborate.<br className="hidden sm:block" />
                            <span className="text-white/90">Convert.</span>
                        </h1>

                        <p className="animate-slide-up text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed" style={{ animationDelay: "0.1s" }}>
                            Kenya's premier influencer marketing platform connecting brands with authentic voices to drive real results.
                        </p>

                        <div className="animate-slide-up flex flex-col sm:flex-row gap-4 justify-center items-center" style={{ animationDelay: "0.2s" }}>
                            <Button
                                size="lg"
                                onClick={() => navigate("/signup?type=influencer")}
                                className="bg-white text-primary hover:bg-white/95 text-base px-8 py-6 rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 font-semibold"
                            >
                                <Users className="mr-2 h-5 w-5" />
                                I'm an Influencer
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => navigate("/signup?type=brand")}
                                className="bg-white/10 backdrop-blur-md border-2 border-white/30 text-white hover:bg-white/20 text-base px-8 py-6 rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 font-semibold"
                            >
                                <TrendingUp className="mr-2 h-5 w-5" />
                                I'm a Brand
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Bottom gradient fade */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
            </section>

            {/* ============ FEATURES SECTION ============ */}
            <section className="py-24 bg-background gradient-mesh relative">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 animate-fade-in">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                            <Zap className="w-4 h-4" />
                            Why Choose Us
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
                            Why Choose <span className="text-gradient">Netfluenz?</span>
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Built for the African market, powered by data-driven insights
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="glass-card-hover rounded-2xl p-8 animate-slide-up"
                                style={{ animationDelay: `${index * 0.15}s` }}
                            >
                                <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6 shadow-lg`}>
                                    <feature.icon className="h-7 w-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ SOCIAL PROOF / STATS ============ */}
            <section className="py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-muted/30" />
                <div className="absolute inset-0 gradient-mesh" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 stagger-children">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="glass-card rounded-2xl p-6 text-center animate-scale-in hover-lift"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className={`text-4xl md:text-5xl font-extrabold ${stat.color} mb-2`}>
                                    {stat.value}
                                </div>
                                <div className="text-sm text-muted-foreground font-medium">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ CTA SECTION ============ */}
            <section className="py-24 relative overflow-hidden">
                {/* Gradient background */}
                <div className="absolute inset-0 gradient-hero animate-gradient-shift" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(255,255,255,0.1)_0%,_transparent_60%)]" />

                {/* Floating orbs */}
                <div className="absolute top-10 left-[15%] animate-float hidden md:block">
                    <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/15" />
                </div>
                <div className="absolute bottom-10 right-[15%] animate-float hidden md:block" style={{ animationDelay: "2s" }}>
                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/15" />
                </div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="max-w-3xl mx-auto">
                        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center animate-bounce-subtle">
                            <Globe className="h-8 w-8 text-white/90" />
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
                            Ready to Amplify Your Influence?
                        </h2>
                        <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                            Join Kenya's fastest-growing influencer marketing platform today
                        </p>
                        <Button
                            size="lg"
                            onClick={() => navigate("/signup")}
                            className="bg-white text-primary hover:bg-white/95 text-base px-10 py-6 rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 font-semibold"
                        >
                            Get Started Now
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
};
