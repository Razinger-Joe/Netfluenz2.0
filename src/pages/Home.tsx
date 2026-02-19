import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { SocialProof } from "@/components/landing/SocialProof";
import { FinalCTA } from "@/components/landing/FinalCTA";

export const Home = () => {
    return (
        <div className="min-h-screen bg-[#0A0A1A]">
            <Hero />
            <Features />
            <SocialProof />
            <FinalCTA />
        </div>
    );
};
