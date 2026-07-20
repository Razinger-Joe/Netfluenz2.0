-- ============================================================================
-- NETFLUENZ 2.0 — MIGRATION 004: USER PORTFOLIOS & SOCIAL LINKS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_portfolios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    campaign_name TEXT,
    metrics JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS for user_portfolios
ALTER TABLE public.user_portfolios ENABLE ROW LEVEL SECURITY;

-- Anyone can view portfolio items
CREATE POLICY "Public can view user portfolios"
    ON public.user_portfolios FOR SELECT
    USING (true);

-- Users can insert their own portfolio items
CREATE POLICY "Users can create own portfolio items"
    ON public.user_portfolios FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own portfolio items
CREATE POLICY "Users can update own portfolio items"
    ON public.user_portfolios FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can delete their own portfolio items
CREATE POLICY "Users can delete own portfolio items"
    ON public.user_portfolios FOR DELETE
    USING (auth.uid() = user_id);

-- Index for user_id lookup
CREATE INDEX IF NOT EXISTS idx_user_portfolios_user_id ON public.user_portfolios(user_id);
