import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Rocket } from "lucide-react";
import { motion } from "framer-motion";

export const FinalCTA = () => {
    const navigate = useNavigate();

    return (
        <section className="py-24 relative overflow-hidden bg-[#0A0A1A]">
            {/* Background glow */}
            <div className="absolute inset-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-orange-500/10 blur-[150px]" />
            </div>

            {/* Gradient border card */}
            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto text-center p-12 md:p-16 rounded-3xl bg-gradient-to-br from-orange-500/10 to-amber-500/5 border border-orange-500/20 backdrop-blur-sm relative overflow-hidden"
                >
                    {/* Inner glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent" />

                    <div className="relative z-10">
                        <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", bounce: 0.5 }}
                            className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-xl shadow-orange-500/25"
                        >
                            <Rocket className="h-8 w-8 text-white" />
                        </motion.div>

                        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                            Ready to Amplify
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400">
                                Your Influence?
                            </span>
                        </h2>

                        <p className="text-lg text-white/50 mb-10 max-w-2xl mx-auto">
                            Join Kenya's fastest-growing influencer marketing platform. Start connecting
                            with brands and creators today — it's free to get started.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                size="lg"
                                onClick={() => navigate("/signup")}
                                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-base px-10 py-6 rounded-xl shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-1 transition-all duration-300 font-semibold border-0"
                            >
                                Get Started Free
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => navigate("/marketplace")}
                                className="bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 hover:border-orange-500/30 text-base px-10 py-6 rounded-xl hover:-translate-y-1 transition-all duration-300 font-semibold"
                            >
                                Browse Influencers
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
