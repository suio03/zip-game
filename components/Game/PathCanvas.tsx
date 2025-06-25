'use client';

import { useRef, useEffect } from 'react';
import { GameGrid, Path } from '../../types/game';

interface PathCanvasProps {
  grid: GameGrid;
  path: Path;
  cellSize: number;
}

export default function PathCanvas({ grid, path, cellSize }: PathCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw path
    if (path.dots.length > 1) {
      ctx.strokeStyle = '#000000'; // Black lines like in the image
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      for (let i = 1; i < path.dots.length; i++) {
        const prevDot = path.dots[i - 1];
        const currentDot = path.dots[i];
        
        const prevX = prevDot.position.x * cellSize + cellSize / 2;
        const prevY = prevDot.position.y * cellSize + cellSize / 2;
        const currentX = currentDot.position.x * cellSize + cellSize / 2;
        const currentY = currentDot.position.y * cellSize + cellSize / 2;
        
        // Draw L-shaped path (horizontal first, then vertical)
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        
        // Horizontal line first
        ctx.lineTo(currentX, prevY);
        // Then vertical line
        ctx.lineTo(currentX, currentY);
        
        ctx.stroke();
      }
    }
  }, [grid, path, cellSize]);

  const canvasSize = grid.size * cellSize;

  return (
    <canvas
      ref={canvasRef}
      width={canvasSize}
      height={canvasSize}
      className="absolute top-0 left-0 pointer-events-none"
      style={{ width: canvasSize, height: canvasSize }}
    />
  );
}

function drawArrow(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string) {
  const headLength = 10;
  const angle = Math.atan2(y2 - y1, x2 - x1);
  
  // Calculate midpoint for arrow placement
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(midX, midY);
  ctx.lineTo(
    midX - headLength * Math.cos(angle - Math.PI / 6),
    midY - headLength * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    midX - headLength * Math.cos(angle + Math.PI / 6),
    midY - headLength * Math.sin(angle + Math.PI / 6)
  );
  ctx.closePath();
  ctx.fill();
}