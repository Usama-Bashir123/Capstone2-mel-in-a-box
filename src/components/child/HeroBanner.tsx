"use client";

// Hero Banner — Figma node 213:10561 "Top Pages"
// Root: 260px h, gradient(8deg, #FEF2DD 1%, #FF7293 100%), r=12, border 1px #E5E5E5, p=20px 42px
// Chat box: 691×146px, white 4px border, r=12, shadow, multi-layer pink gradient bg
//   Title: Nunito 700 36px ls=-0.72px white
//   Subtitle: Nunito 500 20px lh=30px white, gap=8px
// Character image: 506×506 positioned x:611 y:-28 (overflows top), objectFit:contain
// Sparkles: white dots/stars scattered at absolute positions

import Image from "next/image";

interface HeroBannerProps {
  subtitle?: string;
}

export function HeroBanner({ subtitle = "Keep going! You're doing amazing today!" }: HeroBannerProps) {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(8deg, #FEF2DD 1%, #FF7293 100%)",
        borderRadius: "12px",
        border: "1px solid #E5E5E5",
        height: "260px",
        padding: "20px 42px",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* ── Sparkle decorations (white, scattered) ── */}
      {/* Large star top-right area — x:673 y:8 — 36×38 */}
      <div
        className="absolute"
        style={{ left: "63%", top: "3%", width: 36, height: 36, opacity: 0.7 }}
      >
        <svg viewBox="0 0 36 38" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 0L21.5 14.5L36 18L21.5 21.5L18 36L14.5 21.5L0 18L14.5 14.5L18 0Z" />
        </svg>
      </div>
      {/* Medium star — x:733 y:46 — 18×19 */}
      <div
        className="absolute"
        style={{ left: "68.6%", top: "17.7%", width: 18, height: 19, opacity: 0.7 }}
      >
        <svg viewBox="0 0 18 19" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 0L10.8 7.2L18 9L10.8 10.8L9 18L7.2 10.8L0 9L7.2 7.2L9 0Z" />
        </svg>
      </div>
      {/* Small dot — x:39 y:211 — 11×11 */}
      <div
        className="absolute"
        style={{ left: "3.6%", bottom: "18px", width: 11, height: 11, borderRadius: "50%", background: "rgba(255,255,255,0.5)" }}
      />
      {/* Tiny dot — x:10 y:157 — 7×7 */}
      <div
        className="absolute"
        style={{ left: "0.9%", top: "60%", width: 7, height: 7, borderRadius: "50%", background: "rgba(255,255,255,0.45)" }}
      />
      {/* Medium dot — x:76 y:221 — 25×26 */}
      <div
        className="absolute"
        style={{ left: "7.1%", bottom: "12px", width: 25, height: 25, borderRadius: "50%", background: "rgba(255,255,255,0.25)" }}
      />
      {/* Small dot — x:139 y:208 — 13×14 */}
      <div
        className="absolute"
        style={{ left: "13%", bottom: "35px", width: 13, height: 13, borderRadius: "50%", background: "rgba(255,255,255,0.35)" }}
      />

      {/* ── Chat box ── */}
      {/* Figma: 691×146px, border 4px white, r=12, shadow, multi-layer pink gradient */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          borderRadius: "12px",
          border: "4px solid #FFFFFF",
          padding: "32px 35px",
          width: "62%",
          boxShadow: "-9px 12px 7.46px 0px rgba(123,123,123,0.23)",
          background: [
            "linear-gradient(rgba(255,59,104,0.38), rgba(255,59,104,0.38))",
            "linear-gradient(90deg, rgba(246,61,104,0) 0%, rgba(246,61,104,1) 100%)",
            "linear-gradient(90deg, rgba(204,48,94,1) 0%, rgba(204,48,94,0) 100%)",
            "#FFFFFF",
          ].join(", "),
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {/* "Hi! I'm Mel!" — Nunito 700 36px ls=-0.72px white */}
        <h2
          className="font-nunito font-bold text-white"
          style={{ fontSize: "36px", lineHeight: "44px", letterSpacing: "-0.72px", margin: 0 }}
        >
          Hi! I&apos;m Mel!
        </h2>
        {/* Subtitle — Nunito 500 20px lh=30px white */}
        <p
          className="font-nunito font-medium text-white"
          style={{ fontSize: "20px", lineHeight: "30px", margin: 0 }}
        >
          {subtitle}
        </p>
      </div>

      {/* ── Hero character image ── */}
      {/* Figma: 506×506px at x:611 y:-28 — overflows top, objectFit:contain */}
      <div
        style={{
          position: "absolute",
          right: "0px",
          top: "-28px",
          width: "288px",
          height: "288px",
          filter: "drop-shadow(0px 4px 4px rgba(255,255,255,1))",
        }}
      >
        <Image
          src="/images/hero/hero-character.png"
          alt="Mel the character"
          fill
          style={{ objectFit: "contain", objectPosition: "bottom" }}
          priority
        />
      </div>
    </div>
  );
}
