-- ============================================================================
-- NETFLUENZ 2.0 — MIGRATION 003: INFLUENCER MARKETPLACE FIELDS
-- ============================================================================

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS niches TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS follower_count INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS engagement_rate NUMERIC DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS platforms JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS rate_card JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS portfolio_urls TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS rating NUMERIC DEFAULT 5.0,
ADD COLUMN IF NOT EXISTS completed_campaigns INT DEFAULT 0;

-- Indexes for marketplace searching & filtering
CREATE INDEX IF NOT EXISTS idx_profiles_niches ON public.profiles USING GIN(niches);
CREATE INDEX IF NOT EXISTS idx_profiles_follower_count ON public.profiles(follower_count);
CREATE INDEX IF NOT EXISTS idx_profiles_engagement_rate ON public.profiles(engagement_rate);
