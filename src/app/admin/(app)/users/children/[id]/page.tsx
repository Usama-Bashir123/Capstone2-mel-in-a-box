"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronRight, Mail, Phone, Calendar, User } from "lucide-react";

// ── Shared mock data (mirrors users/page.tsx) ─────────────────────

const PARENTS = [
  { id: "1", name: "Sarah Johnson",   email: "sarah.j@gmail.com",   phone: "+1 234 567 8901", status: "Active",   joined: "Jan 15, 2025" },
  { id: "2", name: "Michael Chen",    email: "m.chen@gmail.com",     phone: "+1 234 567 8902", status: "Active",   joined: "Feb 03, 2025" },
  { id: "3", name: "Emily Rodriguez", email: "emily.r@gmail.com",    phone: "+1 234 567 8903", status: "Inactive", joined: "Feb 18, 2025" },
  { id: "4", name: "James Williams",  email: "j.williams@gmail.com", phone: "+1 234 567 8904", status: "Active",   joined: "Mar 01, 2025" },
  { id: "5", name: "Aisha Patel",     email: "aisha.p@gmail.com",    phone: "+1 234 567 8905", status: "Active",   joined: "Mar 12, 2025" },
  { id: "6", name: "Daniel Kim",      email: "d.kim@gmail.com",      phone: "+1 234 567 8906", status: "Inactive", joined: "Mar 20, 2025" },
  { id: "7", name: "Laura Thompson",  email: "laura.t@gmail.com",    phone: "+1 234 567 8907", status: "Active",   joined: "Apr 02, 2025" },
  { id: "8", name: "Omar Hassan",     email: "omar.h@gmail.com",     phone: "+1 234 567 8908", status: "Active",   joined: "Apr 10, 2025" },
];

const CHILDREN = [
  { id: "1", name: "Emma Johnson",     age: 5, gender: "Female", parentId: "1", status: "Active",   joined: "Jan 15, 2025" },
  { id: "2", name: "Liam Johnson",     age: 7, gender: "Male",   parentId: "1", status: "Active",   joined: "Jan 15, 2025" },
  { id: "3", name: "Noah Chen",        age: 6, gender: "Male",   parentId: "2", status: "Active",   joined: "Feb 03, 2025" },
  { id: "4", name: "Mia Rodriguez",    age: 4, gender: "Female", parentId: "3", status: "Inactive", joined: "Feb 18, 2025" },
  { id: "5", name: "Sophia Rodriguez", age: 8, gender: "Female", parentId: "3", status: "Active",   joined: "Feb 18, 2025" },
  { id: "6", name: "Lucas Williams",   age: 5, gender: "Male",   parentId: "4", status: "Active",   joined: "Mar 01, 2025" },
  { id: "7", name: "Zara Patel",       age: 6, gender: "Female", parentId: "5", status: "Active",   joined: "Mar 12, 2025" },
  { id: "8", name: "Aiden Kim",        age: 9, gender: "Male",   parentId: "6", status: "Inactive", joined: "Mar 20, 2025" },
];

const AVATAR_COLORS = [
  { bg: "#FFF1F3", text: "#F63D68" },
  { bg: "#F0F4FF", text: "#444CE7" },
  { bg: "#ECFDF3", text: "#067647" },
  { bg: "#FFFAEB", text: "#B54708" },
  { bg: "#F0F9FF", text: "#026AA2" },
  { bg: "#FDF4FF", text: "#6941C6" },
  { bg: "#FFF7ED", text: "#C4320A" },
  { bg: "#F0FDF4", text: "#15803D" },
];

// ── Primitives ────────────────────────────────────────────────────

