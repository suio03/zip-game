export interface UserStats {
  // Daily Challenge Stats
  dailyStreak: number;
  bestStreak: number;
  dailyGamesPlayed: number;
  dailyGamesWon: number;
  lastDailyCompletion: string; // ISO date string
  
  // Unlimited Mode Stats  
  unlimitedGamesPlayed: number;
  unlimitedGamesWon: number;
  
  // Performance Metrics
  totalTimePlayed: number; // milliseconds
  averageCompletionTime: number; // milliseconds
  bestCompletionTime: number; // milliseconds
  totalMoves: number;
  averageMovesPerGame: number;
  
  // Daily Challenge History
  completedDates: string[]; // Array of completed dates (ISO format)
  
  // Settings & Preferences
  preferredDifficulty: 'easy' | 'medium';
  firstPlayDate: string; // ISO date string
}

export interface GamePerformance {
  duration: number; // milliseconds
  moves: number;
  difficulty: 'easy' | 'medium';
  gameMode: 'daily' | 'unlimited';
  completed: boolean;
  date: string; // ISO date string
}

export interface StatsUpdate {
  gamePerformance: GamePerformance;
  isNewDailyCompletion?: boolean;
}

// Default user stats for new players
export const DEFAULT_USER_STATS: UserStats = {
  dailyStreak: 0,
  bestStreak: 0,
  dailyGamesPlayed: 0,
  dailyGamesWon: 0,
  lastDailyCompletion: '',
  
  unlimitedGamesPlayed: 0,
  unlimitedGamesWon: 0,
  
  totalTimePlayed: 0,
  averageCompletionTime: 0,
  bestCompletionTime: 0,
  totalMoves: 0,
  averageMovesPerGame: 0,
  
  completedDates: [],
  
  preferredDifficulty: 'easy',
  firstPlayDate: new Date().toISOString(),
};