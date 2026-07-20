-- ============================================================================
-- NETFLUENZ 2.0 — MIGRATION 002: CAMPAIGNS & APPLICATIONS
-- ============================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- CAMPAIGNS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    budget NUMERIC NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'cancelled')),
    niches TEXT[] DEFAULT '{}',
    requirements JSONB DEFAULT '{}'::jsonb,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS for campaigns
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can view active/completed campaigns
CREATE POLICY "Public can view non-draft campaigns"
    ON public.campaigns FOR SELECT
    USING (status IN ('active', 'completed') OR auth.uid() = brand_id);

-- Brands can create their own campaigns
CREATE POLICY "Brands can create campaigns"
    ON public.campaigns FOR INSERT
    WITH CHECK (auth.uid() = brand_id);

-- Brands can update their own campaigns
CREATE POLICY "Brands can update own campaigns"
    ON public.campaigns FOR UPDATE
    USING (auth.uid() = brand_id);

-- Brands can delete their own campaigns
CREATE POLICY "Brands can delete own campaigns"
    ON public.campaigns FOR DELETE
    USING (auth.uid() = brand_id);

-- Admin override policy for campaigns
CREATE POLICY "Admins can manage all campaigns"
    ON public.campaigns FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Trigger for auto updated_at
CREATE OR REPLACE FUNCTION public.update_campaigns_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_campaigns_updated_at
    BEFORE UPDATE ON public.campaigns
    FOR EACH ROW EXECUTE FUNCTION public.update_campaigns_updated_at();

-- ============================================================================
-- CAMPAIGN APPLICATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.campaign_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
    influencer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    pitch TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(campaign_id, influencer_id)
);

-- RLS for campaign_applications
ALTER TABLE public.campaign_applications ENABLE ROW LEVEL SECURITY;

-- Influencers can view their own applications
CREATE POLICY "Influencers can view own applications"
    ON public.campaign_applications FOR SELECT
    USING (auth.uid() = influencer_id);

-- Campaign brand owner can view all applications for their campaigns
CREATE POLICY "Brands can view applications for their campaigns"
    ON public.campaign_applications FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.campaigns
            WHERE id = campaign_applications.campaign_id AND brand_id = auth.uid()
        )
    );

-- Influencers can submit applications
CREATE POLICY "Influencers can create applications"
    ON public.campaign_applications FOR INSERT
    WITH CHECK (auth.uid() = influencer_id);

-- Brand owner can update application status (accept/reject)
CREATE POLICY "Brands can update application status"
    ON public.campaign_applications FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.campaigns
            WHERE id = campaign_applications.campaign_id AND brand_id = auth.uid()
        )
    );

-- Admin override policy for applications
CREATE POLICY "Admins can manage all applications"
    ON public.campaign_applications FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_campaigns_brand_id ON public.campaigns(brand_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON public.campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaign_applications_campaign_id ON public.campaign_applications(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_applications_influencer_id ON public.campaign_applications(influencer_id);
