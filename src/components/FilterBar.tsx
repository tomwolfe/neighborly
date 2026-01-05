'use client';

import React from 'react';
import { Search, MapPin, Filter } from 'lucide-react';

interface FilterBarProps {
  search: string;
  setSearch: (val: string) => void;
  neighborhood: string;
  setNeighborhood: (val: string) => void;
  filterType: 'all' | 'offer' | 'need';
  setFilterType: (val: 'all' | 'offer' | 'need') => void;
  neighborhoods: string[];
}

export default function FilterBar({ 
  search, setSearch, 
  neighborhood, setNeighborhood, 
  filterType, setFilterType,
  neighborhoods 
}: FilterBarProps) {
  return (
    <div className="bg-white border border-warm-gray/10 rounded-2xl p-4 shadow-sm mb-6 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-gray/30" size={18} />
          <input 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search skills (e.g., sink, algebra)..."
            className="w-full bg-cream/30 border border-warm-gray/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sage/20 focus:border-sage"
          />
        </div>
        
        <div className="relative w-full md:w-64">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-gray/30" size={18} />
          <select 
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            className="w-full bg-cream/30 border border-warm-gray/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sage/20 focus:border-sage appearance-none cursor-pointer"
          >
            <option value="">All Neighborhoods</option>
            {neighborhoods.map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2">
        <div className="text-[10px] font-bold uppercase tracking-widest text-warm-gray/30 mr-2 flex items-center gap-1">
          <Filter size={12} /> Filter By:
        </div>
        {(['all', 'offer', 'need'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              filterType === type 
                ? 'bg-sage text-cream' 
                : 'bg-warm-gray/5 text-warm-gray/60 hover:bg-warm-gray/10'
            }`}
          >
            {type === 'all' ? 'All Posts' : type === 'offer' ? 'Offers' : 'Needs'}
          </button>
        ))}
      </div>
    </div>
  );
}
