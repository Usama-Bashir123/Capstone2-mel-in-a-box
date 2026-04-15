"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Search, Upload, Eye, RefreshCw, Trash2,
  LayoutList, LayoutGrid, X, Play, Pause, Download, Volume2,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────
type AssetTab = "Images" | "Backgrounds" | "Characters" | "Icons" | "Audio" | "Videos";
type ViewMode = "list" | "grid";

interface Asset {
  id: string;
  tab: AssetTab;
  name: string;
  usedIn: string | string[];
  size: string;
  type: string;
  resolution?: string;
  duration?: string;
  uploadedBy: string;
  uploadDate: string;
  thumbTop: string;
  thumbBottom: string;
}

// ── Mock data ─────────────────────────────────────────────────────
const ALL_ASSETS: Asset[] = [
  // Images
  { id: "img-1", tab: "Images",      name: "Jungle",              usedIn: "The Magical Jungle",          size: "2.4 MB", type: "PNG", resolution: "1920 × 1080", uploadedBy: "Admin", uploadDate: "Mar 10, 2025", thumbTop: "#4ADE80", thumbBottom: "#166534" },
  { id: "img-2", tab: "Images",      name: "Space Background",    usedIn: "Space Explorer Mel",          size: "3.1 MB", type: "JPG", resolution: "2560 × 1440", uploadedBy: "Admin", uploadDate: "Mar 08, 2025", thumbTop: "#60A5FA", thumbBottom: "#1E3A8A" },
  { id: "img-3", tab: "Images",      name: "Ocean Waves",         usedIn: "Ocean Adventure",             size: "1.8 MB", type: "PNG", resolution: "1920 × 1080", uploadedBy: "Admin", uploadDate: "Mar 05, 2025", thumbTop: "#38BDF8", thumbBottom: "#0C4A6E" },
  { id: "img-4", tab: "Images",      name: "Desert Dunes",        usedIn: "Desert Safari Mel",           size: "2.9 MB", type: "PNG", resolution: "1920 × 1080", uploadedBy: "Admin", uploadDate: "Feb 28, 2025", thumbTop: "#FBBF24", thumbBottom: "#92400E" },
  { id: "img-5", tab: "Images",      name: "Pirate Ship",         usedIn: "Pirate Island Activity Pack", size: "4.2 MB", type: "PNG", resolution: "2048 × 1152", uploadedBy: "Admin", uploadDate: "Feb 20, 2025", thumbTop: "#818CF8", thumbBottom: "#312E81" },
  { id: "img-6", tab: "Images",      name: "Bedtime Sky",         usedIn: "Jungle Bedtime Story Video",  size: "1.5 MB", type: "JPG", resolution: "1920 × 1080", uploadedBy: "Admin", uploadDate: "Feb 15, 2025", thumbTop: "#C084FC", thumbBottom: "#581C87" },
  // Backgrounds
  { id: "bg-1",  tab: "Backgrounds", name: "Forest Dawn",         usedIn: ["The Magical Jungle", "Bedtime Story"],   size: "1.2 MB", type: "PNG", resolution: "1920 × 1080", uploadedBy: "Admin", uploadDate: "Mar 12, 2025", thumbTop: "#34D399", thumbBottom: "#064E3B" },
  { id: "bg-2",  tab: "Backgrounds", name: "Starry Night",        usedIn: ["Space Explorer Mel", "Night Adventure"], size: "2.1 MB", type: "PNG", resolution: "2560 × 1440", uploadedBy: "Admin", uploadDate: "Mar 09, 2025", thumbTop: "#818CF8", thumbBottom: "#1E1B4B" },
  { id: "bg-3",  tab: "Backgrounds", name: "Coral Reef",          usedIn: "Ocean Adventure",             size: "1.6 MB", type: "PNG", resolution: "1920 × 1080", uploadedBy: "Admin", uploadDate: "Mar 06, 2025", thumbTop: "#FB923C", thumbBottom: "#7C2D12" },
  { id: "bg-4",  tab: "Backgrounds", name: "Sandy Desert",        usedIn: "Desert Safari Mel",           size: "1.4 MB", type: "PNG", resolution: "1920 × 1080", uploadedBy: "Admin", uploadDate: "Feb 25, 2025", thumbTop: "#FCD34D", thumbBottom: "#78350F" },
  { id: "bg-5",  tab: "Backgrounds", name: "Pirate Cove",         usedIn: ["Pirate Island", "Sea Quest"], size: "1.9 MB", type: "PNG", resolution: "2048 × 1152", uploadedBy: "Admin", uploadDate: "Feb 18, 2025", thumbTop: "#7DD3FC", thumbBottom: "#0C4A6E" },
  { id: "bg-6",  tab: "Backgrounds", name: "Moonlit Valley",      usedIn: "Bedtime Story Video",         size: "1.1 MB", type: "PNG", resolution: "1920 × 1080", uploadedBy: "Admin", uploadDate: "Feb 10, 2025", thumbTop: "#A78BFA", thumbBottom: "#4C1D95" },
  // Characters
  { id: "ch-1",  tab: "Characters",  name: "Mel — Explorer",      usedIn: ["Space Explorer Mel", "Jungle", "+3 more"], size: "0.8 MB", type: "SVG", resolution: "512 × 512", uploadedBy: "Admin", uploadDate: "Mar 11, 2025", thumbTop: "#FCA5A5", thumbBottom: "#991B1B" },
  { id: "ch-2",  tab: "Characters",  name: "Mel — Pirate",        usedIn: "Pirate Island Activity Pack", size: "0.7 MB", type: "SVG", resolution: "512 × 512", uploadedBy: "Admin", uploadDate: "Mar 07, 2025", thumbTop: "#6EE7B7", thumbBottom: "#065F46" },
  { id: "ch-3",  tab: "Characters",  name: "Mel — Astronaut",     usedIn: ["Space Explorer Mel", "+2 more"], size: "0.9 MB", type: "SVG", resolution: "512 × 512", uploadedBy: "Admin", uploadDate: "Mar 04, 2025", thumbTop: "#93C5FD", thumbBottom: "#1D4ED8" },
  { id: "ch-4",  tab: "Characters",  name: "Mel — Desert Guide",  usedIn: "Desert Safari Mel",           size: "0.6 MB", type: "SVG", resolution: "512 × 512", uploadedBy: "Admin", uploadDate: "Feb 27, 2025", thumbTop: "#FDE68A", thumbBottom: "#92400E" },
  { id: "ch-5",  tab: "Characters",  name: "Mel — Sailor",        usedIn: ["Ocean Adventure", "Sea Quest"], size: "0.8 MB", type: "SVG", resolution: "512 × 512", uploadedBy: "Admin", uploadDate: "Feb 21, 2025", thumbTop: "#BAE6FD", thumbBottom: "#0369A1" },
  { id: "ch-6",  tab: "Characters",  name: "Mel — Dreamer",       usedIn: "Jungle Bedtime Story Video",  size: "0.7 MB", type: "SVG", resolution: "512 × 512", uploadedBy: "Admin", uploadDate: "Feb 14, 2025", thumbTop: "#DDD6FE", thumbBottom: "#5B21B6" },
  // Icons
  { id: "ic-1",  tab: "Icons",       name: "Star Badge",          usedIn: "Global — Rewards",            size: "0.1 MB", type: "SVG", resolution: "64 × 64",   uploadedBy: "Admin", uploadDate: "Mar 10, 2025", thumbTop: "#FDE047", thumbBottom: "#CA8A04" },
  { id: "ic-2",  tab: "Icons",       name: "Book Icon",           usedIn: "Global — Stories",            size: "0.1 MB", type: "SVG", resolution: "64 × 64",   uploadedBy: "Admin", uploadDate: "Mar 08, 2025", thumbTop: "#86EFAC", thumbBottom: "#16A34A" },
  { id: "ic-3",  tab: "Icons",       name: "Play Button",         usedIn: "Global — Media",              size: "0.1 MB", type: "SVG", resolution: "64 × 64",   uploadedBy: "Admin", uploadDate: "Mar 06, 2025", thumbTop: "#7DD3FC", thumbBottom: "#0284C7" },
  { id: "ic-4",  tab: "Icons",       name: "Trophy",              usedIn: "Global — Achievements",       size: "0.1 MB", type: "SVG", resolution: "64 × 64",   uploadedBy: "Admin", uploadDate: "Feb 26, 2025", thumbTop: "#FDA4AF", thumbBottom: "#BE123C" },
  { id: "ic-5",  tab: "Icons",       name: "Heart",               usedIn: "Global — Favourites",         size: "0.1 MB", type: "SVG", resolution: "64 × 64",   uploadedBy: "Admin", uploadDate: "Feb 20, 2025", thumbTop: "#F9A8D4", thumbBottom: "#9D174D" },
  { id: "ic-6",  tab: "Icons",       name: "Compass",             usedIn: "Desert Safari Mel",           size: "0.1 MB", type: "SVG", resolution: "64 × 64",   uploadedBy: "Admin", uploadDate: "Feb 12, 2025", thumbTop: "#C4B5FD", thumbBottom: "#6D28D9" },
  // Audio
  { id: "au-1",  tab: "Audio",       name: "Jungle Adventure",    usedIn: "The Magical Jungle",          size: "3.2 MB", type: "MP3", duration: "2:34", uploadedBy: "Admin", uploadDate: "Mar 10, 2025", thumbTop: "#4ADE80", thumbBottom: "#166534" },
  { id: "au-2",  tab: "Audio",       name: "Space Theme",         usedIn: "Space Explorer Mel",          size: "2.8 MB", type: "MP3", duration: "1:58", uploadedBy: "Admin", uploadDate: "Mar 08, 2025", thumbTop: "#60A5FA", thumbBottom: "#1E3A8A" },
  { id: "au-3",  tab: "Audio",       name: "Ocean Breeze",        usedIn: "Ocean Adventure",             size: "4.1 MB", type: "MP3", duration: "3:12", uploadedBy: "Admin", uploadDate: "Mar 05, 2025", thumbTop: "#38BDF8", thumbBottom: "#0C4A6E" },
  { id: "au-4",  tab: "Audio",       name: "Desert Wind",         usedIn: "Desert Safari Mel",           size: "2.5 MB", type: "MP3", duration: "2:05", uploadedBy: "Admin", uploadDate: "Feb 28, 2025", thumbTop: "#FBBF24", thumbBottom: "#92400E" },
  { id: "au-5",  tab: "Audio",       name: "Pirate Shanty",       usedIn: "Pirate Island Activity Pack", size: "3.6 MB", type: "MP3", duration: "2:47", uploadedBy: "Admin", uploadDate: "Feb 20, 2025", thumbTop: "#818CF8", thumbBottom: "#312E81" },
  { id: "au-6",  tab: "Audio",       name: "Lullaby",             usedIn: "Jungle Bedtime Story Video",  size: "2.1 MB", type: "MP3", duration: "3:30", uploadedBy: "Admin", uploadDate: "Feb 15, 2025", thumbTop: "#C084FC", thumbBottom: "#581C87" },
  // Videos
  { id: "vd-1",  tab: "Videos",      name: "Jungle Story",        usedIn: "The Magical Jungle",          size: "48 MB",  type: "MP4", duration: "8:24", uploadedBy: "Admin", uploadDate: "Mar 10, 2025", thumbTop: "#4ADE80", thumbBottom: "#166534" },
  { id: "vd-2",  tab: "Videos",      name: "Space Intro",         usedIn: "Space Explorer Mel",          size: "62 MB",  type: "MP4", duration: "5:11", uploadedBy: "Admin", uploadDate: "Mar 08, 2025", thumbTop: "#60A5FA", thumbBottom: "#1E3A8A" },
  { id: "vd-3",  tab: "Videos",      name: "Ocean World",         usedIn: "Ocean Adventure",             size: "54 MB",  type: "MP4", duration: "6:45", uploadedBy: "Admin", uploadDate: "Mar 05, 2025", thumbTop: "#38BDF8", thumbBottom: "#0C4A6E" },
  { id: "vd-4",  tab: "Videos",      name: "Desert Quest",        usedIn: "Desert Safari Mel",           size: "39 MB",  type: "MP4", duration: "4:50", uploadedBy: "Admin", uploadDate: "Feb 28, 2025", thumbTop: "#FBBF24", thumbBottom: "#92400E" },
  { id: "vd-5",  tab: "Videos",      name: "Pirate Adventure",    usedIn: "Pirate Island Activity Pack", size: "71 MB",  type: "MP4", duration: "9:02", uploadedBy: "Admin", uploadDate: "Feb 20, 2025", thumbTop: "#818CF8", thumbBottom: "#312E81" },
  { id: "vd-6",  tab: "Videos",      name: "Bedtime Story",       usedIn: "Jungle Bedtime Story Video",  size: "33 MB",  type: "MP4", duration: "7:18", uploadedBy: "Admin", uploadDate: "Feb 15, 2025", thumbTop: "#C084FC", thumbBottom: "#581C87" },
];

