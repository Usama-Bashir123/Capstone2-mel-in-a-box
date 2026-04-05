// Recent Activity
// Container: bg white r=12 p=20
// Title: Nunito 600 20px lh=30px rgb(40,40,40)
// Table header: Nunito 600 12px lh=18px rgb(82,82,82), bg rgb(249,250,251)
// Table rows: bg white, Nunito 400 16px lh=24px rgb(82,82,82)
// Scrollbar: 8px wide, rose-500 fill, black track (from Figma Frame 417)

import { MoreVertical } from "lucide-react";

const activities = [
  { id: "1", text: "Earned 1 star — Jungle Counting Game" },
  { id: "2", text: "Read Pirate Island Adventure — Page 4" },
  { id: "3", text: 'Earned "Counting Star" badge' },
  { id: "4", text: 'Earned "Counting Star" badge' },
];

export function RecentActivity() {
  return (
    <div className="bg-white flex flex-col gap-4" style={{ borderRadius: "12px", padding: "20px" }}>

      {/* Header — Nunito 600 20px lh=30px rgb(40,40,40) */}
      <div className="flex items-start justify-between">
        <h3
          className="font-nunito font-semibold text-ink-secondary"
          style={{ fontSize: "20px", lineHeight: "30px" }}
        >
          What You Did Recently
        </h3>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Activity table */}
      <div style={{ borderRadius: "8px", border: "1px solid #F5F5F5", overflow: "hidden" }}>
        {/* Table header — bg rgb(249,250,251) */}
        <div
          className="px-4 py-3"
          style={{ background: "#F9FAFB" }}
        >
          {/* Nunito 600 12px lh=18px rgb(82,82,82) */}
          <span
            className="font-nunito font-semibold text-ink-subtle"
            style={{ fontSize: "12px", lineHeight: "18px" }}
          >
            Activity
          </span>
        </div>

        {/* Rows */}
        {activities.map((activity, idx) => (
          <div
            key={activity.id}
            className="flex items-center px-4 hover:bg-gray-25 transition-colors"
            style={{
              height: "64px",
              borderTop: idx > 0 ? "1px solid #F5F5F5" : "1px solid #F5F5F5",
              background: "#FFFFFF",
            }}
          >
            {/* Nunito 400 16px lh=24px rgb(82,82,82) */}
            <p
              className="font-nunito font-normal text-ink-subtle"
              style={{ fontSize: "16px", lineHeight: "24px" }}
            >
              {activity.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
