"use client";

// Add Child Screen — Figma node 214:15075
// Breadcrumb: "Child Profile" > "Add Child"
// Action buttons: Cancel + Save (top right)
// Card 1: Child Information (Name, DOB, Gender)
// Card 2: Learning Preferences (Language, Content Type)
// Card 3: Upload Avatar (file upload drop zone)

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Upload } from "lucide-react";

/* ── Form Input ────────────────────────────────────────── */
function FormInput({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
      <label className="font-nunito font-medium" style={{ fontSize: "14px", lineHeight: "20px", color: "#344054" }}>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="font-nunito font-normal placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300"
        style={{
          height: "44px",
          padding: "10px 14px",
          borderRadius: "8px",
          border: "1px solid #E5E5E5",
          fontSize: "16px",
          lineHeight: "24px",
          color: "#141414",
          background: "#FFFFFF",
          boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
          width: "100%",
        }}
      />
    </div>
  );
}

/* ── Form Select ───────────────────────────────────────── */
function FormSelect({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
      <label className="font-nunito font-medium" style={{ fontSize: "14px", lineHeight: "20px", color: "#344054" }}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="font-nunito font-normal focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300"
        style={{
          height: "44px",
          padding: "10px 14px",
          borderRadius: "8px",
          border: "1px solid #E5E5E5",
          fontSize: "16px",
          lineHeight: "24px",
          color: value ? "#141414" : "#737373",
          background: "#FFFFFF",
          boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
          width: "100%",
          cursor: "pointer",
        }}
      >
        <option value="" disabled>Select {label}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

/* ── Section Card ──────────────────────────────────────── */
function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "24px" }}>
      <h3 className="font-nunito font-semibold" style={{ fontSize: "18px", lineHeight: "28px", color: "#141414" }}>{title}</h3>
      {children}
    </div>
  );
}

/* ── Preference Toggle ─────────────────────────────────── */
function PrefToggle({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <span className="font-nunito font-medium" style={{ fontSize: "14px", lineHeight: "20px", color: "#344054" }}>{label}</span>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className="font-nunito font-medium"
            style={{
              padding: "6px 14px", borderRadius: "8px", fontSize: "14px", cursor: "pointer", border: "1px solid",
              borderColor: value === o ? "#F63D68" : "#E5E5E5",
              background: value === o ? "#FFF1F3" : "#FFFFFF",
              color: value === o ? "#F63D68" : "#424242",
              transition: "all 0.15s",
            }}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────── */
export default function AddChildPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "", dob: "", gender: "", language: "", contentType: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) setAvatarFile(file);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Breadcrumb + Actions */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href="/parent/children" className="font-nunito font-bold" style={{ fontSize: "14px", lineHeight: "20px", color: "#424242", textDecoration: "none" }}>
            Child Profile
          </Link>
          <ChevronRight size={16} style={{ color: "#737373" }} />
          <span className="font-nunito font-bold" style={{ fontSize: "14px", lineHeight: "20px", color: "#F63D68" }}>
            Add Child
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            onClick={() => router.back()}
            className="font-nunito font-bold"
            style={{
              padding: "10px 14px", borderRadius: "8px", border: "1px solid #D6D6D6",
              background: "#FFFFFF", fontSize: "14px", lineHeight: "20px", color: "#424242",
              boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => router.push("/parent/children")}
            className="font-nunito font-bold text-white"
            style={{
              padding: "10px 14px", borderRadius: "8px", border: "1px solid #F63D68",
              background: "#F63D68", fontSize: "14px", lineHeight: "20px",
              boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", cursor: "pointer",
            }}
          >
            Save
          </button>
        </div>
      </div>

      {/* Card 1 — Child Information */}
      <SectionCard title="Child Information">
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <FormInput label="Full Name" placeholder="Enter child's full name" value={form.name} onChange={set("name")} />
          <div style={{ display: "flex", gap: "20px" }}>
            <FormInput label="Date of Birth" placeholder="DD / MM / YYYY" type="date" value={form.dob} onChange={set("dob")} />
            <FormSelect label="Gender" options={["Male", "Female", "Prefer not to say"]} value={form.gender} onChange={set("gender")} />
          </div>
        </div>
      </SectionCard>

      {/* Card 2 — Learning Preferences */}
      <SectionCard title="Learning Preferences">
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <PrefToggle
            label="Preferred Language"
            options={["English", "Arabic", "French", "Spanish"]}
            value={form.language}
            onChange={set("language")}
          />
          <PrefToggle
            label="Content Type"
            options={["Stories", "Games", "Both"]}
            value={form.contentType}
            onChange={set("contentType")}
          />
        </div>
      </SectionCard>

      {/* Card 3 — Upload Avatar */}
      <SectionCard title="Upload Avatar">
        <div style={{ display: "flex", alignItems: "flex-start", gap: "24px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
            <span className="font-nunito font-semibold" style={{ fontSize: "14px", lineHeight: "20px", color: "#424242" }}>Your avatar</span>
            <span className="font-nunito font-normal" style={{ fontSize: "14px", lineHeight: "20px", color: "#737373" }}>This will be displayed on child avatar.</span>
          </div>
          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            style={{
              flex: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              padding: "16px 24px",
              borderRadius: "8px",
              border: `1px dashed ${dragging ? "#F63D68" : "#E5E5E5"}`,
              background: dragging ? "#FFF5F6" : "#FFFFFF",
              cursor: "pointer",
              textAlign: "center",
              transition: "all 0.15s",
            }}
            onClick={() => document.getElementById("avatar-upload")?.click()}
          >
            <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "#FFF1F3", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "4px" }}>
              <Upload size={20} style={{ color: "#F63D68" }} />
            </div>
            {avatarFile ? (
              <span className="font-nunito font-semibold" style={{ fontSize: "14px", color: "#F63D68" }}>{avatarFile.name}</span>
            ) : (
              <>
                <span className="font-nunito font-semibold" style={{ fontSize: "14px", color: "#F63D68" }}>Click to upload <span style={{ color: "#525252", fontWeight: 400 }}>or drag and drop</span></span>
                <span className="font-nunito font-normal" style={{ fontSize: "12px", color: "#737373" }}>SVG, PNG, JPG or GIF (max. 800×400px)</span>
              </>
            )}
            <input id="avatar-upload" type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { if (e.target.files?.[0]) setAvatarFile(e.target.files[0]); }} />
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
