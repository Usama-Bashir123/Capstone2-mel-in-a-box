"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import {
  Search, SlidersHorizontal, Eye,
  ChevronLeft, ChevronRight,
  TrendingUp, ShoppingCart, DollarSign, RefreshCcw,
  Loader2
} from "lucide-react";
import { Timestamp } from "firebase/firestore";

// ── Types ─────────────────────────────────────────────────────────
interface Purchase {
  id: string;
  invoice: string;
  parentName: string;
  item: string;
  amount: number;
  status: "Completed" | "Pending" | "Refunded";
  timestamp: Timestamp | null;
  displayTime: string;
}

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

const MOCK_PURCHASES: Purchase[] = [
  { id: "1", invoice: "INV-001", parentName: "John Doe", item: "Premium Plan (Annual)", amount: 120.00, status: "Completed", timestamp: null, displayTime: "2024-03-10, 10:30 AM" },
  { id: "2", invoice: "INV-002", parentName: "Jane Smith", item: "Adventure Pack", amount: 15.00, status: "Completed", timestamp: null, displayTime: "2024-03-12, 02:15 PM" },
  { id: "3", invoice: "INV-003", parentName: "Robert Brown", item: "Premium Plan (Monthly)", amount: 12.00, status: "Pending", timestamp: null, displayTime: "2024-03-14, 09:45 AM" },
  { id: "4", invoice: "INV-004", parentName: "Emily Davis", item: "Premium Plan (Annual)", amount: 120.00, status: "Completed", timestamp: null, displayTime: "2024-03-15, 11:00 AM" },
  { id: "5", invoice: "INV-005", parentName: "Michael Wilson", item: "Adventure Pack", amount: 15.00, status: "Refunded", timestamp: null, displayTime: "2024-03-16, 04:30 PM" },
];

// ── Page ──────────────────────────────────────────────────────────
export default function PurchasesPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [search, setSearch] = useState("");
  const [purchases] = useState<Purchase[]>(MOCK_PURCHASES);
  const loading = false;

  useEffect(() => {
    // Reverted to mock data
  }, []);

  const stats = useMemo(() => {
    const completed = purchases.filter(p => p.status === "Completed");
    const totalRevenue = completed.reduce((sum, p) => sum + p.amount, 0);
    const refunded = purchases.filter(p => p.status === "Refunded").reduce((sum, p) => sum + p.amount, 0);
    const avgValue = completed.length > 0 ? totalRevenue / completed.length : 0;

    return [
      {
        label: "Total Revenue",
        value: `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
        trend: "+40% this month", // Mock trend for now
        trendUp: true,
        icon: DollarSign,
        iconBg: "#ECFDF3",
        iconColor: "#067647",
      },
      {
        label: "Total Purchases",
        value: purchases.length.toString(),
        trend: "+12% this month",
        trendUp: true,
        icon: ShoppingCart,
        iconBg: "#EFF8FF",
        iconColor: "#1570EF",
      },
      {
        label: "Avg. Purchase Value",
        value: `$${avgValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
        trend: "+8% this month",
        trendUp: true,
        icon: TrendingUp,
        iconBg: "#FDF4FF",
        iconColor: "#9E77ED",
      },
      {
        label: "Refunded",
        value: `$${refunded.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
        trend: "-5% this month",
        trendUp: false,
        icon: RefreshCcw,
        iconBg: "#FEF3F2",
        iconColor: "#F04438",
      },
    ];
  }, [purchases]);

  const filtered = purchases.filter((p) => {
    const matchSearch =
      (p.parentName || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.item || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.invoice || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <h1 className="font-nunito font-semibold" style={{ fontSize: "30px", lineHeight: "38px", color: "#141414" }}>
          Purchases &amp; Payments
        </h1>
        <p className="font-nunito font-normal" style={{ fontSize: "16px", lineHeight: "24px", color: "#525252" }}>
          View all transactions and revenue details.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
        {stats.map((card) => {
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

              <span className="font-nunito font-semibold" style={{ fontSize: "28px", lineHeight: "38px", color: "#141414" }}>
                {card.value}
              </span>

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

      <div style={{
        background: "#FFFFFF", border: "1px solid #E5E5E5",
        borderRadius: "12px", overflow: "hidden", minHeight: "500px"
      }}>

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

        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "100px" }}>
            <Loader2 size={32} className="animate-spin" style={{ color: "#F63D68" }} />
          </div>
        ) : filtered.length === 0 ? (
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
            <span className="font-nunito font-normal" style={{ fontSize: "14px", color: "#525252" }}>{row.invoice}</span>

            <span className="font-nunito font-normal" style={{ fontSize: "14px", color: "#525252", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {row.parentName}
            </span>

            <span className="font-nunito font-normal" style={{ fontSize: "14px", color: "#525252", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {row.item}
            </span>

            <span className="font-nunito font-semibold" style={{ fontSize: "14px", color: "#141414" }}>
              ${row.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>

            <div><StatusBadge status={row.status} /></div>

            <span className="font-nunito font-normal" style={{ fontSize: "14px", color: "#525252" }}>
              {row.displayTime}
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

        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px", borderTop: "1px solid #E5E5E5",
        }}>
          <button className="font-nunito font-bold" style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #D6D6D6", background: "#FFFFFF", fontSize: "14px", color: "#424242" }}>
            <ChevronLeft size={16} /> Previous
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
            <button className="font-nunito font-semibold" style={{ width: "40px", height: "40px", borderRadius: "8px", border: "none", background: "#FAFAFA", color: "#424242" }}>1</button>
          </div>
          <button className="font-nunito font-bold" style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #D6D6D6", background: "#FFFFFF", fontSize: "14px", color: "#424242" }}>
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
