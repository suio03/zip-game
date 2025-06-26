import { UserStats, GamePerformance, StatsUpdate, DEFAULT_USER_STATS } from '../types/userStats';
import { getTodaysDateString } from './dailyChallenge';

const STORAGE_KEY = 'zip-game-user-stats';
const STATS_VERSION = '1.0';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

/**
 * Get user stats from localStorage or return defaults
 */
export function getUserStats(): UserStats {
  if (!isBrowser) {
    return { ...DEFAULT_USER_STATS };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // First time user - initialize with defaults
      const newStats = { ...DEFAULT_USER_STATS };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
      return newStats;
    }

    const parsed = JSON.parse(stored);
    
    // Migrate data if needed
    const migrated = migrateStatsIfNeeded(parsed);
    
    // Ensure all required fields exist
    return { ...DEFAULT_USER_STATS, ...migrated };
  } catch (error) {
    console.warn('Error loading user stats, using defaults:', error);
    return { ...DEFAULT_USER_STATS };
  }
}

/**
 * Update user stats with new game performance data
 */
export function updateUserStats(update: StatsUpdate): UserStats {
  const currentStats = getUserStats();
  const { gamePerformance, isNewDailyCompletion } = update;
  
  // Create updated stats
  const updatedStats: UserStats = { ...currentStats };
  
  // Update game counters
  if (gamePerformance.gameMode === 'daily') {
    updatedStats.dailyGamesPlayed++;
    if (gamePerformance.completed) {
      updatedStats.dailyGamesWon++;
    }
  } else {
    updatedStats.unlimitedGamesPlayed++;
    if (gamePerformance.completed) {
      updatedStats.unlimitedGamesWon++;
    }
  }
  
  // Update performance metrics (only for completed games)
  if (gamePerformance.completed) {
    // Time tracking
    updatedStats.totalTimePlayed += gamePerformance.duration;
    
    if (updatedStats.bestCompletionTime === 0 || gamePerformance.duration < updatedStats.bestCompletionTime) {
      updatedStats.bestCompletionTime = gamePerformance.duration;
    }
    
    // Move tracking
    updatedStats.totalMoves += gamePerformance.moves;
    
    // Calculate averages
    const totalCompletedGames = updatedStats.dailyGamesWon + updatedStats.unlimitedGamesWon;
    if (totalCompletedGames > 0) {
      updatedStats.averageCompletionTime = updatedStats.totalTimePlayed / totalCompletedGames;
      updatedStats.averageMovesPerGame = updatedStats.totalMoves / totalCompletedGames;
    }
    
    // Update daily challenge specific stats
    if (gamePerformance.gameMode === 'daily' && isNewDailyCompletion) {
      const today = getTodaysDateString();
      
      // Add today to completed dates
      if (!updatedStats.completedDates.includes(today)) {
        updatedStats.completedDates.push(today);
        updatedStats.completedDates.sort(); // Keep sorted
      }
      
      // Update last completion
      updatedStats.lastDailyCompletion = today;
      
      // Calculate streak
      updatedStats.dailyStreak = calculateCurrentStreak(updatedStats.completedDates);
      
      // Update best streak
      if (updatedStats.dailyStreak > updatedStats.bestStreak) {
        updatedStats.bestStreak = updatedStats.dailyStreak;
      }
    }
  }
  
  // Save updated stats
  saveUserStats(updatedStats);
  return updatedStats;
}

/**
 * Calculate current daily streak based on completed dates
 */
function calculateCurrentStreak(completedDates: string[]): number {
  if (completedDates.length === 0) return 0;
  
  const today = getTodaysDateString();
  const sortedDates = [...completedDates].sort().reverse(); // Most recent first
  
  let streak = 0;
  let currentDate = new Date(today);
  
  for (const dateStr of sortedDates) {
    const completedDate = new Date(dateStr);
    const expectedDate = new Date(currentDate);
    
    // Check if this date matches our expected streak date
    if (dateStr === expectedDate.toISOString().split('T')[0]) {
      streak++;
      // Move to previous day
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      // Streak is broken
      break;
    }
  }
  
  return streak;
}

/**
 * Reset all user stats to defaults
 */
export function resetStats(): UserStats {
  const newStats = { ...DEFAULT_USER_STATS };
  saveUserStats(newStats);
  return newStats;
}

/**
 * Migrate stats from older versions if needed
 */
