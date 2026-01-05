'use client';

import React, { useMemo } from 'react';
import { Post, UserStats } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { getGravatarUrl, cn, getNeighborId } from '@/lib/utils';
import { MessageSquare, Award, CheckCircle2, User } from 'lucide-react';

interface PostCardProps {
  post: Post;
  userStats: Record<string, UserStats>;
  onReply: (post: Post) => void;
}

export default function PostCard({ post, userStats, onReply }: PostCardProps) {
  const currentNeighborId = useMemo(() => getNeighborId(), []);
  const isOwnPost = post.neighbor_id === currentNeighborId;
  
  const stats = userStats[post.neighbor_id] || { post_count: 0, reply_count: 0 };
  const isActive = stats.post_count >= 2;
  const hasSwapped = stats.reply_count > 0;

  return (
    <div className={cn(
      "bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow",
      isOwnPost ? "border-sage/30 ring-1 ring-sage/10" : "border-warm-gray/10"
    )}>
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <img 
              src={getGravatarUrl(post.nickname)} 
              alt={post.nickname}
              className="w-10 h-10 rounded-full border-2 border-sage/20"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-warm-gray">{post.nickname}</h3>
                <div className="flex gap-1" aria-label="Neighbor trust signals">
                  {isOwnPost && (
                    <span className="bg-sage/10 text-sage text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      <User size={10} /> You
                    </span>
                  )}
                  {isActive && (
                    <span className="group relative" role="status" aria-label="Active Neighbor: Has posted 2 or more times">
                      <Award size={14} className="text-sage" aria-hidden="true" />
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-warm-gray text-cream text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap">Active Neighbor</span>
                    </span>
                  )}
                  {hasSwapped && (
                    <span className="group relative" role="status" aria-label="Has Swapped: Has replied to others">
                      <CheckCircle2 size={14} className="text-blue-500" aria-hidden="true" />
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-warm-gray text-cream text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap">Has Swapped</span>
                    </span>
                  )}
                </div>
              </div>
              <p className="text-xs text-warm-gray/60">{post.neighborhood} • {formatDistanceToNow(new Date(post.created_at))} ago</p>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-5">
          <div className="bg-sage/5 border border-sage/10 rounded-lg p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-sage mb-1">I can help with</p>
            <p className="text-sm text-warm-gray leading-relaxed">{post.offer}</p>
          </div>
          <div className="bg-warm-gray/5 border border-warm-gray/10 rounded-lg p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-warm-gray/40 mb-1">I need help with</p>
            <p className="text-sm text-warm-gray leading-relaxed">{post.need}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-warm-gray/5">
          <div className="flex items-center gap-1.5 text-xs text-warm-gray/50 font-medium">
            <MessageSquare size={14} />
            {post.reply_count} {post.reply_count === 1 ? 'reply' : 'replies'}
          </div>
          <button 
            onClick={() => onReply(post)}
            className="text-xs font-bold text-sage hover:text-sage-dark transition-colors px-3 py-1.5 rounded-full hover:bg-sage/5"
          >
            Reply to Swap
          </button>
        </div>

        {post.replies && post.replies.length > 0 && (
          <div className="mt-4 space-y-3 border-l-2 border-sage/10 ml-2 pl-4">
            {post.replies.map((reply, idx) => (
              <div key={idx} className="text-xs">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-warm-gray">{reply.nickname}</span>
                  <span className="text-warm-gray/40">• {reply.neighborhood}</span>
                </div>
                <p className="text-warm-gray/70 leading-relaxed italic">"{reply.content}"</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
