'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import CreatePostForm from '@/components/CreatePostForm';
import Feed from '@/components/Feed';
import Toast from '@/components/ui/Toast';

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const handlePostSuccess = () => {
    setRefreshKey(prev => prev + 1);
    setToast({ message: 'Posted to the neighborhood board!', type: 'success' });
  };

  return (
    <main className="min-h-screen bg-cream">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-warm-gray tracking-tight mb-4">
            Swap skills, <span className="text-sage">build trust.</span>
          </h1>
          <p className="text-lg text-warm-gray/60 max-w-md mx-auto leading-relaxed">
            A quiet place for neighborhoods to trade help. No money. No ads. Just community.
          </p>
        </header>

        <CreatePostForm onSuccess={handlePostSuccess} />
        
        <div className="mt-12">
          <Feed key={refreshKey} />
        </div>

        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}

        <footer className="mt-20 py-10 border-t border-warm-gray/10 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-warm-gray/30 mb-2">Neighborly</p>
          <p className="text-[10px] text-warm-gray/40">
            A public good for the neighborhood. Built with care for a zero-cost future.
          </p>
        </footer>
      </div>
    </main>
  );
}