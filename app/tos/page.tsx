import Link from "next/link"

const TOS = () => {
    return (
        <div className="mt-24">
            <main className="max-w-xl mx-auto">
                <div className="p-5">
                    <Link href="/" className="btn btn-ghost">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                                fillRule="evenodd"
                                d="M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Back
                    </Link>
                    <h1 className="text-3xl font-extrabold pb-6">
                        Terms of Service for Zip Game
                    </h1>

                    <pre
                        className="leading-relaxed whitespace-pre-wrap"
                        style={{ fontFamily: "sans-serif" }}
                    >
                        {` 
Last Updated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

Acceptance of Terms
By accessing and playing Zip Game at zipgame.net (the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the Service.

Description of Service
Zip Game is a free connect-the-dots puzzle game that allows players to:
- Fill all cells in a grid while connecting numbered dots in sequence
- Play multiple difficulty levels (5x5 and 6x6 grids)
- Save game progress locally on their device
- Share the game with others
- Access game instructions and help guides

Free Service
Zip Game is completely free to play with:
- No registration or account creation required
- No hidden fees or premium features
- No advertisements
- No in-app purchases
- No subscription requirements

Game Rules and Objective
Players must:
- Connect numbered dots in sequential order (1→2→3→etc.)
- Fill every cell in the grid with their path
- Create one continuous path without breaks
- Complete the puzzle by visiting all cells and all dots

Acceptable Use
You may:
- Play the game for personal enjoyment
- Share the game URL with others
- Use the game for educational purposes
- Access the game from any device with a web browser

You may not:
- Attempt to hack, modify, or reverse engineer the game
- Use automated tools or bots to play the game
- Interfere with the game&apos;s functionality or other players&apos; experience
- Use the game for any illegal purposes
- Claim ownership of the game or its content

Intellectual Property
a) Game Ownership:
- Zip Game and all its components are owned by the developer
- Game design, graphics, and code are protected by copyright
- The Zip Game name and branding are proprietary

b) User Rights:
- You may play the game freely
- You may share links to the game
- You retain no ownership rights in the game itself
- Your local game progress belongs to you

Local Data Storage
- Game progress is stored locally on your device
- We do not access or control your local game data
- You are responsible for backing up your progress if desired
- Clearing browser data will reset your game progress

Privacy and Analytics
- We use Google Analytics for anonymous usage statistics
- No personal information is collected or stored
- See our Privacy Policy for complete details
- Game progress stays on your device only

Service Availability
- The game is provided "as is" without guarantees of availability
- We may update or modify the game at any time
- Service interruptions may occur for maintenance or technical issues
- The game requires a modern web browser and internet connection

Disclaimers and Limitations
Zip Game is provided without warranties of any kind. We are not liable for:
- Loss of game progress
- Technical issues or browser compatibility problems
- Any damages arising from use of the game
- Service interruptions or downtime
- Device or browser-specific issues

Age Restrictions
Zip Game is suitable for players of all ages. No age restrictions apply.

Updates and Modifications
We may update:
- Game features and functionality
- Puzzle difficulty or design
- These Terms of Service
- Privacy practices
- Technical requirements

All updates will be reflected on the website when they take effect.

Termination
These Terms remain in effect while you use the Service. You may stop using the game at any time. We may discontinue the Service at our discretion.

Governing Law
These Terms are governed by applicable laws. Any disputes will be resolved in accordance with the jurisdiction where the developer resides.

Open Source
Zip Game may include open source components. Such components are governed by their respective licenses.

Sharing and Distribution
You are encouraged to:
- Share the game URL with friends and family
- Link to zipgame.net from websites or social media
- Recommend the game to others

You may not:
- Redistribute the game files or code
- Create unauthorized copies or mirrors
- Embed the game without permission

Contact Information
For questions about these Terms:
- Visit zipgame.net
- This is a free project created by an individual developer

Severability
If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect.

Entire Agreement
These Terms, along with our Privacy Policy, constitute the entire agreement between you and Zip Game regarding use of the Service.

Effective Date
These Terms are effective as of the date listed above and apply to all users of Zip Game.
`}
                    </pre>
                </div>
            </main>
        </div>
    )
}

export default TOS
