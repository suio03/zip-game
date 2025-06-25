import { GridCell as GridCellType } from '../../types/game';

interface GridCellProps {
  cell: GridCellType;
  size: number;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function GridCell({ cell, size, isSelected, onClick }: GridCellProps) {
  // Responsive cell sizing - use fixed size to prevent hydration issues
  const cellSize = Math.min(60, 360 / size);
  const dotSize = Math.max(24, Math.min(36, cellSize * 0.65));
  
  return (
    <div
      className={`
        bg-gray-50 border-2 border-gray-300 rounded-md transition-all duration-200 
        flex items-center justify-center cursor-pointer relative
        hover:bg-gray-100 hover:border-gray-400 hover:-translate-y-0.5 hover:shadow-md
        ${isSelected ? 'bg-amber-100 border-amber-500 ring-2 ring-amber-400' : ''}
      `}
      style={{ 
        width: cellSize, 
        height: cellSize 
      }}
      onClick={onClick}
    >
      {cell.dot && (
        <div 
          className="
            bg-gray-800 text-white rounded-full flex items-center justify-center font-bold
            shadow-lg border-2 border-white transition-all duration-200
            hover:scale-105 hover:shadow-xl
          "
          style={{
            width: dotSize,
            height: dotSize,
            fontSize: Math.max(12, dotSize * 0.45)
          }}
        >
          {cell.dot.number}
        </div>
      )}
    </div>
  );
}