-- Create schema for Phase 6 of Freelance Ops Toolkit

-- 1. Create time_entries table
CREATE TABLE IF NOT EXISTS public.time_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    client_name TEXT NOT NULL,
    hourly_rate NUMERIC NOT NULL,
    description TEXT NOT NULL,
    hours NUMERIC NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security (RLS) on time_entries
ALTER TABLE public.time_entries ENABLE ROW LEVEL SECURITY;

-- Add RLS Policies for time_entries
CREATE POLICY "Users can create their own time entries"
    ON public.time_entries
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own time entries"
    ON public.time_entries
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own time entries"
    ON public.time_entries
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own time entries"
    ON public.time_entries
    FOR DELETE
    USING (auth.uid() = user_id);


-- 2. Create scope_estimates table
CREATE TABLE IF NOT EXISTS public.scope_estimates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    project_type TEXT NOT NULL,
    inputs JSONB NOT NULL,
    estimated_hours_min NUMERIC NOT NULL,
    estimated_hours_max NUMERIC NOT NULL,
    suggested_timeline TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security (RLS) on scope_estimates
ALTER TABLE public.scope_estimates ENABLE ROW LEVEL SECURITY;

-- Add RLS Policies for scope_estimates
CREATE POLICY "Users can create their own scope estimates"
    ON public.scope_estimates
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own scope estimates"
    ON public.scope_estimates
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own scope estimates"
    ON public.scope_estimates
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scope estimates"
    ON public.scope_estimates
    FOR DELETE
    USING (auth.uid() = user_id);
