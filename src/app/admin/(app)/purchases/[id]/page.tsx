"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronRight } from "lucide-react";

// ── Mock data ─────────────────────────────────────────────────────
const PURCHASES = [
  {
    id: "1", invoice: "0313",
    // Parent Information
    parentName:     "Sarah Lee",
    parentEmail:    "sarah@mail.com",
    accountCreated: "09-July-2025",
    parentStatus:   "Active",
    // Purchase Detail
    item:           "Jungle Bedtime Story Video",
    amount:         "$4.99",
    paymentMethod:  "Credit Card",
    purchaseStatus: "Completed",
    transactionId:  "TXN-9834201",
    paymentDate:    "Today, 9:12 AM",
    // Billing Information
    cardLast4:      "**** 1234",
    country:        "Australia",
    zipCode:        "5799",
  },
  {
    id: "2", invoice: "3456",
    parentName:     "Mike Brown",
    parentEmail:    "mike.b@mail.com",
    accountCreated: "03-Feb-2025",
    parentStatus:   "Active",
    item:           "Space Adventure Pack",
    amount:         "$5.99",
    paymentMethod:  "PayPal",
    purchaseStatus: "Pending",
    transactionId:  "TXN-7712043",
    paymentDate:    "Yesterday, 5:20PM",
    cardLast4:      "**** 5678",
    country:        "United States",
    zipCode:        "10001",
  },
  {
    id: "3", invoice: "1243",
    parentName:     "Aisha Khan",
    parentEmail:    "aisha.k@mail.com",
    accountCreated: "10-Mar-2025",
    parentStatus:   "Active",
    item:           "Remote Party Session",
    amount:         "$4.99",
    paymentMethod:  "Credit Card",
    purchaseStatus: "Completed",
    transactionId:  "TXN-3341029",
    paymentDate:    "Yesterday, 5:20PM",
    cardLast4:      "**** 9012",
    country:        "United Kingdom",
    zipCode:        "EC1A 1BB",
  },
  {
    id: "4", invoice: "2432",
    parentName:     "David Wilson",
    parentEmail:    "david.w@mail.com",
    accountCreated: "01-Mar-2025",
    parentStatus:   "Disable",
    item:           "Pirate Island Activity Pack",
    amount:         "$5.99",
    paymentMethod:  "Debit Card",
    purchaseStatus: "Refunded",
    transactionId:  "TXN-5598712",
    paymentDate:    "Mar 14, 2025",
    cardLast4:      "**** 3456",
    country:        "Canada",
    zipCode:        "M5H 2N2",
  },
  {
    id: "5", invoice: "1245",
    parentName:     "Emma Clark",
    parentEmail:    "emma.c@mail.com",
    accountCreated: "12-Mar-2025",
    parentStatus:   "Active",
    item:           "Pirate Island Activity Pack",
    amount:         "$4.99",
    paymentMethod:  "Credit Card",
    purchaseStatus: "Completed",
    transactionId:  "TXN-2209834",
    paymentDate:    "Mar 10, 2025",
    cardLast4:      "**** 7890",
    country:        "Australia",
    zipCode:        "2000",
  },
  {
    id: "6", invoice: "2345",
    parentName:     "Liam Taylor",
    parentEmail:    "liam.t@mail.com",
    accountCreated: "20-Mar-2025",
    parentStatus:   "Disable",
    item:           "Pirate Island Activity Pack",
    amount:         "$5.99",
    paymentMethod:  "PayPal",
    purchaseStatus: "Pending",
    transactionId:  "TXN-8834512",
    paymentDate:    "Mar 03, 2025",
    cardLast4:      "**** 2345",
    country:        "New Zealand",
    zipCode:        "1010",
  },
  {
    id: "7", invoice: "1234",
    parentName:     "David Carl",
    parentEmail:    "david.c@mail.com",
    accountCreated: "27-Feb-2025",
    parentStatus:   "Active",
    item:           "Pirate Island Activity Pack",
    amount:         "$4.99",
    paymentMethod:  "Credit Card",
    purchaseStatus: "Completed",
    transactionId:  "TXN-1122334",
    paymentDate:    "Feb 27, 2025",
    cardLast4:      "**** 6789",
    country:        "United States",
    zipCode:        "90001",
  },
  {
    id: "8", invoice: "5312",
    parentName:     "Mary Jane",
    parentEmail:    "mary.j@mail.com",
    accountCreated: "27-Feb-2025",
    parentStatus:   "Active",
    item:           "Pirate Island Activity Pack",
    amount:         "$5.99",
    paymentMethod:  "Debit Card",
    purchaseStatus: "Refunded",
    transactionId:  "TXN-9988776",
    paymentDate:    "Feb 27, 2025",
    cardLast4:      "**** 0123",
    country:        "Ireland",
    zipCode:        "D01 F5P2",
  },
];

