'use client';

import React, { useState, useEffect } from 'react';
import { Post } from '@/lib/types';
import { cn } from '@/lib/utils';
import { X, Send } from 'lucide-react';

interface ReplyModalProps {
  post: Post | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReplyModal({ post, onClose, onSuccess }: ReplyModalProps) {
  const [nickname, setNickname] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedNickname = localStorage.getItem('neighborly_nickname');
    const savedNeighborhood = localStorage.getItem('neighborly_neighborhood');
    if (savedNickname) setNickname(savedNickname);
    if (savedNeighborhood) setNeighborhood(savedNeighborhood);

    if (post) {
      setContent(`Hi ${post.nickname}, I saw you can ${post.offer}. I can help with ${post.need} in return. Interested?`);
    }
  }, [post]);

  if (!post) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname || !neighborhood || !content) return;

    setLoading(true);
    try {
      const response = await fetch('/api/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          postId: post.id, 
          nickname, 
          neighborhood, 
          content 
        }),
      });

      if (response.ok) {
        localStorage.setItem('neighborly_nickname', nickname);
        localStorage.setItem('neighborly_neighborhood', neighborhood);
        onSuccess();
      }
    } catch (error) {
      console.error('Failed to reply:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-warm-gray/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-cream border border-warm-gray/10 rounded-2xl w-full max-w-md shadow-2xl relative z-10 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-warm-gray/5">
          <h3 className="font-bold text-warm-gray">Reply to {post.nickname}</h3>
          <button onClick={onClose} className="text-warm-gray/40 hover:text-warm-gray transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-warm-gray/50 mb-1">Nickname</label>
              <input
                type="text"
                required
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Priya"
                className="w-full bg-white border border-warm-gray/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sage/20 focus:border-sage"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-warm-gray/50 mb-1">Neighborhood</label>
              <input
                type="text"
                required
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                placeholder="Oak Street"
                className="w-full bg-white border border-warm-gray/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sage/20 focus:border-sage"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-warm-gray/50 mb-1">Message</label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-white border border-warm-gray/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sage/20 focus:border-sage resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={cn(
              "w-full bg-sage hover:bg-sage-dark text-cream font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2",
              loading && "opacity-50 cursor-not-allowed"
            )}
          >
            {loading ? "Sending..." : (
              <>
                Send Reply <Send size={16} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
