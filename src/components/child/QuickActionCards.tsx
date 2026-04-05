// Quick Action Cards — Figma node 213:10285
// Outer: bg white r=12 p=20 col gap=16
// Title: Text xl/Semibold = Nunito 600 20px lh=30px Gray true/800 = #292929
// Cards: Gray true/25 = #FCFCFC bg, r=12, p=12, column gap=20
// Profile thumbnail: 95x95 r=8, actual images from Figma
// Subtitle: Text xs/Semibold = Nunito 600 12px lh=18px Gray true/600 = #525252
// Title: Text md/Semibold = Nunito 600 16px lh=24px Gray true/900 = #141414
// Button: Rosé/500 = #F63D68, Nunito 700 14px white, r=8, padding 10px 14px

import Link from "next/link";
import Image from "next/image";

const quickActions = [
  {
    id: "1",
    subtitle: "Read a New Story",
    title: "Discover a magical new story",
    image: "/images/child/story-underwater.png",
    href: "/child/stories",
    btnLabel: "Start Reading",
  },
  {
    id: "2",
    subtitle: "Play a Game",
    title: "Fun games to earn stars",
    image: "/images/child/game-thumbnail.png",
    href: "/child/games",
    btnLabel: "Play Game",
  },
  {
    id: "3",
    subtitle: "Creative Time",
    title: "Color, draw & have fun",
    image: "/images/child/creative-thumbnail.png",
    href: "/child/games",
    btnLabel: "Start Activity",
  },
];

export function QuickActionCards() {
  return (
    <div className="bg-white flex flex-col gap-4" style={{ borderRadius: "12px", padding: "20px" }}>

      {/* Header — Text xl/Semibold = Nunito 600 20px lh=30px #292929 */}
      <h3
        className="font-nunito font-semibold"
        style={{ fontSize: "20px", lineHeight: "30px", color: "#292929" }}
      >
        Quick Action Cards
      </h3>

      {/* Cards — column gap=16 */}
      <div className="flex flex-col gap-4">
        {quickActions.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3"
            style={{ background: "#FCFCFC", borderRadius: "12px", padding: "12px", border: "1px solid #E5E5E5" }}
          >
            {/* Thumbnail — 95×95 r=8, actual Figma image */}
            <div
              className="relative shrink-0 overflow-hidden"
              style={{ width: "95px", height: "95px", borderRadius: "8px", border: "1px solid #E5E5E5" }}
            >
              <Image
                src={item.image}
                alt={item.subtitle}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>

            {/* Info — column gap=16 */}
            <div className="flex flex-col gap-4 flex-1 min-w-0">
              <div>
                {/* Text xs/Semibold = Nunito 600 12px lh=18px Gray true/600 = #525252 */}
                <p
                  className="font-nunito font-semibold"
                  style={{ fontSize: "12px", lineHeight: "18px", color: "#525252" }}
                >
                  {item.subtitle}
                </p>
                {/* Text md/Semibold = Nunito 600 16px lh=24px Gray true/900 = #141414 */}
                <p
                  className="font-nunito font-semibold"
                  style={{ fontSize: "16px", lineHeight: "24px", color: "#141414" }}
                >
                  {item.title}
                </p>
              </div>

              {/* Button — Rosé/500 bg, Text sm/Bold = Nunito 700 14px white, r=8 padding 10px 14px */}
              <Link
                href={item.href}
                className="self-start inline-flex items-center justify-center font-nunito font-bold text-white hover:opacity-90 transition-opacity"
                style={{
                  padding: "10px 14px",
                  borderRadius: "8px",
                  background: "#F63D68",
                  fontSize: "14px",
                  lineHeight: "20px",
                }}
              >
                {item.btnLabel}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
