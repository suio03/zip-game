'use client';

import { useState, useEffect } from 'react';
import { useGameState } from '../../hooks/useGameState';
import DragGrid from './DragGrid';
import { Position } from '../../types/game';
import HowToPlay from '../how-to-play';
import GameFeatures from '../features';
import GameInfoSections from '../tips';
import Faq from '../faq';

export default function GameBoard() {
  const { gameState, resetGame, addDotToPath, clearPath } = useGameState();

  const [pathClearTrigger, setPathClearTrigger] = useState(0);
  const [completedPath, setCompletedPath] = useState<Position[] | null>(null);
  const [showingSolution, setShowingSolution] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [activeHelpSection, setActiveHelpSection] = useState<'how-to-play' | 'features' | 'tips' | 'faq'>('how-to-play');
  const [showControls, setShowControls] = useState(true);

  // Load control panel preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('zip-game-show-controls');
    if (saved !== null) {
      setShowControls(JSON.parse(saved));
    }
  }, []);

  // Save control panel preference to localStorage
  const toggleControls = () => {
    const newValue = !showControls;
    setShowControls(newValue);
    localStorage.setItem('zip-game-show-controls', JSON.stringify(newValue));
  };

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

  const helpSections = [
    { id: 'how-to-play' as const, label: 'How to Play', icon: '🎮' },
    { id: 'features' as const, label: 'Features', icon: '⭐' },
    { id: 'tips' as const, label: 'Tips & Tricks', icon: '💡' },
    { id: 'faq' as const, label: 'FAQ', icon: '❓' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-5xl font-bold mb-3">
            🎯 Zip Game
          </h1>
          <p className="text-lg sm:text-xl opacity-90 max-w-2xl mx-auto">
            Fill all cells and connect all dots in sequence - Fun Zip Game
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className={`grid gap-8 transition-all duration-300 ${showControls ? 'lg:grid-cols-3' : 'lg:grid-cols-1'}`}>
          
          {/* Main Game Area */}
          <div className={`transition-all duration-300 ${showControls ? 'lg:col-span-2' : 'lg:col-span-1'}`}>
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="text-center mb-6">
                <div className="flex items-center justify-end mb-2">
                  <button
                    onClick={toggleControls}
                    className="lg:flex hidden items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    aria-label={showControls ? 'Hide controls' : 'Show controls'}
                    title={showControls ? 'Hide controls' : 'Show controls'}
                  >
                    <svg 
                      className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${showControls ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              <DragGrid 
                grid={gameState.grid}
                onPathComplete={handlePathComplete}
                onPathClear={() => pathClearTrigger}
                completedPath={pathToShow ?? undefined}
              />
            </div>

            {/* Status Messages */}
            {completedPath && !showingSolution && (
              <div className="bg-gradient-to-r max-w-2xl mx-auto from-green-500 to-green-600 text-white px-6 py-4 rounded-xl shadow-lg mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">🎉 Perfect! Maze Solved!</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white bg-opacity-20 rounded-lg p-3">
                      <div className="font-semibold">✅ All Cells</div>
                      <div>{gameState.grid.size * gameState.grid.size} filled</div>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-lg p-3">
                      <div className="font-semibold">✅ All Dots</div>
                      <div>{gameState.grid.dots.length} connected</div>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-lg p-3">
                      <div className="font-semibold">✅ Path Length</div>
                      <div>{completedPath.length} moves</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {showingSolution && (
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-xl shadow-lg mb-6">
                <div className="text-center">
                  <div className="text-xl font-bold mb-2">💡 Solution Revealed</div>
                  <p>Complete path from dot 1 → dot 8 visiting all {gameState.grid.size * gameState.grid.size} cells!</p>
                </div>
              </div>
            )}

            {/* Mobile Quick Controls - Only show when sidebar is hidden */}
            {!showControls && (
              <div className="lg:flex hidden justify-center gap-4 mb-6">
                <button
                  onClick={handleClearPath}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-md"
                >
                  🔄 Undo
                </button>
                <button
                  onClick={handleNewGame}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-md"
                >
                  🎮 New Game
                </button>
                {!showingSolution && !completedPath && (
                  <button
                    onClick={handleShowSolution}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-md"
                  >
                    💡 Solution
                  </button>
                )}
                {showingSolution && (
                  <button
                    onClick={handleHideSolution}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-md"
                  >
                    👁️ Hide
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Control Panel - Collapsible */}
          <div className={`transition-all duration-300 overflow-hidden ${
            showControls ? 'lg:col-span-1 opacity-100 lg:max-w-none lg:block' : 'lg:col-span-0 opacity-0 lg:max-w-0 lg:hidden'
          }`}>
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Game Controls</h3>
                <button
                  onClick={toggleControls}
                  className="lg:flex hidden items-center justify-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  aria-label="Hide controls"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Grid Size Selection */}
              <div className="mb-6">
                <label htmlFor="grid-size" className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level:
                </label>
                <select
                  id="grid-size"
                  value={gameState.difficulty}
                  onChange={(e) => handleDifficultyChange(e.target.value as 'easy' | 'medium')}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="easy">🟩 5×5 Grid (Easy)</option>
                  <option value="medium">🟨 6×6 Grid (Medium)</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleClearPath}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-3 rounded-lg transition-colors font-medium shadow-md"
                >
                  🔄 Undo Path
                </button>
                
                {!showingSolution && !completedPath && (
                  <button
                    onClick={handleShowSolution}
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white px-4 py-3 rounded-lg transition-colors font-medium shadow-md"
                  >
                    💡 Show Solution
                  </button>
                )}
                
                {showingSolution && (
                  <button
                    onClick={handleHideSolution}
                    className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-3 rounded-lg transition-colors font-medium shadow-md"
                  >
                    👁️ Hide Solution
                  </button>
                )}
                
                <button
                  onClick={handleNewGame}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg transition-colors font-medium shadow-md"
                >
                  🎮 New Game
                </button>
              </div>
            </div>

            {/* Game Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Current Game</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Grid Size:</span>
                  <span className="font-medium">{gameState.grid.size}×{gameState.grid.size}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Cells:</span>
                  <span className="font-medium">{gameState.grid.size * gameState.grid.size}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Dots to Connect:</span>
                  <span className="font-medium">{gameState.grid.dots.length}</span>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-800">
                  <strong>💡 Pro Tip:</strong> Click and drag to fill ALL cells while connecting all numbered dots in sequence!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Help Button */}
      <button
        onClick={() => setShowHelpModal(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-40"
        aria-label="Open help guide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">📚 Game Guide</h2>
              <button
                onClick={() => setShowHelpModal(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b bg-gray-50">
              {helpSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveHelpSection(section.id)}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeHelpSection === section.id
                      ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span>{section.icon}</span>
                    <span className="hidden sm:inline">{section.label}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {activeHelpSection === 'how-to-play' && <HowToPlay />}
              {activeHelpSection === 'features' && <GameFeatures />}
              {activeHelpSection === 'tips' && <GameInfoSections />}
              {activeHelpSection === 'faq' && <Faq />}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end p-6 border-t bg-gray-50">
              <button
                onClick={() => setShowHelpModal(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Got it! Let&apos;s Play 🎮
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}