import GameBoard from "@/components/Game/GameBoard";
import HowToPlay from "@/components/how-to-play";
import GameFeatures from "@/components/features";
import GameInfoSections from "@/components/tips";
import Faq from "@/components/faq";

export default function Home() {
  return (
    <div>
      <GameBoard />
      <HowToPlay />
      <GameFeatures />
      <GameInfoSections />
      <Faq />
    </div>
  )
}