// ── Status badge ──────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; border: string; color: string }> = {
    Active:    { bg: "#ECFDF3", border: "#ABEFC6", color: "#067647" },
    Completed: { bg: "#ECFDF3", border: "#ABEFC6", color: "#067647" },
    Pending:   { bg: "#FFFAEB", border: "#FEDF89", color: "#B54708" },
    Refunded:  { bg: "#F9FAFB", border: "#EAECF0", color: "#525252" },
    Disable:   { bg: "#FEF3F2", border: "#FDA29B", color: "#F04438" },
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

// ── Field: label + value ──────────────────────────────────────────
function Field({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <span className="font-nunito" style={{ fontWeight: 500, fontSize: "14px", color: "#424242" }}>
        {label}
      </span>
      <span className="font-nunito font-semibold" style={{ fontSize: "16px", color: "#141414" }}>
        {value}
      </span>
    </div>
  );
}

// ── Section card ──────────────────────────────────────────────────
function SectionCard({
  title, children,
}: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: "#FFFFFF", border: "1px solid #E5E5E5",
      borderRadius: "12px", padding: "20px",
      boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
      display: "flex", flexDirection: "column", gap: "24px",
    }}>
      <h3 className="font-nunito font-semibold" style={{ fontSize: "18px", lineHeight: "28px", color: "#141414", margin: 0 }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────
export default function PurchaseDetailPage() {
  const params  = useParams();
  const id      = params.id as string;
  const purchase = PURCHASES.find((p) => p.id === id);

  if (!purchase) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "300px", gap: "12px" }}>
        <p className="font-nunito font-semibold" style={{ fontSize: "18px", color: "#141414" }}>Purchase not found</p>
        <Link href="/admin/purchases" className="font-nunito font-semibold" style={{ fontSize: "14px", color: "#F63D68", textDecoration: "none" }}>
          ← Back to Purchases
        </Link>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Link
          href="/admin/purchases"
          className="font-nunito font-bold"
          style={{ fontSize: "14px", color: "#424242", textDecoration: "none" }}
        >
          Purchases
        </Link>
        <ChevronRight size={16} style={{ color: "#A3A3A3", flexShrink: 0 }} />
        <span className="font-nunito font-bold" style={{ fontSize: "14px", color: "#F63D68" }}>
          Invoice# {purchase.invoice}
        </span>
      </div>

      {/* ── Three stacked cards ─────────────────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* 1. Parents Information */}
        <SectionCard title="Parents Information">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <Field label="Name"            value={purchase.parentName}     />
            <Field label="Email Address"   value={purchase.parentEmail}    />
            <Field label="Account Created" value={purchase.accountCreated} />
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-start" }}>
              <span className="font-nunito" style={{ fontWeight: 500, fontSize: "14px", color: "#424242" }}>Status</span>
              <StatusBadge status={purchase.parentStatus} />
            </div>
          </div>
        </SectionCard>

        {/* 2. Purchase Detail */}
        <SectionCard title="Purchase Detail">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <Field label="Item"             value={purchase.item}           />
            <Field label="Amount"           value={purchase.amount}         />
            <Field label="Payment Method"   value={purchase.paymentMethod}  />
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-start" }}>
              <span className="font-nunito" style={{ fontWeight: 500, fontSize: "14px", color: "#424242" }}>Status</span>
              <StatusBadge status={purchase.purchaseStatus} />
            </div>
            <Field label="Transaction ID"   value={purchase.transactionId}  />
            <Field label="Payment Date"     value={purchase.paymentDate}    />
          </div>
        </SectionCard>

        {/* 3. Billing Information */}
        <SectionCard title="Billing Information">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <Field label="Card last 4 digit" value={purchase.cardLast4} />
            <Field label="Country"           value={purchase.country}   />
            <Field label="Zip code"          value={purchase.zipCode}   />
          </div>
        </SectionCard>

      </div>
    </div>
  );
}
