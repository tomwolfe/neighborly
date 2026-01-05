'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Send } from 'lucide-react';

interface CreatePostFormProps {
  onSuccess: () => void;
}

export default function CreatePostForm({ onSuccess }: CreatePostFormProps) {
  const [nickname, setNickname] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [offer, setOffer] = useState('');
  const [need, setNeed] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedNickname = localStorage.getItem('neighborly_nickname');
    const savedNeighborhood = localStorage.getItem('neighborly_neighborhood');
    if (savedNickname) setNickname(savedNickname);
    if (savedNeighborhood) setNeighborhood(savedNeighborhood);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname || !neighborhood || !offer || !need) return;

    setLoading(true);
    try {
      const response = await fetch('/api/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, neighborhood, offer, need }),
      });

      if (response.ok) {
        localStorage.setItem('neighborly_nickname', nickname);
        localStorage.setItem('neighborly_neighborhood', neighborhood);
        setOffer('');
        setNeed('');
        onSuccess();
      }
    } catch (error) {
      console.error('Failed to post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-warm-gray/10 rounded-2xl p-6 shadow-sm mb-8">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <span className="w-2 h-6 bg-sage rounded-full"></span>
        Share with your neighbors
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-warm-gray/50 mb-1">Nickname</label>
            <input
              type="text"
              required
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="e.g., Priya"
              className="w-full bg-cream/50 border border-warm-gray/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-warm-gray/50 mb-1">Neighborhood</label>
            <input
              type="text"
              required
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              placeholder="e.g., Oak Street"
              className="w-full bg-cream/50 border border-warm-gray/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-warm-gray/50 mb-1">I can help with...</label>
          <input
            type="text"
            required
            maxLength={120}
            value={offer}
            onChange={(e) => setOffer(e.target.value)}
            placeholder="e.g., Fixing sinks, algebra tutoring"
            className="w-full bg-cream/50 border border-warm-gray/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all"
          />
          <div className="text-[10px] text-right text-warm-gray/40 mt-1">{offer.length}/120</div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-warm-gray/50 mb-1">I need help with...</label>
          <input
            type="text"
            required
            maxLength={120}
            value={need}
            onChange={(e) => setNeed(e.target.value)}
            placeholder="e.g., Moving boxes, baking bread"
            className="w-full bg-cream/50 border border-warm-gray/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all"
          />
          <div className="text-[10px] text-right text-warm-gray/40 mt-1">{need.length}/120</div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={cn(
            "w-full bg-sage hover:bg-sage-dark text-cream font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2",
            loading && "opacity-50 cursor-not-allowed"
          )}
        >
          {loading ? "Posting..." : (
            <>
              Post to community board <Send size={16} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
