import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import CryptoJS from 'crypto-js';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getGravatarUrl(nickname: string) {
  const hash = CryptoJS.MD5(nickname.toLowerCase().trim()).toString();
  return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=150`;
}
