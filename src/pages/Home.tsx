import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Users, TrendingUp, BarChart3, Shield, Zap, Globe } from "lucide-react";

export const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative gradient-hero min-h-[90vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBoLTJ2Mmgydi0yem0wLTRoLTJ2Mmgydi0yem0wLTRoLTJ2Mmgydi0yem0wIDEyaC0ydjJoMnYtMnptLTQgMGgtMnYyaDJ2LTJ6bS00IDBoLTJ2Mmgydi0yem0tNCAwSDB2Mmgydi0yem0wLTRoLTJ2Mmgydi0yem0wLTRoLTJ2Mmgydi0yem0wLTRoLTJ2Mmgydi0yem0wLTRoLTJ2Mmgydi0yem0wLTRoLTJ2Mmgydi0yem0wLTRoLTJ2Mmgydi0yem0wLTRoLTJ2Mmgydi0yem0wLTRoLTJ2Mmgydi0yem0wLTRoLTJ2Mmgydi0yeiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center max-w-4xl mx-auto animate-slide-up">
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                            Connect. Collaborate. Convert.
                        </h1>
                        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
                            Kenya's premier influencer marketing platform connecting brands with authentic voices to drive real results.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Button
                                size="lg"
                                onClick={() => navigate("/signup?type=influencer")}
                                className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 shadow-xl hover-lift"
                            >
                                <Users className="mr-2 h-5 w-5" />
                                I'm an Influencer
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => navigate("/signup?type=brand")}
                                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-6 shadow-xl hover-lift"
                            >
                                <TrendingUp className="mr-2 h-5 w-5" />
                                I'm a Brand
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-20 left-10 animate-float hidden md:block">
                    <div className="w-16 h-16 bg-white/20 rounded-full backdrop-blur-sm"></div>
                </div>
                <div className="absolute bottom-20 right-10 animate-float hidden md:block" style={{ animationDelay: "1s" }}>
                    <div className="w-20 h-20 bg-white/20 rounded-full backdrop-blur-sm"></div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 animate-fade-in">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            Why Choose Netfluenz?
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Built for the African market, powered by data-driven insights
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="glass-card p-8 hover-lift">
                            <div className="w-14 h-14 gradient-accent rounded-xl flex items-center justify-center mb-6">
                                <BarChart3 className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Real-Time Analytics</h3>
                            <p className="text-muted-foreground">
                                Track campaign performance with detailed metrics on reach, engagement, and conversions in real-time.
                            </p>
                        </Card>

                        <Card className="glass-card p-8 hover-lift">
                            <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center mb-6">
                                <Shield className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Verified Partners</h3>
                            <p className="text-muted-foreground">
                                Work with confidence knowing all influencers and brands are verified and vetted by our team.
                            </p>
                        </Card>

                        <Card className="glass-card p-8 hover-lift">
                            <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mb-6">
                                <Zap className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Instant Matching</h3>
                            <p className="text-muted-foreground">
                                AI-powered matching connects brands with the perfect influencers based on niche, audience, and goals.
                            </p>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Social Proof Section */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div className="animate-scale-in">
                            <div className="text-5xl font-bold gradient-accent bg-clip-text text-transparent mb-2">
                                500+
                            </div>
                            <div className="text-muted-foreground">Active Influencers</div>
                        </div>
                        <div className="animate-scale-in" style={{ animationDelay: "0.1s" }}>
                            <div className="text-5xl font-bold text-secondary mb-2">
                                200+
                            </div>
                            <div className="text-muted-foreground">Brand Partners</div>
                        </div>
                        <div className="animate-scale-in" style={{ animationDelay: "0.2s" }}>
                            <div className="text-5xl font-bold text-primary mb-2">
                                1,000+
                            </div>
                            <div className="text-muted-foreground">Campaigns Completed</div>
                        </div>
                        <div className="animate-scale-in" style={{ animationDelay: "0.3s" }}>
                            <div className="text-5xl font-bold gradient-accent bg-clip-text text-transparent mb-2">
                                50M+
                            </div>
                            <div className="text-muted-foreground">Total Reach</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 gradient-hero relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBoLTJ2Mmgydi0yem0wLTRoLTJ2Mmgydi0yem0wLTRoLTJ2Mmgydi0yem0wIDEyaC0ydjJoMnYtMnptLTQgMGgtMnYyaDJ2LTJ6bS00IDBoLTJ2Mmgydi0yem0tNCAwSDB2Mmgydi0yem0wLTRoLTJ2Mmgydi0yem0wLTRoLTJ2Mmgydi0yem0wLTRoLTJ2Mmgydi0yem0wLTRoLTJ2Mmgydi0yem0wLTRoLTJ2Mmgydi0yem0wLTRoLTJ2Mmgydi0yem0wLTRoLTJ2Mmgydi0yem0wLTRoLTJ2Mmgydi0yeiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <Globe className="h-16 w-16 text-white/80 mx-auto mb-6" />
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Ready to Amplify Your Influence?
                    </h2>
                    <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                        Join Kenya's fastest-growing influencer marketing platform today
                    </p>
                    <Button
                        size="lg"
                        onClick={() => navigate("/signup")}
                        className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 shadow-xl hover-lift"
                    >
                        Get Started Now
                    </Button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-foreground/5 py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <h3 className="text-2xl font-bold gradient-accent bg-clip-text text-transparent mb-4">
                                Netfluenz
                            </h3>
                            <p className="text-muted-foreground">
                                Connecting influencers and brands across Africa
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-3">Platform</h4>
                            <ul className="space-y-2 text-muted-foreground">
                                <li><a href="#" className="hover:text-primary transition-colors">For Influencers</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">For Brands</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">How It Works</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-3">Company</h4>
                            <ul className="space-y-2 text-muted-foreground">
                                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-3">Legal</h4>
                            <ul className="space-y-2 text-muted-foreground">
                                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-border pt-8 text-center text-muted-foreground">
                        <p>© 2025 Netfluenz. Made in Kenya 🇰🇪</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};
