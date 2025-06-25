import Link from "next/link";

export default function Privacy() {
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
                    </svg>{" "}
                    Back
                </Link>
                <h1 className="text-3xl font-extrabold pb-6">
                    Privacy Policy for Zip Game
                </h1>

                <pre
                    className="leading-relaxed whitespace-pre-wrap"
                    style={{ fontFamily: "sans-serif" }}
                >
                    {`
Last Updated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

Introduction
Welcome to Zip Game, a free connect-the-dots puzzle game. This Privacy Policy explains how we handle information when you play our game at zipgame.net (the "Service").

Our Commitment
Zip Game is completely free with no strings attached. We believe in keeping your privacy simple and transparent.

Information We Collect

Analytics Data (via Google Analytics)
We use Google Analytics to understand how players use our game:
- Pages visited and time spent
- Device type and browser information
- General location (country/city level)
- Game interactions and completion rates
- Anonymous usage patterns

This data is collected anonymously and helps us improve the game experience.

Game Progress Data
Your game progress is stored locally on your device:
- Current puzzle state
- Completed levels
- Game preferences and settings
- Path history for current session

This information never leaves your device and is not transmitted to our servers.

Information We Do NOT Collect
- Personal information (name, email, phone)
- Account information (no registration required)
- Payment information (game is completely free)
- Detailed personal data
- User-generated content (beyond game state)

Cookies and Local Storage
We use:
- Google Analytics cookies for anonymous usage tracking
- Local browser storage to save your game progress
- No third-party advertising cookies
- No tracking cookies for marketing purposes

How We Use Information
Analytics data helps us:
- Understand which puzzles are most popular
- Improve game performance and user experience
- Identify technical issues
- Make the game more enjoyable

Local game data is used to:
- Remember your current puzzle progress
- Save your difficulty preferences
- Maintain game state between sessions

Data Sharing
We do not sell, rent, or share your personal information.

Google Analytics data is shared with Google according to their privacy policy. This data is anonymous and aggregated.

No other data sharing occurs.

Your Rights and Choices
You can:
- Clear your local game data by clearing browser storage
- Opt out of Google Analytics using browser extensions
- Play the game with analytics blocked without losing functionality
- Share the game with others freely

Data Retention
- Analytics data: Retained according to Google Analytics policy
- Local game data: Stored until you clear browser data
- No personal data retention (we don&apos;t collect personal data)

Children&apos;s Privacy
Zip Game is safe for players of all ages. We do not knowingly collect personal information from anyone, including children.

Security
While we don&apos;t collect personal information:
- The game is served over HTTPS
- Local data is protected by browser security
- Google Analytics data is handled according to Google&apos;s security standards

International Users
Zip Game can be played worldwide. Google Analytics may transfer anonymous data internationally according to Google&apos;s privacy policy.

Changes to Privacy Policy
We may update this policy to reflect:
- New features
- Legal requirements
- Service improvements

Updates will be posted on this page with a new date.

Third-Party Services
Google Analytics: We use Google Analytics for anonymous usage statistics. Please review Google&apos;s Privacy Policy for more information about how they handle data.

Contact Information
If you have questions about this Privacy Policy:
- Visit our website: zipgame.net
- This is a free, open-source project created by an individual developer

Effective Date
This Privacy Policy is effective as of the date listed above and applies to all users of Zip Game.
`}
                </pre>
            </div>
        </main>
        </div>
    )
}
