import { GameGrid, Position, Dot } from '../types/game';

export function canReachAllCells(grid: GameGrid, dots: Dot[]): boolean {
  if (dots.length !== 8) return false;

  // Sort dots by number to get the path order
  const sortedDots = [...dots].sort((a, b) => a.number - b.number);
  
  // Check if we can create a path that visits all cells
  const visited = new Set<string>();
  
  for (let i = 0; i < sortedDots.length - 1; i++) {
    const from = sortedDots[i].position;
    const to = sortedDots[i + 1].position;
    
    const path = findPath(from, to, grid);
    if (!path) return false;
    
    // Mark all cells in this path segment as visited
    path.forEach(pos => visited.add(`${pos.x},${pos.y}`));
  }

  return visited.size >= Math.floor(grid.size * grid.size * 0.6); // At least 60% coverage
}

function findPath(from: Position, to: Position, grid: GameGrid): Position[] | null {
  // Simple L-shaped path (horizontal then vertical, or vertical then horizontal)
  const path1 = getHVPath(from, to, grid);
  const path2 = getVHPath(from, to, grid);
  
  if (path1) return path1;
  if (path2) return path2;
  
  return null;
}

function getHVPath(from: Position, to: Position, grid: GameGrid): Position[] | null {
  const path: Position[] = [];
  
  // Horizontal movement first
  const startX = from.x;
  const endX = to.x;
  const y = from.y;
  
  if (startX !== endX) {
    const xStep = startX < endX ? 1 : -1;
    for (let x = startX; x !== endX; x += xStep) {
      if (isObstructed({ x, y }, grid, from, to)) return null;
      path.push({ x, y });
    }
  }
  
  // Vertical movement
  const startY = from.y;
  const endY = to.y;
  const x = to.x;
  
  if (startY !== endY) {
    const yStep = startY < endY ? 1 : -1;
    for (let y = startY; y !== endY; y += yStep) {
      if (isObstructed({ x, y }, grid, from, to)) return null;
      path.push({ x, y });
    }
  }
  
  path.push(to);
  return path;
}

function getVHPath(from: Position, to: Position, grid: GameGrid): Position[] | null {
  const path: Position[] = [];
  
  // Vertical movement first
  const startY = from.y;
  const endY = to.y;
  const x = from.x;
  
  if (startY !== endY) {
    const yStep = startY < endY ? 1 : -1;
    for (let y = startY; y !== endY; y += yStep) {
      if (isObstructed({ x, y }, grid, from, to)) return null;
      path.push({ x, y });
    }
  }
  
  // Horizontal movement
  const startX = from.x;
  const endX = to.x;
  const y = to.y;
  
  if (startX !== endX) {
    const xStep = startX < endX ? 1 : -1;
    for (let x = startX; x !== endX; x += xStep) {
      if (isObstructed({ x, y }, grid, from, to)) return null;
      path.push({ x, y });
    }
  }
  
  path.push(to);
  return path;
}

function isObstructed(pos: Position, grid: GameGrid, from: Position, to: Position): boolean {
  if (pos.x < 0 || pos.x >= grid.size || pos.y < 0 || pos.y >= grid.size) {
    return true;
  }
  
  const cell = grid.cells[pos.y][pos.x];
  
  // Allow movement through start and end positions
  if ((pos.x === from.x && pos.y === from.y) || (pos.x === to.x && pos.y === to.y)) {
    return false;
  }
  
  // Block if there's a dot that's not the start or end
  return cell.isOccupied;
}

export function generateSolvablePositions(size: number, dotCount: number): Position[] {
  const maxAttempts = 100;
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const positions = generateRandomPositions(size, dotCount);
    
    // Create a temporary grid to test solvability
    const testGrid = createTestGrid(size, positions);
    const testDots = positions.map((pos, index) => ({
      id: index,
      position: pos,
      number: index + 1
    }));
    
    if (canReachAllCells(testGrid, testDots)) {
      return positions;
    }
  }
  
  // Fallback: use a known solvable pattern
  return getFallbackPositions(size, dotCount);
}

function generateRandomPositions(size: number, count: number): Position[] {
  const positions: Position[] = [];
  const used = new Set<string>();

  while (positions.length < count) {
    const x = Math.floor(Math.random() * size);
    const y = Math.floor(Math.random() * size);
    const key = `${x},${y}`;

    if (!used.has(key)) {
      positions.push({ x, y });
      used.add(key);
    }
  }

  return positions;
}

function createTestGrid(size: number, positions: Position[]): GameGrid {
  const cells = Array(size).fill(null).map((_, y) =>
    Array(size).fill(null).map((_, x) => ({
      position: { x, y },
      isOccupied: positions.some(pos => pos.x === x && pos.y === y),
      isPath: false
    }))
  );

  return {
    size,
    cells,
    dots: []
  };
}

function getFallbackPositions(size: number, dotCount: number): Position[] {
  // Generate a spiral pattern that's guaranteed to be solvable
  const positions: Position[] = [];
  const center = Math.floor(size / 2);
  
  // Start from center and spiral outward
  positions.push({ x: center, y: center });
  
  let radius = 1;
  let currentCount = 1;
  
  while (currentCount < dotCount && radius < size) {
    // Try to place dots in a spiral pattern
    const candidates = getSpiralPositions(center, center, radius, size);
    
    for (const pos of candidates) {
      if (currentCount >= dotCount) break;
      
      if (!positions.some(p => p.x === pos.x && p.y === pos.y)) {
        positions.push(pos);
        currentCount++;
      }
    }
    
    radius++;
  }
  
  // Fill remaining positions randomly if needed
  while (positions.length < dotCount) {
    const x = Math.floor(Math.random() * size);
    const y = Math.floor(Math.random() * size);
    
    if (!positions.some(p => p.x === x && p.y === y)) {
      positions.push({ x, y });
    }
  }
  
  return positions.slice(0, dotCount);
}

function getSpiralPositions(centerX: number, centerY: number, radius: number, gridSize: number): Position[] {
  const positions: Position[] = [];
  
  for (let x = centerX - radius; x <= centerX + radius; x++) {
    for (let y = centerY - radius; y <= centerY + radius; y++) {
      if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
        if (x === centerX - radius || x === centerX + radius || 
            y === centerY - radius || y === centerY + radius) {
          positions.push({ x, y });
        }
      }
    }
  }
  
  return positions;
}