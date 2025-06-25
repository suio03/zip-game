import React from 'react'
import { Info } from 'lucide-react'

const HowToPlay = () => {
    return (
        <div id="how-to-play">
            <div className="max-w-lg mx-auto space-y-6 p-2 bg-white rounded-2xl border-2 border-gray-200 shadow-lg">
                <h1 className="text-3xl font-bold text-blue-600 py-4 text-center">
                    Zip Game - The Ultimate Connect-the-Dots Puzzle!
                </h1>

                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-800 py-4">How to Play Zip Game</h2>
                    <p className="text-gray-600">Challenge your mind with the addictive puzzle where you connect numbered dots while filling every single cell in the grid!</p>
                </div>

                {/* Main Game Rules */}
                <div className="border-none">
                    <div className="p-6 text-gray-700 space-y-4">
                        <div className="flex gap-3 items-start">
                            <Info className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                            <p>Connect dots 1→2→3→4→5→6→7→8 in sequence while filling ALL cells in the grid with one continuous path. Use only L-shaped moves!</p>
                        </div>
                    </div>
                </div>

                {/* Basic Rules */}
                <div className="border-none">
                    <div className="p-6 space-y-4">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Basic Rules</h3>
                        <div className="grid gap-3 text-gray-700">
                            <div className="flex items-start gap-3">
                                <div className="h-6 w-6 mt-1 flex-shrink-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-bold flex items-center justify-center">1</div>
                                <span><strong>Start at Dot 1:</strong> Begin your path at the numbered dot &ldquo;1&rdquo;</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="h-6 w-6 mt-1 flex-shrink-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-bold flex items-center justify-center">2</div>
                                <span><strong>Sequential Connection:</strong> Connect dots in numerical order (1→2→3→4→5→6→7→8)</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="h-6 w-6 mt-1 flex-shrink-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-bold flex items-center justify-center">3</div>
                                <span><strong>Fill Every Cell:</strong> Your path must visit every single cell in the grid</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="h-6 w-6 mt-1 flex-shrink-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-bold flex items-center justify-center">4</div>
                                <span><strong>L-Shaped Moves Only:</strong> Move horizontally first, then vertically (or vice versa)</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="h-6 w-6 mt-1 flex-shrink-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-bold flex items-center justify-center">5</div>
                                <span><strong>Win Condition:</strong> Reach dot 8 after filling all cells</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Difficulty Levels */}
                <div className="border-none">
                    <div className="p-6">
                        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Difficulty Levels</h3>
                        <div className="grid gap-4 text-gray-700">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="items-center">
                                    <p className='font-semibold text-green-600 text-xl'>5×5 Grid (Easy): </p>
                                    <p>Perfect for beginners learning the game mechanics</p>
                                    <p>25 cells to fill with a clear, manageable layout</p>
                                </div>
                                <div className="items-center">
                                    <p className='font-semibold text-yellow-600 text-xl'>6×6 Grid (Medium): </p>
                                    <p>More challenging puzzle for experienced players</p>
                                    <p>36 cells requiring advanced planning and strategy</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HowToPlay