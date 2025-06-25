import { GameGrid, GridCell, Dot, Position } from '../types/game';
import { generateSolvableMaze } from './solvableMazeGenerator';

export function createEmptyGrid(size: number): GameGrid {
  const cells: GridCell[][] = [];
  
  for (let y = 0; y < size; y++) {
    cells[y] = [];
    for (let x = 0; x < size; x++) {
      cells[y][x] = {
        position: { x, y },
        isOccupied: false,
        isPath: false
      };
    }
  }

  return {
    size,
    cells,
    dots: []
  };
}

export function placeDots(grid: GameGrid, positions: Position[]): void {
  positions.forEach((position, index) => {
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

export function generateGrid(size: number): GameGrid {
  return generateSolvableMaze(size);
}