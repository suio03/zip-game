import { GameGrid, Position } from '../types/game';

// Find a solution path that connects all dots without crossing itself
export function findSolutionPath(grid: GameGrid): Position[] | null {
  const allPositions = getAllGridPositions(grid);
  const dotPositions = grid.dots.map(dot => dot.position);
  
  // Use backtracking to find a path that visits all dots
  const visited = new Set<string>();
  const path: Position[] = [];
  
  // Try starting from each dot position
  for (const startDot of dotPositions) {
    visited.clear();
    path.length = 0;
    
    if (findPathRecursive(startDot, dotPositions, path, visited, grid)) {
      return path;
    }
  }
  
  return null;
}

function findPathRecursive(
  current: Position,
  remainingDots: Position[],
  path: Position[],
  visited: Set<string>,
  grid: GameGrid
): boolean {
  const key = `${current.x},${current.y}`;
  
  if (visited.has(key)) {
    return false;
  }
  
  visited.add(key);
  path.push(current);
  
  // Check if we've visited all dots
  const connectedDots = remainingDots.filter(dot =>
    path.some(pos => pos.x === dot.x && pos.y === dot.y)
  );
  
  if (connectedDots.length === remainingDots.length) {
    return true; // Found a solution!
  }
  
  // Try all adjacent positions
  const adjacentPositions = getAdjacentPositions(current, grid);
  
  for (const next of adjacentPositions) {
    if (findPathRecursive(next, remainingDots, path, visited, grid)) {
      return true;
    }
  }
  
  // Backtrack
  visited.delete(key);
  path.pop();
  return false;
}

function getAdjacentPositions(pos: Position, grid: GameGrid): Position[] {
  const adjacent: Position[] = [];
  const directions = [
    { x: 0, y: 1 },   // down
    { x: 1, y: 0 },   // right
    { x: 0, y: -1 },  // up
    { x: -1, y: 0 }   // left
  ];
  
  for (const dir of directions) {
    const newPos = { x: pos.x + dir.x, y: pos.y + dir.y };
    
    if (newPos.x >= 0 && newPos.x < grid.size && 
        newPos.y >= 0 && newPos.y < grid.size) {
      adjacent.push(newPos);
    }
  }
  
  return adjacent;
}

function getAllGridPositions(grid: GameGrid): Position[] {
  const positions: Position[] = [];
  
  for (let y = 0; y < grid.size; y++) {
    for (let x = 0; x < grid.size; x++) {
      positions.push({ x, y });
    }
  }
  
  return positions;
}

// Validate that a player's path is valid (no self-crossing, connects all dots)
export function validatePlayerPath(path: Position[], grid: GameGrid): {
  isValid: boolean;
  connectedDots: number;
  totalDots: number;
  hasSelfCrossing: boolean;
} {
  const visited = new Set<string>();
  let hasSelfCrossing = false;
  
  // Check for self-crossing
  for (const pos of path) {
    const key = `${pos.x},${pos.y}`;
    if (visited.has(key)) {
      hasSelfCrossing = true;
      break;
    }
    visited.add(key);
  }
  
  // Count connected dots
  const connectedDots = grid.dots.filter(dot =>
    path.some(pos => pos.x === dot.position.x && pos.y === dot.position.y)
  ).length;
  
  const isValid = !hasSelfCrossing && connectedDots === grid.dots.length;
  
  return {
    isValid,
    connectedDots,
    totalDots: grid.dots.length,
    hasSelfCrossing
  };
}