const ASSET_TABS: AssetTab[] = ["Images", "Backgrounds", "Characters", "Icons", "Audio", "Videos"];

// ── Helpers ───────────────────────────────────────────────────────
function usedInString(usedIn: string | string[]): string {
  if (typeof usedIn === "string") return usedIn;
  return usedIn.join(" · ");
}

function isAudio(tab: AssetTab)  { return tab === "Audio"; }
function isVideo(tab: AssetTab)  { return tab === "Videos"; }

// ── Thumbnail ─────────────────────────────────────────────────────
function Thumb({
  asset, width, height, radius = 8, showPlay = false,
}: {
  asset: Asset; width: number; height: number; radius?: number; showPlay?: boolean;
}) {
  const isAud = isAudio(asset.tab);
  return (
    <div style={{
      width, height, borderRadius: radius, flexShrink: 0, position: "relative", overflow: "hidden",
      background: `linear-gradient(160deg, ${asset.thumbTop} 0%, ${asset.thumbBottom} 100%)`,
      border: "0.5px solid rgba(0,0,0,0.08)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {isAud ? (
        <Waveform small />
      ) : showPlay ? (
        <div style={{
          width: 28, height: 28, borderRadius: "50%",
          background: "rgba(255,255,255,0.85)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Play size={12} style={{ color: "#141414", marginLeft: 2 }} />
        </div>
      ) : (
        <span className="font-nunito font-semibold" style={{ color: "rgba(255,255,255,0.7)", fontSize: "10px" }}>
          {asset.type}
        </span>
      )}
    </div>
  );
}

// ── Waveform (decorative) ─────────────────────────────────────────
function Waveform({ small = false }: { small?: boolean }) {
  const heights = [30, 55, 70, 45, 85, 60, 40, 75, 50, 65, 35, 80, 55, 45, 70];
  const barW    = small ? 3 : 5;
  const gap     = small ? 3 : 5;
  const maxH    = small ? 28 : 80;
  return (
    <div style={{ display: "flex", alignItems: "center", gap, height: maxH }}>
      {heights.map((pct, i) => (
        <div
          key={i}
          style={{
            width: barW,
            height: `${(pct / 100) * maxH}px`,
            borderRadius: barW,
            background: small ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.55)",
          }}
        />
      ))}
    </div>
  );
}

// ── Audio player (modal) ──────────────────────────────────────────
function AudioPlayer({ asset }: { asset: Asset }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(28); // fake 28%

  return (
    <div style={{
      background: `linear-gradient(160deg, ${asset.thumbTop}33 0%, ${asset.thumbBottom}22 100%)`,
      borderRadius: 10, border: "1px solid #E5E5E5",
      padding: "28px 32px", display: "flex", flexDirection: "column", gap: 20,
      alignItems: "center",
    }}>
      {/* Waveform */}
      <Waveform />

      {/* Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, width: "100%" }}>
        <button
          onClick={() => setPlaying(!playing)}
          style={{
            width: 44, height: 44, borderRadius: "50%",
            background: "#F63D68", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}
        >
          {playing
            ? <Pause size={18} style={{ color: "#fff" }} />
            : <Play  size={18} style={{ color: "#fff", marginLeft: 2 }} />}
        </button>

        {/* Progress bar */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
          <div
            style={{
              width: "100%", height: 6, borderRadius: 99,
              background: "#E5E5E5", cursor: "pointer", position: "relative",
            }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setProgress(Math.round(((e.clientX - rect.left) / rect.width) * 100));
            }}
          >
            <div style={{
              position: "absolute", left: 0, top: 0, bottom: 0,
              width: `${progress}%`, borderRadius: 99, background: "#F63D68",
            }} />
            <div style={{
              position: "absolute", top: "50%", left: `${progress}%`,
              transform: "translate(-50%, -50%)",
              width: 14, height: 14, borderRadius: "50%",
              background: "#F63D68", border: "2px solid #fff",
              boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
            }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span className="font-nunito font-normal" style={{ fontSize: 12, color: "#737373" }}>
              {playing ? "0:08" : "0:00"}
            </span>
            <span className="font-nunito font-normal" style={{ fontSize: 12, color: "#737373" }}>
              {asset.duration}
            </span>
          </div>
        </div>

        <Volume2 size={18} style={{ color: "#737373", flexShrink: 0 }} />
      </div>
    </div>
  );
}

// ── Video player preview (modal) ──────────────────────────────────
function VideoPreview({ asset }: { asset: Asset }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Thumbnail with overlay */}
      <div
        onClick={() => setPlaying(!playing)}
        style={{
          width: "100%", height: 420, borderRadius: 10, cursor: "pointer",
          background: `linear-gradient(160deg, ${asset.thumbTop} 0%, ${asset.thumbBottom} 100%)`,
          border: "1px solid #E5E5E5", position: "relative",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          background: "rgba(255,255,255,0.88)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
        }}>
          {playing
            ? <Pause size={26} style={{ color: "#141414" }} />
            : <Play  size={26} style={{ color: "#141414", marginLeft: 4 }} />}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span className="font-nunito font-normal" style={{ fontSize: 12, color: "#737373", whiteSpace: "nowrap" }}>
          0:00
        </span>
        <div style={{ flex: 1, height: 4, borderRadius: 99, background: "#E5E5E5", position: "relative" }}>
          <div style={{ width: "0%", height: "100%", borderRadius: 99, background: "#F63D68" }} />
        </div>
        <span className="font-nunito font-normal" style={{ fontSize: 12, color: "#737373", whiteSpace: "nowrap" }}>
          {asset.duration}
        </span>
      </div>
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────
function ViewModal({ asset, onClose }: { asset: Asset; onClose: () => void }) {
  const metaFields = isAudio(asset.tab) || isVideo(asset.tab)
    ? [
        { label: "Used In",     value: usedInString(asset.usedIn) },
        { label: "Size",        value: asset.size                 },
        { label: "Type",        value: asset.type                 },
        { label: "Duration",    value: asset.duration ?? "—"      },
        { label: "Uploaded By", value: asset.uploadedBy           },
      ]
    : [
        { label: "Used In",     value: usedInString(asset.usedIn)  },
        { label: "Size",        value: asset.size                   },
        { label: "Type",        value: asset.type                   },
        { label: "Resolution",  value: asset.resolution ?? "—"      },
        { label: "Uploaded By", value: asset.uploadedBy             },
      ];

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: "#FFFFFF", borderRadius: "12px",
        width: "960px", maxWidth: "100%",
        boxShadow: "0px 20px 60px rgba(16,24,40,0.18)",
      }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 24px", borderBottom: "1px solid #F2F4F7",
        }}>
          <span className="font-nunito font-semibold" style={{ fontSize: "18px", color: "#141414" }}>
            {asset.name}
          </span>
          <button
            onClick={onClose}
            style={{
              width: "32px", height: "32px", borderRadius: "8px",
              border: "1px solid #E5E5E5", background: "#FFFFFF",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <X size={16} style={{ color: "#525252" }} />
          </button>
        </div>

        {/* Preview */}
        <div style={{ padding: "20px 24px 0" }}>
          {isAudio(asset.tab) ? (
            <AudioPlayer asset={asset} />
          ) : isVideo(asset.tab) ? (
            <VideoPreview asset={asset} />
          ) : (
            <div style={{
              width: "100%", height: "460px", borderRadius: "10px",
              background: `linear-gradient(160deg, ${asset.thumbTop} 0%, ${asset.thumbBottom} 100%)`,
              border: "1px solid #E5E5E5",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span className="font-nunito font-semibold" style={{ color: "rgba(255,255,255,0.6)", fontSize: "16px", letterSpacing: "0.04em" }}>
                {asset.name} · {asset.type}
              </span>
            </div>
          )}
        </div>

        {/* Details + buttons */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: "16px", padding: "16px 24px",
        }}>
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
            {metaFields.map(({ label, value }) => (
              <div key={label} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span className="font-nunito font-normal" style={{ fontSize: "12px", color: "#737373" }}>{label}</span>
                <span className="font-nunito font-semibold" style={{ fontSize: "13px", color: "#141414" }}>{value}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
            <button className="font-nunito font-bold" style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              padding: "8px 14px", borderRadius: "8px",
              border: "1px solid #D6D6D6", background: "#FFFFFF",
              fontSize: "14px", color: "#424242", cursor: "pointer",
              boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", whiteSpace: "nowrap",
            }}>
              <RefreshCw size={14} /> Replace
            </button>
            <button className="font-nunito font-bold" style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              padding: "8px 14px", borderRadius: "8px",
              border: "1px solid #D6D6D6", background: "#FFFFFF",
              fontSize: "14px", color: "#424242", cursor: "pointer",
              boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", whiteSpace: "nowrap",
            }}>
              <Download size={14} /> Download
            </button>
            <button className="font-nunito font-bold" style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              padding: "8px 14px", borderRadius: "8px",
              border: "1px solid #FECDCA", background: "#FEF3F2",
              fontSize: "14px", color: "#F04438", cursor: "pointer",
              whiteSpace: "nowrap",
            }}>
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Row action buttons ────────────────────────────────────────────
function RowActions({ asset, onView }: { asset: Asset; onView: () => void }) {
  const label = isAudio(asset.tab) ? "Play" : "View";
  const Icon  = isAudio(asset.tab) ? Play  : Eye;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
      <button onClick={onView} className="font-nunito font-bold" style={{
        display: "inline-flex", alignItems: "center", gap: "6px",
        padding: "8px 12px", borderRadius: "8px", cursor: "pointer",
        fontSize: "14px", fontWeight: 700,
        background: "#F63D68", border: "1px solid #F63D68", color: "#FFFFFF",
        boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", whiteSpace: "nowrap",
      }}>
        <Icon size={14} /> {label}
      </button>
      <button className="font-nunito font-bold" style={{
        display: "inline-flex", alignItems: "center", gap: "6px",
        padding: "8px 12px", borderRadius: "8px", cursor: "pointer",
        fontSize: "14px", fontWeight: 700,
        background: "#FFFFFF", border: "1px solid #D6D6D6", color: "#424242",
        boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", whiteSpace: "nowrap",
      }}>
        <RefreshCw size={14} /> Replace
      </button>
      <button style={{
        width: "36px", height: "36px", borderRadius: "8px",
        border: "1px solid #FECDCA", background: "#FEF3F2",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", flexShrink: 0,
      }}>
        <Trash2 size={15} style={{ color: "#F04438" }} />
      </button>
    </div>
  );
}

