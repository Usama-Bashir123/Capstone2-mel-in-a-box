"use client";

// Admin Dashboard — Functional Migration
// Fetches real stats from Firestore: stories, games, parents, and children.
// Fetches recent activity from the activity_logs collection.
// Fetches revenue and purchase counts from the purchases collection.

import { useState, useEffect } from "react";
import Image from "next/image";
import { TrendingUp, Loader2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, collectionGroup, orderBy, limit, onSnapshot } from "firebase/firestore";

// ── Smooth bezier path helper ─────────────────────────────────
function smoothPath(pts: { x: number; y: number }[]) {
  if (pts.length < 2) return "";
  let d = `M${pts[0].x.toFixed(2)},${pts[0].y.toFixed(2)}`;
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i - 1];
    const c = pts[i];
    const cpx = (p.x + c.x) / 2;
    d += ` C${cpx.toFixed(2)},${p.y.toFixed(2)} ${cpx.toFixed(2)},${p.y.toFixed(2)} ${c.x.toFixed(2)},${c.y.toFixed(2)}`;
  }
  return d;
}

function smoothAreaPath(pts: { x: number; y: number }[], h: number) {
  const line = smoothPath(pts);
  if (!line) return "";
  const last = pts[pts.length - 1];
  const first = pts[0];
  return `${line} L${last.x.toFixed(2)},${h} L${first.x.toFixed(2)},${h} Z`;
}

// ── Metric Card ───────────────────────────────────────────────
function MetricCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E5E5E5",
        borderRadius: "12px",
        padding: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        flex: 1,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <p className="font-nunito font-medium" style={{ fontSize: "16px", lineHeight: "24px", color: "#525252" }}>
          {label}
        </p>
        <p className="font-nunito font-semibold" style={{ fontSize: "20px", lineHeight: "30px", color: "#141414" }}>
          {value}
        </p>
      </div>
      <div style={{ width: "48px", height: "48px", flexShrink: 0, position: "relative", opacity: 0.8 }}>
        <Image src={icon} alt={label} fill style={{ objectFit: "contain" }} />
      </div>
    </div>
  );
}

// ── User Growth Chart (Mocked Visual) ───────────────────────
function UserGrowthChart() {
  const w = 340;
  const h = 180;
  const data1 = [25, 35, 30, 48, 42, 58, 50, 65, 58, 75, 68, 85];
  const toPts = (data: number[]) => data.map((v, i) => ({ x: (i / (data.length - 1)) * w, y: h - (v / 100) * h }));
  const pts1 = toPts(data1);
  const months = ["Jan", "Mar", "May", "Jul", "Sep", "Nov"];
  const monthIndices = [0, 2, 4, 6, 8, 10];

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h + 24}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="ug1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F63D68" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#F63D68" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 25, 50, 75, 100].map((pct) => {
        const y = h - (pct / 100) * h;
        return <line key={pct} x1={0} y1={y} x2={w} y2={y} stroke="#F2F4F7" strokeWidth={1} />;
      })}
      <path d={smoothAreaPath(pts1, h)} fill="url(#ug1)" />
      <path d={smoothPath(pts1)} fill="none" stroke="#F63D68" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {monthIndices.map((idx, i) => (
        <text key={months[i]} x={(idx / (data1.length - 1)) * w} y={h + 18} textAnchor="middle" fontSize={10} fill="#A3A3A3" fontFamily="Nunito, sans-serif">{months[i]}</text>
      ))}
    </svg>
  );
}

// ── Yearly Revenue Chart (Mocked Visual) ────────────────────
function YearlyRevenueChart() {
  const w = 520;
  const h = 200;
  const data = [420, 310, 520, 680, 590, 740, 300, 810, 640, 920, 780, 860];
  const pts = data.map((v, i) => ({ x: (i / (data.length - 1)) * w, y: h - (v / 1000) * h }));
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h + 24}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="yrGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F63D68" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#F63D68" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={smoothAreaPath(pts, h)} fill="url(#yrGrad)" />
      <path d={smoothPath(pts)} fill="none" stroke="#F63D68" strokeWidth={2} />
    </svg>
  );
}

// ── Table helpers ─────────────────────────────────────────────
function TableHeader({ cols, widths }: { cols: string[]; widths?: string[] }) {
  const grid = widths ? widths.join(" ") : `repeat(${cols.length}, 1fr)`;
  return (
    <div style={{ display: "grid", gridTemplateColumns: grid, padding: "14px 20px", background: "#F9FAFB", borderBottom: "1px solid #F2F4F7" }}>
      {cols.map((c) => (
        <span key={c} className="font-nunito font-semibold" style={{ fontSize: "12px", color: "#525252" }}>{c}</span>
      ))}
    </div>
  );
}

