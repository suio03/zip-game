import { GameGrid, Position, Dot } from '../types/game';
import { createEmptyGrid } from './gridGenerator';
import { SeededRandom } from './seededRandom';

// Generate a solvable maze where user must visit ALL cells and connect ALL dots
export function generateSolvableMaze(size: number, seed?: number): GameGrid {
  const grid = createEmptyGrid(size);
  
  // Generate a Hamiltonian path that visits ALL cells exactly once
  const randomGenerator = seed ? new SeededRandom(seed) : null;
  const hamiltonianPath = generateVariedHamiltonianPath(size, randomGenerator);
  
  // Select 8 random positions from this path for dots, ensuring dot 8 is at the end
  const dotPositions = selectRandomDotPositions(hamiltonianPath, 8, randomGenerator);
  
  // Place dots on the selected positions
  placeDots(grid, dotPositions);
  
  // Store the solution path in the grid for reference
  (grid as unknown as { solutionPath: Position[] }).solutionPath = hamiltonianPath;
  
  return grid;
}

function generateVariedHamiltonianPath(size: number, randomGenerator?: SeededRandom | null): Position[] {
  // Generate truly random Hamiltonian paths that can start/end anywhere
  // This ensures dots 1 and 8 appear in varied, unpredictable positions
  
  const maxAttempts = 100;
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Try random starting position (anywhere on the grid)
    const startX = randomGenerator ? randomGenerator.nextInt(size) : Math.floor(Math.random() * size);
    const startY = randomGenerator ? randomGenerator.nextInt(size) : Math.floor(Math.random() * size);
    const startPos = { x: startX, y: startY };
    
    const path = generateRandomHamiltonianFromStart(startPos, size, randomGenerator);
    if (path && path.length === size * size) {
      return path;
    }
  }
  
  // Fallback to ensure we always have a working puzzle
  return generateRandomSnakePath(size, randomGenerator);
}

function generateRandomHamiltonianFromStart(start: Position, size: number, randomGenerator?: SeededRandom | null): Position[] | null {
  const path: Position[] = [];
  const visited = new Set<string>();
  const totalCells = size * size;
  
  // Use backtracking to find a Hamiltonian path from the random start position
  if (findRandomHamiltonianPath(start, path, visited, size, totalCells, randomGenerator)) {
    return path;
  }
  
  return null;
}

function findRandomHamiltonianPath(
  current: Position,
  path: Position[],
  visited: Set<string>,
  size: number,
  targetLength: number,
  randomGenerator?: SeededRandom | null
): boolean {
  const key = `${current.x},${current.y}`;
  
  // Check bounds and if already visited
  if (current.x < 0 || current.x >= size || current.y < 0 || current.y >= size) {
    return false;
  }
  if (visited.has(key)) {
    return false;
  }
  
  // Add current position to path
  visited.add(key);
  path.push(current);
  
  // Check if we've found a complete path
  if (path.length === targetLength) {
    return true;
  }
  
  // Get all possible next positions in random order for variety
  const directions = getRandomizedDirections(current, randomGenerator);
  
  // Try each direction
  for (const next of directions) {
    if (findRandomHamiltonianPath(next, path, visited, size, targetLength, randomGenerator)) {
      return true;
    }
  }
  
  // Backtrack if no solution found
  visited.delete(key);
  path.pop();
  return false;
}

function getRandomizedDirections(current: Position, randomGenerator?: SeededRandom | null): Position[] {
  const directions = [
    { x: current.x + 1, y: current.y }, // right
    { x: current.x - 1, y: current.y }, // left
    { x: current.x, y: current.y + 1 }, // down
    { x: current.x, y: current.y - 1 }  // up
  ];
  
  // Fisher-Yates shuffle for true randomness
  for (let i = directions.length - 1; i > 0; i--) {
    const j = randomGenerator ? randomGenerator.nextInt(i + 1) : Math.floor(Math.random() * (i + 1));
    [directions[i], directions[j]] = [directions[j], directions[i]];
  }
  
  return directions;
}