// ── List row ──────────────────────────────────────────────────────
function ListRow({ asset, onView, isLast }: { asset: Asset; onView: () => void; isLast: boolean }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "16px 20px", gap: "20px",
      borderBottom: isLast ? "none" : "1px solid #EAECF0",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", minWidth: 0 }}>
        <Thumb asset={asset} width={72} height={72} showPlay={isVideo(asset.tab)} />
        <div style={{ display: "flex", flexDirection: "column", gap: "4px", minWidth: 0 }}>
          <span className="font-nunito font-semibold" style={{ fontSize: "16px", color: "#141414" }}>
            {asset.name}
          </span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
            <span className="font-nunito font-normal" style={{ fontSize: "12px", color: "#424242" }}>
              Used In: <strong>{usedInString(asset.usedIn)}</strong>
            </span>
            <span style={{ color: "#D6D6D6" }}>·</span>
            <span className="font-nunito font-normal" style={{ fontSize: "12px", color: "#424242" }}>
              Size: <strong>{asset.size}</strong>
            </span>
            <span style={{ color: "#D6D6D6" }}>·</span>
            <span className="font-nunito font-normal" style={{ fontSize: "12px", color: "#424242" }}>
              {isAudio(asset.tab) || isVideo(asset.tab)
                ? <>Duration: <strong>{asset.duration}</strong></>
                : <>Type: <strong>{asset.type}</strong></>}
            </span>
          </div>
        </div>
      </div>
      <RowActions asset={asset} onView={onView} />
    </div>
  );
}

