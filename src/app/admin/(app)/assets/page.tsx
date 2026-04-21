"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Search, Upload, Eye, Trash2,
  LayoutList, LayoutGrid, X, Play, Pause, Download, Volume2,
  Loader2
} from "lucide-react";
import Image from "next/image";
import { db } from "@/lib/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { logActivity } from "@/lib/activity";

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
  url: string;
  storagePath: string;
  // Decorative colors for thumbs if no real thumb exists
  thumbTop?: string;
  thumbBottom?: string;
}

const ASSET_TABS: AssetTab[] = ["Images", "Backgrounds", "Characters", "Icons", "Audio", "Videos"];

// ── Helpers ───────────────────────────────────────────────────────
function usedInString(usedIn: string | string[]): string {
  if (!usedIn) return "None";
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
  
  // If it's an image, we can try to show the actual image
  const isImg = ["Images", "Backgrounds", "Characters", "Icons"].includes(asset.tab);

  return (
    <div style={{
      width, height, borderRadius: radius, flexShrink: 0, position: "relative", overflow: "hidden",
      background: asset.thumbTop ? `linear-gradient(160deg, ${asset.thumbTop} 0%, ${asset.thumbBottom} 100%)` : "#F2F4F7",
      border: "0.5px solid rgba(0,0,0,0.08)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {isImg && asset.url ? (
        <Image
          src={asset.url}
          alt={asset.name}
          width={width}
          height={height}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : isAud ? (
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
        <span className="font-nunito font-semibold" style={{ color: asset.thumbTop ? "rgba(255,255,255,0.7)" : "#737373", fontSize: "10px" }}>
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
            background: small ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.55)",
          }}
        />
      ))}
    </div>
  );
}

// ── Audio player (modal) ──────────────────────────────────────────
function AudioPlayer({ asset }: { asset: Asset }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  return (
    <div style={{
      background: asset.thumbTop ? `linear-gradient(160deg, ${asset.thumbTop}33 0%, ${asset.thumbBottom}22 100%)` : "#F9FAFB",
      borderRadius: 10, border: "1px solid #E5E5E5",
      padding: "28px 32px", display: "flex", flexDirection: "column", gap: 20,
      alignItems: "center",
    }}>
      <Waveform />

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
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span className="font-nunito font-normal" style={{ fontSize: 12, color: "#737373" }}>0:00</span>
            <span className="font-nunito font-normal" style={{ fontSize: 12, color: "#737373" }}>
              {asset.duration}
            </span>
          </div>
        </div>

        <Volume2 size={18} style={{ color: "#737373", flexShrink: 0 }} />
      </div>
      {playing && <audio src={asset.url} autoPlay onEnded={() => setPlaying(false)} style={{ display: "none" }} />}
    </div>
  );
}

