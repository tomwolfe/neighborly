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
      // 1. Fetch current post
      const { data: post, error: fetchError } = await supabase
        .from('posts')
        .select('replies, reply_count')
        .eq('id', postId)
        .single();

      if (fetchError || !post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }

      const newReply: Reply = {
        id: uuidv4(),
        nickname,
        neighborhood,
        content,
        created_at: new Date().toISOString(),
      };

      const updatedReplies = [...(post.replies || []), newReply];
      
      const { error: updateError } = await supabase
        .from('posts')
        .update({ 
          replies: updatedReplies, 
          reply_count: (post.reply_count || 0) + 1 
        })
        .eq('id', postId);

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, reply: newReply });
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
          replies: [], 
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