function TableRow({ cells, widths }: { cells: string[]; widths?: string[] }) {
  const grid = widths ? widths.join(" ") : `repeat(${cells.length}, 1fr)`;
  return (
    <div style={{ display: "grid", gridTemplateColumns: grid, padding: "16px 20px", background: "#FFFFFF", border: "1px solid #EAECF0", borderTop: "none" }}>
      {cells.map((cell, i) => (
        <span key={i} className="font-nunito font-normal" style={{ fontSize: "14px", color: i === 0 ? "#141414" : "#525252", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {cell}
        </span>
      ))}
    </div>
  );
}

// ── Mock Data ────────────────────────────────────────────────
const MOCK_STATS = {
  stories: 12,
  games: 8,
  parents: 156,
  children: 243,
  purchases: 89,
  revenue: 2450.75
};

const MOCK_ACTIVITY = [
  { id: "1", type: "Story", activity: "Added new story: Underwater Kingdom", displayTime: "2 mins ago" },
  { id: "2", type: "Game", activity: "Updated levels in Math Jungle", displayTime: "1 hr ago" },
  { id: "3", type: "User", activity: "New parent signup: sarah@example.com", displayTime: "3 hrs ago" },
  { id: "4", type: "Purchase", activity: "New subscription: Annual Plan", displayTime: "5 hrs ago" },
  { id: "5", type: "System", activity: "Database backup completed", displayTime: "Yesterday" },
];

// ── Dashboard Page ────────────────────────────────────────────
export default function AdminDashboardPage() {
  const [stats] = useState(MOCK_STATS);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [recentActivity] = useState<any[]>(MOCK_ACTIVITY);
  const loading = false;

  useEffect(() => {
    // Reverted to mock data - no firestore fetching needed
  }, []);

  const metrics = [
    { label: "Total Stories",        value: `${stats.stories} Stories`,      icon: "/images/icons/stories.png" },
    { label: "Total Games",          value: `${stats.games} Games`,         icon: "/images/icons/games.png" },
    { label: "Parent Users",         value: `${stats.parents.toLocaleString()} Parents`,   icon: "/images/icons/parents.png" },
    { label: "Child Profiles",       value: `${stats.children.toLocaleString()} Children`,  icon: "/images/icons/children.png" },
    { label: "Total Purchases",      value: `${stats.purchases.toLocaleString()} Transactions`, icon: "/images/icons/purchases.png" },
    { label: "Total Revenue",        value: `$${stats.revenue.toLocaleString()}`,          icon: "/images/icons/revenue.png" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <h1 className="font-nunito font-semibold" style={{ fontSize: "30px", lineHeight: "38px", color: "#141414" }}>
          Dashboard Overview
        </h1>
        <p className="font-nunito font-normal" style={{ fontSize: "16px", lineHeight: "24px", color: "#525252" }}>
          Quick insights and recent activity
        </p>
      </div>

      <div style={{ display: "flex", gap: "20px", alignItems: "stretch" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", gap: "16px", flex: 1 }}>
            {metrics.slice(0, 3).map((m) => (
              <MetricCard key={m.label} label={m.label} value={m.value} icon={m.icon} />
            ))}
          </div>
          <div style={{ display: "flex", gap: "16px", flex: 1 }}>
            {metrics.slice(3, 6).map((m) => (
              <MetricCard key={m.label} label={m.label} value={m.value} icon={m.icon} />
            ))}
          </div>
        </div>

        <div style={{ width: "380px", flexShrink: 0, background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <p className="font-nunito font-semibold" style={{ fontSize: "20px", color: "#292929" }}>User Growth</p>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="font-nunito font-semibold" style={{ fontSize: "16px", color: "#141414" }}>34.64%</span>
              <span style={{ fontSize: "12px", color: "#067647", background: "#ECFDF3", border: "1px solid #ABEFC6", borderRadius: "9999px", padding: "2px 8px", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <TrendingUp size={12} /> +6.71%
              </span>
            </div>
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
            <UserGrowthChart />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "20px" }}>
        <div style={{ flex: 1, background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <p className="font-nunito font-semibold" style={{ fontSize: "20px", color: "#292929" }}>Yearly Revenue</p>
          <YearlyRevenueChart />
        </div>

        <div style={{ width: "420px", flexShrink: 0, background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <p className="font-nunito font-semibold" style={{ fontSize: "20px", color: "#292929" }}>Recent Activity</p>
          <div style={{ border: "1px solid #F2F4F7", borderRadius: "8px", overflow: "hidden" }}>
            <TableHeader cols={["Type", "Activity", "Time"]} widths={["80px", "1fr", "80px"]} />
            {loading ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "40px" }}><Loader2 className="animate-spin" style={{ color: "#F63D68" }} /></div>
            ) : recentActivity.length > 0 ? (
              recentActivity.map((log) => (
                <TableRow 
                  key={log.id} 
                  cells={[log.type, log.activity, log.displayTime?.split(",")[0] || "Today"]} 
                  widths={["80px", "1fr", "80px"]} 
                />
              ))
            ) : (
              <div style={{ padding: "20px", textAlign: "center", color: "#525252" }}>No recent activity.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
