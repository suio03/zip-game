import { getTodaysSeed } from './seededRandom';

// Daily challenge utilities

export function getTodaysDateString(): string {
  const today = new Date();
  // Use UTC to ensure same date globally
  const utcDate = new Date(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  return utcDate.toISOString().split('T')[0]; // "2024-12-26"
}

export function isDailyCompletedToday(): boolean {
  // Check if we're in browser environment
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return false; // Default to not completed on server
  }
  
  const todayString = getTodaysDateString();
  const lastCompletion = localStorage.getItem('lastDailyCompletion');
  return lastCompletion === todayString;
}

export function markDailyCompleted(): void {
  // Check if we're in browser environment
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return; // Can't save on server
  }
  
  const todayString = getTodaysDateString();
  localStorage.setItem('lastDailyCompletion', todayString);
}

export function getTodaysDailySeed(): number {
  return getTodaysSeed();
}

export function canPlayDailyChallenge(): boolean {
  return !isDailyCompletedToday();
}