// ── Video player preview (modal) ──────────────────────────────────
function VideoPreview({ asset }: { asset: Asset }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div
        style={{
          width: "100%", height: 420, borderRadius: 10, overflow: "hidden",
          background: "#000", border: "1px solid #E5E5E5", position: "relative",
        }}
      >
        <video 
          src={asset.url} 
          controls 
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────
function ViewModal({ asset, onClose }: { asset: Asset; onClose: () => void }) {
  const metaFields = [
    { label: "Used In",     value: usedInString(asset.usedIn) },
    { label: "Size",        value: asset.size                 },
    { label: "Type",        value: asset.type                 },
    { label: "Duration",    value: asset.duration ?? "—"      },
    { label: "Resolution",  value: asset.resolution ?? "—"    },
    { label: "Uploaded By", value: asset.uploadedBy           },
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

        <div style={{ padding: "20px 24px 0" }}>
          {isAudio(asset.tab) ? (
            <AudioPlayer asset={asset} />
          ) : isVideo(asset.tab) ? (
            <VideoPreview asset={asset} />
          ) : (
            <div style={{
              width: "100%", height: "460px", borderRadius: "10px",
              background: "#F2F4F7",
              border: "1px solid #E5E5E5",
              display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden"
            }}>
              <div style={{ position: "relative", width: "100%", height: "100%" }}>
                <Image
                  src={asset.url}
                  alt={asset.name}
                  fill
                  style={{ objectFit: "contain" }}
                  unoptimized // For diverse external or dynamic imagery if needed, or omit if using Next.js config
                />
              </div>
            </div>
          )}
        </div>

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
            <a href={asset.url} download className="font-nunito font-bold" style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              padding: "8px 14px", borderRadius: "8px",
              border: "1px solid #D6D6D6", background: "#FFFFFF",
              fontSize: "14px", color: "#424242", cursor: "pointer",
              boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", whiteSpace: "nowrap",
              textDecoration: "none"
            }}>
              <Download size={14} /> Download
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

const MOCK_ASSETS: Asset[] = [
  {
    id: "1", tab: "Images", name: "App Icon - Round", usedIn: ["App", "Web"], size: "240 KB", type: "PNG",
    uploadedBy: "Admin", uploadDate: "2024-03-10", url: "/images/mock/icon.png", storagePath: ""
  },
  {
    id: "2", tab: "Images", name: "Character - Mel Happy", usedIn: ["Stories"], size: "1.2 MB", type: "SVG",
    uploadedBy: "Admin", uploadDate: "2024-03-12", url: "/images/mock/mel.svg", storagePath: ""
  },
  {
    id: "3", tab: "Backgrounds", name: "Jungle Night", usedIn: ["Game 1"], size: "4.5 MB", type: "JPG",
    uploadedBy: "Admin", uploadDate: "2024-03-14", url: "/images/mock/jungle.jpg", storagePath: ""
  },
  {
    id: "4", tab: "Audio", name: "Forest Ambience", usedIn: ["Story 2"], size: "8.1 MB", type: "MP3",
    uploadedBy: "Admin", uploadDate: "2024-03-15", url: "/audio/mock/forest.mp3", storagePath: "", duration: "02:45"
  },
  {
    id: "5", tab: "Videos", name: "Intro Animation", usedIn: ["Welcome"], size: "22 MB", type: "MP4",
    uploadedBy: "Admin", uploadDate: "2024-03-16", url: "/videos/mock/intro.mp4", storagePath: "", resolution: "1080p"
  }
];

// ── Page ──────────────────────────────────────────────────────────
export default function AssetsPage() {
  const [activeTab, setActiveTab]         = useState<AssetTab>("Images");
  const [viewMode, setViewMode]           = useState<ViewMode>("list");
  const [search, setSearch]               = useState("");
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [assets] = useState<Asset[]>(MOCK_ASSETS);
  const loading = false;

  useEffect(() => {
    // Reverted to mock data
  }, []);

  const handleDelete = async (asset: Asset) => {
    if (!confirm(`Are you sure you want to delete "${asset.name}"?`)) return;
    try {
      await deleteDoc(doc(db, "assets", asset.id));
      await logActivity({
        type: "Asset",
        activity: `Deleted asset: ${asset.name}`,
        targetName: asset.name
      });
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete asset.");
    }
  };

  const filtered = assets.filter((a) => {
    const matchTab = a.tab === activeTab;
    const matchSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      usedInString(a.usedIn).toLowerCase().includes(search.toLowerCase()) ||
      a.type.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

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

      <div style={{
        background: "#FFFFFF", border: "1px solid #E5E5E5",
        borderRadius: "12px", overflow: "hidden", minHeight: "500px"
      }}>

        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 20px", borderBottom: "1px solid #F2F4F7",
          gap: "16px", flexWrap: "wrap",
        }}>
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

        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "100px" }}>
            <Loader2 size={32} className="animate-spin" style={{ color: "#F63D68" }} />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "48px 20px", textAlign: "center" }}>
            <p className="font-nunito font-semibold" style={{ fontSize: "16px", color: "#141414" }}>No assets found</p>
          </div>
        ) : viewMode === "list" ? (
          <div>
            {filtered.map((asset, i) => (
              <div key={asset.id} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "16px 20px", gap: "20px",
                borderBottom: i === filtered.length - 1 ? "none" : "1px solid #EAECF0",
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
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                   <button onClick={() => setSelectedAsset(asset)} className="font-nunito font-bold" style={{
                      display: "inline-flex", alignItems: "center", gap: "6px",
                      padding: "8px 12px", borderRadius: "8px", cursor: "pointer",
                      fontSize: "14px", background: "#F63D68", border: "1px solid #F63D68", color: "#FFFFFF",
                   }}>
                      <Eye size={14} /> View
                   </button>
                   <button onClick={() => handleDelete(asset)} style={{
                      width: "36px", height: "36px", borderRadius: "8px",
                      border: "1px solid #FECDCA", background: "#FEF3F2",
                      display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
                   }}>
                      <Trash2 size={15} style={{ color: "#F04438" }} />
                   </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px", padding: "20px",
          }}>
            {filtered.map((asset) => (
              <div key={asset.id} style={{
                background: "#FFFFFF", border: "1px solid #E5E5E5",
                borderRadius: "12px", overflow: "hidden",
                boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
                display: "flex", flexDirection: "column",
              }}>
                <div style={{ height: "160px", overflow: "hidden" }}>
                  <Thumb asset={asset} width={1000} height={160} radius={0} showPlay={isVideo(asset.tab)} />
                </div>
                <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <span className="font-nunito font-semibold" style={{ fontSize: "16px", color: "#141414" }}>
                    {asset.name}
                  </span>
                  <span className="font-nunito font-normal" style={{ fontSize: "12px", color: "#424242" }}>
                    Size: <strong>{asset.size}</strong>
                  </span>
                  <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                    <button onClick={() => setSelectedAsset(asset)} style={{ flex: 1, height: "36px", borderRadius: "8px", background: "#F63D68", border: "none", color: "#fff", cursor: "pointer" }}>View</button>
                    <button onClick={() => handleDelete(asset)} style={{ width: "36px", height: "36px", borderRadius: "8px", border: "1px solid #FECDCA", background: "#FEF3F2", color: "#F04438", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Trash2 size={15} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedAsset && (
        <ViewModal asset={selectedAsset} onClose={() => setSelectedAsset(null)} />
      )}
    </div>
  );
}
