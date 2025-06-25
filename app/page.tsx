import GameBoard from "@/components/Game/GameBoard";
import HowToPlay from "@/components/how-to-play";
import GameFeatures from "@/components/features";
import GameInfoSections from "@/components/tips";
import Faq from "@/components/faq";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div>
      <GameBoard />
      
      {/* SEO Content - Hidden by default but accessible via help modal */}
      <div className="hidden">
        <div id="seo-how-to-play">
          <HowToPlay />
        </div>
        <div id="seo-features">
          <GameFeatures />
        </div>
        <div id="seo-tips">
          <GameInfoSections />
        </div>
        <div id="seo-faq">
          <Faq />
        </div>
      </div>
      <Footer />
    </div>
  )
}
