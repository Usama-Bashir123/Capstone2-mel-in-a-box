import { HeroBanner } from "@/components/child/HeroBanner";
import { ContinueStoryCard } from "@/components/child/ContinueStoryCard";
import { QuickActionCards } from "@/components/child/QuickActionCards";
import { RewardGoals } from "@/components/child/RewardGoals";
import { RecentActivity } from "@/components/child/RecentActivity";
import { RecommendedSection } from "@/components/child/RecommendedSection";

export default function ChildHomePage() {
  return (
    <div className="flex flex-col gap-5">

      {/* Page heading — Nunito 600 30px lh=38px #141414 */}
      <div>
        <h1
          className="font-nunito font-semibold text-ink"
          style={{ fontSize: "30px", lineHeight: "38px" }}
        >
          Hello, Mia! 👋
        </h1>
        {/* Nunito 400 16px lh=24px #525252 */}
        <p
          className="font-nunito font-normal text-ink-subtle mt-0.5"
          style={{ fontSize: "16px", lineHeight: "24px" }}
        >
          Ready for a new adventure today?
        </p>
      </div>

      <HeroBanner subtitle="Keep going! You're doing amazing today!" />

      <div className="grid grid-cols-2 gap-5">
        <ContinueStoryCard />
        <QuickActionCards />
      </div>

      <div className="grid grid-cols-2 gap-5">
        <RewardGoals />
        <RecentActivity />
      </div>

      <RecommendedSection />
    </div>
  );
}
