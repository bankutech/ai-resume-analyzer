import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString?: string): string {
  if (!dateString) return '';
  return dateString;
}

export function calculateReadingTimeMinutes(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / 200);
}
