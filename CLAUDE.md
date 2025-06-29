# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server at http://localhost:3000
- `npm run build` - Build production version
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Testing
No test framework is currently configured. Check with user before adding tests.

## Architecture Overview

This is a Next.js 15 puzzle game called "Zip Game" - a connect-the-dots game where players must fill all grid cells while connecting numbered dots in sequence.

### Tech Stack
- **Next.js 15** with App Router and TypeScript
- **React 19** with hooks-based state management
- **Tailwind CSS** for styling with shadcn/ui components
- **Zustand** for global state (though currently using React hooks)
- **HTML5 Canvas** for game rendering via PathCanvas component

### Core Game Logic

#### Game Modes
- **Daily Challenge**: Fixed 6x6 grid with date-based seed for global consistency
- **Unlimited Play**: Variable difficulty (5x5 easy, 6x6 medium) with random generation

#### Key Libraries (`lib/` directory)
- `gridGenerator.ts` - Main grid generation using solvable maze algorithm
- `solvableMazeGenerator.ts` - Hamiltonian path-based puzzle generation
- `pathValidator.ts` - Validates L-shaped moves between dots
- `dailyChallenge.ts` - Date-based seeding and completion tracking
- `userStats.ts` - localStorage-based statistics with SSR safety
- `performanceTracker.ts` - Real-time game performance tracking

#### State Management
- `hooks/useGameState.ts` - Primary game state hook with performance tracking integration
- Local storage for user stats and daily challenge completion
- SSR-safe implementation throughout

### Component Structure

#### Game Components (`components/Game/`)
- `GameBoard.tsx` - Main game container with UI controls and stats
- `DragGrid.tsx` - Interactive grid with drag-and-drop functionality
- `PathCanvas.tsx` - HTML5 Canvas for drawing game paths

#### UI Components
- `components/ui/` - shadcn/ui components
- Custom game-specific components like `how-to-play.tsx`, `features.tsx`

### Game Algorithm

The puzzle generation uses a sophisticated approach:
1. Generates Hamiltonian paths (visiting every cell exactly once)
2. Places 8 numbered dots strategically along the path
3. Ensures L-shaped connectivity between consecutive dots
4. Guarantees every puzzle is solvable

### Data Storage

All user data is stored client-side in localStorage:
- Daily challenge completion status
- User statistics (streaks, win rates, performance metrics)
- Game preferences (control panel visibility)

## Important Implementation Details

### Daily Challenge System
- Uses UTC dates for global consistency
- Deterministic seeding ensures same puzzle worldwide
- One completion per day limit
- Completion time tracking

### Performance Considerations
- SSR-safe localStorage access with hydration checks
- Efficient canvas rendering for smooth gameplay
- Optimized grid generation algorithms

### Mobile Optimization
- Touch-friendly drag controls
- Responsive design with collapsible control panel
- Gesture-based interactions

When working on this codebase:
- Maintain SSR safety for any localStorage operations
- Follow existing TypeScript patterns and interfaces
- Use the established game state flow through useGameState hook
- Preserve the existing UI/UX patterns for consistency