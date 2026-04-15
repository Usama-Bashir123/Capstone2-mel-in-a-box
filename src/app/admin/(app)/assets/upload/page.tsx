"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { ChevronRight, UploadCloud, Upload } from "lucide-react";

// ── Shared primitives (mirrors stories/add pattern) ───────────────

function FormLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="font-nunito font-semibold" style={{ fontSize: "14px", lineHeight: "20px", color: "#424242", display: "block" }}>
      {children}{required && <span style={{ color: "#F63D68" }}> *</span>}
    </label>
  );
}

function FormInput({
  label, placeholder, value, onChange, required,
}: { label: string; placeholder: string; value: string; onChange: (v: string) => void; required?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <FormLabel required={required}>{label}</FormLabel>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="font-nunito font-normal placeholder:text-gray-400 focus:outline-none"
        style={{
          height: "44px", padding: "10px 14px", borderRadius: "8px",
          border: "1px solid #E5E5E5", fontSize: "16px", color: "#141414",
          background: "#FFFFFF", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
          width: "100%", boxSizing: "border-box",
        }}
      />
    </div>
  );
}

function FormSelect({
  label, options, value, onChange, placeholder, required,
}: { label: string; options: string[]; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <FormLabel required={required}>{label}</FormLabel>
      <div style={{ position: "relative" }}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="font-nunito font-normal focus:outline-none"
          style={{
            height: "44px", padding: "10px 14px", paddingRight: "40px",
            borderRadius: "8px", border: "1px solid #E5E5E5", fontSize: "16px",
            color: value ? "#141414" : "#737373",
            background: "#FFFFFF", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
            width: "100%", cursor: "pointer", appearance: "none",
            boxSizing: "border-box",
          }}
        >
          <option value="" disabled>{placeholder ?? "Choose"}</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronRight
          size={16}
          style={{
            position: "absolute", right: "14px", top: "50%",
            transform: "translateY(-50%) rotate(90deg)",
            color: "#A3A3A3", pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "12px",
      padding: "20px", display: "flex", flexDirection: "column", gap: "24px",
    }}>
      <h3 className="font-nunito font-semibold" style={{ fontSize: "18px", lineHeight: "28px", color: "#141414", margin: 0 }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

// ── Options ───────────────────────────────────────────────────────
const ASSET_TYPE_OPTIONS = ["Images", "Backgrounds", "Characters", "Icons", "Audio", "Videos"];

// ── Page ──────────────────────────────────────────────────────────
export default function UploadAssetPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "", assetType: "", description: "", linkStory: "", linkGame: "",
  });
  const [file, setFile]           = useState<File | null>(null);
  const [dragging, setDragging]   = useState(false);

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleFileSelect = (f: File) => setFile(f);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFileSelect(f);
  };

  void file; // will be used when API is wired

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Breadcrumb + action buttons */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link
            href="/admin/assets"
            className="font-nunito font-bold"
            style={{ fontSize: "14px", color: "#424242", textDecoration: "none" }}
          >
            Assets Library
          </Link>
          <ChevronRight size={16} style={{ color: "#A3A3A3", flexShrink: 0 }} />
          <span className="font-nunito font-bold" style={{ fontSize: "14px", color: "#F63D68" }}>
            Upload New Asset
          </span>
        </div>

        <div style={{ display: "flex", gap: "12px", flexShrink: 0 }}>
          <button
            type="button"
            onClick={() => router.push("/admin/assets")}
            className="font-nunito font-bold"
            style={{
              padding: "10px 14px", borderRadius: "8px",
              border: "1px solid #D6D6D6", background: "#FFFFFF",
              fontSize: "14px", color: "#424242", cursor: "pointer",
              boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/assets")}
            className="font-nunito font-bold"
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "10px 14px", borderRadius: "8px",
              border: "1px solid #F63D68", background: "#F63D68",
              fontSize: "14px", color: "#FFFFFF", cursor: "pointer",
              boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
            }}
          >
            <Upload size={15} /> Upload
          </button>
        </div>
      </div>

      {/* ── Cards ────────────────────────────────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* 1. Upload File */}
        <Card title="Upload File">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: "12px",
              padding: "32px 24px", borderRadius: "8px",
              border: `2px dashed ${dragging ? "#F63D68" : "#E5E5E5"}`,
              background: dragging ? "#FFF5F6" : "#FAFAFA",
              cursor: "pointer", textAlign: "center",
              transition: "border-color 0.15s, background 0.15s",
            }}
          >
            <div style={{
              width: "48px", height: "48px", borderRadius: "10px",
              border: "1px solid #EAECF0", background: "#FFFFFF",
              boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <UploadCloud size={22} style={{ color: "#525252" }} />
            </div>

            {file ? (
              <span className="font-nunito font-semibold" style={{ fontSize: "14px", color: "#141414" }}>
                {file.name}
              </span>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span className="font-nunito font-bold" style={{ fontSize: "14px", color: "#F63D68" }}>
                    Click to upload
                  </span>
                  <span className="font-nunito font-normal" style={{ fontSize: "14px", color: "#525252" }}>
                    or drag and drop
                  </span>
                </div>
                <span className="font-nunito font-normal" style={{ fontSize: "12px", color: "#737373" }}>
                  SVG, PNG, JPG, MP3 or MP4 (max. 800×400px)
                </span>
              </>
            )}

            <input
              ref={fileInputRef}
              type="file"
              style={{ display: "none" }}
              accept=".svg,.png,.jpg,.jpeg,.mp3,.mp4"
              onChange={(e) => { if (e.target.files?.[0]) handleFileSelect(e.target.files[0]); }}
            />
          </div>
        </Card>

        {/* 2. Asset Details */}
        <Card title="Asset Details">
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <FormInput
              label="Name"
              placeholder="Enter asset name"
              value={form.name}
              onChange={set("name")}
              required
            />
            <FormSelect
              label="Asset Type"
              options={ASSET_TYPE_OPTIONS}
              value={form.assetType}
              onChange={set("assetType")}
              placeholder="Select asset type"
              required
            />
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <FormLabel>Description</FormLabel>
              <textarea
                placeholder="Enter a description..."
                value={form.description}
                onChange={(e) => set("description")(e.target.value)}
                className="font-nunito font-normal placeholder:text-gray-400 focus:outline-none"
                style={{
                  width: "100%", minHeight: "120px", padding: "12px 14px",
                  borderRadius: "8px", border: "1px solid #E5E5E5",
                  fontSize: "16px", color: "#141414", background: "#FFFFFF",
                  boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
                  resize: "vertical", boxSizing: "border-box",
                  lineHeight: "24px",
                }}
              />
            </div>
          </div>
        </Card>

        {/* 3. Link To */}
        <Card title="Link To">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <FormInput
              label="Link to Story"
              placeholder="Select or search a story"
              value={form.linkStory}
              onChange={set("linkStory")}
            />
            <FormInput
              label="Link to Game"
              placeholder="Select or search a game"
              value={form.linkGame}
              onChange={set("linkGame")}
            />
          </div>
        </Card>

      </div>
    </div>
  );
}
