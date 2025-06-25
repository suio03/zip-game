'use client';

import { useState, useCallback, useRef } from 'react';
import { GameGrid, Position } from '../types/game';

interface UseDragPathProps {
  grid: GameGrid;
  onPathComplete: (path: Position[]) => void;
}

function areAdjacent(a: Position, b: Position): boolean {
  return (
    (Math.abs(a.x - b.x) === 1 && a.y === b.y) ||
    (Math.abs(a.y - b.y) === 1 && a.x === b.x)
  );
}

function posEquals(a: Position, b: Position): boolean {
  return a.x === b.x && a.y === b.y;
}

// Validate that dots are connected in the correct sequence (1→2→3→etc.)
function validateDotSequence(path: Position[], grid: GameGrid): boolean {
  const dotsInPath = grid.dots
    .filter(dot => path.some(pathPos => posEquals(pathPos, dot.position)))
    .sort((a, b) => a.number - b.number);
  
  if (dotsInPath.length !== grid.dots.length) {
    return false; // Not all dots are in the path
  }
  
  // Check if dots appear in the correct sequence in the path
  let expectedNextDot = 1;
  
  for (const pathPos of path) {
    const dotAtPosition = grid.dots.find(dot => posEquals(dot.position, pathPos));
    
    if (dotAtPosition) {
      if (dotAtPosition.number !== expectedNextDot) {
        return false; // Dots are not in sequence
      }
      expectedNextDot++;
    }
  }
  
  return expectedNextDot > grid.dots.length; // All dots were found in sequence
}

export function useDragPath({ grid, onPathComplete }: UseDragPathProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [currentPath, setCurrentPath] = useState<Position[]>([]);
  const [dragPosition, setDragPosition] = useState<Position | null>(null);
  const lastDragPosRef = useRef<Position | null>(null);

  // Start drag: if on last cell of path, continue; else, start new path
  const handleMouseDown = useCallback((x: number, y: number) => {
    const pos = { x, y };
    if (
      currentPath.length === 0 ||
      posEquals(currentPath[currentPath.length - 1], pos)
    ) {
      setIsDragging(true);
      lastDragPosRef.current = pos;
      setDragPosition(pos);
      if (currentPath.length === 0) {
        setCurrentPath([pos]);
      }
    }
  }, [currentPath]);

  // Drag: add cell if adjacent, not blocked, and not already in path
  const handleMouseMove = useCallback((x: number, y: number) => {
    if (!isDragging) return;
    const pos = { x, y };
    setDragPosition(pos);
    
    // Check if position is within grid bounds
    if (x < 0 || x >= grid.size || y < 0 || y >= grid.size) return;
    
    const last = currentPath[currentPath.length - 1];
    
    // Check if we're dragging to a position that's already in the path (for reversing)
    const existingIndex = currentPath.findIndex(p => posEquals(p, pos));
    
    if (existingIndex !== -1 && existingIndex < currentPath.length - 1) {
      // User is dragging back to a previous position - reverse/undo the path
      const newPath = currentPath.slice(0, existingIndex + 1);
      setCurrentPath(newPath);
      lastDragPosRef.current = pos;
      return;
    }
    
    // Normal forward movement: add cell if adjacent, not blocked, and not already in path
    if (
      !posEquals(pos, last) &&
      areAdjacent(last, pos) &&
      !currentPath.some(p => posEquals(p, pos))
    ) {
      const newPath = [...currentPath, pos];
      setCurrentPath(newPath);
      lastDragPosRef.current = pos;
      
      const totalCells = grid.size * grid.size;
      const allCellsFilled = newPath.length === totalCells;
      
      // Only check for completion if all cells are filled
      if (allCellsFilled) {
        // Validate that dots are connected in the correct sequence
        const validSequence = validateDotSequence(newPath, grid);
        
        if (validSequence) {
          onPathComplete(newPath);
        }
      }
    }
  }, [isDragging, currentPath, grid, onPathComplete]);

  // End drag: finalize path, but keep it for continuation
  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      setDragPosition(null);
      // Optionally, call onPathComplete if you want to auto-complete
      // onPathComplete(currentPath);
    }
  }, [isDragging]);

  // Clear path
  const clearPath = useCallback(() => {
    setCurrentPath([]);
    setIsDragging(false);
    setDragPosition(null);
    lastDragPosRef.current = null;
  }, []);

  return {
    isDragging,
    currentPath,
    dragPosition,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    clearPath
  };
}