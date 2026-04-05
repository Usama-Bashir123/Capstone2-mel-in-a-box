// Story Detail Page — node 213:10423 (detail overlay)
// Breadcrumb: Stories > [Title]
// Hero banner with gradient thumbnail
// Info section: progress, last read, age, pages
// Continue/Start Reading button: #F53D68

import Link from "next/link";
import { ChevronRight, BookOpen } from "lucide-react";

const storyData: Record<string, {
  title: string;
  emoji: string;
  gradient: string;
  progress: number;
  lastRead: string;
  ageRange: string;
  totalPages: number;
  description: string;
  author: string;
}> = {
  "1": {
    title: "Underwater Kingdom",
    emoji: "🌊",
    gradient: "linear-gradient(135deg, #BFDBFE 0%, #93C5FD 100%)",
    progress: 50,
    lastRead: "2 hrs ago",
    ageRange: "3-6",
    totalPages: 24,
    description: "Dive into the magical world beneath the waves and discover the wonders of the underwater kingdom with Mel!",
    author: "Mel Stories",
  },
  "2": {
    title: "The Brave Little Fox",
    emoji: "🦊",
    gradient: "linear-gradient(135deg, #FDE68A 0%, #FCA5A5 100%)",
    progress: 65,
    lastRead: "Yesterday",
    ageRange: "3-6",
    totalPages: 20,
    description: "Follow the brave little fox on an adventure through the forest, learning courage and friendship along the way.",
    author: "Mel Stories",
  },
  "3": {
    title: "Stars and Planets",
    emoji: "⭐",
    gradient: "linear-gradient(135deg, #C4B5FD 0%, #818CF8 100%)",
    progress: 20,
    lastRead: "3 days ago",
    ageRange: "4-7",
    totalPages: 28,
    description: "Explore the wonders of the universe as Mel takes you on a journey through stars, planets, and galaxies.",
    author: "Mel Stories",
  },
  default: {
    title: "The Magical Jungle",
    emoji: "🦁",
    gradient: "linear-gradient(135deg, #BBF7D0 0%, #059669 100%)",
    progress: 0,
    lastRead: "Not started",
    ageRange: "3-6",
    totalPages: 22,
    description: "Join Mel on an exciting journey through the magical jungle, meeting friendly animals and solving fun puzzles!",
    author: "Mel Stories",
  },
};

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      className="flex items-center justify-between"
      style={{ padding: "14px 0", borderBottom: "1px solid #F3F4F6" }}
    >
      <span
        className="font-nunito font-medium"
        style={{ fontSize: "14px", lineHeight: "20px", color: "#424242" }}
      >
        {label}
      </span>
      <div>{children}</div>
    </div>
  );
}

