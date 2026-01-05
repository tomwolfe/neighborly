'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Post } from '@/lib/types';
import PostCard from './PostCard';
import FilterBar from './FilterBar';
import ReplyModal from './ReplyModal';
import { RefreshCcw } from 'lucide-react';

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'offer' | 'need'>('all');
  const [replyingTo, setReplyingTo] = useState<Post | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPosts(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const neighborhoods = useMemo(() => {
    const unique = Array.from(new Set(posts.map(p => p.neighborhood)));
    return unique.sort().slice(0, 50);
  }, [posts]);

  // Calculate stats for badges
  const userStats = useMemo(() => {
    const stats: Record<string, { posts: number, replies: number }> = {};
    
    posts.forEach(post => {
      // Count posts
      if (!stats[post.nickname]) stats[post.nickname] = { posts: 0, replies: 0 };
      stats[post.nickname].posts += 1;

      // Count replies made by users
      if (post.replies && Array.isArray(post.replies)) {
        post.replies.forEach(reply => {
          if (!stats[reply.nickname]) stats[reply.nickname] = { posts: 0, replies: 0 };
          stats[reply.nickname].replies += 1;
        });
      }
    });
    
    return stats;
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = 
        post.offer.toLowerCase().includes(search.toLowerCase()) || 
        post.need.toLowerCase().includes(search.toLowerCase()) ||
        post.nickname.toLowerCase().includes(search.toLowerCase());
      
      const matchesNeighborhood = !selectedNeighborhood || post.neighborhood === selectedNeighborhood;
      
      const matchesType = 
        filterType === 'all' || 
        (filterType === 'offer' && post.offer) || 
        (filterType === 'need' && post.need);

      return matchesSearch && matchesNeighborhood && matchesType;
    });
  }, [posts, search, selectedNeighborhood, filterType]);

  const handleRefresh = () => {
    fetchPosts();
  };

  return (
    <div className="space-y-6">
      <FilterBar 
        search={search}
        setSearch={setSearch}
        neighborhood={selectedNeighborhood}
        setNeighborhood={setSelectedNeighborhood}
        filterType={filterType}
        setFilterType={setFilterType}
        neighborhoods={neighborhoods}
      />

      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xs font-bold uppercase tracking-widest text-warm-gray/40">
          {loading ? 'Refreshing board...' : `${filteredPosts.length} neighbors active`}
        </h2>
        <button 
          onClick={handleRefresh}
          className="text-warm-gray/40 hover:text-sage transition-colors p-1"
          title="Refresh board"
        >
          <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading && posts.length === 0 ? (
          <div className="py-20 text-center">
            <div className="inline-block w-8 h-8 border-4 border-sage/20 border-t-sage rounded-full animate-spin mb-4"></div>
            <p className="text-warm-gray/40 text-sm font-medium">Walking down the street...</p>
          </div>
        ) : filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <PostCard 
              key={post.id} 
              post={post} 
              userStats={userStats}
              onReply={setReplyingTo}
            />
          ))
        ) : (
          <div className="py-20 text-center bg-white/50 border border-dashed border-warm-gray/20 rounded-2xl">
            <p className="text-warm-gray/40 text-sm">No neighbors found with those skills yet.</p>
          </div>
        )}
      </div>

      <ReplyModal 
        post={replyingTo} 
        onClose={() => setReplyingTo(null)} 
        onSuccess={() => {
          setReplyingTo(null);
          fetchPosts();
        }}
      />
    </div>
  );
}
