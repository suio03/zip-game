// Simple seeded random number generator using Linear Congruential Generator (LCG)
// This ensures deterministic random numbers for daily challenges

export class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  // Generate next random number between 0 and 1
  public next(): number {
    // LCG formula: (a * seed + c) % m
    // Using values from Numerical Recipes: a=1664525, c=1013904223, m=2^32
    this.seed = (this.seed * 1664525 + 1013904223) % Math.pow(2, 32);
    return this.seed / Math.pow(2, 32);
  }

  // Generate random integer between 0 and max-1 (like Math.floor(Math.random() * max))
  public nextInt(max: number): number {
    return Math.floor(this.next() * max);
  }

  // Reset seed
  public setSeed(seed: number): void {
    this.seed = seed;
  }
}

// Convert date string to consistent seed number
export function getDailyChallengeSeed(date: Date): number {
  const dateString = date.toISOString().split('T')[0]; // "2024-12-26"
  
  // Simple hash function to convert date string to number
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    const char = dateString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Ensure positive seed
  return Math.abs(hash);
}

// Get today's daily challenge seed
export function getTodaysSeed(): number {
  const today = new Date();
  // Use UTC to ensure same seed globally
  const utcDate = new Date(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  return getDailyChallengeSeed(utcDate);
}