export function migrateStatsIfNeeded(stats: any): UserStats {
  // Check if migration is needed
  if (stats.version === STATS_VERSION) {
    return stats;
  }
  
  // Version 1.0 migration (initial version)
  const migrated: UserStats = {
    // Preserve existing values or use defaults
    dailyStreak: stats.dailyStreak ?? 0,
    bestStreak: stats.bestStreak ?? 0,
    dailyGamesPlayed: stats.dailyGamesPlayed ?? 0,
    dailyGamesWon: stats.dailyGamesWon ?? 0,
    lastDailyCompletion: stats.lastDailyCompletion ?? '',
    
    unlimitedGamesPlayed: stats.unlimitedGamesPlayed ?? 0,
    unlimitedGamesWon: stats.unlimitedGamesWon ?? 0,
    
    totalTimePlayed: stats.totalTimePlayed ?? 0,
    averageCompletionTime: stats.averageCompletionTime ?? 0,
    bestCompletionTime: stats.bestCompletionTime ?? 0,
    totalMoves: stats.totalMoves ?? 0,
    averageMovesPerGame: stats.averageMovesPerGame ?? 0,
    
    completedDates: stats.completedDates ?? [],
    
    preferredDifficulty: stats.preferredDifficulty ?? 'easy',
    firstPlayDate: stats.firstPlayDate ?? new Date().toISOString(),
  };
  
  console.log('Migrated user stats to version', STATS_VERSION);
  return migrated;
}

/**
 * Save user stats to localStorage
 */
function saveUserStats(stats: UserStats): void {
  if (!isBrowser) return;
  
  try {
    const toSave = {
      ...stats,
      version: STATS_VERSION,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (error) {
    console.error('Error saving user stats:', error);
  }
}

/**
 * Export user stats as JSON for backup
 */
export function exportUserStats(): string {
  const stats = getUserStats();
  return JSON.stringify(stats, null, 2);
}

/**
 * Import user stats from JSON backup
 */
export function importUserStats(jsonData: string): boolean {
  try {
    const imported = JSON.parse(jsonData);
    const migrated = migrateStatsIfNeeded(imported);
    saveUserStats(migrated);
    return true;
  } catch (error) {
    console.error('Error importing user stats:', error);
    return false;
  }
}

/**
 * Get daily challenge statistics
 */
export function getDailyStats(): {
  gamesPlayed: number;
  gamesWon: number;
  winRate: number;
  currentStreak: number;
  bestStreak: number;
} {
  const stats = getUserStats();
  
  const winRate = stats.dailyGamesPlayed > 0 ? (stats.dailyGamesWon / stats.dailyGamesPlayed) * 100 : 0;
  
  return {
    gamesPlayed: stats.dailyGamesPlayed,
    gamesWon: stats.dailyGamesWon,
    winRate: Math.round(winRate),
    currentStreak: stats.dailyStreak,
    bestStreak: stats.bestStreak,
  };
}

/**
 * Get unlimited mode statistics  
 */
export function getUnlimitedStats(): {
  gamesPlayed: number;
  gamesWon: number;
  winRate: number;
} {
  const stats = getUserStats();
  
  const winRate = stats.unlimitedGamesPlayed > 0 ? (stats.unlimitedGamesWon / stats.unlimitedGamesPlayed) * 100 : 0;
  
  return {
    gamesPlayed: stats.unlimitedGamesPlayed,
    gamesWon: stats.unlimitedGamesWon,
    winRate: Math.round(winRate),
  };
}

/**
 * Get overall performance statistics (timing, moves)
 */
export function getPerformanceStats(): {
  averageTime: string;
  bestTime: string;
  totalGames: number;
  totalWins: number;
} {
  const stats = getUserStats();
  
  const totalGames = stats.dailyGamesPlayed + stats.unlimitedGamesPlayed;
  const totalWins = stats.dailyGamesWon + stats.unlimitedGamesWon;
  
  // Format time in seconds
  const formatTime = (ms: number): string => {
    if (ms === 0) return '--';
    const seconds = Math.round(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return minutes > 0 ? `${minutes}:${remainingSeconds.toString().padStart(2, '0')}` : `${seconds}s`;
  };
  
  return {
    averageTime: formatTime(stats.averageCompletionTime),
    bestTime: formatTime(stats.bestCompletionTime),
    totalGames,
    totalWins,
  };
}

/**
 * Get summary statistics for display (legacy function for compatibility)
 */
export function getStatsSummary(): {
  totalGames: number;
  totalWins: number;
  winRate: number;
  currentStreak: number;
  bestStreak: number;
  averageTime: string;
  bestTime: string;
} {
  const dailyStats = getDailyStats();
  const unlimitedStats = getUnlimitedStats();
  const performanceStats = getPerformanceStats();
  
  const totalGames = performanceStats.totalGames;
  const totalWins = performanceStats.totalWins;
  const winRate = totalGames > 0 ? (totalWins / totalGames) * 100 : 0;
  
  return {
    totalGames,
    totalWins,
    winRate: Math.round(winRate),
    currentStreak: dailyStats.currentStreak,
    bestStreak: dailyStats.bestStreak,
    averageTime: performanceStats.averageTime,
    bestTime: performanceStats.bestTime,
  };
}