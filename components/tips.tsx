import React from 'react'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from './ui/card'

interface GameTip {
    title: string
    description: string
}

const GameInfoSections = () => {
    const tips: GameTip[] = [
        {
            title: "Plan Ahead",
            description: "Look at all dot positions before starting your path. Visualize the complete route to avoid dead-ends."
        },
        {
            title: "Work Backwards",
            description: "Sometimes start from dot 8 and plan in reverse. This can reveal easier path solutions."
        },
        {
            title: "Use Corners Wisely",
            description: "Corner cells can only be reached one way. Plan these critical connection points first."
        },
        {
            title: "Count Your Cells",
            description: "Make sure your path visits all cells in the grid. Missing even one cell means starting over."
        },
        {
            title: "Practice Makes Perfect",
            description: "Start with 5×5 grids to master the mechanics before attempting the challenging 6×6 puzzles."
        }
    ]

    return (
        <div className="w-full max-w-lg mx-auto space-y-8 mt-4">
            <Card className="bg-white border-2 border-gray-200 shadow-lg rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-blue-600">Pro Tips for Zip Game Success</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {tips.map((tip, index) => (
                            <div
                                key={index}
                                className="p-4 rounded-lg bg-gray-50 border border-gray-200"
                            >
                                <h3 className="font-semibold text-lg mb-2 text-blue-600">{tip.title}</h3>
                                <p className="text-gray-700">{tip.description}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default GameInfoSections