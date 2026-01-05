import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { Reply } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { postId, nickname, neighborhood, offer, need, content } = body;

    // Handle Reply
    if (postId) {
      const { data: reply, error: replyError } = await supabase
        .from('replies')
        .insert([
          { 
            post_id: postId,
            nickname,
            neighborhood,
            content
          }
        ])
        .select()
        .single();

      if (replyError) {
        return NextResponse.json({ error: replyError.message }, { status: 500 });
      }

      // We still update reply_count on the post for performance (denormalization)
      // but the source of truth is now the replies table.
      // In a real app, this could be handled by a DB trigger.
      const { error: updateError } = await supabase.rpc('increment_reply_count', { row_id: postId });
      
      // If the RPC doesn't exist yet, we'll fall back to a less ideal update for now
      // but ideally we add the RPC in the migration.
      if (updateError) {
        const { data: post } = await supabase.from('posts').select('reply_count').eq('id', postId).single();
        await supabase
          .from('posts')
          .update({ reply_count: (post?.reply_count || 0) + 1 })
          .eq('id', postId);
      }

      return NextResponse.json({ success: true, reply });
    }

    // Handle New Post
    const { data, error } = await supabase
      .from('posts')
      .insert([
        { 
          nickname, 
          neighborhood, 
          offer, 
          need, 
          reply_count: 0,
          barter_only: true
        }
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, post: data });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
