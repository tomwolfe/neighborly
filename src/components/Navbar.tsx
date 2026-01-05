import React from 'react';
import { Home } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="border-b border-warm-gray/10 bg-cream/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-sage text-cream p-1.5 rounded-lg">
            <Home size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight text-warm-gray">Neighborly</span>
        </div>
        <div className="text-sm font-medium text-warm-gray/60 italic">
          Reciprocity starts here.
        </div>
      </div>
    </nav>
  );
}
