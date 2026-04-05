"use client";

// Settings Page — node 213:14799
// Title: "Settings" Nunito 600 30px #141414
// Subtitle: "Ask a grown-up before changing anything" Nunito 400 16px #525252
// Action pills: 12 stars + 03 badges + volume (same as rewards detail)
// 3 section cards stacked (no tabs):
//   1. Profile Info — Name "Mia" + Age "4 Years" (display-only, #FAFAFA box, row gap=8)
//   2. Language Preference — Current Language "English" (display-only, #FAFAFA box)
//   3. Sound Settings — 2 toggle rows (Sound Effects ON, Background Music OFF), row gap=32
// Card: bg white border #E5E5E5 r=12 p=20 col gap=24
// Inner field box: bg #FAFAFA r=12 p=16
// Field label: Nunito 500 14px #424242
// Field value: Nunito 600 16px #141414
// Toggle track: 36×20 r=9999, ON=#F63D68, OFF=#F2F4F7
// Toggle knob: 16×16 r=9999 white with shadow-sm

import { useState } from "react";
import { Star, Volume2 } from "lucide-react";

/* ── Toggle ─────────────────────────────────────────── */

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="relative shrink-0 transition-colors duration-200"
      style={{
        width: "36px",
        height: "20px",
        borderRadius: "9999px",
        background: on ? "#F63D68" : "#F2F4F7",
        display: "flex",
        alignItems: "center",
        padding: "2px",
        justifyContent: on ? "flex-end" : "flex-start",
      }}
    >
      <span
        style={{
          width: "16px",
          height: "16px",
          borderRadius: "9999px",
          background: "#FFFFFF",
          boxShadow: "0px 1px 2px rgba(16,24,40,0.06), 0px 1px 3px rgba(16,24,40,0.1)",
          display: "block",
          flexShrink: 0,
        }}
      />
    </button>
  );
}

/* ── Field (display-only label + value) ─────────────── */

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-2 flex-1">
      <span
        className="font-nunito font-medium"
        style={{ fontSize: "14px", lineHeight: "20px", color: "#424242" }}
      >
        {label}
      </span>
      <span
        className="font-nunito font-semibold"
        style={{ fontSize: "16px", lineHeight: "24px", color: "#141414" }}
      >
        {value}
      </span>
    </div>
  );
}

/* ── Section card ───────────────────────────────────── */

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="bg-white flex flex-col"
      style={{ borderRadius: "12px", padding: "20px", gap: "24px", border: "1px solid #E5E5E5" }}
    >
      <h3
        className="font-nunito font-semibold"
        style={{ fontSize: "18px", lineHeight: "28px", color: "#141414" }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

/* ── Page ───────────────────────────────────────────── */

export default function SettingsPage() {
  const [soundEffects, setSoundEffects] = useState(true);
  const [bgMusic, setBgMusic] = useState(false);

  return (
    <div className="flex flex-col gap-5">

      {/* Title + action pills row */}
      <div className="flex items-start justify-between">
        <div>
          <h1
            className="font-nunito font-semibold"
            style={{ fontSize: "30px", lineHeight: "38px", color: "#141414" }}
          >
            Settings
          </h1>
          <p
            className="font-nunito font-normal mt-0.5"
            style={{ fontSize: "16px", lineHeight: "24px", color: "#525252" }}
          >
            Ask a grown-up before changing anything
          </p>
        </div>

        {/* Action pills */}
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-1"
            style={{ padding: "10px 12px", height: "40px", borderRadius: "12px", background: "#FFFFFF", border: "1px solid #E5E5E5", boxShadow: "0px 1px 2px 0px rgba(16,24,40,0.05)" }}
          >
            <span className="font-nunito font-semibold" style={{ fontSize: "14px", color: "#424242" }}>12</span>
            <Star size={20} style={{ color: "#F63D68", fill: "#F63D68" }} />
          </div>
          <div
            className="flex items-center gap-1"
            style={{ padding: "10px 12px", height: "40px", borderRadius: "12px", background: "#FFFFFF", border: "1px solid #E5E5E5", boxShadow: "0px 1px 2px 0px rgba(16,24,40,0.05)" }}
          >
            <span className="font-nunito font-semibold" style={{ fontSize: "14px", color: "#424242" }}>03</span>
            <span style={{ fontSize: "18px" }}>🏅</span>
          </div>
          <div
            className="flex items-center justify-center"
            style={{ width: "40px", height: "40px", borderRadius: "12px", background: "#FFFFFF", border: "1px solid #E5E5E5", boxShadow: "0px 1px 2px 0px rgba(16,24,40,0.05)" }}
          >
            <Volume2 size={20} style={{ color: "#424242" }} />
          </div>
        </div>
      </div>

      {/* ── Section 1: Profile Info ── */}
      <SectionCard title="Profile Info">
        <div
          className="flex gap-2"
          style={{ background: "#FAFAFA", borderRadius: "12px", padding: "16px" }}
        >
          <Field label="Name" value="Mia" />
          <Field label="Age" value="4 Years" />
        </div>
      </SectionCard>

      {/* ── Section 2: Language Preference ── */}
      <SectionCard title="Language Preference">
        <div
          style={{ background: "#FAFAFA", borderRadius: "12px", padding: "16px" }}
        >
          <Field label="Current Language" value="English" />
        </div>
      </SectionCard>

      {/* ── Section 3: Sound Settings ── */}
      <SectionCard title="Sound Settings">
        <div className="flex gap-8">

          {/* Sound Effects toggle */}
          <div
            className="flex flex-col flex-1"
            style={{ background: "#FAFAFA", borderRadius: "12px", padding: "16px", gap: "8px" }}
          >
            <div className="flex items-center justify-between gap-1.5">
              <span
                className="font-nunito font-semibold"
                style={{ fontSize: "14px", lineHeight: "20px", color: "#424242" }}
              >
                Sound Effects
              </span>
              <Toggle on={soundEffects} onToggle={() => setSoundEffects(!soundEffects)} />
            </div>
          </div>

          {/* Background Music toggle */}
          <div
            className="flex flex-col flex-1"
            style={{ background: "#FAFAFA", borderRadius: "12px", padding: "16px", gap: "8px" }}
          >
            <div className="flex items-center justify-between gap-1.5">
              <span
                className="font-nunito font-semibold"
                style={{ fontSize: "14px", lineHeight: "20px", color: "#424242" }}
              >
                Background Music:
              </span>
              <Toggle on={bgMusic} onToggle={() => setBgMusic(!bgMusic)} />
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
