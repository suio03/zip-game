import { GameGrid, Path, Dot, Position } from '../types/game';

export function isValidConnection(from: Dot, to: Dot): boolean {
  // Check if dots are sequential (1->2, 2->3, etc.)
  return to.number === from.number + 1;
}

export function getDistance(pos1: Position, pos2: Position): number {
  return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
}

export function isReachable(from: Position, to: Position, grid: GameGrid): boolean {
  // Try L-shaped paths: horizontal then vertical, or vertical then horizontal
  return canReachHV(from, to, grid) || canReachVH(from, to, grid);
}

function canReachHV(from: Position, to: Position, grid: GameGrid): boolean {
  // Horizontal first, then vertical
  const startX = Math.min(from.x, to.x);
  const endX = Math.max(from.x, to.x);
  
  // Check horizontal path at from.y
  for (let x = startX; x <= endX; x++) {
    if (x === from.x || x === to.x) continue; // Skip start and end positions
    const cell = grid.cells[from.y][x];
    if (cell.isOccupied) return false;
  }

  // Check vertical path at to.x
  const startY = Math.min(from.y, to.y);
  const endY = Math.max(from.y, to.y);
  
  for (let y = startY; y <= endY; y++) {
    if (y === from.y || y === to.y) continue; // Skip start and end positions
    const cell = grid.cells[y][to.x];
    if (cell.isOccupied) return false;
  }

  return true;
}

function canReachVH(from: Position, to: Position, grid: GameGrid): boolean {
  // Vertical first, then horizontal
  const startY = Math.min(from.y, to.y);
  const endY = Math.max(from.y, to.y);
  
  // Check vertical path at from.x
  for (let y = startY; y <= endY; y++) {
    if (y === from.y || y === to.y) continue; // Skip start and end positions
    const cell = grid.cells[y][from.x];
    if (cell.isOccupied) return false;
  }

  // Check horizontal path at to.y
  const startX = Math.min(from.x, to.x);
  const endX = Math.max(from.x, to.x);
  
  for (let x = startX; x <= endX; x++) {
    if (x === from.x || x === to.x) continue; // Skip start and end positions
    const cell = grid.cells[to.y][x];
    if (cell.isOccupied) return false;
  }

  return true;
}

export function validatePath(grid: GameGrid, path: Path): boolean {
  if (path.dots.length < 2) return true;

  for (let i = 0; i < path.dots.length - 1; i++) {
    const current = path.dots[i];
    const next = path.dots[i + 1];

    // Check if connection is valid (sequential numbers)
    if (!isValidConnection(current, next)) {
      return false;
    }

    // Check if dots are reachable
    if (!isReachable(current.position, next.position, grid)) {
      return false;
    }
  }

  return true;
}

export function isPathComplete(path: Path): boolean {
  return path.dots.length === 8 && path.dots[path.dots.length - 1].number === 8;
}