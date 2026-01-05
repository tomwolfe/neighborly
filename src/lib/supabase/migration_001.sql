-- Migration to move replies to their own table and improve trust signals

-- 1. Create replies table
CREATE TABLE IF NOT EXISTS public.replies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
    nickname TEXT NOT NULL,
    neighborhood TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable RLS on replies
ALTER TABLE public.replies ENABLE ROW LEVEL SECURITY;

-- 3. RLS policies for replies
CREATE POLICY "Allow public read access" ON public.replies
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert access" ON public.replies
    FOR INSERT WITH CHECK (true);

-- 4. Create a view for user stats (Trust Signals)
CREATE OR REPLACE VIEW public.user_stats AS
WITH all_users AS (
    SELECT nickname FROM public.posts
    UNION
    SELECT nickname FROM public.replies
)
SELECT 
    au.nickname,
    (SELECT count(*) FROM public.posts WHERE nickname = au.nickname) as post_count,
    (SELECT count(*) FROM public.replies WHERE nickname = au.nickname) as reply_count
FROM all_users au;

-- 5. Fix RLS on posts (Restrict updates)
DROP POLICY IF EXISTS "Allow public update to replies" ON public.posts;
-- We don't need updates to posts for now since replies are in their own table.
-- If we add "closed" status later, we can add a specific policy.

-- 6. Add indexes
CREATE INDEX IF NOT EXISTS replies_post_id_idx ON public.replies(post_id);
CREATE INDEX IF NOT EXISTS replies_nickname_idx ON public.replies(nickname);

-- 7. Add RPC for incrementing reply count (as a fallback)
CREATE OR REPLACE FUNCTION increment_reply_count(row_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.posts
  SET reply_count = reply_count + 1
  WHERE id = row_id;
END;
$$ LANGUAGE plpgsql;

-- 8. Add trigger to update reply_count on posts when a reply is added
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

