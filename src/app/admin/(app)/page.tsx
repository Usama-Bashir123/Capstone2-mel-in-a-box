"use client";

// Admin Dashboard — Figma node 111-5754
// Pixel-perfect: metric cards with icons, dual curved line chart (User Growth),
// curved line chart (Yearly Revenue), corrected Recent Activity & Top Selling Content

import Image from "next/image";
import { TrendingUp } from "lucide-react";

// ── Smooth bezier path helper ─────────────────────────────────
function smoothPath(pts: { x: number; y: number }[]) {
  if (pts.length < 2) return "";
  let d = `M${pts[0].x.toFixed(2)},${pts[0].y.toFixed(2)}`;
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i - 1];
    const c = pts[i];
    const cpx = (p.x + c.x) / 2;
    d += ` C${cpx.toFixed(2)},${p.y.toFixed(2)} ${cpx.toFixed(2)},${c.y.toFixed(2)} ${c.x.toFixed(2)},${c.y.toFixed(2)}`;
  }
  return d;
}

function smoothAreaPath(pts: { x: number; y: number }[], h: number) {
  const line = smoothPath(pts);
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
      <div style={{ width: "56px", height: "56px", flexShrink: 0, position: "relative" }}>
        <Image src={icon} alt={label} fill style={{ objectFit: "contain" }} />
      </div>
    </div>
  );
}

// ── User Growth — dual curved line chart ──────────────────────
function UserGrowthChart() {
  const w = 340;
  const h = 180;

  const data1 = [28, 42, 33, 58, 48, 70, 63, 79, 68, 86, 76, 93];
  const data2 = [12, 25, 18, 38, 32, 52, 44, 60, 52, 68, 56, 72];

  const toPts = (data: number[]) =>
    data.map((v, i) => ({
      x: (i / (data.length - 1)) * w,
      y: h - (v / 100) * h,
    }));

  const pts1 = toPts(data1);
  const pts2 = toPts(data2);

  const months = ["Jan", "Mar", "May", "Jul", "Sep", "Nov"];
  const monthIndices = [0, 2, 4, 6, 8, 10];

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h + 24}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="ug1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F63D68" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#F63D68" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ug2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6941C6" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#6941C6" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {[0, 25, 50, 75, 100].map((pct) => {
        const y = h - (pct / 100) * h;
        return <line key={pct} x1={0} y1={y} x2={w} y2={y} stroke="#F2F4F7" strokeWidth={1} />;
      })}

      {/* Area fills */}
      <path d={smoothAreaPath(pts2, h)} fill="url(#ug2)" />
      <path d={smoothAreaPath(pts1, h)} fill="url(#ug1)" />

      {/* Line 2 — previous period (purple) */}
      <path d={smoothPath(pts2)} fill="none" stroke="#6941C6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

      {/* Line 1 — current period (rose) */}
      <path d={smoothPath(pts1)} fill="none" stroke="#F63D68" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

      {/* X-axis labels */}
      {monthIndices.map((idx, i) => (
        <text
          key={months[i]}
          x={(idx / (data1.length - 1)) * w}
          y={h + 18}
          textAnchor="middle"
          fontSize={10}
          fill="#A3A3A3"
          fontFamily="Nunito, sans-serif"
        >
          {months[i]}
        </text>
      ))}
    </svg>
  );
}

