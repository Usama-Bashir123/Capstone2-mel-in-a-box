"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ShoppingCart, CheckCircle, X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useCart } from "@/contexts/CartContext";

interface IncludedFile { name: string; type: "PDF" | "PNG"; }
interface AddOn { id: string; title: string; description: string; price: string; numericPrice: number; }
interface ThemeDetail { title: string; ageGroup: string; description: string; image: string; files: IncludedFile[]; addOns: AddOn[]; }

const themeData: Record<string, ThemeDetail> = {
  "1": { title: "Jungle Adventure Party", ageGroup: "3-7", description: "Transform your home into a magical jungle with animal masks, vine decorations, and themed games.", image: "/images/parent/party-themes/party-jungle-adventure.png", files: [{ name: "Rocket craft template", type: "PDF" }, { name: "Decorations kit", type: "PDF" }, { name: "Space helmets", type: "PDF" }, { name: "Cake toppers", type: "PNG" }, { name: "Coloring sheets", type: "PDF" }], addOns: [{ id: "1-storytelling", title: "Live Remote Storytelling Session", description: "30-minute virtual session hosted by Mel.", price: "$9.99", numericPrice: 9.99 }, { id: "1-games", title: "Extra Printable Games Pack", description: "Includes 5 bonus jungle games.", price: "$2.99", numericPrice: 2.99 }] },
  "2": { title: "Space Explorer Party", ageGroup: "3-7", description: "Launch into space with rocket crafts, space helmets, and planet-themed cupcake toppers.", image: "/images/parent/party-themes/party-space-explorer.png", files: [{ name: "Rocket craft template", type: "PDF" }, { name: "Decorations kit", type: "PDF" }, { name: "Space helmets", type: "PDF" }, { name: "Cake toppers", type: "PNG" }, { name: "Coloring sheets", type: "PDF" }], addOns: [{ id: "2-storytelling", title: "Live Remote Storytelling Session", description: "30-minute virtual session hosted by Mel.", price: "$9.99", numericPrice: 9.99 }, { id: "2-games", title: "Extra Printable Games Pack", description: "Includes 5 bonus space games.", price: "$2.99", numericPrice: 2.99 }] },
  "3": { title: "Pirate Island Party", ageGroup: "3-7", description: "A high-energy pirate-themed party with treasure hunts, pirate hats, and map-based activities.", image: "/images/parent/party-themes/party-pirate-island.png", files: [{ name: "Treasure map activity", type: "PDF" }, { name: "Pirate hats template", type: "PDF" }, { name: "Bandana craft sheet", type: "PDF" }, { name: "Cake toppers", type: "PNG" }, { name: "Party games sheet", type: "PDF" }], addOns: [{ id: "3-storytelling", title: "Live Remote Storytelling Session", description: "30-minute virtual session hosted by Mel.", price: "$9.99", numericPrice: 9.99 }, { id: "3-games", title: "Extra Printable Games Pack", description: "Includes 5 bonus pirate games.", price: "$2.99", numericPrice: 2.99 }] },
  "4": { title: "Pirate Island Party", ageGroup: "3-7", description: "A high-energy pirate-themed party with treasure hunts, pirate hats, and map-based activities.", image: "/images/parent/party-themes/party-pirate-island.png", files: [{ name: "Treasure map activity", type: "PDF" }, { name: "Pirate hats template", type: "PDF" }, { name: "Bandana craft sheet", type: "PDF" }, { name: "Cake toppers", type: "PNG" }, { name: "Party games sheet", type: "PDF" }], addOns: [{ id: "4-storytelling", title: "Live Remote Storytelling Session", description: "30-minute virtual session hosted by Mel.", price: "$9.99", numericPrice: 9.99 }, { id: "4-games", title: "Extra Printable Games Pack", description: "Includes 5 bonus pirate games.", price: "$2.99", numericPrice: 2.99 }] },
};

function FileBadge({ type }: { type: "PDF" | "PNG" }) {
  return <span style={{ fontSize: "9px", fontWeight: 700, fontFamily: "Inter, sans-serif", color: "#FFFFFF", background: type === "PDF" ? "#F04438" : "#737373", borderRadius: "3px", padding: "1px 4px", flexShrink: 0, lineHeight: "14px" }}>{type}</span>;
}

