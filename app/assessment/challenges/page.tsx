import { ChallengesClient } from "./challenges-client"
import { BackButton } from "./back-button"
import { TopNav } from "@/components/top-nav"

export default function ChallengesPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <TopNav />
      {/* Header with curved bottom */}
      <div className="bg-[#1A4099] text-white px-4 pt-6 pb-16 relative">
        <BackButton />
        <h1 className="text-xl font-bold mb-1">挑战与应对</h1>
        <p className="text-white/90 text-xs">了解潜在挑战，掌握应对策略</p>
        {/* Wave effect at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-4 bg-background"
          style={{
            clipPath: "ellipse(70% 100% at 50% 100%)",
          }}
        ></div>
      </div>

      <ChallengesClient />
    </div>
  )
}
