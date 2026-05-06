"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ShoppingCart, Trash2, Plus, Minus, ChevronRight, Tag, CheckCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

// ── Valid promo codes ─────────────────────────────────────────────
const PROMO_CODES: Record<string, number> = {
  PARTY30: 0.30,
  MEL10:   0.10,
  SAVE20:  0.20,
};

// ── Recommended premium content data ─────────────────────────────
const RECOMMENDED = [
  { id: "rec-1", title: "Live Remote Storytelling Session", category: "Add-on", price: "$9.99", numericPrice: 9.99, thumbnail: "/images/parent/party-themes/party-jungle-adventure.png" },
  { id: "rec-2", title: "Extra Printable Games Pack",       category: "Add-on", price: "$2.99", numericPrice: 2.99, thumbnail: "/images/parent/party-themes/party-space-explorer.png" },
  { id: "rec-3", title: "Party Decoration Bundle",          category: "Bundle", price: "$14.99", numericPrice: 14.99, thumbnail: "/images/parent/party-themes/party-pirate-island.png" },
];

function EmptyCart() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px", gap: "16px" }}>
      <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "#FFF1F3", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <ShoppingCart size={32} style={{ color: "#F63D68" }} />
      </div>
      <div style={{ textAlign: "center" }}>
        <p className="font-nunito font-bold" style={{ fontSize: "18px", color: "#141414", margin: "0 0 8px" }}>Your cart is empty</p>
        <p className="font-nunito font-normal" style={{ fontSize: "14px", color: "#737373", margin: 0 }}>Add some party theme add-ons to get started!</p>
      </div>
      <Link href="/parent/party-themes" className="font-nunito font-bold" style={{ padding: "10px 24px", borderRadius: "8px", background: "#F63D68", color: "#FFFFFF", textDecoration: "none", fontSize: "14px", display: "inline-flex", alignItems: "center", gap: "6px" }}>
        Browse Party Themes <ChevronRight size={16} />
      </Link>
    </div>
  );
}

