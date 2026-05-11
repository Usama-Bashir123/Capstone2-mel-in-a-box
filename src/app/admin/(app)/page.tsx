"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { TrendingUp, Loader2 } from "lucide-react";

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

// ── Metric Card ───────────────────────────────────────────────
function MetricCard({ label, value, icon, bgColor = "#FFFFFF" }: { label: string; value: string; icon: string; bgColor?: string }) {
  return (
    <div
      style={{
        background: bgColor,
        border: "1px solid #E5E5E5",
        borderRadius: "12px",
        padding: "20px",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        height: "140px",
        position: "relative",
        overflow: "hidden",
        flex: 1,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", position: "relative", zIndex: 1 }}>
        <p className="font-nunito font-medium" style={{ fontSize: "14px", color: "#525252" }}>
          {label}
        </p>
        <p className="font-nunito font-bold" style={{ fontSize: "24px", color: "#141414" }}>
          {value}
        </p>
      </div>
      <div style={{ 
        position: "absolute", 
        right: "-10px", 
        bottom: "-10px", 
        width: "120px", 
        height: "120px", 
        opacity: 0.9 
      }}>
        <Image src={icon} alt={label} fill style={{ objectFit: "contain" }} />
      </div>
    </div>
  );
}

// ── User Growth Chart ───────────────────────────────────────
function UserGrowthChart() {
  const w = 340;
  const h = 180;
  const data1 = [30, 45, 40, 55, 50, 65, 60, 75, 70, 85, 80, 95];
  const data2 = [15, 25, 20, 35, 30, 45, 40, 55, 50, 65, 60, 75];
  const toPts = (data: number[]) => data.map((v, i) => ({ x: (i / (data.length - 1)) * w, y: h - (v / 100) * h }));
  const pts1 = toPts(data1);
  const pts2 = toPts(data2);
  const months = ["Jan", "Mar", "Nov", "Dec"];
  const monthIndices = [0, 2, 9, 11];

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h + 24}`} style={{ overflow: "visible" }}>
      <path d={smoothPath(pts1)} fill="none" stroke="#F63D68" strokeWidth={3} strokeLinecap="round" />
      <path d={smoothPath(pts2)} fill="none" stroke="#FDA29B" strokeWidth={2} strokeLinecap="round" />
      {monthIndices.map((idx, i) => (
        <text key={i} x={(idx / (data1.length - 1)) * w} y={h + 18} textAnchor="middle" fontSize={12} fill="#A3A3A3" fontFamily="Nunito">{months[i]}</text>
      ))}
    </svg>
  );
}

// ── Yearly Revenue Chart ────────────────────────────────────
function YearlyRevenueChart() {
  const w = 520;
  const h = 200;
  const data = [70, 55, 45, 75, 80, 40, 35, 65, 55, 40, 45, 90];
  const pts = data.map((v, i) => ({ x: (i / (data.length - 1)) * w, y: h - (v / 100) * h }));
  
  return (
    <div style={{ position: "relative" }}>
      <svg width="100%" viewBox={`0 0 ${w} ${h + 24}`} style={{ overflow: "visible" }}>
        {/* Y-axis labels */}
        {[0, 25, 50, 75, 100].map((v) => (
          <text key={v} x={-10} y={h - (v / 100) * h} textAnchor="end" fontSize={12} fill="#A3A3A3" fontFamily="Nunito">
            ${v * 10}
          </text>
        ))}
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((v) => (
          <line key={v} x1={0} y1={h - (v / 100) * h} x2={w} y2={h - (v / 100) * h} stroke="#F2F4F7" strokeWidth={1} />
        ))}
        <path d={smoothPath(pts)} fill="none" stroke="#F63D68" strokeWidth={3} strokeLinecap="round" />
        {/* Tooltip dot */}
        <circle cx={pts[6].x} cy={pts[6].y} r={6} fill="#F63D68" stroke="#FFFFFF" strokeWidth={2} />
        {/* Tooltip box */}
        <foreignObject x={pts[6].x - 40} y={pts[6].y + 10} width="80" height="50">
          <div style={{ background: "#1D2939", color: "#FFFFFF", padding: "4px 8px", borderRadius: "6px", fontSize: "10px", textAlign: "center" }}>
            <div style={{ fontWeight: "bold" }}>$300.42</div>
            <div style={{ opacity: 0.8 }}>July 2024</div>
          </div>
        </foreignObject>
        {/* X-axis months */}
        {["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => (
          <text key={m} x={((i + 1) / 11) * w} y={h + 18} textAnchor="middle" fontSize={12} fill="#A3A3A3" fontFamily="Nunito">{m}</text>
        ))}
      </svg>
    </div>
  );
}

// ── Dashboard Page ────────────────────────────────────────────
export default function AdminDashboardPage() {
  const metrics = [
    { label: "Total Stories", value: "12 Stories", icon: "/images/admin/metrics/stories.png" },
    { label: "Total Games", value: "8 Games", icon: "/images/admin/metrics/games.png" },
    { label: "Parent Users", value: "1,240 Parents", icon: "/images/admin/metrics/parents.png" },
    { label: "Child Profiles", value: "1,780 Children", icon: "/images/admin/metrics/children.png" },
    { label: "Total Purchases", value: "3,420 Purchases", icon: "/images/admin/metrics/purchases.png" },
    { label: "Revenue (This Month)", value: "$4,950", icon: "/images/admin/metrics/revenue.png" },
  ];

  const recentActivity = [
    { title: "Story", activity: "Pirate Island updated", day: "Today" },
    { title: "Parent", activity: "Sarah Lee created an account", day: "Today" },
    { title: "Game", activity: "Counting Jungle published", day: "Today" },
  ];

  const topSelling = [
    { no: "01", name: "Jungle Bedtime Story Video", category: "Premium Video", sales: "350", revenue: "$24" },
    { no: "02", name: "Space Adventure Pack", category: "Add-on Pack", sales: "225", revenue: "$48" },
    { no: "03", name: "Remote Party Session", category: "Live Event", sales: "112", revenue: "$14" },
    { no: "04", name: "Pirate Island Activity Pack", category: "Downloadable", sales: "87", revenue: "$35" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Title section */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <h1 className="font-nunito font-semibold" style={{ fontSize: "30px", lineHeight: "38px", color: "#141414" }}>
          Dashboard Overview
        </h1>
        <p className="font-nunito font-normal" style={{ fontSize: "16px", lineHeight: "24px", color: "#525252" }}>
          Quick insights and recent activity
        </p>
      </div>

      {/* Metrics Row */}
      <div style={{ display: "flex", gap: "20px" }}>
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {metrics.map((m) => (
            <MetricCard key={m.label} {...m} />
          ))}
        </div>
        
        {/* User Growth */}
        <div style={{ width: "380px", background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <p className="font-nunito font-semibold" style={{ fontSize: "20px", color: "#292929" }}>User Growth</p>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="font-nunito font-semibold" style={{ fontSize: "16px", color: "#141414" }}>34.64%</span>
              <span style={{ fontSize: "12px", color: "#067647", background: "#ECFDF3", border: "1px solid #ABEFC6", borderRadius: "9999px", padding: "2px 8px", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <TrendingUp size={12} /> +6.71%
              </span>
            </div>
          </div>
          <UserGrowthChart />
        </div>
      </div>

      {/* Charts Row */}
      <div style={{ display: "flex", gap: "20px" }}>
        <div style={{ flex: 1, background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <p className="font-nunito font-semibold" style={{ fontSize: "20px", color: "#292929" }}>Yearly Revenue</p>
          <YearlyRevenueChart />
        </div>

        <div style={{ width: "420px", background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <p className="font-nunito font-semibold" style={{ fontSize: "20px", color: "#292929" }}>Recent Activity</p>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {/* Activity Table Header */}
            <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 80px", padding: "12px", background: "#F9FAFB", borderBottom: "1px solid #EAECF0" }}>
              {["Title", "Activity", "Day"].map(h => <span key={h} style={{ fontSize: "12px", fontWeight: 600, color: "#525252" }}>{h}</span>)}
            </div>
            {recentActivity.map((a, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "80px 1fr 80px", padding: "16px 12px", borderBottom: i < 2 ? "1px solid #EAECF0" : "none" }}>
                <span style={{ fontWeight: 600, color: "#141414" }}>{a.title}</span>
                <span style={{ color: "#525252" }}>{a.activity}</span>
                <span style={{ color: "#525252" }}>{a.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Selling Content */}
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <p className="font-nunito font-semibold" style={{ fontSize: "20px", color: "#292929" }}>Top Selling Content</p>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "grid", gridTemplateColumns: "60px 2fr 1fr 1fr 1fr", padding: "12px", background: "#F9FAFB", borderBottom: "1px solid #EAECF0" }}>
            {["No#", "Item Name", "Category", "Sales", "Revenue"].map(h => <span key={h} style={{ fontSize: "12px", fontWeight: 600, color: "#525252" }}>{h}</span>)}
          </div>
          {topSelling.map((s, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "60px 2fr 1fr 1fr 1fr", padding: "20px 12px", borderBottom: i < topSelling.length - 1 ? "1px solid #EAECF0" : "none" }}>
              <span style={{ color: "#141414", fontWeight: 600 }}>{s.no}</span>
              <span style={{ color: "#525252" }}>{s.name}</span>
              <span style={{ color: "#525252" }}>{s.category}</span>
              <span style={{ color: "#525252" }}>{s.sales}</span>
              <span style={{ color: "#525252" }}>{s.revenue}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
