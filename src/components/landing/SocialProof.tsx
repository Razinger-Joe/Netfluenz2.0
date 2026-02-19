import { motion } from "framer-motion";

const stats = [
    { value: "500+", label: "Active Influencers", suffix: "" },
    { value: "200+", label: "Brand Partners", suffix: "" },
    { value: "1,000+", label: "Campaigns Completed", suffix: "" },
    { value: "50M+", label: "Total Reach", suffix: "" },
];

const testimonials = [
    {
        quote:
            "Netfluenz transformed how we connect with Kenyan audiences. Our campaign ROI tripled within 2 months.",
        author: "Sarah Wanjiku",
        role: "Marketing Director, Safaricom",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    },
    {
        quote:
            "As a micro-influencer, Netfluenz gave me access to brands I never thought I could work with. Game changer!",
        author: "Brian Ochieng",
        role: "Lifestyle Creator, 45K followers",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=brian",
    },
    {
        quote:
            "The platform's analytics helped us understand our audience better than any tool we've used before.",
        author: "Amina Hassan",
        role: "Brand Manager, Kenya Airways",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=amina",
    },
];

export const SocialProof = () => {
    return (
        <section className="py-24 bg-[#0d0d1f] relative overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-orange-500/5 blur-[120px]" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="text-center p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm"
                        >
                            <div className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400 mb-2">
                                {stat.value}{stat.suffix}
                            </div>
                            <div className="text-sm text-white/40 font-medium">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Testimonials */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                        Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400">Leading Brands</span>
                    </h2>
                    <p className="text-white/40 max-w-xl mx-auto">
                        Hear from the creators and brands thriving on our platform
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6">
                    {testimonials.map((t, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15 }}
                            className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm hover:border-orange-500/20 transition-all duration-500"
                        >
                            <p className="text-white/60 mb-6 leading-relaxed italic">
                                "{t.quote}"
                            </p>
                            <div className="flex items-center gap-3">
                                <img
                                    src={t.avatar}
                                    alt={t.author}
                                    className="w-10 h-10 rounded-full ring-2 ring-orange-500/20"
                                />
                                <div>
                                    <p className="text-white font-semibold text-sm">{t.author}</p>
                                    <p className="text-white/40 text-xs">{t.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