export default function StoryDetailPage({ params }: { params: { id: string } }) {
  const story = storyData[params.id] ?? storyData.default;
  const isStarted = story.progress > 0;
  const pagesRead = Math.round((story.progress / 100) * story.totalPages);

  return (
    <div className="flex flex-col gap-5">

      {/* Breadcrumb */}
      <div className="flex items-center gap-1">
        <Link
          href="/child/stories"
          className="font-nunito font-bold hover:opacity-75 transition-opacity"
          style={{ fontSize: "14px", lineHeight: "20px", color: "#424242" }}
        >
          Stories
        </Link>
        <ChevronRight size={14} className="text-gray-400" />
        <span
          className="font-nunito font-bold"
          style={{ fontSize: "14px", lineHeight: "20px", color: "#F53D68" }}
        >
          {story.title}
        </span>
      </div>

      {/* Main card */}
      <div className="bg-white flex flex-col gap-5" style={{ borderRadius: "12px", padding: "20px" }}>

        {/* Section title */}
        <h3
          className="font-nunito font-semibold text-ink"
          style={{ fontSize: "18px", lineHeight: "28px" }}
        >
          Story
        </h3>

        {/* Thumbnail + meta row */}
        <div className="flex items-start gap-5">
          {/* Thumbnail */}
          <div
            className="flex items-center justify-center shrink-0"
            style={{ width: "126px", height: "126px", borderRadius: "12px", background: story.gradient }}
          >
            <span style={{ fontSize: "64px", opacity: 0.6 }}>{story.emoji}</span>
          </div>

          {/* Title + progress */}
          <div className="flex flex-col gap-2 pt-1">
            <p
              className="font-nunito font-semibold text-ink"
              style={{ fontSize: "16px", lineHeight: "24px" }}
            >
              {story.title}
            </p>

            {/* Progress bar */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <div
                  className="overflow-hidden"
                  style={{ width: "160px", height: "6px", borderRadius: "9999px", background: "#F3F4F6" }}
                >
                  <div
                    style={{
                      width: `${story.progress}%`,
                      height: "100%",
                      borderRadius: "9999px",
                      background: "#F53D68",
                    }}
                  />
                </div>
                <span
                  className="font-nunito font-semibold"
                  style={{ fontSize: "12px", lineHeight: "18px", color: "#F53D68" }}
                >
                  {story.progress}%
                </span>
              </div>
              <span
                className="font-nunito"
                style={{ fontSize: "12px", lineHeight: "18px", color: "#525252" }}
              >
                {isStarted ? `${pagesRead} of ${story.totalPages} pages` : "Not started"}
              </span>
            </div>

            {/* Author */}
            <div className="flex items-center gap-1">
              <BookOpen size={12} style={{ color: "#9CA3AF" }} />
              <span
                className="font-nunito"
                style={{ fontSize: "12px", lineHeight: "18px", color: "#9CA3AF" }}
              >
                {story.author}
              </span>
            </div>
          </div>
        </div>

        {/* Info rows */}
        <div className="flex flex-col">
          <InfoRow label="Progress">
            <div className="flex items-center gap-2">
              <div
                className="overflow-hidden"
                style={{ width: "100px", height: "6px", borderRadius: "9999px", background: "#F3F4F6" }}
              >
                <div
                  style={{
                    width: `${story.progress}%`,
                    height: "100%",
                    borderRadius: "9999px",
                    background: "#F53D68",
                  }}
                />
              </div>
              <span
                className="font-nunito font-semibold text-ink"
                style={{ fontSize: "16px", lineHeight: "24px" }}
              >
                {story.progress}%
              </span>
            </div>
          </InfoRow>

          <InfoRow label="Last Read">
            <span
              className="font-nunito font-semibold text-ink"
              style={{ fontSize: "16px", lineHeight: "24px" }}
            >
              {story.lastRead}
            </span>
          </InfoRow>

          <InfoRow label="Age Range">
            <span
              className="font-nunito font-semibold text-ink"
              style={{ fontSize: "16px", lineHeight: "24px" }}
            >
              Age {story.ageRange}
            </span>
          </InfoRow>

          <InfoRow label="Total Pages">
            <span
              className="font-nunito font-semibold text-ink"
              style={{ fontSize: "16px", lineHeight: "24px" }}
            >
              {story.totalPages} pages
            </span>
          </InfoRow>

          <InfoRow label="Description">
            <span
              className="font-nunito font-semibold text-ink"
              style={{ fontSize: "16px", lineHeight: "24px", maxWidth: "600px", textAlign: "right" }}
            >
              {story.description}
            </span>
          </InfoRow>
        </div>

        {/* CTA button */}
        <div>
          <Link
            href={`/child/stories/${params.id}/read`}
            className="inline-flex items-center justify-center font-nunito font-bold text-white hover:opacity-90 transition-opacity"
            style={{
              height: "40px",
              paddingLeft: "28px",
              paddingRight: "28px",
              borderRadius: "8px",
              background: "#F53D68",
              fontSize: "14px",
              lineHeight: "20px",
            }}
          >
            {isStarted ? "Continue Reading" : "Start Reading"}
          </Link>
        </div>
      </div>
    </div>
  );
}