function Toast({ item, onClose }: { item: AddOn; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div style={{ position: "fixed", top: "24px", right: "24px", zIndex: 9999, background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "12px", padding: "16px", boxShadow: "0px 8px 24px rgba(16,24,40,0.12)", display: "flex", alignItems: "flex-start", gap: "12px", width: "340px", animation: "slideInRight 0.3s ease-out" }}>
      <style>{`@keyframes slideInRight { from { transform:translateX(120%); opacity:0; } to { transform:translateX(0); opacity:1; } }`}</style>
      <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#ECFDF3", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <CheckCircle size={18} style={{ color: "#12B76A" }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p className="font-nunito font-semibold" style={{ fontSize: "14px", color: "#141414", margin: 0 }}>Added to cart!</p>
        <p className="font-nunito font-normal" style={{ fontSize: "12px", color: "#525252", margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</p>
        <Link href="/parent/cart" className="font-nunito font-semibold" style={{ fontSize: "12px", color: "#F63D68", textDecoration: "none", display: "inline-block", marginTop: "6px" }}>View Cart →</Link>
      </div>
      <button onClick={onClose} style={{ background: "none", border: "none", padding: "2px", cursor: "pointer", color: "#A3A3A3", flexShrink: 0, display: "flex" }}><X size={16} /></button>
    </div>
  );
}

function AddOnCard({ addon, image, themeId }: { addon: AddOn; image: string; themeId: string }) {
  const { addItem } = useCart();
  const [toastItem, setToastItem] = useState<AddOn | null>(null);
  const closeToast = useCallback(() => setToastItem(null), []);
  const handleAddToCart = () => {
    addItem({ id: addon.id, title: addon.title, description: addon.description, price: addon.price, numericPrice: addon.numericPrice, image, themeId });
    setToastItem(addon);
  };
  return (
    <>
      {toastItem && <Toast item={toastItem} onClose={closeToast} />}
      <div style={{ flex: 1, border: "1px solid #E5E5E5", borderRadius: "12px", padding: "12px", display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{ width: "98px", height: "98px", borderRadius: "8px", border: "1px solid #E5E5E5", position: "relative", overflow: "hidden", flexShrink: 0 }}>
          <Image src={image} alt={addon.title} fill style={{ objectFit: "cover" }} />
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
          <span className="font-nunito font-semibold" style={{ fontSize: "16px", lineHeight: "24px", color: "#141414" }}>{addon.title}</span>
          <span className="font-nunito font-normal" style={{ fontSize: "12px", lineHeight: "18px", color: "#525252" }}>{addon.description}</span>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", marginTop: "4px" }}>
            <span className="font-nunito font-semibold" style={{ fontSize: "18px", lineHeight: "28px", color: "#292929" }}>{addon.price}</span>
            <button onClick={handleAddToCart} className="font-nunito font-bold" style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "8px", background: "#F63D68", border: "1px solid #F63D68", fontSize: "14px", color: "#FFFFFF", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", cursor: "pointer", whiteSpace: "nowrap" }}>
              <ShoppingCart size={15} /> Add to Cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function DiscountBanner() {
  return (
    <div style={{ position: "relative", height: "231px", borderRadius: "12px", border: "1px solid #E5E5E5", overflow: "hidden" }}>
      {/* Background image — same as dashboard promo banner */}
      <Image src="/images/parent/promo-banner-bg.png" alt="Promo banner" fill style={{ objectFit: "cover" }} priority />

      {/* Dark green gradient overlay — dense left, fades right */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(-90deg, rgba(9,29,2,0) 50%, rgba(9,29,2,1) 100%)" }} />

      {/* LEFT — MEGA sale text */}
      <div style={{ position: "absolute", left: "26px", top: "52px", width: "250px" }}>
        <div style={{ lineHeight: 1 }}>
          <div style={{ fontFamily: "var(--font-luckiest-guy), cursive", fontWeight: 400, fontSize: "52px", color: "#43FF59", lineHeight: 1 }}>MEGA</div>
          <div style={{ fontFamily: "var(--font-luckiest-guy), cursive", fontWeight: 400, fontSize: "64px", color: "#FFFFFF", lineHeight: 1, marginTop: "-4px" }}>sale</div>
        </div>
        <div style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif", fontWeight: 900, fontSize: "14px", color: "#FFFFFF", letterSpacing: "0.5px", marginTop: "6px" }}>
          LIMITED TIME OFFER
        </div>
        <div style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif", fontWeight: 400, fontSize: "12px", color: "#FFFFFF", marginTop: "4px" }}>
          Use code PARTY30 at checkout
        </div>
      </div>

      {/* CENTRE — dark olive circle with 30% OFF */}
      <div style={{ position: "absolute", left: "445px", top: "10px", width: "179px", height: "171px" }}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(39,63,0,0.84)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif", fontWeight: 700, fontSize: "42px", color: "#FFFFFF", lineHeight: 1 }}>30%</div>
          <div style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif", fontWeight: 700, fontSize: "42px", color: "#FFFFFF", lineHeight: 1 }}>OFF</div>
        </div>
      </div>

      {/* RIGHT — image card */}
      <div style={{ position: "absolute", right: "23px", top: "25px", width: "242px", height: "179px", borderRadius: "8px", border: "1px solid #F5F5F5", overflow: "hidden" }}>
        <Image src="/images/parent/promo-banner-right-card.png" alt="Promo offer" fill style={{ objectFit: "cover" }} />
      </div>

      {/* CTA button */}
      <div style={{ position: "absolute", bottom: "20px", left: "485px" }}>
        <Link href="/parent/cart" className="font-nunito font-bold"
          style={{ padding: "10px 14px", borderRadius: "8px", background: "#F63D68", border: "1px solid #F63D68", fontSize: "14px", lineHeight: "20px", color: "#FFFFFF", boxShadow: "0px 1px 2px 0px rgba(16,24,40,0.05)", cursor: "pointer", whiteSpace: "nowrap", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}>
          <ShoppingCart size={15} /> Shop Now
        </Link>
      </div>
    </div>
  );
}

export default function PartyThemeDetailPage({ params }: { params: { id: string } }) {
  const theme = themeData[params.id] ?? themeData["1"];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Link href="/parent/party-themes" className="font-nunito font-bold" style={{ fontSize: "14px", color: "#424242", textDecoration: "none" }}>Party Theme</Link>
        <ChevronRight size={16} style={{ color: "#737373" }} />
        <span className="font-nunito font-bold" style={{ fontSize: "14px", color: "#F63D68" }}>{theme.title}</span>
      </div>

      <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "24px" }}>
        <div style={{ position: "relative", width: "100%", height: "263px", borderRadius: "12px", border: "1px solid #E5E5E5", overflow: "hidden" }}>
          <Image src={theme.image} alt={theme.title} fill style={{ objectFit: "cover" }} priority />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="font-nunito font-semibold" style={{ fontSize: "12px", color: "#141414" }}>Age Group</span>
              <span className="font-nunito font-semibold" style={{ fontSize: "12px", color: "#525252" }}>{theme.ageGroup}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span className="font-nunito font-semibold" style={{ fontSize: "20px", lineHeight: "30px", color: "#141414" }}>{theme.title}</span>
              <span className="font-nunito font-normal" style={{ fontSize: "16px", lineHeight: "24px", color: "#525252" }}>{theme.description}</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <span className="font-nunito font-semibold" style={{ fontSize: "16px", color: "#141414" }}>Included Files</span>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {theme.files.map((file) => (
                <div key={file.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: "8px", border: "1px solid #E5E5E5", background: "#FAFAFA" }}>
                  <span className="font-nunito font-normal" style={{ fontSize: "12px", color: "#141414" }}>{file.name}</span>
                  <FileBadge type={file.type} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "16px" }}>
          <button className="font-nunito font-bold" style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #D6D6D6", background: "#FFFFFF", fontSize: "14px", color: "#424242", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", cursor: "pointer" }}>Download Individuals</button>
          <button className="font-nunito font-bold" style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #F63D68", background: "#F63D68", fontSize: "14px", color: "#FFFFFF", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", cursor: "pointer" }}>Download All</button>
        </div>
      </div>

      <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "24px" }}>
        <span className="font-nunito font-semibold" style={{ fontSize: "18px", lineHeight: "28px", color: "#141414" }}>Add More Fun to Your Party</span>
        <div style={{ display: "flex", gap: "24px" }}>
          {theme.addOns.map((addon) => (
            <AddOnCard key={addon.id} addon={addon} image={theme.image} themeId={params.id} />
          ))}
        </div>
      </div>

      <DiscountBanner />
    </div>
  );
}
