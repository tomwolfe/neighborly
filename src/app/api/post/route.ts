import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { Reply } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { postId, neighborId, nickname, neighborhood, offer, need, content } = body;

    // Handle Reply
    if (postId) {
      const { data: reply, error: replyError } = await supabase
        .from('replies')
        .insert([
          { 
            post_id: postId,
            neighbor_id: neighborId,
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

      return NextResponse.json({ success: true, reply });
    }

    // Handle New Post
    const { data, error } = await supabase
      .from('posts')
      .insert([
        { 
          neighbor_id: neighborId,
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