function Avatar({ name, size = 80, index = 0 }: { name: string; size?: number; index?: number }) {
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
  const { bg, text } = AVATAR_COLORS[index % AVATAR_COLORS.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: bg, color: text, flexShrink: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.36, fontWeight: 700, fontFamily: "Nunito, sans-serif",
      border: "2px solid rgba(0,0,0,0.06)",
    }}>
      {initials}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const active = status === "Active";
  return (
    <span
      className="font-nunito font-semibold"
      style={{
        display: "inline-flex", alignItems: "center", width: "fit-content",
        whiteSpace: "nowrap", fontSize: "12px", lineHeight: "18px",
        padding: "2px 10px", borderRadius: "9999px",
        background: active ? "#ECFDF3" : "#F2F4F7",
        border: `1px solid ${active ? "#ABEFC6" : "#D0D5DD"}`,
        color: active ? "#067647" : "#525252",
      }}
    >
      {status}
    </span>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <div style={{
        width: "36px", height: "36px", borderRadius: "8px",
        background: "#FFF1F3", border: "1px solid #FFE0E7",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <Icon size={16} style={{ color: "#F63D68" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
        <span className="font-nunito font-normal" style={{ fontSize: "12px", color: "#A3A3A3" }}>{label}</span>
        <span className="font-nunito font-medium" style={{ fontSize: "14px", color: "#141414" }}>{value}</span>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────

export default function ChildDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const child = CHILDREN.find((c) => c.id === id);
  const childIndex = CHILDREN.findIndex((c) => c.id === id);

  const parent = child ? PARENTS.find((p) => p.id === child.parentId) : null;
  const parentIndex = parent ? PARENTS.findIndex((p) => p.id === child?.parentId) : 0;

  if (!child) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "300px", gap: "12px" }}>
        <p className="font-nunito font-semibold" style={{ fontSize: "18px", color: "#141414" }}>Child not found</p>
        <Link href="/admin/users" className="font-nunito font-semibold" style={{ fontSize: "14px", color: "#F63D68", textDecoration: "none" }}>
          ← Back to Users
        </Link>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Link href="/admin/users" className="font-nunito font-bold" style={{ fontSize: "14px", color: "#424242", textDecoration: "none" }}>
          Users
        </Link>
        <ChevronRight size={16} style={{ color: "#A3A3A3", flexShrink: 0 }} />
        <span className="font-nunito font-bold" style={{ fontSize: "14px", color: "#F63D68" }}>
          {child.name}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* ── Child profile card ── */}
        <div style={{
          background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "12px",
          padding: "24px", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
        }}>
          <h3 className="font-nunito font-semibold" style={{ fontSize: "18px", lineHeight: "28px", color: "#141414", margin: "0 0 20px 0" }}>
            Child Information
          </h3>

          <div style={{ display: "flex", alignItems: "flex-start", gap: "24px", flexWrap: "wrap" }}>
            {/* Avatar */}
            <Avatar name={child.name} size={88} index={childIndex + 2} />

            {/* Details grid */}
            <div style={{ flex: 1, minWidth: "260px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              {/* Name + status spans full width */}
              <div style={{ gridColumn: "1 / -1" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                  <span className="font-nunito font-bold" style={{ fontSize: "22px", color: "#141414" }}>
                    {child.name}
                  </span>
                  <StatusBadge status={child.status} />
                </div>
              </div>

              <InfoRow icon={User}     label="Age"         value={`${child.age} years old`} />
              <InfoRow icon={User}     label="Gender"      value={child.gender}              />
              <InfoRow icon={Calendar} label="Date Joined" value={child.joined}              />
            </div>
          </div>
        </div>

        {/* ── Parent information card ── */}
        {parent && (
          <div style={{
            background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "12px",
            padding: "24px", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <h3 className="font-nunito font-semibold" style={{ fontSize: "18px", lineHeight: "28px", color: "#141414", margin: 0 }}>
                Parent Information
              </h3>
              <Link
                href={`/admin/users/parents/${parent.id}`}
                className="font-nunito font-semibold"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "6px",
                  padding: "8px 14px", borderRadius: "8px",
                  border: "1px solid #F63D68", background: "transparent",
                  fontSize: "13px", color: "#F63D68", textDecoration: "none",
                  boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
                }}
              >
                View Profile
                <ChevronRight size={14} />
              </Link>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: "24px", flexWrap: "wrap" }}>
              {/* Parent avatar */}
              <Avatar name={parent.name} size={64} index={parentIndex} />

              {/* Parent details grid */}
              <div style={{ flex: 1, minWidth: "260px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                {/* Name + status */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                    <span className="font-nunito font-bold" style={{ fontSize: "18px", color: "#141414" }}>
                      {parent.name}
                    </span>
                    <StatusBadge status={parent.status} />
                  </div>
                </div>

                <InfoRow icon={Mail}     label="Email Address" value={parent.email}  />
                <InfoRow icon={Phone}    label="Phone Number"  value={parent.phone}  />
                <InfoRow icon={Calendar} label="Date Joined"   value={parent.joined} />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
