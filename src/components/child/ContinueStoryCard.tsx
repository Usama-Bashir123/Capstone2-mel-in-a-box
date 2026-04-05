// Continue Your Story — Figma node 213:10260
// Outer: bg white r=12 p=20 gap=16
// Title: Text xl/Semibold = Nunito 600 20px lh=30px Gray true/800 = #292929
// Inner card: r=12 border Gray/200, padding=12, column gap=16
// Profile thumbnail: fill_2NUGOJ = story-underwater.png, fills card area
// Story title: Text md/Semibold = Nunito 600 16px lh=24px Gray true/900 = #141414
// Progress: 50%, track #F5F5F5, fill Rosé/500 = #F63D68, percentage label
// Last Read: Text xs/Medium + Text xs/Semibold
// Button: "Continue Story" Rosé/500 bg, Nunito 700 14px white, r=8 h=40

import Link from "next/link";
import Image from "next/image";

const story = {
  id: "1",
  title: "Underwater Kingdom",
  progress: 50,
  lastRead: "2 hrs ago",
};

export function ContinueStoryCard() {
  return (
    <div className="bg-white flex flex-col gap-4" style={{ borderRadius: "12px", padding: "20px" }}>

      {/* Header — Text xl/Semibold = Nunito 600 20px lh=30px #292929 */}
      <div className="flex items-center justify-between">
        <h3
          className="font-nunito font-semibold"
          style={{ fontSize: "20px", lineHeight: "30px", color: "#292929" }}
        >
          Continue Your Story
        </h3>
      </div>

      {/* Inner story card — border Gray/200, r=12, padding=12, column gap=16 */}
      <div
        className="flex flex-col gap-4"
        style={{ borderRadius: "12px", border: "1px solid #E5E5E5", padding: "12px" }}
      >
        {/* Thumbnail — fill_2NUGOJ = story-underwater.png, fills width, r=8 */}
        <div
          className="relative w-full overflow-hidden"
          style={{ height: "180px", borderRadius: "8px", border: "1px solid #E5E5E5" }}
        >
          <Image
            src="/images/child/story-underwater.png"
            alt="Underwater Kingdom"
            fill
            style={{ objectFit: "cover" }}
          />
        </div>

        {/* Card body — column gap=16 */}
        <div className="flex flex-col gap-4">

          {/* Story title row — space-between */}
          <div className="flex items-center justify-between gap-3">
            {/* Text md/Semibold = Nunito 600 16px lh=24px Gray true/900 = #141414 */}
            <h4
              className="font-nunito font-semibold"
              style={{ fontSize: "16px", lineHeight: "24px", color: "#141414" }}
            >
              {story.title}
            </h4>
          </div>

          {/* Progress + Last Read — column gap=10 */}
          <div className="flex flex-col gap-2.5">
            {/* Progress bar — track #F5F5F5 r=8, fill Rosé/500 = #F63D68 + percentage */}
            <div className="flex items-center gap-3">
              <div
                className="flex-1 relative"
                style={{ height: "8px", borderRadius: "8px", background: "#F5F5F5" }}
              >
                <div
                  className="absolute inset-y-0 left-0"
                  style={{
                    width: `${story.progress}%`,
                    background: "#F63D68",
                    borderRadius: "8px",
                  }}
                />
              </div>
              {/* Text sm/Medium = Inter 500 14px lh=20px #344054 */}
              <span
                className="font-inter font-medium shrink-0"
                style={{ fontSize: "14px", lineHeight: "20px", color: "#344054" }}
              >
                {story.progress}%
              </span>
            </div>

            {/* Last Read — row gap=6 */}
            <div className="flex items-center gap-1.5">
              {/* Text xs/Medium = Nunito 500 12px lh=18px Gray true/600 = #525252 */}
              <span
                className="font-nunito font-medium"
                style={{ fontSize: "12px", lineHeight: "18px", color: "#525252" }}
              >
                Last Read:
              </span>
              {/* Text xs/Semibold = Nunito 600 12px lh=18px Gray true/700 = #424242 */}
              <span
                className="font-nunito font-semibold"
                style={{ fontSize: "12px", lineHeight: "18px", color: "#424242" }}
              >
                {story.lastRead}
              </span>
            </div>
          </div>

          {/* Button — Rosé/500 bg, Text sm/Bold = Nunito 700 14px white, r=8, h=40 */}
          <Link
            href={`/child/stories/${story.id}`}
            className="w-full flex items-center justify-center font-nunito font-bold text-white hover:opacity-90 transition-opacity"
            style={{
              height: "40px",
              borderRadius: "8px",
              background: "#F63D68",
              fontSize: "14px",
              lineHeight: "20px",
            }}
          >
            Continue Story
          </Link>
        </div>
      </div>
    </div>
  );
}
