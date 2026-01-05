'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Post, UserStats } from '@/lib/types';
import PostCard from './PostCard';
import FilterBar from './FilterBar';
import ReplyModal from './ReplyModal';
import { RefreshCcw } from 'lucide-react';
import Toast from './ui/Toast';

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [userStats, setUserStats] = useState<Record<string, UserStats>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'offer' | 'need'>('all');
  const [replyingTo, setReplyingTo] = useState<Post | null>(null);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const [limit, setLimit] = useState(10);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async (isLoadMore = false) => {
    if (!isLoadMore) setLoading(true);
    
    const currentLimit = isLoadMore ? limit + 10 : limit;
    if (isLoadMore) setLimit(currentLimit);

    // Fetch posts with replies from the separate table
    const { data: postsData, error: postsError } = await supabase
      .from('posts')
      .select(`
        *,
        replies (*)
      `)
      .order('created_at', { ascending: false })
      .range(0, currentLimit);

    if (!postsError && postsData) {
      setPosts(postsData);
      setHasMore(postsData.length > currentLimit);
    }

    // Fetch user stats from the view
    const { data: statsData, error: statsError } = await supabase
      .from('user_stats')
      .select('*');

    if (!statsError && statsData) {
      const statsMap = statsData.reduce((acc, curr) => {
        acc[curr.neighbor_id] = curr;
        return acc;
      }, {} as Record<string, UserStats>);
      setUserStats(statsMap);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();

    // Set up Realtime subscriptions
    const postsChannel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'posts' },
        () => fetchPosts()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'replies' },
        () => fetchPosts()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(postsChannel);
    };
  }, []);

  const neighborhoods = useMemo(() => {
    const unique = Array.from(new Set(posts.map(p => p.neighborhood)));
    return unique.sort().slice(0, 50);
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

        {hasMore && (
          <div className="pt-4 flex justify-center">
            <button
              onClick={() => fetchPosts(true)}
              className="text-sm font-bold text-warm-gray/60 hover:text-sage transition-colors py-2 px-6 rounded-full border border-warm-gray/10 hover:border-sage/20 bg-white/50"
            >
              Load more neighbors
            </button>
          </div>
        )}
      </div>

      <ReplyModal 
        post={replyingTo} 
        onClose={() => setReplyingTo(null)} 
        onSuccess={() => {
          setReplyingTo(null);
          setToast({ message: 'Reply sent! Neighbor notified.', type: 'success' });
          fetchPosts();
        }}
      />

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
}
