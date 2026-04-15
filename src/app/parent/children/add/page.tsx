"use client";

// Add Child — Wired to Firestore + Firebase Storage
// Firestore path: users/{uid}/children
// Avatar: uploaded to Firebase Storage → download URL stored in Firestore

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Upload, Loader2, X } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { useAuth } from "@/components/auth/auth-context";

// ── Shared UI ──────────────────────────────────────────────
function FormInput({ label, placeholder, type = "text", value, onChange, required }: {
  label: string; placeholder: string; type?: string; value: string; onChange: (v: string) => void; required?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
      <label className="font-nunito font-medium" style={{ fontSize: "14px", lineHeight: "20px", color: "#344054" }}>
        {label}{required && <span style={{ color: "#F63D68" }}> *</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="font-nunito font-normal placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300"
        style={{ height: "44px", padding: "10px 14px", borderRadius: "8px", border: "1px solid #E5E5E5", fontSize: "16px", lineHeight: "24px", color: "#141414", background: "#FFFFFF", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", width: "100%" }}
      />
    </div>
  );
}

function FormSelect({ label, options, value, onChange, required }: {
  label: string; options: string[]; value: string; onChange: (v: string) => void; required?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
      <label className="font-nunito font-medium" style={{ fontSize: "14px", lineHeight: "20px", color: "#344054" }}>
        {label}{required && <span style={{ color: "#F63D68" }}> *</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="font-nunito font-normal focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300"
        style={{ height: "44px", padding: "10px 14px", borderRadius: "8px", border: "1px solid #E5E5E5", fontSize: "16px", lineHeight: "24px", color: value ? "#141414" : "#737373", background: "#FFFFFF", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", width: "100%", cursor: "pointer" }}
      >
        <option value="" disabled>Select {label}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "24px" }}>
      <h3 className="font-nunito font-semibold" style={{ fontSize: "18px", lineHeight: "28px", color: "#141414" }}>{title}</h3>
      {children}
    </div>
  );
}

function PrefToggle({ label, options, value, onChange }: {
  label: string; options: string[]; value: string; onChange: (v: string) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <span className="font-nunito font-medium" style={{ fontSize: "14px", lineHeight: "20px", color: "#344054" }}>{label}</span>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            className="font-nunito font-medium"
            style={{ padding: "6px 14px", borderRadius: "8px", fontSize: "14px", cursor: "pointer", border: "1px solid", borderColor: value === o ? "#F63D68" : "#E5E5E5", background: value === o ? "#FFF1F3" : "#FFFFFF", color: value === o ? "#F63D68" : "#424242", transition: "all 0.15s" }}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────
export default function AddChildPage() {
  const router = useRouter();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({ name: "", dob: "", gender: "", language: "English", contentType: "Both" });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleFileSelect = (file: File) => {
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleFileSelect(file);
  };

  const handleSubmit = async () => {
    if (!user?.uid) return;
    if (!form.name.trim() || !form.dob || !form.gender) {
      setError("Please fill in Name, Date of Birth, and Gender.");
      return;
    }
    setError(null);
    setIsSubmitting(true);

    try {
      let photoURL = "";

      // Upload avatar to Firebase Storage if provided
      if (avatarFile) {
        try {
          const path = `avatars/${user.uid}/${Date.now()}_${avatarFile.name}`;
          const sRef = storageRef(storage, path);
          await uploadBytes(sRef, avatarFile);
          photoURL = await getDownloadURL(sRef);
        } catch (storageErr: any) {
          const code = storageErr?.code || storageErr?.message || "unknown";
          console.error("Storage upload failed:", storageErr);
          setError(
            `Photo upload failed (${code}). Child profile will be created without a photo. ` +
            `Fix Storage rules in Firebase Console → Storage → Rules.`
          );
          // Still proceed to create the profile without a photo
        }
      }

      // Save profile to Firestore (always runs)
      await addDoc(collection(db, "users", user.uid, "children"), {
        name: form.name.trim(),
        dob: form.dob,
        gender: form.gender,
        language: form.language,
        contentType: form.contentType,
        photoURL,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      router.push("/parent/children");
    } catch (err: any) {
      const code = err?.code || err?.message || "unknown";
      console.error("Error saving child:", err);
      setError(`Failed to save profile (${code}). Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
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
          <span className="font-nunito font-bold" style={{ fontSize: "14px", lineHeight: "20px", color: "#F63D68" }}>Add Child</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            type="button"
            onClick={() => router.back()}
            className="font-nunito font-bold"
            style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #D6D6D6", background: "#FFFFFF", fontSize: "14px", lineHeight: "20px", color: "#424242", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", cursor: "pointer" }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="font-nunito font-bold text-white"
            style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #F63D68", background: "#F63D68", fontSize: "14px", lineHeight: "20px", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", opacity: isSubmitting ? 0.7 : 1 }}
          >
            {isSubmitting ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : "Save"}
          </button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div style={{ background: "#FFF1F3", border: "1px solid #FECDD6", borderRadius: "8px", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
          <span className="font-nunito font-medium" style={{ fontSize: "14px", color: "#F04438" }}>{error}</span>
          <button onClick={() => setError(null)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}>
            <X size={16} style={{ color: "#F04438" }} />
          </button>
        </div>
      )}

      {/* Card 1 — Child Information */}
      <SectionCard title="Child Information">
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <FormInput label="Full Name" placeholder="Enter child's full name" value={form.name} onChange={set("name")} required />
          <div style={{ display: "flex", gap: "20px" }}>
            <FormInput label="Date of Birth" placeholder="YYYY-MM-DD" type="date" value={form.dob} onChange={set("dob")} required />
            <FormSelect label="Gender" options={["Male", "Female", "Prefer not to say"]} value={form.gender} onChange={set("gender")} required />
          </div>
        </div>
      </SectionCard>

      {/* Card 2 — Learning Preferences */}
      <SectionCard title="Learning Preferences">
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <PrefToggle label="Preferred Language" options={["English", "Arabic", "French", "Spanish"]} value={form.language} onChange={set("language")} />
          <PrefToggle label="Content Type" options={["Stories", "Games", "Both"]} value={form.contentType} onChange={set("contentType")} />
        </div>
      </SectionCard>

      {/* Card 3 — Upload Avatar */}
      <SectionCard title="Upload Avatar">
        <div style={{ display: "flex", alignItems: "flex-start", gap: "24px" }}>
          {/* Preview */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }}>
            <div style={{ width: "80px", height: "80px", borderRadius: "12px", overflow: "hidden", border: "1px solid #E5E5E5", background: "#FFF1F3", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {avatarPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarPreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <span style={{ fontSize: "36px" }}>🧒</span>
              )}
            </div>
            <span className="font-nunito font-normal" style={{ fontSize: "12px", color: "#737373", textAlign: "center" }}>Preview</span>
          </div>

          {/* Drop zone */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
            <p className="font-nunito font-semibold" style={{ fontSize: "14px", lineHeight: "20px", color: "#424242" }}>Your avatar</p>
            <p className="font-nunito font-normal" style={{ fontSize: "14px", lineHeight: "20px", color: "#737373" }}>This will be displayed on the child&apos;s profile.</p>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", padding: "16px 24px", borderRadius: "8px", border: `1px dashed ${dragging ? "#F63D68" : "#E5E5E5"}`, background: dragging ? "#FFF5F6" : "#FFFFFF", cursor: "pointer", textAlign: "center", transition: "all 0.15s" }}
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
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { if (e.target.files?.[0]) handleFileSelect(e.target.files[0]); }} />
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