function selectRandomDotPositions(path: Position[], dotCount: number, randomGenerator?: SeededRandom | null): Position[] {
  const positions: Position[] = [];
  
  // CRITICAL: Dot 1 at START of path, Dot 8 at END of path
  // This ensures the solution from dot 1 → dot 8 visits ALL cells
  const dot1Position = path[0]; // START of Hamiltonian path
  const dot8Position = path[path.length - 1]; // END of Hamiltonian path
  
  // For dots 2-7, randomly select positions from the middle of the path
  const middlePositions = path.slice(1, path.length - 1); // Exclude first and last positions
  const selectedIndices = new Set<number>();
  
  // Randomly select 6 positions for dots 2-7 from the middle positions
  while (selectedIndices.size < dotCount - 2 && selectedIndices.size < middlePositions.length) {
    const randomIndex = randomGenerator ? randomGenerator.nextInt(middlePositions.length) : Math.floor(Math.random() * middlePositions.length);
    selectedIndices.add(randomIndex);
  }
  
  // Convert to sorted array to maintain path order (essential for solvability)
  const sortedIndices = Array.from(selectedIndices).sort((a, b) => a - b);
  
  // Build the final dot positions array in order
  positions.push(dot1Position); // Dot 1 at START
  
  // Add dots 2-7 in path order
  sortedIndices.forEach(index => {
    positions.push(middlePositions[index]);
  });
  
  positions.push(dot8Position); // Dot 8 at END
  
  return positions;
}

function generateRandomSnakePath(size: number, randomGenerator?: SeededRandom | null): Position[] {
  // Choose random starting corner
  const corners = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
  const randomCorner = corners[randomGenerator ? randomGenerator.nextInt(corners.length) : Math.floor(Math.random() * corners.length)];
  return generateSnakePath(size, randomCorner);
}



function generateSnakePath(size: number, corner: string = 'top-left'): Position[] {
  const path: Position[] = [];
  
  switch (corner) {
    case 'top-right':
      for (let row = 0; row < size; row++) {
        if (row % 2 === 0) {
          // Even rows: right to left
          for (let col = size - 1; col >= 0; col--) {
            path.push({ x: col, y: row });
          }
        } else {
          // Odd rows: left to right
          for (let col = 0; col < size; col++) {
            path.push({ x: col, y: row });
          }
        }
      }
      break;
      
    case 'bottom-left':
      for (let row = size - 1; row >= 0; row--) {
        if ((size - 1 - row) % 2 === 0) {
          // Even rows from bottom: left to right
          for (let col = 0; col < size; col++) {
            path.push({ x: col, y: row });
          }
        } else {
          // Odd rows from bottom: right to left
          for (let col = size - 1; col >= 0; col--) {
            path.push({ x: col, y: row });
          }
        }
      }
      break;
      
    case 'bottom-right':
      for (let row = size - 1; row >= 0; row--) {
        if ((size - 1 - row) % 2 === 0) {
          // Even rows from bottom: right to left
          for (let col = size - 1; col >= 0; col--) {
            path.push({ x: col, y: row });
          }
        } else {
          // Odd rows from bottom: left to right
          for (let col = 0; col < size; col++) {
            path.push({ x: col, y: row });
          }
        }
      }
      break;
      
    default: // 'top-left'
      for (let row = 0; row < size; row++) {
        if (row % 2 === 0) {
          // Even rows: left to right
          for (let col = 0; col < size; col++) {
            path.push({ x: col, y: row });
          }
        } else {
          // Odd rows: right to left
          for (let col = size - 1; col >= 0; col--) {
            path.push({ x: col, y: row });
          }
        }
      }
  }
  
  return path;
}

function placeDots(grid: GameGrid, positions: Position[]): void {
  positions.forEach((position, index) => {
    // Add bounds checking to prevent crashes
    if (position.y < 0 || position.y >= grid.size || 
        position.x < 0 || position.x >= grid.size) {
      console.error(`Invalid position: ${position.x}, ${position.y} for grid size ${grid.size}`);
      return;
    }

    const dot: Dot = {
      id: index,
      position,
      number: index + 1
    };

    grid.cells[position.y][position.x].dot = dot;
    grid.cells[position.y][position.x].isOccupied = true;
    grid.dots.push(dot);
  });
}