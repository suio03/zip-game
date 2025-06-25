'use client';

import { useEffect, useState } from 'react';
import { GameGrid, Dot } from '../types/game';

interface UseKeyboardNavigationProps {
  grid: GameGrid;
  onDotSelect: (dot: Dot) => void;
}

export function useKeyboardNavigation({ grid, onDotSelect }: UseKeyboardNavigationProps) {
  const [selectedPosition, setSelectedPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const { key } = event;
      
      // Prevent default behavior for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Enter'].includes(key)) {
        event.preventDefault();
      }

      switch (key) {
        case 'ArrowUp':
          setSelectedPosition(prev => ({
            ...prev,
            y: Math.max(0, prev.y - 1)
          }));
          break;
        case 'ArrowDown':
          setSelectedPosition(prev => ({
            ...prev,
            y: Math.min(grid.size - 1, prev.y + 1)
          }));
          break;
        case 'ArrowLeft':
          setSelectedPosition(prev => ({
            ...prev,
            x: Math.max(0, prev.x - 1)
          }));
          break;
        case 'ArrowRight':
          setSelectedPosition(prev => ({
            ...prev,
            x: Math.min(grid.size - 1, prev.x + 1)
          }));
          break;
        case ' ':
        case 'Enter':
          const cell = grid.cells[selectedPosition.y][selectedPosition.x];
          if (cell.dot) {
            onDotSelect(cell.dot);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [grid, selectedPosition, onDotSelect]);

  return { selectedPosition };
}