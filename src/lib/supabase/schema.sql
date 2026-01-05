-- Neighborly Supabase Schema

-- Create the posts table
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    neighbor_id UUID NOT NULL, -- Permanent ID stored in user's localStorage
    nickname TEXT NOT NULL,
    neighborhood TEXT NOT NULL,
    offer TEXT NOT NULL,
    need TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    reply_count INTEGER DEFAULT 0 NOT NULL,
    barter_only BOOLEAN DEFAULT TRUE NOT NULL
);

-- Create replies table
CREATE TABLE IF NOT EXISTS public.replies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
    neighbor_id UUID NOT NULL, -- Permanent ID stored in user's localStorage
    nickname TEXT NOT NULL,
    neighborhood TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.replies ENABLE ROW LEVEL SECURITY;

-- Create policies for posts
CREATE POLICY "Allow public read access" ON public.posts
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert access" ON public.posts
    FOR INSERT WITH CHECK (true);

-- Create policies for replies
CREATE POLICY "Allow public read access" ON public.replies
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert access" ON public.replies
    FOR INSERT WITH CHECK (true);

-- Create a view for user stats (Trust Signals)
CREATE OR REPLACE VIEW public.user_stats AS
WITH all_users AS (
    SELECT neighbor_id FROM public.posts
    UNION
    SELECT neighbor_id FROM public.replies
)
SELECT 
    au.neighbor_id,
    -- Get the most recent nickname for this neighbor_id
    (SELECT nickname FROM (
        SELECT nickname, created_at FROM public.posts WHERE neighbor_id = au.neighbor_id
        UNION ALL
        SELECT nickname, created_at FROM public.replies WHERE neighbor_id = au.neighbor_id
        ORDER BY created_at DESC
        LIMIT 1
    ) AS latest_name) as current_nickname,
    (SELECT count(*) FROM public.posts WHERE neighbor_id = au.neighbor_id) as post_count,
    (SELECT count(*) FROM public.replies WHERE neighbor_id = au.neighbor_id) as reply_count
FROM all_users au;

-- Create indexes
CREATE INDEX IF NOT EXISTS posts_neighborhood_idx ON public.posts(neighborhood);
CREATE INDEX IF NOT EXISTS posts_created_at_idx ON public.posts(created_at DESC);
CREATE INDEX IF NOT EXISTS posts_neighbor_id_idx ON public.posts(neighbor_id);
CREATE INDEX IF NOT EXISTS replies_post_id_idx ON public.replies(post_id);
CREATE INDEX IF NOT EXISTS replies_neighbor_id_idx ON public.replies(neighbor_id);

-- Trigger to update reply_count on posts when a reply is added
CREATE OR REPLACE FUNCTION update_post_reply_count()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE public.posts 
        SET reply_count = reply_count + 1
        WHERE id = NEW.post_id;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE public.posts 
        SET reply_count = reply_count - 1
        WHERE id = OLD.post_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_reply_added
AFTER INSERT OR DELETE ON public.replies
FOR EACH ROW EXECUTE FUNCTION update_post_reply_count();
