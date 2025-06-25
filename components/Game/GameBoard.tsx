'use client';

import { useState } from 'react';
import { useGameState } from '../../hooks/useGameState';
import DragGrid from './DragGrid';
import { Position } from '../../types/game';

export default function GameBoard() {
  const { gameState, resetGame, addDotToPath, clearPath } = useGameState();

  const [pathClearTrigger, setPathClearTrigger] = useState(0);
  const [completedPath, setCompletedPath] = useState<Position[] | null>(null);
  const [showingSolution, setShowingSolution] = useState(false);

  const handlePathComplete = (path: Position[]) => {
    // Player completed the puzzle! Store their path
    setCompletedPath(path);
    setShowingSolution(false); // Hide solution when player completes
    
    // Update game state to show completion
    const connectedDots = gameState.grid.dots.filter(dot =>
      path.some(pos => pos.x === dot.position.x && pos.y === dot.position.y)
    );
    connectedDots.forEach(dot => addDotToPath(dot));
  };

  const handleClearPath = () => {
    clearPath();
    setCompletedPath(null);
    setShowingSolution(false);
    setPathClearTrigger(prev => prev + 1); // Trigger clear in DragGrid
  };

  const handleNewGame = () => {
    resetGame();
    setCompletedPath(null);
    setShowingSolution(false);
    setPathClearTrigger(prev => prev + 1);
  };

  const handleShowSolution = () => {
    const solutionPath = (gameState.grid as unknown as { solutionPath?: Position[] }).solutionPath;
    if (solutionPath) {
      setShowingSolution(true);
      setCompletedPath(null); // Clear any existing completed path
    }
  };

  const handleHideSolution = () => {
    setShowingSolution(false);
  };

  const handleDifficultyChange = (difficulty: 'easy' | 'medium') => {
    // Completely reset all game state when changing grid size
    resetGame(difficulty);
    setCompletedPath(null);
    setShowingSolution(false);
    setPathClearTrigger(prev => prev + 1); // Trigger clear in DragGrid
  };

  // Determine which path to show in DragGrid
  const pathToShow = showingSolution 
    ? (gameState.grid as unknown as { solutionPath?: Position[] }).solutionPath 
    : completedPath;

  return (
    <div className="bg-gray-50 py-4 sm:py-8 game-container">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-2">
            Connect the Dots Maze
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Fill ALL cells and connect ALL dots - draw one continuous path through the entire grid
          </p>
        </div>

        <DragGrid 
          grid={gameState.grid}
          onPathComplete={handlePathComplete}
          onPathClear={() => pathClearTrigger}
          completedPath={pathToShow ?? undefined}
        />

        <div className="text-center mt-6 sm:mt-8">
          <div className="mb-4">
            <p className="text-xs sm:text-sm text-gray-500">
              Current: {gameState.difficulty === 'easy' ? '5×5 (25 cells)' : '6×6 (36 cells)'}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              💡 Tip: Click and drag to fill ALL {gameState.grid.size * gameState.grid.size} cells while connecting all {gameState.grid.dots.length} dots!
            </p>
          </div>

          {completedPath && !showingSolution && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 mx-4">
              <div className="text-lg font-bold mb-2">🎉 Perfect! Maze Solved!</div>
              <div className="text-sm space-y-1">
                <p>✅ Filled all {gameState.grid.size * gameState.grid.size} cells</p>
                <p>✅ Connected all {gameState.grid.dots.length} dots</p>
                <p>✅ Path length: {completedPath.length} moves</p>
              </div>
            </div>
          )}

          {showingSolution && (
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4 mx-4">
              <div className="text-lg font-bold mb-2">💡 Solution Revealed</div>
              <div className="text-sm">
                <p>Complete path from dot 1 → dot 8 visiting all {gameState.grid.size * gameState.grid.size} cells!</p>
              </div>
            </div>
          )}

          {/* Grid Size Dropdown */}
          <div className="mb-4">
            <label htmlFor="grid-size" className="block text-sm font-medium text-gray-700 mb-2">
              Grid Size:
            </label>
            <select
              id="grid-size"
              value={gameState.difficulty}
              onChange={(e) => handleDifficultyChange(e.target.value as 'easy' | 'medium')}
              className="mx-auto block bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="easy">5×5 Grid (Easy)</option>
              <option value="medium">6×6 Grid (Medium)</option>
            </select>
          </div>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 px-4">
            <button
              onClick={handleClearPath}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 sm:px-6 py-2 rounded transition-colors text-sm sm:text-base"
            >
              Undo
            </button>
            
            {!showingSolution && !completedPath && (
              <button
                onClick={handleShowSolution}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 sm:px-6 py-2 rounded transition-colors text-sm sm:text-base"
              >
                Show Solution
              </button>
            )}
            
            {showingSolution && (
              <button
                onClick={handleHideSolution}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 sm:px-6 py-2 rounded transition-colors text-sm sm:text-base"
              >
                Hide Solution
              </button>
            )}
            
            <button
              onClick={handleNewGame}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 sm:px-6 py-2 rounded transition-colors text-sm sm:text-base"
            >
              New Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}