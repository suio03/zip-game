import React from 'react'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from './ui/card'

interface GameFeature {
    title: string
    description: string
}

const GameFeatures = () => {
    const features: GameFeature[] = [
        {
            title: "Two Difficulty Levels",
            description: "5×5 (Easy) and 6×6 (Medium) grids to challenge players of all skill levels."
        },
        {
            title: "Mobile-Friendly Design",
            description: "Play anywhere on your phone, tablet, or computer with responsive touch controls."
        },
        {
            title: "Instant Play",
            description: "No downloads, no registration required. Start playing immediately in your browser."
        },
        {
            title: "Hint System",
            description: "Show solution when you're stuck to learn optimal path strategies."
        },
        {
            title: "Unlimited Puzzles",
            description: "Generate new connect-the-dots challenges instantly for endless entertainment."
        }
    ]

    return (
        <div className="w-full max-w-lg mx-auto mt-4">
            <Card className="bg-white border-2 border-gray-200 shadow-lg rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-blue-600">
                        Zip Game Features
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="p-4 rounded-lg bg-gray-50 border border-gray-200"
                            >
                                <h3 className="font-semibold text-lg mb-2 text-blue-600">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-700">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default GameFeatures