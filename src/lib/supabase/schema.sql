-- Neighborly Supabase Schema

-- Create the posts table
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nickname TEXT NOT NULL,
    neighborhood TEXT NOT NULL,
    offer TEXT NOT NULL,
    need TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    replies JSONB DEFAULT '[]'::jsonb NOT NULL,
    reply_count INTEGER DEFAULT 0 NOT NULL,
    barter_only BOOLEAN DEFAULT TRUE NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Create policies
-- 1. Allow anyone to read posts
CREATE POLICY "Allow public read access" ON public.posts
    FOR SELECT USING (true);

-- 2. Allow anyone to insert posts (ephemeral identity)
CREATE POLICY "Allow public insert access" ON public.posts
    FOR INSERT WITH CHECK (true);

-- 3. Allow updates to replies (app logic will handle this via serverless functions)
-- For simplicity in this "no auth" model, we'll let the serverless function handle the update.
-- If we want to allow the API route to update, we can enable it for the service role or public with caution.
CREATE POLICY "Allow public update to replies" ON public.posts
    FOR UPDATE USING (true);

-- Create index for faster searching
CREATE INDEX IF NOT EXISTS posts_neighborhood_idx ON public.posts(neighborhood);
CREATE INDEX IF NOT EXISTS posts_created_at_idx ON public.posts(created_at DESC);
