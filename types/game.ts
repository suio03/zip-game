export interface Position {
  x: number;
  y: number;
}

export interface Dot {
  id: number;
  position: Position;
  number: number; // 1-8 for connection order
}

export interface GridCell {
  position: Position;
  isOccupied: boolean;
  isPath: boolean;
  dot?: Dot;
}

export interface GameGrid {
  size: number;
  cells: GridCell[][];
  dots: Dot[];
}

export interface Path {
  dots: Dot[];
  isComplete: boolean;
  isValid: boolean;
}

export interface GameState {
  grid: GameGrid;
  currentPath: Path;
  isGameComplete: boolean;
  difficulty: 'easy' | 'medium';
}

export interface GridConfig {
  size: number;
  dots: number;
  name: string;
}

export const GRID_CONFIGS: Record<string, GridConfig> = {
  easy: { size: 5, dots: 8, name: "5x5 Compact" },
  medium: { size: 6, dots: 8, name: "6x6 Balanced" }
};