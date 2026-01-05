'use client';

import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
}

export default function Toast({ message, type = 'success', onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] animate-in fade-in slide-in-from-bottom-4">
      <div className={cn(
        "flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-md",
        type === 'success' ? "bg-white/90 border-sage/20 text-warm-gray" : "bg-red-50/90 border-red-200 text-red-900"
      )}>
        {type === 'success' && <CheckCircle2 className="text-sage" size={20} />}
        <p className="text-sm font-bold">{message}</p>
        <button onClick={onClose} className="ml-2 text-warm-gray/30 hover:text-warm-gray transition-colors">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
