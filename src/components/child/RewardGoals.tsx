// Reward Goals
// Container: bg white r=12 p=20
// Title: Nunito 600 20px lh=30px rgb(40,40,40)
// Inner card: bg rgb(252,252,252) r=12
// Goal text: Nunito 500 16px lh=24px rgb(20,20,20)
// Tick icon (done): rgb(23,177,105) = #17B169 green
// Circle icon (todo): rgb(254,0,80) custom icon → use red circle
// Progress "3/4": Nunito 600 14px lh=20px rgb(40,40,40)
// Progress bar: track rgb(245,245,245), fill rgb(245,61,104)

import { MoreVertical } from "lucide-react";

const goals = [
  { id: "1", label: 'Play the "Match the Letters" game', done: true },
  { id: "2", label: "Play 1 game", done: true },
  { id: "3", label: "Earn 1 star", done: true },
  { id: "4", label: 'Play the "Match the Letters" game', done: false },
];

const progress = { done: 3, total: 4 };

export function RewardGoals() {
  return (
    <div className="bg-white flex flex-col gap-4" style={{ borderRadius: "12px", padding: "20px" }}>

      {/* Header — Nunito 600 20px lh=30px rgb(40,40,40) */}
      <div className="flex items-start justify-between">
        <h3
          className="font-nunito font-semibold text-ink-secondary"
          style={{ fontSize: "20px", lineHeight: "30px" }}
        >
          Today&apos;s Reward Goals
        </h3>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Goals list — inner card rgb(252,252,252) r=12 */}
      <div
        className="flex flex-col gap-4 p-4"
        style={{ background: "#FCFCFC", borderRadius: "12px" }}
      >
        {goals.map((goal) => (
          <div key={goal.id} className="flex items-center gap-3" style={{ height: "24px" }}>
            {goal.done ? (
              /* Tick circle — #17B169 green */
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
                <circle cx="10" cy="10" r="10" fill="#17B169" />
                <path d="M5.5 10.5L8.5 13.5L14.5 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              /* Uncompleted — custom red/pink icon */
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
                <circle cx="10" cy="10" r="10" fill="#FE0050" />
                <rect x="6" y="9" width="8" height="2" rx="1" fill="white" />
              </svg>
            )}
            {/* Nunito 500 16px lh=24px rgb(20,20,20) */}
            <span
              className="font-nunito font-medium text-ink"
              style={{ fontSize: "16px", lineHeight: "24px" }}
            >
              {goal.label}
            </span>
          </div>
        ))}
      </div>

      {/* Progress row */}
      <div className="flex items-center gap-4">
        {/* Track: rgb(245,245,245), Fill: rgb(245,61,104), r=9999 */}
        <div
          className="flex-1 relative"
          style={{ height: "8px", borderRadius: "9999px", background: "#F5F5F5" }}
        >
          <div
            className="absolute inset-y-0 left-0"
            style={{
              width: `${(progress.done / progress.total) * 100}%`,
              background: "#F53D68",
              borderRadius: "9999px",
            }}
          />
        </div>
        {/* Nunito 600 14px lh=20px rgb(40,40,40) */}
        <span
          className="font-nunito font-semibold text-ink-secondary shrink-0"
          style={{ fontSize: "14px", lineHeight: "20px" }}
        >
          {progress.done}/{progress.total}
        </span>
      </div>
    </div>
  );
}
