// Admin Auth layout — same visual structure as (auth)/layout.tsx
// Full-page bg #FFF5F6, gradient blob, character image, sparkle dots, form card

import Image from "next/image";

export default function AdminAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative min-h-screen overflow-hidden flex items-center justify-center"
      style={{ background: "#FFF5F6" }}
    >
      {/* Decorative gradient blob */}
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

      {/* Auth character image */}
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
          src="/images/admin/login-illustration.png"
          alt=""
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </div>

      {/* Decorative sparkle dots */}
      <div className="absolute pointer-events-none" style={{ right: "18%", top: "10%", width: 14, height: 14, borderRadius: "50%", background: "rgba(253,111,142,0.5)" }} />
      <div className="absolute pointer-events-none" style={{ right: "5%", top: "12%", width: 10, height: 10, borderRadius: "50%", background: "rgba(253,111,142,0.4)" }} />
      <div className="absolute pointer-events-none" style={{ right: "15%", top: "33%", width: 8, height: 8, borderRadius: "50%", background: "rgba(253,111,142,0.35)" }} />
      <div className="absolute pointer-events-none" style={{ left: "44%", top: "11%", width: 12, height: 12, borderRadius: "50%", background: "rgba(253,111,142,0.3)" }} />
      <div className="absolute pointer-events-none" style={{ right: "6%", top: "29%", width: 18, height: 18, borderRadius: "50%", background: "rgba(253,111,142,0.25)" }} />
      <div className="absolute pointer-events-none" style={{ left: "25%", top: "33%", width: 20, height: 20, borderRadius: "50%", background: "rgba(253,111,142,0.2)" }} />
      <div className="absolute pointer-events-none" style={{ right: "22%", top: "39%", width: 10, height: 10, borderRadius: "50%", background: "rgba(253,111,142,0.3)" }} />
      <div className="absolute pointer-events-none" style={{ left: "48%", top: "15%", width: 16, height: 16, borderRadius: "50%", background: "rgba(253,111,142,0.25)" }} />

      {/* Form card */}
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
