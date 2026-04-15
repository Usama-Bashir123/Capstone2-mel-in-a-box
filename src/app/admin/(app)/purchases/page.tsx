"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Search, SlidersHorizontal, Eye,
  ChevronLeft, ChevronRight,
  TrendingUp, ShoppingCart, DollarSign, RefreshCcw,
} from "lucide-react";

// ── Mock data ─────────────────────────────────────────────────────
const PURCHASES = [
  { id: "1", invoice: "0313", parentName: "Sarah Lee",    item: "Jungle Bedtime Story Video",  amount: "$4.99", status: "Completed", date: "Today, 09:45 AM"    },
  { id: "2", invoice: "3456", parentName: "Mike Brown",   item: "Space Adventure Pack",         amount: "$5.99", status: "Pending",   date: "Yesterday, 5:20PM"  },
  { id: "3", invoice: "1243", parentName: "Aisha Khan",   item: "Remote Party Session",         amount: "$4.99", status: "Completed", date: "Yesterday, 5:20PM"  },
  { id: "4", invoice: "2432", parentName: "David Wilson", item: "Pirate Island Activity Pack",  amount: "$5.99", status: "Refunded",  date: "Mar 14, 2025"       },
  { id: "5", invoice: "1245", parentName: "Emma Clark",   item: "Pirate Island Activity Pack",  amount: "$4.99", status: "Completed", date: "Mar 10, 2025"       },
  { id: "6", invoice: "2345", parentName: "Liam Taylor",  item: "Pirate Island Activity Pack",  amount: "$5.99", status: "Pending",   date: "Mar 03, 2025"       },
  { id: "7", invoice: "1234", parentName: "David Carl",   item: "Pirate Island Activity Pack",  amount: "$4.99", status: "Completed", date: "Feb 27, 2025"       },
  { id: "8", invoice: "5312", parentName: "Mary Jane",    item: "Pirate Island Activity Pack",  amount: "$5.99", status: "Refunded",  date: "Feb 27, 2025"       },
];

const KPI_CARDS = [
  {
    label:     "Total Revenue",
    value:     "$42,590",
    trend:     "+40% this month",
    trendUp:   true,
    icon:      DollarSign,
    iconBg:    "#ECFDF3",
    iconColor: "#067647",
  },
  {
    label:     "Total Purchases",
    value:     "3,420",
    trend:     "+12% this month",
    trendUp:   true,
    icon:      ShoppingCart,
    iconBg:    "#EFF8FF",
    iconColor: "#1570EF",
  },
  {
    label:     "Avg. Purchase Value",
    value:     "$12.45",
    trend:     "+8% this month",
    trendUp:   true,
    icon:      TrendingUp,
    iconBg:    "#FDF4FF",
    iconColor: "#9E77ED",
  },
  {
    label:     "Refunded",
    value:     "$1,280",
    trend:     "-5% this month",
    trendUp:   false,
    icon:      RefreshCcw,
    iconBg:    "#FEF3F2",
    iconColor: "#F04438",
  },
];

type StatusFilter = "All" | "Completed" | "Pending" | "Refunded";

// ── Status badge ──────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; border: string; color: string }> = {
    Completed: { bg: "#ECFDF3", border: "#ABEFC6", color: "#067647" },
    Pending:   { bg: "#FFFAEB", border: "#FEDF89", color: "#B54708" },
    Refunded:  { bg: "#F9FAFB", border: "#EAECF0", color: "#525252" },
  };
  const s = styles[status] ?? styles.Refunded;
  return (
    <span
      className="font-nunito font-semibold"
      style={{
        display: "inline-flex", alignItems: "center",
        fontSize: "12px", lineHeight: "18px",
        padding: "2px 8px", borderRadius: "9999px",
        background: s.bg, border: `1px solid ${s.border}`, color: s.color,
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </span>
  );
}


// ── Segmented toggle ──────────────────────────────────────────────
function SegmentedToggle({
  options, value, onChange,
}: { options: StatusFilter[]; value: StatusFilter; onChange: (v: StatusFilter) => void }) {
  return (
    <div style={{
      display: "inline-flex", background: "#FAFAFA",
      borderRadius: "10px", padding: "4px", gap: "4px",
    }}>
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
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
            {opt}
          </button>
        );
      })}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────
