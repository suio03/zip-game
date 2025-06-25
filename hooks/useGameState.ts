import { useState, useCallback } from 'react';
import { GameState, Path, Dot } from '../types/game';
import { generateGrid } from '../lib/gridGenerator';
import { validatePath, isPathComplete } from '../lib/pathValidator';

export function useGameState(initialDifficulty: 'easy' | 'medium' = 'easy') {
  const [gameState, setGameState] = useState<GameState>(() => {
    const size = initialDifficulty === 'easy' ? 5 : 6;
    const grid = generateGrid(size);
    
    return {
      grid,
      currentPath: { dots: [], isComplete: false, isValid: true },
      isGameComplete: false,
      difficulty: initialDifficulty
    };
  });

  const resetGame = useCallback((difficulty: 'easy' | 'medium' = gameState.difficulty) => {
    const size = difficulty === 'easy' ? 5 : 6;
    const grid = generateGrid(size);
    
    setGameState({
      grid,
      currentPath: { dots: [], isComplete: false, isValid: true },
      isGameComplete: false,
      difficulty
    });
  }, [gameState.difficulty]);

  const addDotToPath = useCallback((dot: Dot) => {
    setGameState(prev => {
      const newPath: Path = {
        ...prev.currentPath,
        dots: [...prev.currentPath.dots, dot]
      };

      const isValid = validatePath(prev.grid, newPath);
      const isComplete = isPathComplete(newPath);

      return {
        ...prev,
        currentPath: {
          ...newPath,
          isValid,
          isComplete
        },
        isGameComplete: isComplete && isValid
      };
    });
  }, []);

  const clearPath = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      currentPath: { dots: [], isComplete: false, isValid: true },
      isGameComplete: false
    }));
  }, []);

  return {
    gameState,
    resetGame,
    addDotToPath,
    clearPath
  };
}