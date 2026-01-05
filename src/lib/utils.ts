import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import CryptoJS from 'crypto-js';

import { v4 as uuidv4 } from 'uuid';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getNeighborId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem('neighborly_id');
  if (!id) {
    id = uuidv4();
    localStorage.setItem('neighborly_id', id);
  }
  return id;
}

export function getGravatarUrl(nickname: string) {
  const hash = CryptoJS.MD5(nickname.toLowerCase().trim()).toString();
  return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=150`;
}
