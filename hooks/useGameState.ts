import { useState, useCallback, useRef, useEffect } from 'react';
import { GameState, Path, Dot, GameMode } from '../types/game';
import { generateGrid } from '../lib/gridGenerator';
import { validatePath, isPathComplete } from '../lib/pathValidator';
import { getTodaysDateString, isDailyCompletedToday, getTodaysDailySeed, markDailyCompleted } from '../lib/dailyChallenge';
import { GamePerformanceTracker } from '../lib/performanceTracker';
import { updateUserStats } from '../lib/userStats';

export function useGameState(initialDifficulty: 'easy' | 'medium' = 'easy', initialGameMode: GameMode = 'daily') {
  // Performance tracker persists across renders
  const performanceTracker = useRef(new GamePerformanceTracker());
  
  const [gameState, setGameState] = useState<GameState>(() => {
    const isDailyMode = initialGameMode === 'daily';
    const size = isDailyMode ? 6 : (initialDifficulty === 'easy' ? 5 : 6); // Daily challenges are always 6x6
    const seed = isDailyMode ? getTodaysDailySeed() : undefined;
    const grid = generateGrid(size, seed);
    
    // Check if daily challenge is already completed
    const isDailyCompleted = isDailyCompletedToday();
    const isGameComplete = isDailyMode && isDailyCompleted;
    
    return {
      grid,
      currentPath: { dots: [], isComplete: false, isValid: true },
      isGameComplete,
      difficulty: initialDifficulty,
      gameMode: initialGameMode,
      isDailyCompleted,
      dailyChallengeDate: getTodaysDateString()
    };
  });
  
  // Start tracking performance when game state is initialized
  useEffect(() => {
    performanceTracker.current.startGame(gameState.gameMode, gameState.difficulty);
  }, []); // Only run on mount

  const resetGame = useCallback((difficulty: 'easy' | 'medium' = gameState.difficulty, gameMode: GameMode = gameState.gameMode) => {
    const isDailyMode = gameMode === 'daily';
    const size = isDailyMode ? 6 : (difficulty === 'easy' ? 5 : 6); // Daily challenges are always 6x6
    const seed = isDailyMode ? getTodaysDailySeed() : undefined;
    const grid = generateGrid(size, seed);
    
    // Start tracking new game performance
    performanceTracker.current.startGame(gameMode, difficulty);
    
    setGameState({
      grid,
      currentPath: { dots: [], isComplete: false, isValid: true },
      isGameComplete: false,
      difficulty,
      gameMode,
      isDailyCompleted: isDailyCompletedToday(),
      dailyChallengeDate: getTodaysDateString()
    });
  }, [gameState.difficulty, gameState.gameMode]);

  const addDotToPath = useCallback((dot: Dot) => {
    // Track the move
    performanceTracker.current.trackMove();
    
    setGameState(prev => {
      const newPath: Path = {
        ...prev.currentPath,
        dots: [...prev.currentPath.dots, dot]
      };

      const isValid = validatePath(prev.grid, newPath);
      const isComplete = isPathComplete(newPath);
      const gameCompleted = isComplete && isValid;

      const newState = {
        ...prev,
        currentPath: {
          ...newPath,
          isValid,
          isComplete
        },
        isGameComplete: gameCompleted
      };
      
      // Handle game completion
      if (gameCompleted) {
        // Complete performance tracking
        const gamePerformance = performanceTracker.current.completeGame(true);
        
        // Check if this is a new daily completion
        const isNewDailyCompletion = prev.gameMode === 'daily' && !prev.isDailyCompleted;
        
        // Update user stats
        updateUserStats({
          gamePerformance,
          isNewDailyCompletion
        });
        
        // If this is a daily challenge completion, mark it as completed
        if (isNewDailyCompletion) {
          markDailyCompleted();
          newState.isDailyCompleted = true;
        }
      }
      
      return newState;
    });
  }, []);

  const clearPath = useCallback(() => {
    // Reset move count in performance tracker
    performanceTracker.current.resetMoves();
    
    setGameState(prev => ({
      ...prev,
      currentPath: { dots: [], isComplete: false, isValid: true },
      isGameComplete: false
    }));
  }, []);
  
  const switchGameMode = useCallback((newGameMode: GameMode) => {
    resetGame(gameState.difficulty, newGameMode);
  }, [resetGame, gameState.difficulty]);

  const setGameCompleted = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isGameComplete: true,
      isDailyCompleted: prev.gameMode === 'daily' ? true : prev.isDailyCompleted
    }));
  }, []);

  return {
    gameState,
    resetGame,
    addDotToPath,
    clearPath,
    switchGameMode,
    setGameCompleted
  };
}