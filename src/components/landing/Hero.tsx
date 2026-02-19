import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Users, TrendingUp, ArrowRight, Sparkles } from "lucide-react";
import { AfricaMap } from "./AfricaMap";
import { motion } from "framer-motion";

export const Hero = () => {
    const navigate = useNavigate();

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A0A1A]">
            {/* Animated background glow */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-orange-500/8 blur-[120px] animate-pulse-glow" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-orange-600/5 blur-[80px]" />
                <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-amber-500/5 blur-[80px]" />
            </div>

            {/* Grid pattern */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,107,0,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,0,0.3) 1px, transparent 1px)`,
                    backgroundSize: "60px 60px",
                }}
            />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                    {/* Left — Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-left"
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium mb-6 backdrop-blur-sm"
                        >
                            <Sparkles className="w-4 h-4" />
                            Kenya's #1 Influencer Marketing Platform
                        </motion.div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-[1.05] tracking-tight">
                            Connect.
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-400 to-amber-400">
                                Collaborate.
                            </span>
                            <br />
                            Convert.
                        </h1>

                        <p className="text-lg md:text-xl text-white/60 mb-10 max-w-lg leading-relaxed">
                            The premier influencer marketing platform connecting brands with
                            authentic African voices to drive real results.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                size="lg"
                                onClick={() => navigate("/signup?type=influencer")}
                                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-base px-8 py-6 rounded-xl shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-1 transition-all duration-300 font-semibold border-0"
                            >
                                <Users className="mr-2 h-5 w-5" />
                                I'm an Influencer
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => navigate("/signup?type=brand")}
                                className="bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 hover:border-orange-500/30 text-base px-8 py-6 rounded-xl hover:-translate-y-1 transition-all duration-300 font-semibold"
                            >
                                <TrendingUp className="mr-2 h-5 w-5" />
                                I'm a Brand
                            </Button>
                        </div>

                        {/* Trust indicators */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="mt-10 flex items-center gap-6 text-white/40 text-sm"
                        >
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <img
                                        key={i}
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=netfluenz${i}`}
                                        alt=""
                                        className="w-8 h-8 rounded-full ring-2 ring-[#0A0A1A]"
                                    />
                                ))}
                            </div>
                            <span>
                                <span className="text-orange-400 font-semibold">500+</span> creators already
                                onboard
                            </span>
                        </motion.div>
                    </motion.div>

                    {/* Right — Africa Map */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                        className="hidden lg:flex items-center justify-center"
                    >
                        <AfricaMap className="w-full max-w-[520px]" />
                    </motion.div>
                </div>
            </div>

            {/* Bottom gradient fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0A0A1A] to-transparent" />
        </section>
    );
};
