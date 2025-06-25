import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'

interface FAQ {
    question: string
    answer: string
}

const Faq = () => {
    const faqs: FAQ[] = [
        {
            question: "What is Zip Game?",
            answer: "Zip Game is an addictive connect-the-dots puzzle where you connect numbered dots (1→2→3→4→5→6→7→8) while filling every single cell in the grid with one continuous path."
        },
        {
            question: "How do I play Zip Game?",
            answer: "Start at dot 1, connect dots in numerical order, fill ALL cells in the grid, use only L-shaped moves (horizontal then vertical), and reach dot 8 to win."
        },
        {
            question: "What are L-shaped moves?",
            answer: "L-shaped moves mean you can move horizontally first, then vertically (or vice versa) - like the shape of the letter L. You cannot move diagonally."
        },
        {
            question: "What difficulty levels are available?",
            answer: "Zip Game offers two difficulty levels: 5×5 grid (Easy) for beginners and 6×6 grid (Medium) for more experienced players."
        },
        {
            question: "Do I need to download anything to play?",
            answer: "No! Zip Game is completely browser-based. No downloads, no registration required - just instant play on any device."
        },
        {
            question: "Can I play Zip Game on mobile?",
            answer: "Yes! Zip Game is fully mobile-friendly and works perfectly on phones, tablets, and computers with responsive touch controls."
        },
        {
            question: "What if I get stuck on a puzzle?",
            answer: "Use the hint system to show the solution when you're stuck. This helps you learn optimal path strategies for future puzzles."
        },
        {
            question: "How many puzzles can I play?",
            answer: "Unlimited! Generate new connect-the-dots challenges instantly for endless entertainment. Each puzzle is unique."
        },
        {
            question: "What are the cognitive benefits of playing Zip Game?",
            answer: "Zip Game improves spatial reasoning, logical thinking, problem-solving skills, concentration, and planning abilities - perfect brain training for all ages."
        },
        {
            question: "Is Zip Game suitable for children?",
            answer: "Absolutely! Zip Game is perfect for ages 8 to 88. It's educational, helps develop logical thinking, and provides a fun mental challenge."
        },
        {
            question: "Can I share my progress with friends?",
            answer: "While the game focuses on personal achievement, you can challenge friends to beat your solving times and share strategies."
        },
        {
            question: "Is Zip Game free to play?",
            answer: "Yes! Zip Game is completely free to play with unlimited puzzles and all features available at no cost."
        }
    ]

    return (
        <div className="max-w-lg mx-auto mt-4">
            <Card className="bg-white border-2 border-gray-200 shadow-lg rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-blue-600">Frequently Asked Questions about Zip Game</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="border-b border-gray-200 pb-4">
                                <div className="w-full text-left font-semibold text-lg mb-2 text-blue-600">
                                    {faq.question}
                                </div>
                                <p className="text-gray-700">
                                    {faq.answer}
                                </p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Faq