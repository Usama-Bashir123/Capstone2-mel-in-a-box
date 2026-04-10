"use client";

// Purchase Detail — Figma node 214:14295
// Breadcrumb: "Purchases & Billing" > "Bill Detail" (Rosé/500)
// Actions (right-aligned): Request Refund (secondary) + Download Receipt (primary rose)
// Card 1 "Details:": 2-column field grid
//   Left: Item Name, Age Group, Category, Amount
//   Right: Payment Method, Transaction ID, Date & Time, Status (Active green badge)
// Card 2 "Billing Information": Billing Email, Payment Status

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

/* ── Data ──────────────────────────────────────────────── */
interface PurchaseDetail {
  itemName: string;
  ageGroup: string;
  category: string;
  amount: string;
  paymentMethod: string;
  transactionId: string;
  dateTime: string;
  status: string;
  billingEmail: string;
  paymentStatus: string;
}

const purchaseData: Record<string, PurchaseDetail> = {
  "1": {
    itemName: "Jungle Bedtime Story Video",
    ageGroup: "3-4",
    category: "Premium Story",
    amount: "$4.99",
    paymentMethod: "Visa ending in 1234",
    transactionId: "TXN-20250325-0945",
    dateTime: "2025-03-25, 09:45 AM",
    status: "Active",
    billingEmail: "parent@mail.com",
    paymentStatus: "Paid",
  },
  "2": {
    itemName: "Pirate Activity Pack",
    ageGroup: "5-6",
    category: "Premium Game",
    amount: "$2.99",
    paymentMethod: "PayPal",
    transactionId: "TXN-20250324-1720",
    dateTime: "2025-03-24, 05:20 PM",
    status: "Pending",
    billingEmail: "parent@mail.com",
    paymentStatus: "Pending",
  },
  "3": {
    itemName: "Remote Party Session",
    ageGroup: "3-7",
    category: "Add-on",
    amount: "$4.99",
    paymentMethod: "Visa ending in 1234",
    transactionId: "TXN-20250324-1720",
    dateTime: "2025-03-24, 05:20 PM",
    status: "Active",
    billingEmail: "parent@mail.com",
    paymentStatus: "Paid",
  },
  "4": {
    itemName: "Mel and the Snowy Adventure",
    ageGroup: "3-7",
    category: "Bundle",
    amount: "$4.99",
    paymentMethod: "PayPal",
    transactionId: "TXN-20250314-1200",
    dateTime: "2025-03-14, 12:00 PM",
    status: "Active",
    billingEmail: "parent@mail.com",
    paymentStatus: "Paid",
  },
  "5": {
    itemName: "Mel and the Snowy Adventure",
    ageGroup: "3-7",
    category: "Service",
    amount: "$4.99",
    paymentMethod: "Visa ending in 1234",
    transactionId: "TXN-20250310-0930",
    dateTime: "2025-03-10, 09:30 AM",
    status: "Active",
    billingEmail: "parent@mail.com",
    paymentStatus: "Paid",
  },
  "6": {
    itemName: "Mel and the Snowy Adventure",
    ageGroup: "3-7",
    category: "Premium Story",
    amount: "$4.99",
    paymentMethod: "Visa ending in 1234",
    transactionId: "TXN-20250303-1100",
    dateTime: "2025-03-03, 11:00 AM",
    status: "Active",
    billingEmail: "parent@mail.com",
    paymentStatus: "Paid",
  },
  "7": {
    itemName: "Party Games Add-on Pack",
    ageGroup: "3-7",
    category: "Premium Story",
    amount: "$4.99",
    paymentMethod: "Visa ending in 1234",
    transactionId: "TXN-20250227-0900",
    dateTime: "2025-02-27, 09:00 AM",
    status: "Active",
    billingEmail: "parent@mail.com",
    paymentStatus: "Paid",
  },
  "8": {
    itemName: "Mel and the Snowy Adventure",
    ageGroup: "3-7",
    category: "Premium Story",
    amount: "$4.99",
    paymentMethod: "Visa ending in 1234",
    transactionId: "TXN-20250227-0800",
    dateTime: "2025-02-27, 08:00 AM",
    status: "Active",
    billingEmail: "parent@mail.com",
    paymentStatus: "Paid",
  },
};

