"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import {
  ChevronRight, UploadCloud,
  Bold, Italic, Underline, Strikethrough,
  AlignLeft, List, ListOrdered,
  Link2, Image as ImageIcon, Undo2, Redo2,
  Film,
} from "lucide-react";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { logActivity } from "@/lib/activity";

// ── Shared form primitives ──────────────────────────────────────

function FormLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="font-nunito font-semibold" style={{ fontSize: "14px", lineHeight: "20px", color: "#424242", display: "block" }}>
      {children}{required && <span style={{ color: "#F63D68" }}> *</span>}
    </label>
  );
}

function FormInput({ label, placeholder, value, onChange, required, disabled }: {
  label: string; placeholder: string; value: string;
  onChange: (v: string) => void; required?: boolean; disabled?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <FormLabel required={required}>{label}</FormLabel>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="font-nunito font-normal placeholder:text-gray-400 focus:outline-none"
        style={{
          height: "44px", padding: "10px 14px", borderRadius: "8px",
          border: "1px solid #E5E5E5", fontSize: "16px", color: "#141414",
          background: disabled ? "#F5F5F5" : "#FFFFFF", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
          width: "100%", boxSizing: "border-box",
        }}
      />
    </div>
  );
}

function FormSelect({ label, options, value, onChange, required, disabled }: {
  label: string; options: string[]; value: string;
  onChange: (v: string) => void; required?: boolean; disabled?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1, minWidth: 0 }}>
      <FormLabel required={required}>{label}</FormLabel>
      <div style={{ position: "relative" }}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="font-nunito font-normal focus:outline-none"
          style={{
            height: "44px", padding: "10px 14px", paddingRight: "40px",
            borderRadius: "8px", border: "1px solid #E5E5E5", fontSize: "16px",
            color: value ? "#141414" : "#737373",
            background: disabled ? "#F5F5F5" : "#FFFFFF",
            boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
            width: "100%", cursor: "pointer", appearance: "none",
          }}
        >
          <option value="" disabled>Choose</option>
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

// ── Card wrapper ────────────────────────────────────────────────

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

// ── Rich-text toolbar ───────────────────────────────────────────

const TOOLBAR_GROUPS = [
  [
    { icon: Bold,          label: "Bold" },
    { icon: Italic,        label: "Italic" },
    { icon: Underline,     label: "Underline" },
    { icon: Strikethrough, label: "Strikethrough" },
  ],
  [
    { icon: AlignLeft,    label: "Align left" },
    { icon: List,         label: "Bullet list" },
    { icon: ListOrdered,  label: "Numbered list" },
  ],
  [
    { icon: Link2,     label: "Insert link" },
    { icon: ImageIcon, label: "Insert image" },
  ],
  [
    { icon: Undo2, label: "Undo" },
    { icon: Redo2, label: "Redo" },
  ],
];

