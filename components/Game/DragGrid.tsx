'use client';

import { useRef, useEffect, useState } from 'react';
import { GameGrid, Position } from '../../types/game';
import { useDragPath } from '../../hooks/useDragPath';

interface DragGridProps {
  grid: GameGrid;
  onPathComplete: (path: Position[]) => void;
  onPathClear: () => void;
  completedPath?: Position[];
}

export default function DragGrid({ grid, onPathComplete, onPathClear, completedPath }: DragGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  const {
    isDragging,
    currentPath,
    dragPosition,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    clearPath
  } = useDragPath({ grid, onPathComplete });

  // Handle responsive sizing after hydration to prevent SSR mismatch
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Responsive sizing - consistent between server and client
  const baseSize = isMobile ? 280 : 400;
  const cellSize = Math.min(60, baseSize / grid.size);
  const gridSize = grid.size * cellSize;

  const getGridPosition = (clientX: number, clientY: number): Position | null => {
    if (!containerRef.current) return null;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.floor((clientX - rect.left) / cellSize);
    const y = Math.floor((clientY - rect.top) / cellSize);
    
    if (x >= 0 && x < grid.size && y >= 0 && y < grid.size) {
      return { x, y };
    }
    return null;
  };

  const handleContainerMouseDown = (e: React.MouseEvent) => {
    const pos = getGridPosition(e.clientX, e.clientY);
    if (pos) {
      handleMouseDown(pos.x, pos.y);
    }
  };

  const handleContainerMouseMove = (e: React.MouseEvent) => {
    const pos = getGridPosition(e.clientX, e.clientY);
    if (pos) {
      handleMouseMove(pos.x, pos.y);
    }
  };

  const handleContainerMouseUp = () => {
    handleMouseUp();
  };

  // Touch event handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const touch = e.touches[0];
    const pos = getGridPosition(touch.clientX, touch.clientY);
    if (pos) {
      handleMouseDown(pos.x, pos.y);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const touch = e.touches[0];
    const pos = getGridPosition(touch.clientX, touch.clientY);
    if (pos) {
      handleMouseMove(pos.x, pos.y);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleMouseUp();
  };

  // Clear path when requested from parent
  useEffect(() => {
    clearPath();
  }, [onPathClear, clearPath]);

  // Draw the grid and path
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines - subtle and friendly
    ctx.strokeStyle = '#d1d5db'; // Change this color to whatever you want!
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= grid.size; i++) {
      // Vertical lines
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, gridSize);
      ctx.stroke();
      
      // Horizontal lines
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(gridSize, i * cellSize);
      ctx.stroke();
    }

    // Use completedPath if present, otherwise currentPath
    const pathToDraw = completedPath && completedPath.length > 0 ? completedPath : currentPath;

    // Highlight path cells with friendly colors
    pathToDraw.forEach(pos => {
      ctx.fillStyle = 'rgba(59, 130, 246, 0.2)'; // slightly more visible blue highlight
      ctx.fillRect(pos.x * cellSize, pos.y * cellSize, cellSize, cellSize);
    });

    // Draw thick colored path under the dots
    if (pathToDraw.length > 1) {
      ctx.save();
      ctx.strokeStyle = '#2563eb'; // stronger blue for better visibility
      ctx.lineWidth = cellSize * 0.5; // thicker for better visibility
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      const firstPos = pathToDraw[0];
      ctx.moveTo(firstPos.x * cellSize + cellSize / 2, firstPos.y * cellSize + cellSize / 2);
      for (let i = 1; i < pathToDraw.length; i++) {
        const pos = pathToDraw[i];
        const x = pos.x * cellSize + cellSize / 2;
        const y = pos.y * cellSize + cellSize / 2;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
    }

    // Draw dots on top of the path
    grid.dots.forEach(dot => {
      const x = dot.position.x * cellSize + cellSize / 2;
      const y = dot.position.y * cellSize + cellSize / 2;
      const radius = Math.min(18, cellSize * 0.35);
      // Draw dot background - always black like in reference image
      ctx.fillStyle = '#1a1a1a';
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw subtle shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      ctx.shadowBlur = 2;
      ctx.shadowOffsetY = 2;
      ctx.fill();
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
      
      // Draw dot number
      ctx.fillStyle = 'white';
      ctx.font = `bold ${Math.max(12, radius * 0.7)}px -apple-system, BlinkMacSystemFont, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(dot.number.toString(), x, y);
    });

    // Draw drag line if dragging (only if not completed)
    if (!completedPath && isDragging && currentPath.length > 0 && dragPosition) {
      const lastPos = currentPath[currentPath.length - 1];
      const lastX = lastPos.x * cellSize + cellSize / 2;
      const lastY = lastPos.y * cellSize + cellSize / 2;
      const dragX = dragPosition.x * cellSize + cellSize / 2;
      const dragY = dragPosition.y * cellSize + cellSize / 2;
      ctx.strokeStyle = '#9ca3af';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(dragX, lastY); // Horizontal first
      ctx.lineTo(dragX, dragY); // Then vertical
      ctx.stroke();
      ctx.setLineDash([]); // Reset line dash
    }
  }, [grid, currentPath, isDragging, dragPosition, cellSize, gridSize, completedPath]);

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="bg-white rounded-2xl p-5 shadow-lg border-2 border-gray-200">
        <div 
          ref={containerRef}
          className="relative cursor-pointer select-none touch-none"
          style={{ 
            width: gridSize, 
            height: gridSize,
            touchAction: 'none', // Prevent all browser touch behaviors
            userSelect: 'none',  // Prevent text selection
            WebkitUserSelect: 'none', // Safari
            msUserSelect: 'none', // IE/Edge
            WebkitTouchCallout: 'none', // iOS Safari callout
            WebkitTapHighlightColor: 'transparent' // Remove tap highlight
          }}
          onMouseDown={handleContainerMouseDown}
          onMouseMove={handleContainerMouseMove}
          onMouseUp={handleContainerMouseUp}
          onMouseLeave={handleContainerMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onContextMenu={(e) => e.preventDefault()} // Prevent context menu on long press
        >
          <canvas
            ref={canvasRef}
            width={gridSize}
            height={gridSize}
            className="absolute top-0 left-0"
            style={{ width: gridSize, height: gridSize }}
          />
        </div>
      </div>
      
      <div className="text-center px-4">
        <p className="text-base sm:text-lg font-semibold">
          {grid.size}×{grid.size} Maze - Fill Every Cell!
        </p>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          Draw one continuous path through ALL {grid.size * grid.size} cells
        </p>
        {currentPath.length > 0 && (
          <div className="text-xs mt-2 space-y-1">
            <div className="flex justify-center gap-4">
              <p className="text-blue-600">
                Cells: {currentPath.length}/{grid.size * grid.size}
              </p>
              <p className="text-green-600">
                Dots: {grid.dots.filter(dot => 
                  currentPath.some(pos => pos.x === dot.position.x && pos.y === dot.position.y)
                ).length}/{grid.dots.length}
              </p>
            </div>
            {isDragging && (
              <p className="text-purple-600 animate-pulse">
                Keep dragging to fill more cells...
              </p>
            )}
            {currentPath.length === grid.size * grid.size && (
              <p className="text-red-600 font-bold">
                All cells filled! Check if all dots are connected!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}