/* ── Field component ───────────────────────────────────── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
      <span className="font-nunito font-medium" style={{ fontSize: "14px", lineHeight: "20px", color: "#424242" }}>
        {label}
      </span>
      <div>{children}</div>
    </div>
  );
}

function FieldValue({ value }: { value: string }) {
  return (
    <span className="font-nunito font-semibold" style={{ fontSize: "16px", lineHeight: "24px", color: "#141414" }}>
      {value}
    </span>
  );
}

/* ── Page ──────────────────────────────────────────────── */
export default function PurchaseDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const purchase = purchaseData[params.id] ?? purchaseData["1"];
  const isActive = purchase.status === "Active";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* ── Breadcrumb + Actions ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link
            href="/parent/purchases"
            className="font-nunito font-bold"
            style={{ fontSize: "14px", lineHeight: "20px", color: "#424242", textDecoration: "none" }}
          >
            Purchases &amp; Billing
          </Link>
          <ChevronRight size={16} style={{ color: "#737373" }} />
          <span className="font-nunito font-bold" style={{ fontSize: "14px", lineHeight: "20px", color: "#F63D68" }}>
            Bill Detail
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            className="font-nunito font-bold"
            style={{
              padding: "10px 14px", borderRadius: "8px",
              border: "1px solid #D6D6D6", background: "#FFFFFF",
              fontSize: "14px", lineHeight: "20px", color: "#424242",
              boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", cursor: "pointer",
            }}
          >
            Request Refund
          </button>
          <button
            className="font-nunito font-bold text-white"
            style={{
              padding: "10px 14px", borderRadius: "8px",
              border: "1px solid #F63D68", background: "#F63D68",
              fontSize: "14px", lineHeight: "20px",
              boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", cursor: "pointer",
            }}
          >
            Download Receipt
          </button>
        </div>
      </div>

      {/* ── Cards ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* Card 1: Details */}
        <div
          style={{
            background: "#FFFFFF", border: "1px solid #E5E5E5",
            borderRadius: "12px", padding: "20px",
            display: "flex", flexDirection: "column", gap: "24px",
          }}
        >
          <span className="font-nunito font-semibold" style={{ fontSize: "18px", lineHeight: "28px", color: "#141414" }}>
            Details:
          </span>

          {/* 2-column field grid */}
          <div style={{ display: "flex", gap: "20px" }}>
            {/* Left column */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
              <Field label="Item Name"><FieldValue value={purchase.itemName} /></Field>
              <Field label="Age Group"><FieldValue value={purchase.ageGroup} /></Field>
              <Field label="Category"><FieldValue value={purchase.category} /></Field>
              <Field label="Amount"><FieldValue value={purchase.amount} /></Field>
            </div>

            {/* Right column */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
              <Field label="Payment Method"><FieldValue value={purchase.paymentMethod} /></Field>
              <Field label="Transaction ID"><FieldValue value={purchase.transactionId} /></Field>
              <Field label="Date &amp; Time"><FieldValue value={purchase.dateTime} /></Field>
              <Field label="Status">
                <span
                  className="font-nunito font-semibold"
                  style={{
                    fontSize: "12px", lineHeight: "18px",
                    color: isActive ? "#067647" : "#B54708",
                    background: isActive ? "#ECFDF3" : "#FFFAEB",
                    border: `1px solid ${isActive ? "#ABEFC6" : "#FEC84B"}`,
                    borderRadius: "9999px", padding: "2px 8px",
                  }}
                >
                  {purchase.status}
                </span>
              </Field>
            </div>
          </div>
        </div>

        {/* Card 2: Billing Information */}
        <div
          style={{
            background: "#FFFFFF", border: "1px solid #E5E5E5",
            borderRadius: "12px", padding: "20px",
            display: "flex", flexDirection: "column", gap: "24px",
          }}
        >
          <span className="font-nunito font-semibold" style={{ fontSize: "18px", lineHeight: "28px", color: "#141414" }}>
            Billing Information
          </span>
          <div style={{ display: "flex", gap: "20px" }}>
            <Field label="Billing Email"><FieldValue value={purchase.billingEmail} /></Field>
            <Field label="Payment Status"><FieldValue value={purchase.paymentStatus} /></Field>
          </div>
        </div>

      </div>
    </div>
  );
}