export default function PurchasesPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [search, setSearch] = useState("");

  const filtered = PURCHASES.filter((p) => {
    const matchSearch =
      p.parentName.toLowerCase().includes(search.toLowerCase()) ||
      p.item.toLowerCase().includes(search.toLowerCase()) ||
      p.invoice.includes(search);
    const matchStatus = statusFilter === "All" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Page header */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <h1 className="font-nunito font-semibold" style={{ fontSize: "30px", lineHeight: "38px", color: "#141414" }}>
          Purchases &amp; Payments
        </h1>
        <p className="font-nunito font-normal" style={{ fontSize: "16px", lineHeight: "24px", color: "#525252" }}>
          View all transactions and revenue details.
        </p>
      </div>

      {/* KPI Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
        {KPI_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              style={{
                background: "#FFFFFF", border: "1px solid #E5E5E5",
                borderRadius: "12px", padding: "20px",
                boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
                display: "flex", flexDirection: "column", gap: "12px",
              }}
            >
              {/* Label + icon row */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <span className="font-nunito font-medium" style={{ fontSize: "14px", color: "#525252", lineHeight: "20px" }}>
                  {card.label}
                </span>
                <div style={{
                  width: "40px", height: "40px", borderRadius: "10px",
                  background: card.iconBg, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={20} style={{ color: card.iconColor }} />
                </div>
              </div>

              {/* Value */}
              <span className="font-nunito font-semibold" style={{ fontSize: "28px", lineHeight: "38px", color: "#141414" }}>
                {card.value}
              </span>

              {/* Trend badge */}
              <span
                className="font-nunito font-medium"
                style={{ fontSize: "12px", color: card.trendUp ? "#067647" : "#F04438" }}
              >
                {card.trend}
              </span>
            </div>
          );
        })}
      </div>

      {/* Table card */}
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
          <SegmentedToggle
            options={["All", "Completed", "Pending", "Refunded"]}
            value={statusFilter}
            onChange={setStatusFilter}
          />

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
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
                placeholder="Search"
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
            {/* Filter */}
            <button
              className="font-nunito font-bold"
              style={{
                display: "inline-flex", alignItems: "center", gap: "4px",
                padding: "10px 14px", borderRadius: "8px",
                border: "1px solid #D6D6D6", background: "#FFFFFF",
                fontSize: "14px", color: "#424242", cursor: "pointer",
                boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", whiteSpace: "nowrap",
              }}
            >
              <SlidersHorizontal size={16} />
              Filter
            </button>
          </div>
        </div>

        {/* Table header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "80px 160px 1fr 100px 120px 175px 48px",
          padding: "14px 20px", background: "#FAFAFA",
          borderBottom: "1px solid #F2F4F7",
          gap: "12px", alignItems: "center",
        }}>
          {["Invoice#", "Parent Name", "Item Name", "Amount", "Status", "Date", "Action"].map((h) => (
            <span key={h} className="font-nunito font-semibold" style={{ fontSize: "12px", lineHeight: "18px", color: "#525252" }}>
              {h}
            </span>
          ))}
        </div>

        {/* Table rows */}
        {filtered.length === 0 ? (
          <div style={{ padding: "48px 20px", textAlign: "center" }}>
            <p className="font-nunito font-semibold" style={{ fontSize: "16px", color: "#141414" }}>No purchases found</p>
          </div>
        ) : filtered.map((row, i) => (
          <div
            key={row.id}
            style={{
              display: "grid",
              gridTemplateColumns: "80px 160px 1fr 100px 120px 175px 48px",
              padding: "16px 20px", background: "#FFFFFF", gap: "12px",
              borderBottom: i < filtered.length - 1 ? "1px solid #EAECF0" : "none",
              alignItems: "center",
            }}
          >
            <span className="font-nunito font-normal" style={{ fontSize: "16px", color: "#525252" }}>{row.invoice}</span>

            <span className="font-nunito font-normal" style={{ fontSize: "16px", color: "#525252", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {row.parentName}
            </span>

            <span className="font-nunito font-normal" style={{ fontSize: "16px", color: "#525252", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {row.item}
            </span>

            <span className="font-nunito font-semibold" style={{ fontSize: "16px", color: "#141414" }}>
              {row.amount}
            </span>

            <div><StatusBadge status={row.status} /></div>

            <span className="font-nunito font-normal" style={{ fontSize: "16px", color: "#525252" }}>
              {row.date}
            </span>

            <Link
              href={`/admin/purchases/${row.id}`}
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: "32px", height: "32px", borderRadius: "8px",
                border: "1px solid #E5E5E5", background: "#FFFFFF", color: "#525252",
                textDecoration: "none", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
              }}
            >
              <Eye size={15} />
            </Link>
          </div>
        ))}

        {/* Pagination */}
        <Pagination />
      </div>
    </div>
  );
}

// ── Pagination ────────────────────────────────────────────────────
function Pagination() {
  const edgeBtnStyle: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", gap: "6px",
    padding: "10px 14px", borderRadius: "8px",
    border: "1px solid #D6D6D6", background: "#FFFFFF",
    fontSize: "14px", color: "#424242", cursor: "pointer",
    boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
  };
  const pageBtn = (active: boolean): React.CSSProperties => ({
    width: "40px", height: "40px", borderRadius: "8px", border: "none",
    background: active ? "#FAFAFA" : "transparent",
    color: active ? "#424242" : "#525252",
    fontSize: "14px", cursor: "pointer",
  });

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "20px", borderTop: "1px solid #E5E5E5",
    }}>
      <button className="font-nunito font-bold" style={edgeBtnStyle}>
        <ChevronLeft size={16} /> Previous
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
        {[1, 2, 3].map((n) => (
          <button key={n} className="font-nunito font-semibold" style={pageBtn(n === 1)}>{n}</button>
        ))}
        <span className="font-nunito" style={{ width: "40px", height: "40px", fontSize: "14px", color: "#525252", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
          ...
        </span>
        {[8, 9, 10].map((n) => (
          <button key={n} className="font-nunito font-semibold" style={pageBtn(false)}>{n}</button>
        ))}
      </div>

      <button className="font-nunito font-bold" style={edgeBtnStyle}>
        Next <ChevronRight size={16} />
      </button>
    </div>
  );
}