// ── Grid card ─────────────────────────────────────────────────────
function GridCard({ asset, onView }: { asset: Asset; onView: () => void }) {
  const label = isAudio(asset.tab) ? "Play" : "View";
  const Icon  = isAudio(asset.tab) ? Play  : Eye;
  return (
    <div style={{
      background: "#FFFFFF", border: "1px solid #E5E5E5",
      borderRadius: "12px", overflow: "hidden",
      boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
      display: "flex", flexDirection: "column",
    }}>
      <div style={{
        height: "160px", position: "relative",
        background: `linear-gradient(160deg, ${asset.thumbTop} 0%, ${asset.thumbBottom} 100%)`,
        borderBottom: "1px solid #F2F4F7",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {isAudio(asset.tab) ? (
          <Waveform />
        ) : isVideo(asset.tab) ? (
          <div style={{
            width: 40, height: 40, borderRadius: "50%",
            background: "rgba(255,255,255,0.85)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Play size={16} style={{ color: "#141414", marginLeft: 3 }} />
          </div>
        ) : (
          <span className="font-nunito font-semibold" style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px" }}>
            {asset.type}
          </span>
        )}
      </div>

      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
        <span className="font-nunito font-semibold" style={{ fontSize: "16px", color: "#141414" }}>
          {asset.name}
        </span>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span className="font-nunito font-normal" style={{ fontSize: "12px", color: "#424242" }}>
            Used In: <strong>{usedInString(asset.usedIn)}</strong>
          </span>
          <span className="font-nunito font-normal" style={{ fontSize: "12px", color: "#424242" }}>
            Size: <strong>{asset.size}</strong>
            {" · "}
            {isAudio(asset.tab) || isVideo(asset.tab)
              ? <>Duration: <strong>{asset.duration}</strong></>
              : <>Type: <strong>{asset.type}</strong></>}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
          <button onClick={onView} className="font-nunito font-bold" style={{
            flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center",
            gap: "6px", padding: "8px 12px", borderRadius: "8px", cursor: "pointer",
            fontSize: "14px", background: "#F63D68", border: "1px solid #F63D68", color: "#FFFFFF",
            boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
          }}>
            <Icon size={14} /> {label}
          </button>
          <button className="font-nunito font-bold" style={{
            flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center",
            gap: "6px", padding: "8px 12px", borderRadius: "8px", cursor: "pointer",
            fontSize: "14px", background: "#FFFFFF", border: "1px solid #D6D6D6", color: "#424242",
            boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
          }}>
            <RefreshCw size={14} /> Replace
          </button>
          <button style={{
            width: "36px", height: "36px", borderRadius: "8px",
            border: "1px solid #FECDCA", background: "#FEF3F2",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", flexShrink: 0,
          }}>
            <Trash2 size={15} style={{ color: "#F04438" }} />
          </button>
        </div>
      </div>
    </div>
  );
}



// ── Page ──────────────────────────────────────────────────────────
export default function AssetsPage() {
  const [activeTab, setActiveTab]         = useState<AssetTab>("Images");
  const [viewMode, setViewMode]           = useState<ViewMode>("list");
  const [search, setSearch]               = useState("");
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const tabAssets = ALL_ASSETS.filter((a) => a.tab === activeTab);
  const filtered  = tabAssets.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    usedInString(a.usedIn).toLowerCase().includes(search.toLowerCase()) ||
    a.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Page header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <h1 className="font-nunito font-semibold" style={{ fontSize: "30px", lineHeight: "38px", color: "#141414" }}>
            Assets Library
          </h1>
          <p className="font-nunito font-normal" style={{ fontSize: "16px", lineHeight: "24px", color: "#525252" }}>
            Manage all images, icons, backgrounds, audio, and videos.
          </p>
        </div>
        <Link href="/admin/assets/upload" className="font-nunito font-bold" style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          padding: "10px 16px", borderRadius: "8px",
          border: "1px solid #F63D68", background: "#F63D68",
          fontSize: "14px", color: "#FFFFFF", cursor: "pointer",
          boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", whiteSpace: "nowrap", flexShrink: 0,
          textDecoration: "none",
        }}>
          <Upload size={16} /> Upload New Asset
        </Link>
      </div>

      {/* Asset type tabs — pill/segmented */}
      <div style={{
        display: "inline-flex", background: "#FAFAFA",
        borderRadius: "10px", padding: "4px", gap: "4px", alignSelf: "flex-start",
      }}>
        {ASSET_TABS.map((tab) => {
          const active = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setSearch(""); }}
              className="font-nunito"
              style={{
                padding: "4px 12px", borderRadius: "6px", border: "none", cursor: "pointer",
                background: active ? "#FFFFFF" : "transparent",
                color: active ? "#141414" : "#737373",
                fontWeight: 500, fontSize: "14px",
                boxShadow: active
                  ? "0px 1px 2px rgba(16,24,40,0.06), 0px 1px 3px rgba(16,24,40,0.1)"
                  : "none",
                transition: "all 0.15s",
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Card */}
      <div style={{
        background: "#FFFFFF", border: "1px solid #E5E5E5",
        borderRadius: "12px", overflow: "hidden",
      }}>

        {/* Toolbar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 20px", borderBottom: "1px solid #F2F4F7",
          gap: "16px", flexWrap: "wrap",
        }}>
          {/* List / Grid toggle */}
          <div style={{
            display: "inline-flex", background: "#FAFAFA",
            borderRadius: "10px", padding: "4px", gap: "4px",
          }}>
            {([
              { mode: "list" as ViewMode, Icon: LayoutList, label: "List View" },
              { mode: "grid" as ViewMode, Icon: LayoutGrid, label: "Grid View" },
            ] as const).map(({ mode, Icon, label }) => {
              const active = viewMode === mode;
              return (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  title={label}
                  style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    width: "36px", height: "32px", borderRadius: "6px", border: "none", cursor: "pointer",
                    background: active ? "#FFFFFF" : "transparent",
                    color: active ? "#141414" : "#737373",
                    boxShadow: active
                      ? "0px 1px 2px rgba(16,24,40,0.06), 0px 1px 3px rgba(16,24,40,0.1)"
                      : "none",
                    transition: "all 0.15s",
                  }}
                >
                  <Icon size={16} />
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div style={{ position: "relative", width: "320px" }}>
            <Search
              size={20}
              style={{
                position: "absolute", left: "14px", top: "50%",
                transform: "translateY(-50%)", color: "#737373", pointerEvents: "none",
              }}
            />
            <input
              type="text"
              placeholder="Search assets…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="font-nunito font-normal focus:outline-none"
              style={{
                width: "100%", height: "40px",
                paddingLeft: "42px", paddingRight: "14px",
                borderRadius: "8px", border: "1px solid #E5E5E5",
                fontSize: "16px", color: "#141414", background: "#FFFFFF",
                boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
              }}
            />
          </div>
        </div>

        {/* Content */}
        {filtered.length === 0 ? (
          <div style={{ padding: "48px 20px", textAlign: "center" }}>
            <p className="font-nunito font-semibold" style={{ fontSize: "16px", color: "#141414" }}>No assets found</p>
          </div>
        ) : viewMode === "list" ? (
          <div>
            {filtered.map((asset, i) => (
              <ListRow
                key={asset.id}
                asset={asset}
                onView={() => setSelectedAsset(asset)}
                isLast={i === filtered.length - 1}
              />
            ))}
          </div>
        ) : (
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px", padding: "20px",
          }}>
            {filtered.map((asset) => (
              <GridCard
                key={asset.id}
                asset={asset}
                onView={() => setSelectedAsset(asset)}
              />
            ))}
          </div>
        )}
      </div>

      {/* View modal */}
      {selectedAsset && (
        <ViewModal asset={selectedAsset} onClose={() => setSelectedAsset(null)} />
      )}
    </div>
  );
}