function RecommendedCard({ item, onAdd }: { item: typeof RECOMMENDED[number]; onAdd: () => void }) {
  return (
    <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "12px", padding: "12px", display: "flex", alignItems: "center", gap: "16px" }}>
      <div style={{ width: "72px", height: "72px", borderRadius: "8px", border: "1px solid #E5E5E5", position: "relative", overflow: "hidden", flexShrink: 0 }}>
        <Image src={item.thumbnail} alt={item.title} fill style={{ objectFit: "cover" }} unoptimized />
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
        <span style={{ fontSize: "10px", fontWeight: 700, fontFamily: "Nunito, sans-serif", color: "#F63D68", background: "#FFF1F3", border: "1px solid #FECDD6", borderRadius: "4px", padding: "1px 6px", display: "inline-block", width: "fit-content" }}>{item.category}</span>
        <p className="font-nunito font-semibold" style={{ fontSize: "14px", color: "#141414", margin: 0 }}>{item.title}</p>
        <p className="font-nunito font-bold" style={{ fontSize: "15px", color: "#F63D68", margin: 0 }}>{item.price}</p>
      </div>
      <button onClick={onAdd} className="font-nunito font-bold" style={{ flexShrink: 0, padding: "8px 14px", borderRadius: "8px", background: "#F63D68", border: "none", color: "#FFFFFF", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}>
        <Plus size={13} /> Add
      </button>
    </div>
  );
}

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQty, addItem, subtotal, totalItems } = useCart();

  const [promoCode, setPromoCode] = useState("");
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState(false);

  const discountRate = appliedCode ? (PROMO_CODES[appliedCode] ?? 0) : 0;
  const discount = subtotal * discountRate;
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + tax;

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (PROMO_CODES[code] !== undefined) {
      setAppliedCode(code);
      setPromoError("");
      setPromoSuccess(true);
    } else {
      setAppliedCode(null);
      setPromoError("Invalid promo code. Try PARTY30.");
      setPromoSuccess(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedCode(null);
    setPromoCode("");
    setPromoError("");
    setPromoSuccess(false);
  };

  if (items.length === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Link href="/parent/party-themes" className="font-nunito font-bold" style={{ fontSize: "14px", color: "#424242", textDecoration: "none" }}>Party Themes</Link>
          <ChevronRight size={16} style={{ color: "#A3A3A3" }} />
          <span className="font-nunito font-bold" style={{ fontSize: "14px", color: "#F63D68" }}>Cart</span>
        </div>
        <div style={{ background: "#FFFFFF", borderRadius: "12px", border: "1px solid #E5E5E5" }}>
          <EmptyCart />
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Link href="/parent/party-themes" className="font-nunito font-bold" style={{ fontSize: "14px", color: "#424242", textDecoration: "none" }}>Party Themes</Link>
        <ChevronRight size={16} style={{ color: "#A3A3A3" }} />
        <span className="font-nunito font-bold" style={{ fontSize: "14px", color: "#F63D68" }}>Cart</span>
      </div>

      {/* Page title */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <h1 className="font-nunito font-bold" style={{ fontSize: "24px", color: "#141414", margin: 0 }}>My Cart</h1>
        <span style={{ background: "#FFF1F3", color: "#F63D68", fontSize: "12px", fontWeight: 700, fontFamily: "Nunito, sans-serif", padding: "2px 10px", borderRadius: "999px", border: "1px solid #FECDD6" }}>
          {totalItems} {totalItems === 1 ? "item" : "items"}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "20px", alignItems: "start" }}>

        {/* Left — Cart Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {items.map((item) => (
            <div key={item.id} style={{ background: "#FFFFFF", borderRadius: "12px", border: "1px solid #E5E5E5", padding: "16px", display: "flex", alignItems: "flex-start", gap: "16px" }}>
              {/* Image */}
              <div style={{ width: "80px", height: "80px", borderRadius: "8px", overflow: "hidden", flexShrink: 0, background: "#F5F5F5", position: "relative" }}>
                <Image src={item.image} alt={item.title} fill style={{ objectFit: "cover" }} unoptimized />
              </div>

              {/* Details */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p className="font-nunito font-bold" style={{ fontSize: "15px", color: "#141414", margin: "0 0 4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</p>
                <p className="font-nunito font-normal" style={{ fontSize: "13px", color: "#737373", margin: "0 0 12px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.description}</p>

                {/* Qty controls */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", border: "1px solid #E5E5E5", borderRadius: "8px", overflow: "hidden" }}>
                    <button onClick={() => updateQty(item.id, item.quantity - 1)} disabled={item.quantity <= 1}
                      style={{ width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: item.quantity <= 1 ? "not-allowed" : "pointer", color: item.quantity <= 1 ? "#D4D4D4" : "#525252" }}>
                      <Minus size={14} />
                    </button>
                    <span className="font-nunito font-semibold" style={{ fontSize: "14px", color: "#141414", minWidth: "32px", textAlign: "center", borderLeft: "1px solid #E5E5E5", borderRight: "1px solid #E5E5E5", height: "32px", lineHeight: "32px" }}>{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, item.quantity + 1)}
                      style={{ width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", color: "#525252" }}>
                      <Plus size={14} />
                    </button>
                  </div>
                  <button onClick={() => removeItem(item.id)} style={{ display: "flex", alignItems: "center", gap: "4px", background: "none", border: "none", cursor: "pointer", color: "#F04438", padding: "4px 0" }}>
                    <Trash2 size={14} />
                    <span className="font-nunito font-semibold" style={{ fontSize: "13px" }}>Remove</span>
                  </button>
                </div>
              </div>

              {/* Price */}
              <div style={{ flexShrink: 0, textAlign: "right" }}>
                <p className="font-nunito font-bold" style={{ fontSize: "16px", color: "#F63D68", margin: 0 }}>${(item.numericPrice * item.quantity).toFixed(2)}</p>
                {item.quantity > 1 && (
                  <p className="font-nunito font-normal" style={{ fontSize: "12px", color: "#A3A3A3", margin: "2px 0 0" }}>{item.price} each</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Right — Order Summary */}
        <div style={{ background: "#FFFFFF", borderRadius: "12px", border: "1px solid #E5E5E5", padding: "20px", display: "flex", flexDirection: "column", gap: "16px", position: "sticky", top: "20px" }}>
          <h2 className="font-nunito font-bold" style={{ fontSize: "18px", color: "#141414", margin: 0 }}>Order Summary</h2>

          {/* Price breakdown */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="font-nunito font-normal" style={{ fontSize: "14px", color: "#525252" }}>Subtotal ({totalItems} items)</span>
              <span className="font-nunito font-semibold" style={{ fontSize: "14px", color: "#141414" }}>${subtotal.toFixed(2)}</span>
            </div>
            {appliedCode && (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className="font-nunito font-normal" style={{ fontSize: "14px", color: "#12B76A" }}>Discount ({Math.round(discountRate * 100)}% off)</span>
                <span className="font-nunito font-semibold" style={{ fontSize: "14px", color: "#12B76A" }}>−${discount.toFixed(2)}</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="font-nunito font-normal" style={{ fontSize: "14px", color: "#525252" }}>Tax (8%)</span>
              <span className="font-nunito font-semibold" style={{ fontSize: "14px", color: "#141414" }}>${tax.toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="font-nunito font-normal" style={{ fontSize: "14px", color: "#525252" }}>Delivery</span>
              <span className="font-nunito font-semibold" style={{ fontSize: "14px", color: "#12B76A" }}>Free</span>
            </div>
          </div>

          {/* Promo code inside order summary */}
          <div style={{ background: "#F9FAFB", borderRadius: "8px", padding: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <p className="font-nunito font-semibold" style={{ fontSize: "13px", color: "#424242", margin: 0 }}>Promo Code</p>
            {appliedCode ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#ECFDF3", border: "1px solid #ABEFC6", borderRadius: "8px", padding: "8px 12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <CheckCircle size={15} style={{ color: "#12B76A" }} />
                  <span className="font-nunito font-bold" style={{ fontSize: "13px", color: "#067647" }}>{appliedCode} applied!</span>
                </div>
                <button onClick={handleRemovePromo} className="font-nunito font-semibold" style={{ background: "none", border: "none", cursor: "pointer", color: "#F04438", fontSize: "12px", padding: 0 }}>Remove</button>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", gap: "8px" }}>
                  <div style={{ flex: 1, position: "relative" }}>
                    <Tag size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#A3A3A3" }} />
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => { setPromoCode(e.target.value.toUpperCase()); setPromoError(""); }}
                      onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                      placeholder="e.g. PARTY30"
                      className="font-nunito font-normal placeholder:text-gray-400 focus:outline-none"
                      style={{ width: "100%", height: "36px", paddingLeft: "30px", paddingRight: "10px", borderRadius: "8px", border: `1px solid ${promoError ? "#F04438" : "#E5E5E5"}`, fontSize: "13px", color: "#141414", background: "#FFFFFF", boxSizing: "border-box" }}
                    />
                  </div>
                  <button onClick={handleApplyPromo} className="font-nunito font-bold" style={{ padding: "0 14px", height: "36px", borderRadius: "8px", border: "1px solid #F63D68", background: "#FFF1F3", color: "#F63D68", fontSize: "13px", cursor: "pointer", flexShrink: 0 }}>
                    Apply
                  </button>
                </div>
                {promoError && <span className="font-nunito" style={{ fontSize: "12px", color: "#F04438" }}>{promoError}</span>}
              </>
            )}
          </div>

          <div style={{ height: "1px", background: "#E5E5E5" }} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="font-nunito font-bold" style={{ fontSize: "16px", color: "#141414" }}>Total</span>
            <div style={{ textAlign: "right" }}>
              {appliedCode && (
                <p className="font-nunito font-normal" style={{ fontSize: "12px", color: "#A3A3A3", margin: "0 0 2px", textDecoration: "line-through" }}>${(subtotal + subtotal * 0.08).toFixed(2)}</p>
              )}
              <span className="font-nunito font-bold" style={{ fontSize: "20px", color: "#F63D68" }}>${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => router.push("/parent/cart/checkout")}
            className="font-nunito font-bold"
            style={{ width: "100%", padding: "12px", borderRadius: "10px", background: "#F63D68", border: "none", color: "#FFFFFF", fontSize: "16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", boxShadow: "0px 4px 12px rgba(246,61,104,0.3)" }}
          >
            Proceed to Checkout <ChevronRight size={18} />
          </button>

          <Link href="/parent/party-themes" className="font-nunito font-semibold" style={{ textAlign: "center", fontSize: "14px", color: "#525252", textDecoration: "none", display: "block" }}>
            ← Continue Shopping
          </Link>
        </div>
      </div>

      {/* ── Recommended Premium Content ── */}
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2 className="font-nunito font-bold" style={{ fontSize: "18px", color: "#141414", margin: "0 0 4px" }}>Recommended Premium Content</h2>
            <p className="font-nunito font-normal" style={{ fontSize: "13px", color: "#737373", margin: 0 }}>Customers who bought this also loved these add-ons</p>
          </div>
          <Link href="/parent/party-themes" className="font-nunito font-bold" style={{ fontSize: "14px", color: "#F63D68", textDecoration: "none" }}>View all</Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
          {RECOMMENDED.map((item) => (
            <RecommendedCard
              key={item.id}
              item={item}
              onAdd={() => addItem({ id: item.id, title: item.title, description: item.category, price: item.price, numericPrice: item.numericPrice, image: item.thumbnail, themeId: "recommended" })}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