// ── Yearly Revenue — curved line chart ────────────────────────
function YearlyRevenueChart() {
  const w = 520;
  const h = 200;
  const maxVal = 1000;

  const revenueData = [
    { month: "Jan", value: 420 },
    { month: "Feb", value: 310 },
    { month: "Mar", value: 520 },
    { month: "Apr", value: 680 },
    { month: "May", value: 590 },
    { month: "Jun", value: 740 },
    { month: "Jul", value: 300 },
    { month: "Aug", value: 810 },
    { month: "Sep", value: 640 },
    { month: "Oct", value: 920 },
    { month: "Nov", value: 780 },
    { month: "Dec", value: 860 },
  ];

  const yLabels = ["$1,000", "$800", "$600", "$400", "$200", "0"];
  const yVals   = [1000, 800, 600, 400, 200, 0];

  const chartLeft = 52;
  const chartW = w - chartLeft;

  const adjustedPts = revenueData.map((d, i) => ({
    x: chartLeft + (i / (revenueData.length - 1)) * chartW,
    y: h - (d.value / maxVal) * h,
  }));

  return (
    <div style={{ width: "100%" }}>
      <svg width="100%" viewBox={`0 0 ${w + 8} ${h + 40}`} style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="yrGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F63D68" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#F63D68" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Y-axis labels + grid */}
        {yLabels.map((label, i) => {
          const y = h - (yVals[i] / maxVal) * h;
          return (
            <g key={label}>
              <line x1={chartLeft} y1={y} x2={w} y2={y} stroke="#F2F4F7" strokeWidth={1} />
              <text x={chartLeft - 6} y={y + 4} textAnchor="end" fontSize={10} fill="#A3A3A3" fontFamily="Nunito, sans-serif">
                {label}
              </text>
            </g>
          );
        })}

        {/* Y-axis label "Amount" */}
        <text
          x={8}
          y={h / 2}
          textAnchor="middle"
          fontSize={10}
          fill="#525252"
          fontFamily="Nunito, sans-serif"
          transform={`rotate(-90, 8, ${h / 2})`}
        >
          Amount
        </text>

        {/* Area fill */}
        <path d={smoothAreaPath(adjustedPts, h)} fill="url(#yrGrad)" />

        {/* Line */}
        <path
          d={smoothPath(adjustedPts)}
          fill="none"
          stroke="#F63D68"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* X-axis labels */}
        {revenueData.map((d, i) => (
          <text
            key={d.month}
            x={chartLeft + (i / (revenueData.length - 1)) * chartW}
            y={h + 18}
            textAnchor="middle"
            fontSize={10}
            fill="#A3A3A3"
            fontFamily="Nunito, sans-serif"
          >
            {d.month}
          </text>
        ))}

        {/* X-axis "Month" label */}
        <text x={chartLeft + chartW / 2} y={h + 34} textAnchor="middle" fontSize={10} fill="#525252" fontFamily="Nunito, sans-serif">
          Month
        </text>

        {/* Tooltip dot — July */}
        <circle cx={adjustedPts[6].x} cy={adjustedPts[6].y} r={5} fill="#F63D68" stroke="#FFFFFF" strokeWidth={2} />
        <rect
          x={adjustedPts[6].x - 38}
          y={adjustedPts[6].y - 38}
          width={76}
          height={30}
          rx={6}
          fill="#141414"
        />
        <text x={adjustedPts[6].x} y={adjustedPts[6].y - 17} textAnchor="middle" fontSize={11} fill="#FFFFFF" fontFamily="Nunito, sans-serif" fontWeight="600">
          $300.42
        </text>
        <text x={adjustedPts[6].x} y={adjustedPts[6].y - 5} textAnchor="middle" fontSize={9} fill="#D0D5DD" fontFamily="Nunito, sans-serif">
          July 2024
        </text>

        {/* Tooltip pointer */}
        <polygon
          points={`${adjustedPts[6].x - 5},${adjustedPts[6].y - 9} ${adjustedPts[6].x + 5},${adjustedPts[6].y - 9} ${adjustedPts[6].x},${adjustedPts[6].y - 2}`}
          fill="#141414"
        />
      </svg>
    </div>
  );
}

// ── Table helpers ─────────────────────────────────────────────
function TableHeader({ cols, widths }: { cols: string[]; widths?: string[] }) {
  const grid = widths ? widths.join(" ") : `repeat(${cols.length}, 1fr)`;
  return (
    <div style={{ display: "grid", gridTemplateColumns: grid, padding: "14px 20px", background: "#F9FAFB", borderBottom: "1px solid #F2F4F7" }}>
      {cols.map((c) => (
        <span key={c} className="font-nunito font-semibold" style={{ fontSize: "12px", lineHeight: "18px", color: "#525252" }}>
          {c}
        </span>
      ))}
    </div>
  );
}

function TableRow({ cells, widths }: { cells: string[]; widths?: string[] }) {
  const grid = widths ? widths.join(" ") : `repeat(${cells.length}, 1fr)`;
  return (
    <div style={{ display: "grid", gridTemplateColumns: grid, padding: "16px 20px", background: "#FFFFFF", borderBottom: "1px solid #EAECF0" }}>
      {cells.map((cell, i) => (
        <span key={i} className="font-nunito font-normal" style={{ fontSize: "16px", lineHeight: "24px", color: i === 0 ? "#141414" : "#525252" }}>
          {cell}
        </span>
      ))}
    </div>
  );
}

