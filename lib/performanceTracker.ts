import { GamePerformance } from '../types/userStats';
import { GameMode } from '../types/game';

export class GamePerformanceTracker {
  private startTime: number = 0;
  private moveCount: number = 0;
  private gameMode: GameMode = 'unlimited';
  private difficulty: 'easy' | 'medium' = 'easy';
  private isTracking: boolean = false;

  /**
   * Start tracking a new game
   */
  public startGame(gameMode: GameMode = 'unlimited', difficulty: 'easy' | 'medium' = 'easy'): void {
    this.startTime = Date.now();
    this.moveCount = 0;
    this.gameMode = gameMode;
    this.difficulty = difficulty;
    this.isTracking = true;
  }

  /**
   * Track a player move (dot connection)
   */
  public trackMove(): void {
    if (!this.isTracking) return;
    this.moveCount++;
  }

  /**
   * Reset move count (for when player clears path)
   */
  public resetMoves(): void {
    if (!this.isTracking) return;
    this.moveCount = 0;
  }

  /**
   * Complete the game and return performance data
   */
  public completeGame(completed: boolean = true): GamePerformance {
    const endTime = Date.now();
    const duration = this.isTracking ? endTime - this.startTime : 0;
    
    const performance: GamePerformance = {
      duration,
      moves: this.moveCount,
      difficulty: this.difficulty,
      gameMode: this.gameMode,
      completed,
      date: new Date().toISOString(),
    };

    // Reset tracking state
    this.isTracking = false;
    
    return performance;
  }

  /**
   * Stop tracking without completing (for game resets)
   */
  public stopTracking(): void {
    this.isTracking = false;
  }

  /**
   * Get current tracking status
   */
  public isCurrentlyTracking(): boolean {
    return this.isTracking;
  }

  /**
   * Get current move count
   */
  public getCurrentMoveCount(): number {
    return this.moveCount;
  }

  /**
   * Get current game duration in milliseconds
   */
  public getCurrentDuration(): number {
    if (!this.isTracking) return 0;
    return Date.now() - this.startTime;
  }

  /**
   * Get current game mode
   */
  public getCurrentGameMode(): GameMode {
    return this.gameMode;
  }

  /**
   * Get current difficulty
   */
  public getCurrentDifficulty(): 'easy' | 'medium' {
    return this.difficulty;
  }

  /**
   * Pause tracking (useful for when game is in background)
   */
  public pauseTracking(): void {
    if (!this.isTracking) return;
    
    // Store the elapsed time by updating start time
    const elapsed = Date.now() - this.startTime;
    this.startTime = Date.now() - elapsed;
  }

  /**
   * Resume tracking after pause
   */
  public resumeTracking(): void {
    if (!this.isTracking) return;
    
    // Start time is already adjusted from pause, no action needed
    // This method exists for symmetry and future enhancements
  }

  /**
   * Get formatted duration string for display
   */
  public getFormattedDuration(): string {
    const duration = this.getCurrentDuration();
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    } else {
      return `${seconds}s`;
    }
  }

  /**
   * Create a performance summary for display
   */
  public getPerformanceSummary(): {
    duration: string;
    moves: number;
    gameMode: GameMode;
    difficulty: 'easy' | 'medium';
  } {
    return {
      duration: this.getFormattedDuration(),
      moves: this.moveCount,
      gameMode: this.gameMode,
      difficulty: this.difficulty,
    };
  }
}