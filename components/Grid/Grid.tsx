import { GameGrid, Path } from '../../types/game';
import GridCell from './GridCell';
import PathCanvas from '../Game/PathCanvas';

interface GridProps {
  grid: GameGrid;
  path: Path;
  selectedPosition?: { x: number; y: number };
  onCellClick?: (x: number, y: number) => void;
}

export default function Grid({ grid, path, selectedPosition, onCellClick }: GridProps) {
  // Responsive sizing
  const baseSize = typeof window !== 'undefined' && window.innerWidth < 768 ? 240 : 360;
  const cellSize = Math.min(60, baseSize / grid.size);
  
  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="relative max-w-full overflow-auto">
        <div className="bg-white rounded-2xl p-5 shadow-xl border-2 border-gray-200">
          <div 
            className="grid gap-1"
            style={{
              gridTemplateColumns: `repeat(${grid.size}, 1fr)`,
            }}
          >
            {grid.cells.map((row, y) =>
              row.map((cell, x) => (
                <GridCell
                  key={`${x}-${y}`}
                  cell={cell}
                  size={grid.size}
                  isSelected={selectedPosition?.x === x && selectedPosition?.y === y}
                  onClick={() => onCellClick?.(x, y)}
                />
              ))
            )}
          </div>
        </div>
        
        <div className="absolute top-4 left-4">
          <PathCanvas 
            grid={grid} 
            path={path} 
            cellSize={cellSize + 1} 
          />
        </div>
      </div>
      
      <div className="text-center px-4">
        <p className="text-lg font-semibold text-gray-700">
          {grid.size}×{grid.size} Grid - Connect dots 1 → 8
        </p>
        <p className="text-sm text-gray-600 mt-2">
          Click dots or use arrow keys + Space/Enter
        </p>
      </div>
    </div>
  );
}