function RichTextToolbar() {
  return (
    <div
      style={{
        display: "flex", alignItems: "center", flexWrap: "wrap",
        gap: "2px", padding: "10px 14px",
        background: "#FAFAFA", borderBottom: "1px solid #E5E5E5",
        borderRadius: "8px 8px 0 0",
      }}
    >
      {TOOLBAR_GROUPS.map((group, gi) => (
        <div key={gi} style={{ display: "flex", alignItems: "center", gap: "2px" }}>
          {group.map(({ icon: Icon, label }) => (
            <button
              key={label}
              type="button"
              title={label}
              style={{
                width: "30px", height: "30px", display: "flex", alignItems: "center",
                justifyContent: "center", borderRadius: "4px", border: "none",
                background: "none", cursor: "pointer", color: "#525252", flexShrink: 0,
              }}
            >
              <Icon size={15} />
            </button>
          ))}
          {gi < TOOLBAR_GROUPS.length - 1 && (
            <div style={{ width: "1px", height: "18px", background: "#E5E5E5", margin: "0 6px" }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Options ─────────────────────────────────────────────────────

const AGE_OPTIONS      = ["3-4", "5-6", "7-8", "N/A"];
const CATEGORY_OPTIONS = ["Magical", "Space", "Adventure", "Ocean", "Jungle"];

// ── Page ────────────────────────────────────────────────────────

export default function AddVideoPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({ name: "", age: "", category: "", description: "" });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleFileSelect = (file: File) => {
    if (!file.type.includes("video/")) {
      alert("Please select a valid video file (MP4 recommended).");
      return;
    }
    const maxBytes = 200 * 1024 * 1024; // 200 MB
    if (file.size > maxBytes) {
      alert("File size exceeds 200MB limit.");
      return;
    }
    setVideoFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const onSave = async (status: "Published" | "Draft") => {
    if (!form.name || isSaving) return;
    setIsSaving(true);
    let videoUrl = "";

    try {
      if (videoFile) {
        setUploadProgress("Uploading video...");
        const storageRef = ref(storage, `videos/${Date.now()}_${videoFile.name}`);
        const snapshot = await uploadBytes(storageRef, videoFile);
        videoUrl = await getDownloadURL(snapshot.ref);
        setUploadProgress(null);
      }

      const docData = {
        title: form.name,
        age: form.age || "N/A",
        category: form.category || "Uncategorized",
        description: form.description,
        videoUrl,
        status,
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp(),
      };

      await addDoc(collection(db, "videos"), docData);

      await logActivity({
        type: "Video",
        activity: `"${form.name}" video ${status === "Draft" ? "saved as draft" : "published"}`,
        targetName: form.name,
        changes: [`Status: ${status}`, `Category: ${form.category}`],
      });

      router.push("/admin/videos");
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Error saving video:", error);
      alert(`Failed to save video: ${error?.message || "Unknown error"}`);
    } finally {
      setIsSaving(false);
      setUploadProgress(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Breadcrumb + Actions */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link
            href="/admin/videos"
            className="font-nunito font-bold"
            style={{ fontSize: "14px", color: "#424242", textDecoration: "none" }}
          >
            Video
          </Link>
          <ChevronRight size={16} style={{ color: "#A3A3A3", flexShrink: 0 }} />
          <span className="font-nunito font-bold" style={{ fontSize: "14px", color: "#F63D68" }}>
            Add Video
          </span>
        </div>

        <div style={{ display: "flex", gap: "12px", flexShrink: 0 }}>
          <button
            type="button"
            disabled={isSaving}
            onClick={() => onSave("Draft")}
            className="font-nunito font-bold"
            style={{
              padding: "10px 14px", borderRadius: "8px",
              border: "1px solid #D6D6D6", background: "#FFFFFF",
              fontSize: "14px", color: "#424242", cursor: "pointer",
              boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
              opacity: isSaving ? 0.7 : 1,
            }}
          >
            Save As Draft
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={() => onSave("Published")}
            className="font-nunito font-bold"
            style={{
              padding: "10px 14px", borderRadius: "8px",
              border: "1px solid #F63D68", background: "#F63D68",
              fontSize: "14px", color: "#FFFFFF", cursor: "pointer",
              boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
              opacity: isSaving ? 0.7 : 1,
            }}
          >
            {uploadProgress || (isSaving ? "Saving..." : "Publish")}
          </button>
        </div>
      </div>

      {/* Form cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* Basic Information */}
        <Card title="Basic Information">
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <FormInput
              label="Product Name"
              placeholder="Enter name"
              value={form.name}
              onChange={set("name")}
              required
              disabled={isSaving}
            />
            <div style={{ display: "flex", gap: "20px" }}>
              <FormSelect label="Age" options={AGE_OPTIONS} value={form.age} onChange={set("age")} required disabled={isSaving} />
              <FormSelect label="Category" options={CATEGORY_OPTIONS} value={form.category} onChange={set("category")} required disabled={isSaving} />
            </div>
          </div>
        </Card>

        {/* Upload Video */}
        <Card title="Upload Video">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => !isSaving && fileInputRef.current?.click()}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: "12px",
              padding: "16px 24px", borderRadius: "8px",
              border: `1px solid ${dragging ? "#F63D68" : "#E5E5E5"}`,
              background: dragging ? "#FFF5F6" : "#FFFFFF",
              cursor: isSaving ? "default" : "pointer",
              textAlign: "center", transition: "border-color 0.15s, background 0.15s",
              opacity: isSaving ? 0.7 : 1,
            }}
          >
            {videoFile ? (
              /* Video selected state */
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                <div style={{
                  width: "48px", height: "48px", borderRadius: "8px",
                  background: "#FFF1F3", border: "1px solid #FECDDA",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Film size={24} style={{ color: "#F63D68" }} />
                </div>
                <p className="font-nunito font-semibold" style={{ fontSize: "14px", color: "#141414", margin: 0 }}>
                  {videoFile.name}
                </p>
                <p className="font-nunito font-normal" style={{ fontSize: "12px", color: "#525252", margin: 0 }}>
                  {formatFileSize(videoFile.size)} — Click to change
                </p>
              </div>
            ) : (
              /* Empty upload state */
              <>
                <div style={{
                  width: "40px", height: "40px", borderRadius: "8px",
                  border: "1px solid #EAECF0", background: "#FFFFFF",
                  boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <UploadCloud size={20} style={{ color: "#525252" }} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <span className="font-nunito font-bold" style={{ fontSize: "14px", color: "#F63D68" }}>
                      Click to upload
                    </span>
                    <span className="font-nunito font-normal" style={{ fontSize: "12px", color: "#525252" }}>
                      or drag and drop
                    </span>
                  </div>
                  <span className="font-nunito font-normal" style={{ fontSize: "12px", color: "#525252", textAlign: "center" }}>
                    mp4 max size should be 200MB
                  </span>
                </div>
              </>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/*"
              style={{ display: "none" }}
              onChange={(e) => { if (e.target.files?.[0]) handleFileSelect(e.target.files[0]); }}
            />
          </div>
        </Card>

        {/* Summary / Description */}
        <Card title="Summary">
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <FormLabel>Description</FormLabel>
            <div style={{
              border: "1px solid #E5E5E5", borderRadius: "8px", overflow: "hidden",
              boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", display: "flex", flexDirection: "column",
            }}>
              <RichTextToolbar />
              <textarea
                placeholder="Enter a description..."
                value={form.description}
                onChange={(e) => set("description")(e.target.value)}
                disabled={isSaving}
                className="font-nunito font-normal placeholder:text-gray-400 focus:outline-none"
                style={{
                  width: "100%", minHeight: "180px", padding: "12px 14px",
                  fontSize: "16px", color: "#141414", background: isSaving ? "#F5F5F5" : "#FFFFFF",
                  border: "none", resize: "vertical", boxSizing: "border-box", display: "block",
                }}
              />
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
}
