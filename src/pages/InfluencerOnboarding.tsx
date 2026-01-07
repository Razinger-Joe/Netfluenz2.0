import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Instagram, Youtube, Twitter, Facebook, X, Check } from "lucide-react";
import { toast } from "sonner";

const NICHES = [
    "Fashion", "Beauty", "Tech", "Food", "Travel", "Fitness",
    "Lifestyle", "Gaming", "Education", "Business", "Music", "Art"
];

const PLATFORMS = [
    { name: "Instagram", icon: Instagram, color: "text-pink-600" },
    { name: "TikTok", icon: Twitter, color: "text-black" }, // Using Twitter icon for TikTok temporarily if needed, or update if available
    { name: "YouTube", icon: Youtube, color: "text-red-600" },
    { name: "Twitter", icon: Twitter, color: "text-blue-500" },
    { name: "Facebook", icon: Facebook, color: "text-blue-600" },
];

export const InfluencerOnboarding = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
    const [platformData, setPlatformData] = useState<Record<string, { username: string; followers: string }>>({});

    const progress = (step / 3) * 100;

    const toggleNiche = (niche: string) => {
        if (selectedNiches.includes(niche)) {
            setSelectedNiches(selectedNiches.filter(n => n !== niche));
        } else {
            setSelectedNiches([...selectedNiches, niche]);
        }
    };

    const togglePlatform = (platform: string) => {
        if (selectedPlatforms.includes(platform)) {
            setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
            const newData = { ...platformData };
            delete newData[platform];
            setPlatformData(newData);
        } else {
            setSelectedPlatforms([...selectedPlatforms, platform]);
            setPlatformData({
                ...platformData,
                [platform]: { username: "", followers: "" }
            });
        }
    };

    const updatePlatformData = (platform: string, field: "username" | "followers", value: string) => {
        setPlatformData({
            ...platformData,
            [platform]: {
                ...platformData[platform],
                [field]: value
            }
        });
    };

    const handleNext = () => {
        if (step === 1 && selectedNiches.length === 0) {
            toast.error("Please select at least one niche");
            return;
        }
        if (step === 2 && selectedPlatforms.length === 0) {
            toast.error("Please select at least one platform");
            return;
        }

        if (step < 3) {
            setStep(step + 1);
        } else {
            toast.success("Profile completed! Welcome to Netfluenz 🎉");
            setTimeout(() => navigate("/dashboard"), 1000); // Updated to /dashboard
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background py-8 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8 text-center animate-fade-in">
                    <h1 className="text-4xl font-bold mb-2 gradient-accent bg-clip-text text-transparent">
                        Complete Your Profile
                    </h1>
                    <p className="text-muted-foreground">Step {step} of 3</p>
                </div>

                <Progress value={progress} className="mb-8 h-2" />

                <Card className="glass-card p-8 animate-scale-in">
                    {step === 1 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold mb-2">Select Your Niches</h2>
                                <p className="text-muted-foreground">Choose the categories that best describe your content</p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {NICHES.map((niche) => (
                                    <Badge
                                        key={niche}
                                        variant={selectedNiches.includes(niche) ? "default" : "outline"}
                                        className={`
                      cursor-pointer py-3 px-4 text-center justify-center hover:scale-105 transition-transform
                      ${selectedNiches.includes(niche) ? "gradient-accent text-white" : ""}
                    `}
                                        onClick={() => toggleNiche(niche)}
                                    >
                                        {selectedNiches.includes(niche) && <Check className="h-4 w-4 mr-1" />}
                                        {niche}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold mb-2">Your Platforms</h2>
                                <p className="text-muted-foreground">Select your social media platforms</p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {PLATFORMS.map((platform) => {
                                    const Icon = platform.icon;
                                    const isSelected = selectedPlatforms.includes(platform.name);
                                    return (
                                        <Card
                                            key={platform.name}
                                            className={`
                        p-6 cursor-pointer hover-lift text-center transition-all
                        ${isSelected ? "ring-2 ring-primary bg-primary/5" : ""}
                      `}
                                            onClick={() => togglePlatform(platform.name)}
                                        >
                                            <Icon className={`h-10 w-10 mx-auto mb-2 ${platform.color}`} />
                                            <p className="font-semibold">{platform.name}</p>
                                            {isSelected && (
                                                <Check className="h-5 w-5 text-primary mx-auto mt-2" />
                                            )}
                                        </Card>
                                    );
                                })}
                            </div>

                            {selectedPlatforms.length > 0 && (
                                <div className="space-y-4 pt-4 border-t">
                                    <h3 className="font-semibold">Platform Details</h3>
                                    {selectedPlatforms.map((platform) => (
                                        <div key={platform} className="space-y-3 p-4 bg-muted/50 rounded-lg">
                                            <div className="flex items-center justify-between">
                                                <Label className="font-semibold">{platform}</Label>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => togglePlatform(platform)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <div>
                                                    <Label className="text-xs">Username</Label>
                                                    <Input
                                                        placeholder="@username"
                                                        value={platformData[platform]?.username || ""}
                                                        onChange={(e) => updatePlatformData(platform, "username", e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-xs">Followers</Label>
                                                    <Input
                                                        type="number"
                                                        placeholder="10000"
                                                        value={platformData[platform]?.followers || ""}
                                                        onChange={(e) => updatePlatformData(platform, "followers", e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <div className="w-20 h-20 gradient-accent rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Check className="h-10 w-10 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold mb-2">Review & Submit</h2>
                                <p className="text-muted-foreground">Make sure everything looks good</p>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 bg-muted/50 rounded-lg">
                                    <h3 className="font-semibold mb-2">Selected Niches</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedNiches.map((niche) => (
                                            <Badge key={niche} className="gradient-accent text-white">
                                                {niche}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-4 bg-muted/50 rounded-lg">
                                    <h3 className="font-semibold mb-2">Connected Platforms</h3>
                                    <div className="space-y-2">
                                        {selectedPlatforms.map((platform) => (
                                            <div key={platform} className="flex items-center justify-between">
                                                <span className="font-medium">{platform}</span>
                                                <span className="text-muted-foreground">
                                                    @{platformData[platform]?.username} • {platformData[platform]?.followers} followers
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-4 border-2 border-primary/20 bg-primary/5 rounded-lg">
                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <input type="checkbox" className="mt-1 rounded border-border" required />
                                        <span className="text-sm">
                                            I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and confirm that all provided information is accurate
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3 mt-8">
                        {step > 1 && (
                            <Button variant="outline" onClick={handleBack} className="flex-1">
                                Back
                            </Button>
                        )}
                        <Button onClick={handleNext} className="flex-1 gradient-accent text-white">
                            {step === 3 ? "Complete Profile" : "Continue"}
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};
