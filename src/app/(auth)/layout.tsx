// Auth layout — Figma node 213:16032 (Login) / all auth screens
// Full-page bg: Rosé/25 = #FFF5F6, 1440×1024
// Decorative blob: large gradient circle right-center (fill_00HE11)
// Character image: 590×590 bottom-right (fill_JZYKEI)
// Decorative SVG small groups at various positions
// Form card: centered, 534px wide, padding 42px, r=30, white bg
//   shadow: 0px 4px 25px 0px rgba(0,0,0,0.08)
//   border: rgba(246,246,246,0.3) 6px solid
// NO logo above card — starts directly with page content

import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative min-h-screen overflow-hidden flex items-center justify-center"
      style={{ background: "#FFF5F6" }}
    >
      {/* Decorative gradient blob — Ellipse 1: fill_00HE11
          linear-gradient(180deg, rgba(253,111,142,1) 0%, rgba(254,255,228,1) 100%)
          positioned at x=331 y=-125, w=1241 h=1231 on 1440px canvas */}
      <div
        className="absolute pointer-events-none"
        style={{
          right: "-5%",
          top: "-12%",
          width: "86%",
          height: "120%",
          borderRadius: "50%",
          background: "linear-gradient(180deg, rgba(253,111,142,0.35) 0%, rgba(254,255,228,0.35) 100%)",
        }}
      />

      {/* Auth character image — 590×590, x=903 y=403 on 1440px */}
      <div
        className="absolute pointer-events-none"
        style={{
          right: "2%",
          bottom: "0",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          overflow: "hidden",
          opacity: 0.9,
        }}
      >
        <Image
          src="/images/auth/auth-character.png"
          alt=""
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </div>

      {/* Decorative sparkle dots — from Figma Group positions */}
      {/* Group at x=1012 y=106 w=316 h=89 */}
      <div className="absolute pointer-events-none" style={{ right: "18%", top: "10%", width: 14, height: 14, borderRadius: "50%", background: "rgba(253,111,142,0.5)" }} />
      {/* Group at x=1342 y=120 w=54 h=27 */}
      <div className="absolute pointer-events-none" style={{ right: "5%", top: "12%", width: 10, height: 10, borderRadius: "50%", background: "rgba(253,111,142,0.4)" }} />
      {/* Group at x=1060 y=333 w=66 h=37 */}
      <div className="absolute pointer-events-none" style={{ right: "15%", top: "33%", width: 8, height: 8, borderRadius: "50%", background: "rgba(253,111,142,0.35)" }} />
      {/* Group at x=638 y=116 w=66 h=37 */}
      <div className="absolute pointer-events-none" style={{ left: "44%", top: "11%", width: 12, height: 12, borderRadius: "50%", background: "rgba(253,111,142,0.3)" }} />
      {/* Group at x=1314 y=301 w=116 h=52 */}
      <div className="absolute pointer-events-none" style={{ right: "6%", top: "29%", width: 18, height: 18, borderRadius: "50%", background: "rgba(253,111,142,0.25)" }} />
      {/* Group at x=366 y=342 w=208 h=93 */}
      <div className="absolute pointer-events-none" style={{ left: "25%", top: "33%", width: 20, height: 20, borderRadius: "50%", background: "rgba(253,111,142,0.2)" }} />
      {/* Group at x=960 y=403 w=79 h=42 */}
      <div className="absolute pointer-events-none" style={{ right: "22%", top: "39%", width: 10, height: 10, borderRadius: "50%", background: "rgba(253,111,142,0.3)" }} />
      {/* Group at x=687 y=150 w=200 h=94 */}
      <div className="absolute pointer-events-none" style={{ left: "48%", top: "15%", width: 16, height: 16, borderRadius: "50%", background: "rgba(253,111,142,0.25)" }} />

      {/* Form card — layout_X8JT6I: 534px wide, gap=32, padding=42, r=30 */}
      <div className="relative z-10 w-full flex items-center justify-center px-4 py-8">
        <div
          className="bg-white flex flex-col w-full"
          style={{
            maxWidth: "534px",
            borderRadius: "30px",
            padding: "42px",
            gap: "32px",
            border: "6px solid rgba(246,246,246,0.3)",
            boxShadow: "0px 4px 25px 0px rgba(0,0,0,0.08)",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
