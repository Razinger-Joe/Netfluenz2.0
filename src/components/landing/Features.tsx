import { BarChart3, Shield, Zap, Globe, MessageCircle, Wallet } from "lucide-react";
import { motion } from "framer-motion";

const features = [
    {
        icon: BarChart3,
        title: "Real-Time Analytics",
        description:
            "Track campaign performance with detailed metrics on reach, engagement, and conversions in real-time.",
        gradient: "from-orange-500 to-amber-400",
    },
    {
        icon: Shield,
        title: "Verified Partners",
        description:
            "Work with confidence knowing all influencers and brands are verified and vetted by our team.",
        gradient: "from-orange-600 to-orange-400",
    },
    {
        icon: Zap,
        title: "AI-Powered Matching",
        description:
            "Smart algorithms connect brands with the perfect influencers based on niche, audience, and goals.",
        gradient: "from-amber-500 to-yellow-400",
    },
    {
        icon: Globe,
        title: "Pan-African Reach",
        description:
            "Tap into markets across Kenya and beyond with our growing network of African influencers.",
        gradient: "from-orange-500 to-rose-400",
    },
    {
        icon: MessageCircle,
        title: "Seamless Collaboration",
        description:
            "Built-in messaging, contracts, and campaign management — all in one platform.",
        gradient: "from-orange-600 to-amber-500",
    },
    {
        icon: Wallet,
        title: "Secure Payments",
        description:
            "M-Pesa and card integrations with escrow protection for peace of mind on every deal.",
        gradient: "from-amber-400 to-orange-500",
    },
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export const Features = () => {
    return (
        <section className="py-24 bg-[#0A0A1A] relative overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full bg-orange-500/5 blur-[120px]" />

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium mb-4">
                        <Zap className="w-4 h-4" />
                        Powerful Features
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                        Why Choose{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400">
                            Netfluenz?
                        </span>
                    </h2>
                    <p className="text-lg text-white/50 max-w-2xl mx-auto">
                        Built for the African market, powered by data-driven insights
                    </p>
                </motion.div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={item}
                            className="group relative p-8 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm hover:bg-white/[0.06] hover:border-orange-500/20 transition-all duration-500"
                        >
                            {/* Hover glow */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/0 to-amber-500/0 group-hover:from-orange-500/5 group-hover:to-amber-500/5 transition-all duration-500" />

                            <div className="relative z-10">
                                <div
                                    className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-orange-500/10 group-hover:shadow-orange-500/25 transition-shadow duration-500`}
                                >
                                    <feature.icon className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-orange-300 transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-white/40 leading-relaxed group-hover:text-white/60 transition-colors">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};
