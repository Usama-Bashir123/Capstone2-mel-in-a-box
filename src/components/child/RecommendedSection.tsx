// Recommended For Mia — Figma node 213:10390
// Outer: bg white r=12 p=20 col gap=16
// Title: Text xl/Semibold = Nunito 600 20px lh=30px Gray true/800 = #292929
// Cards: border Gray/200, r=12, p=12, gap=16; flex row, align stretch
// Thumbnail: fills height, r=8, actual Figma images
// Title: Text md/Semibold = Nunito 600 16px lh=24px Gray true/900
// Tag: Text sm/Semibold = Nunito 600 14px lh=20px Gray true/700 = #424242
// Button: Rosé/500 bg, Nunito 700 14px white, r=8, align stretch

import Link from "next/link";
import Image from "next/image";

import { Story } from "@/types";

interface RecommendedSectionProps {
  stories: Story[];
}

export function RecommendedSection({ stories }: RecommendedSectionProps) {
  return (
    <div className="bg-white flex flex-col gap-4" style={{ borderRadius: "12px", padding: "20px" }}>
      {/* Section title — Text xl/Semibold = Nunito 600 20px lh=30px #292929 */}
      <h3
        className="font-nunito font-semibold"
        style={{ fontSize: "20px", lineHeight: "30px", color: "#292929" }}
      >
        Recommended For Mia
      </h3>

      {/* Cards row — gap=20 */}
      <div className="flex gap-5">
        {stories.map((story) => (
          <div
            key={story.id}
            className="flex flex-col flex-1 min-w-0"
            style={{ borderRadius: "12px", border: "1px solid #E5E5E5", padding: "12px", gap: "16px" }}
          >
            {/* Thumbnail — fills column width, h=180, r=8, actual Figma image */}
            <div
              className="relative w-full overflow-hidden shrink-0"
              style={{ height: "180px", borderRadius: "8px", border: "1px solid #E5E5E5" }}
            >
              <Image
                src={story.thumbnail}
                alt={story.title}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>

            {/* Body — col gap=16, justify center, align stretch */}
            <div className="flex flex-col gap-4 justify-center">
              {/* Title + tag row */}
              <div className="flex items-center justify-between gap-2">
                {/* Text md/Semibold = Nunito 600 16px lh=24px Gray true/900 = #141414 */}
                <p
                  className="font-nunito font-semibold"
                  style={{ fontSize: "16px", lineHeight: "24px", color: "#141414" }}
                >
                  {story.title}
                </p>
                {/* Text sm/Semibold = Nunito 600 14px lh=20px Gray true/700 = #424242 */}
                <span
                  className="font-nunito font-semibold shrink-0"
                  style={{ fontSize: "14px", lineHeight: "20px", color: "#424242" }}
                >
                  {story.category}
                </span>
              </div>

              {/* Button — Rosé/500 bg, Nunito 700 14px white, align stretch, r=8 h=40 */}
              <Link
                href={`/child/stories/${story.id}`}
                className="flex items-center justify-center font-nunito font-bold text-white hover:opacity-90 transition-opacity"
                style={{
                  height: "40px",
                  borderRadius: "8px",
                  background: "#F63D68",
                  fontSize: "14px",
                  lineHeight: "20px",
                }}
              >
                {story.isLocked ? "Unlock" : "Start"}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