// ── Dashboard Page ────────────────────────────────────────────
export default function AdminDashboardPage() {
  const recentActivity = [
    { title: "Story",  activity: '"Pirate Island" updated',          day: "Today" },
    { title: "Parent", activity: '"Sarah Lee" created an account',   day: "Today" },
    { title: "Game",   activity: '"Counting Jungle" published',      day: "Today" },
  ];

  const topContent = [
    { no: "01", name: "Jungle Bedtime Story Video", category: "Premium Video",  sales: "350", revenue: "$24" },
    { no: "02", name: "Space Adventure Pack",       category: "Add-on Pack",    sales: "225", revenue: "$48" },
    { no: "03", name: "Remote Party Session",       category: "Live Event",     sales: "112", revenue: "$14" },
    { no: "03", name: "Pirate Island Activity Pack",category: "Downloadable",   sales: "87",  revenue: "$35" },
  ];

  const metrics = [
    { label: "Total Stories",        value: "12 Stories",      icon: "/images/admin/icons/metric-stories.svg" },
    { label: "Total Games",          value: "8 Games",         icon: "/images/admin/icons/metric-games.svg" },
    { label: "Parent Users",         value: "1,240 Parents",   icon: "/images/admin/icons/metric-parents.svg" },
    { label: "Child Profiles",       value: "1,780 Children",  icon: "/images/admin/icons/metric-children.svg" },
    { label: "Total Purchases",      value: "3,420 Purchases", icon: "/images/admin/icons/metric-purchases.svg" },
    { label: "Revenue (This Month)", value: "$4,950",          icon: "/images/admin/icons/metric-revenue.svg" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Page header */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <h1 className="font-nunito font-semibold" style={{ fontSize: "30px", lineHeight: "38px", color: "#141414" }}>
          Dashboard Overview
        </h1>
        <p className="font-nunito font-normal" style={{ fontSize: "16px", lineHeight: "24px", color: "#525252" }}>
          Quick insights and recent activity
        </p>
      </div>

      {/* Row 1: Metric cards + User Growth — same height */}
      <div style={{ display: "flex", gap: "20px", alignItems: "stretch" }}>

        {/* Left: 2×3 metric cards grid filling full height */}
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

        {/* Right: User Growth panel */}
        <div
          style={{
            width: "380px",
            flexShrink: 0,
            background: "#FFFFFF",
            border: "1px solid #E5E5E5",
            borderRadius: "12px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <p className="font-nunito font-semibold" style={{ fontSize: "20px", lineHeight: "30px", color: "#292929" }}>
              User Growth
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="font-nunito font-semibold" style={{ fontSize: "16px", lineHeight: "24px", color: "#141414" }}>
                34.64%
              </span>
              <span
                className="font-nunito font-medium"
                style={{
                  fontSize: "12px",
                  color: "#067647",
                  background: "#ECFDF3",
                  border: "1px solid #ABEFC6",
                  borderRadius: "9999px",
                  padding: "2px 8px 2px 6px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <TrendingUp size={12} />
                +6.71%
              </span>
            </div>
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
            <UserGrowthChart />
          </div>
        </div>
      </div>

      {/* Row 2: Yearly Revenue + Recent Activity */}
      <div style={{ display: "flex", gap: "20px" }}>

        {/* Yearly Revenue — line chart */}
        <div
          style={{
            flex: 1,
            background: "#FFFFFF",
            border: "1px solid #E5E5E5",
            borderRadius: "12px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <p className="font-nunito font-semibold" style={{ fontSize: "20px", lineHeight: "30px", color: "#292929" }}>
            Yearly Revenue
          </p>
          <YearlyRevenueChart />
        </div>

        {/* Recent Activity */}
        <div
          style={{
            width: "420px",
            flexShrink: 0,
            background: "#FFFFFF",
            border: "1px solid #E5E5E5",
            borderRadius: "12px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <p className="font-nunito font-semibold" style={{ fontSize: "20px", lineHeight: "30px", color: "#292929" }}>
            Recent Activity
          </p>
          <div style={{ border: "1px solid #F2F4F7", borderRadius: "8px", overflow: "hidden" }}>
            <TableHeader cols={["Title", "Activity", "Day"]} widths={["80px", "1fr", "70px"]} />
            {recentActivity.map((row, i) => (
              <TableRow key={i} cells={[row.title, row.activity, row.day]} widths={["80px", "1fr", "70px"]} />
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Top Selling Content */}
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E5E5E5",
          borderRadius: "12px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <p className="font-nunito font-semibold" style={{ fontSize: "20px", lineHeight: "30px", color: "#292929" }}>
          Top Selling Content
        </p>
        <div style={{ border: "1px solid #F2F4F7", borderRadius: "8px", overflow: "hidden" }}>
          <TableHeader cols={["No#", "Item Name", "Category", "Sales", "Revenue"]} widths={["50px", "1fr", "140px", "80px", "80px"]} />
          {topContent.map((row, i) => (
            <TableRow
              key={i}
              cells={[row.no, row.name, row.category, row.sales, row.revenue]}
              widths={["50px", "1fr", "140px", "80px", "80px"]}
            />
          ))}
        </div>
      </div>

    </div>
  );
}
