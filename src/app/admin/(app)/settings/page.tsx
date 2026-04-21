"use client";

import { useState, useRef, useEffect } from "react";
import { UploadCloud, Save, ChevronDown, Download, Trash2, RefreshCw, Eye, EyeOff, Search, Plus, Pencil, Lock, Unlock, ChevronRight, Bold, Italic, Underline, Strikethrough, Loader2 } from "lucide-react";
import Image from "next/image";
import { db, storage } from "@/lib/firebase";
import { doc, setDoc, onSnapshot, collection, query, where, serverTimestamp, addDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { logActivity } from "@/lib/activity";

// ── Types ─────────────────────────────────────────────────────────
type SettingsTab =
  | "General"
  | "Admin Accounts"
  | "Permissions"
  | "Email Templates"
  | "Feature Toggles"
  | "Backup & Data"
  | "Security";

interface EmailTemplate {
  id: string;
  name: string;
  body: string;
  lastUpdated: Timestamp | string | null;
}

interface PasswordPolicy {
  minLength: string;
  expiry: string;
  requireNumbers: boolean;
  requireSpecial: boolean;
}

interface AdminPermissions {
  [category: string]: string;
}

interface RolePermissions {
  [role: string]: AdminPermissions;
}

interface AdminSettings {
  language?: string;
  currency?: string;
  logoURL?: string;
  logoName?: string;
  uploadLogo?: "enable" | "disable";
  filterWords?: "enable" | "disable";
  features?: Record<string, boolean>;
  passwordPolicy?: PasswordPolicy;
  permissions?: RolePermissions;
}

// ─────────────────────────────────────────────────────────────────
// SHARED PRIMITIVES
// ─────────────────────────────────────────────────────────────────

function SectionCard({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{
      background: "#FFFFFF", border: "1px solid #E5E5E5",
      borderRadius: "12px", padding: "20px 24px",
      display: "flex", flexDirection: "column", gap: "24px",
      boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
        <h3 className="font-nunito font-semibold" style={{ fontSize: "18px", lineHeight: "28px", color: "#141414", margin: 0 }}>
          {title}
        </h3>
        {action}
      </div>
      {children}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-nunito font-medium" style={{ fontSize: "14px", color: "#424242", display: "block", marginBottom: "6px" }}>
      {children}
    </span>
  );
}

const inputStyle: React.CSSProperties = {
  height: "44px", padding: "0 14px", borderRadius: "8px",
  border: "1px solid #E5E5E5", background: "#FFFFFF",
  fontSize: "16px", color: "#141414",
  boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
  width: "100%", boxSizing: "border-box", outline: "none",
};

function SelectField({
  label, value, onChange, options, placeholder,
}: { label: string; value: string; onChange: (v: string) => void; options: string[]; placeholder?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <FieldLabel>{label}</FieldLabel>
      <div style={{ position: "relative" }}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="font-nunito font-normal focus:outline-none"
          style={{ ...inputStyle, appearance: "none", paddingRight: "40px", cursor: "pointer", color: value ? "#141414" : "#737373" }}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown size={16} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", color: "#A3A3A3", pointerEvents: "none" }} />
      </div>
    </div>
  );
}

// ── Radio toggle (Enable / Disable, stacked) ──────────────────────
function RadioToggle({
  label, value, onChange,
}: { label: string; value: "enable" | "disable"; onChange: (v: "enable" | "disable") => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <span className="font-nunito font-medium" style={{ fontSize: "14px", color: "#424242" }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        {(["enable", "disable"] as const).map((opt) => (
          <label key={opt} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
            onClick={() => onChange(opt)}>
            <div style={{
              width: "16px", height: "16px", borderRadius: "50%", flexShrink: 0,
              border: `2px solid ${value === opt ? "#F63D68" : "#D6D6D6"}`,
              background: "#FFFFFF", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "border-color 0.15s",
            }}>
              {value === opt && <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#F63D68" }} />}
            </div>
            <span className="font-nunito font-normal" style={{ fontSize: "14px", color: "#737373", textTransform: "capitalize" }}>
              {opt === "enable" ? "Enable" : "Disable"}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

// ── Toggle switch ─────────────────────────────────────────────────
function ToggleSwitch({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      style={{
        width: "44px", height: "24px", borderRadius: "99px", border: "none",
        background: value ? "#F63D68" : "#D6D6D6",
        cursor: "pointer", position: "relative", flexShrink: 0,
        transition: "background 0.2s",
      }}
    >
      <div style={{
        position: "absolute", top: "3px",
        left: value ? "23px" : "3px",
        width: "18px", height: "18px", borderRadius: "50%",
        background: "#FFFFFF",
        boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
        transition: "left 0.2s",
      }} />
    </button>
  );
}

const divider = <div style={{ height: "1px", background: "#F2F4F7" }} />;

// ─────────────────────────────────────────────────────────────────
// GENERAL TAB
// ─────────────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function GeneralTab({ settings, setSettings }: { settings: AdminSettings; setSettings: (s: AdminSettings) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging]       = useState(false);
  const [uploading, setUploading]     = useState(false);

  const LANGUAGES  = ["English", "Spanish", "French", "German", "Arabic", "Portuguese"];
  const CURRENCIES = ["USD", "EUR", "GBP", "AUD", "CAD"];

  const handleLogoUpload = async (file: File) => {
    setUploading(true);
    try {
      console.log("Attempting logo upload:", file.name);
      const sRef = ref(storage, `settings/admin_logo_${Date.now()}_${file.name}`);
      await uploadBytes(sRef, file);
      const url = await getDownloadURL(sRef);
      setSettings({ ...settings, logoURL: url, logoName: file.name });
      console.log("Logo upload successful:", url);
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string }; // Using any briefly for firebase error codes or cast to FirebaseError if available
      console.error("Detailed Logo upload failed:", error);
      let msg = "Failed to upload logo.";
      if (error.code === "storage/unauthorized") {
        msg = "Permission denied. Please ensure your Firebase Storage rules allow writes to the 'settings/' folder.";
      } else if (error.message) {
        msg += ` Error: ${error.message}`;
      }
      alert(msg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <SectionCard title="Upload Logo">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleLogoUpload(f); }}
          onClick={() => !uploading && fileInputRef.current?.click()}
          style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: "12px",
            padding: "24px", borderRadius: "8px", cursor: uploading ? "not-allowed" : "pointer", textAlign: "center",
            border: `2px dashed ${dragging ? "#F63D68" : "#E5E5E5"}`,
            background: dragging ? "#FFF5F6" : "#FAFAFA",
            transition: "border-color 0.15s, background 0.15s",
            opacity: uploading ? 0.6 : 1,
          }}
        >
          <div style={{ width: "40px", height: "40px", borderRadius: "8px", border: "1px solid #EAECF0", background: "#FFFFFF", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {uploading ? <Loader2 size={20} className="animate-spin" /> : <UploadCloud size={20} style={{ color: "#525252" }} />}
          </div>
          {settings.logoURL ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
              <div style={{ position: "relative", height: "40px", width: "200px" }}>
                <Image src={settings.logoURL} alt="Logo" fill style={{ objectFit: "contain" }} />
              </div>
              <span className="font-nunito font-semibold" style={{ fontSize: "14px", color: "#141414" }}>{settings.logoName || "admin-logo.png"}</span>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <span className="font-nunito font-bold" style={{ fontSize: "14px", color: "#F63D68" }}>Click to upload</span>
                <span className="font-nunito font-normal" style={{ fontSize: "14px", color: "#525252" }}>or drag and drop</span>
              </div>
              <span className="font-nunito font-normal" style={{ fontSize: "12px", color: "#525252" }}>SVG, PNG, JPG (max. 800×400px)</span>
            </>
          )}
          <input ref={fileInputRef} type="file" style={{ display: "none" }} accept=".svg,.png,.jpg,.jpeg"
            onChange={(e) => { if (e.target.files?.[0]) handleLogoUpload(e.target.files[0]); }} />
        </div>
      </SectionCard>

      <SectionCard title="App Settings">
        <div>
          <FieldLabel>Default Story Language</FieldLabel>
          <div style={{ display: "flex", height: "44px", borderRadius: "8px", border: "1px solid #E5E5E5", background: "#FFFFFF", overflow: "hidden", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)" }}>
            <div style={{ flex: 1, position: "relative", borderRight: "1px solid #E5E5E5" }}>
              <select 
                value={settings.language || ""} 
                onChange={(e) => setSettings({ ...settings, language: e.target.value })} 
                className="font-nunito font-normal focus:outline-none"
                style={{ width: "100%", height: "100%", padding: "0 36px 0 14px", border: "none", background: "transparent", fontSize: "16px", color: settings.language ? "#141414" : "#737373", cursor: "pointer", appearance: "none" }}>
                <option value="" disabled>Choose</option>
                {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
              <ChevronDown size={16} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#A3A3A3", pointerEvents: "none" }} />
            </div>
            <div style={{ width: "96px", position: "relative", flexShrink: 0 }}>
              <select 
                value={settings.currency || "USD"} 
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })} 
                className="font-nunito font-medium focus:outline-none"
                style={{ width: "100%", height: "100%", padding: "0 32px 0 14px", border: "none", background: "transparent", fontSize: "14px", color: "#344054", cursor: "pointer", appearance: "none" }}>
                {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown size={14} style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "#A3A3A3", pointerEvents: "none" }} />
            </div>
          </div>
        </div>
        {divider}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <RadioToggle 
            label="Upload Logo Capability" 
            value={settings.uploadLogo || "enable"} 
            onChange={(v) => setSettings({ ...settings, uploadLogo: v })} 
          />
          <RadioToggle 
            label="Disable Inappropriate Words in Input" 
            value={settings.filterWords || "disable"} 
            onChange={(v) => setSettings({ ...settings, filterWords: v })} 
          />
        </div>
      </SectionCard>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// PERMISSIONS TAB
// ─────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PermissionsTab({ settings, setSettings }: { settings: AdminSettings; setSettings: (s: AdminSettings) => void }) {
  const ROLES = ["Super Admin", "Editor", "Reviewer"];
  const CATEGORIES = ["Access", "Settings", "Stories", "Games", "Users", "Purchases", "Assets"];
  const OPTIONS = ["Full Access", "Full system access", "Editable", "Edit", "View Only", "Restricted"];

  // Normalize permissions to the new map structure if it's currently an array or missing
  const permissions = (settings.permissions && typeof settings.permissions === "object" && !Array.isArray(settings.permissions)) 
    ? settings.permissions 
    : {
        "Super Admin": { Access: "Full system access", Settings: "Full Access", Stories: "Editable", Games: "Full system access", Users: "Restricted", Purchases: "Full Access", Assets: "Full system access" },
        "Editor": { Stories: "View Only", Games: "Edit", Assets: "View Only", Users: "View Only", Purchases: "View Only", Settings: "View Only", Access: "Restricted" },
        "Reviewer": { Stories: "Restricted", Games: "View Only", Assets: "Full Access", Users: "Edit", Purchases: "Restricted", Settings: "Restricted", Access: "Restricted" }
      };

  const updatePerm = (role: string, category: string, value: string) => {
    setSettings({
      ...settings,
      permissions: {
        ...permissions,
        [role]: {
          ...permissions[role],
          [category]: value
        }
      }
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {ROLES.map((role) => (
        <SectionCard key={role} title={`${role}'s Roles`}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 24px" }}>
            {CATEGORIES.map((cat) => (
              <SelectField
                key={cat}
                label={cat}
                value={permissions[role]?.[cat] || "View Only"}
                onChange={(v) => updatePerm(role, cat, v)}
                options={OPTIONS}
              />
            ))}
          </div>
        </SectionCard>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// FEATURE TOGGLES TAB
// ─────────────────────────────────────────────────────────────────
const FEATURES = [
  { key: "story",   label: "New Story Page Builder",     description: "Enable the redesigned story creation interface." },
  { key: "sdk",     label: "Beta Version of Mini-Game SDK", description: "Allow editors to use the experimental game SDK." },
  { key: "ai",      label: "AI-Assisted Illustration",   description: "Use AI to suggest and generate story illustrations." },
  { key: "backup",  label: "Auto-Backup System",         description: "Automatically back up data on a scheduled interval." },
  { key: "audio",   label: "Child Audio Recording",      description: "Allow children to record voice messages in stories." },
];

function FeatureTogglesTab({ features, setFeatures }: { features: Record<string, boolean>; setFeatures: (f: Record<string, boolean>) => void }) {
  return (
    <SectionCard title="Feature Switches">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {FEATURES.map((feature) => (
          <div
            key={feature.key}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              gap: "16px", padding: "16px", borderRadius: "10px",
              border: "1px solid #F2F4F7", background: "#FAFAFA",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span className="font-nunito font-semibold" style={{ fontSize: "14px", color: "#141414" }}>
                {feature.label}
              </span>
              <span className="font-nunito font-normal" style={{ fontSize: "13px", color: "#737373" }}>
                {feature.description}
              </span>
            </div>
            <ToggleSwitch
              value={!!features[feature.key]}
              onChange={(v) => setFeatures({ ...features, [feature.key]: v })}
            />
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

// ─────────────────────────────────────────────────────────────────
// BACKUP & DATA TAB
// ─────────────────────────────────────────────────────────────────
const BACKUP_HISTORY = [
  { date: "Today, 09:45 AM",   file: "backup_2025_03_25.zip", size: "90 MB" },
  { date: "Yesterday, 5:20 PM", file: "backup_2025_03_24.zip", size: "87 MB" },
  { date: "Mar 23, 2025",       file: "backup_2025_03_23.zip", size: "85 MB" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function BackupTab({ settings, setSettings }: { settings: AdminSettings; setSettings: (s: AdminSettings) => void }) {
  const [autoBackup, setAutoBackup] = useState("ON");
  const [frequency, setFrequency]   = useState("Daily");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Auto Backup settings */}
      <SectionCard title="Auto Backup">
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* 2-col dropdown grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <SelectField
              label="Auto Backup"
              value={autoBackup}
              onChange={setAutoBackup}
              options={["ON", "OFF"]}
            />
            <SelectField
              label="Backup Frequency"
              value={frequency}
              onChange={setFrequency}
              options={["Daily", "Weekly", "Monthly"]}
            />
          </div>

          {divider}

          {/* Last Backup + Next Schedule as plain text pairs */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <FieldLabel>Last Backup</FieldLabel>
              <span className="font-nunito font-semibold" style={{ fontSize: "16px", color: "#141414" }}>
                Today, 1:10 AM
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <FieldLabel>Next Schedule Backup</FieldLabel>
              <span className="font-nunito font-semibold" style={{ fontSize: "16px", color: "#141414" }}>
                Tomorrow, 1:00 AM
              </span>
            </div>
          </div>

        </div>
      </SectionCard>

      {/* Backup history table */}
      <SectionCard
        title="Backup History"
        action={
          <button className="font-nunito font-bold" style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "10px 16px", borderRadius: "8px",
            border: "1px solid #F63D68", background: "#F63D68",
            fontSize: "14px", color: "#FFFFFF", cursor: "pointer",
            boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", whiteSpace: "nowrap",
          }}>
            <RefreshCw size={15} /> Create Manual Backup
          </button>
        }
      >
        {/* Table header */}
        <div style={{ display: "grid", gridTemplateColumns: "200px 1fr 100px 80px", gap: "12px", padding: "10px 0", borderBottom: "1px solid #F2F4F7" }}>
          {["Date & Time", "File Name", "Size", "Action"].map((h) => (
            <span key={h} className="font-nunito font-semibold" style={{ fontSize: "12px", color: "#525252" }}>{h}</span>
          ))}
        </div>
        {/* Rows */}
        {BACKUP_HISTORY.map((row, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "200px 1fr 100px 80px", gap: "12px", padding: "14px 0", borderBottom: i < BACKUP_HISTORY.length - 1 ? "1px solid #F2F4F7" : "none", alignItems: "center" }}>
            <span className="font-nunito font-normal" style={{ fontSize: "14px", color: "#525252" }}>{row.date}</span>
            <span className="font-nunito font-normal" style={{ fontSize: "14px", color: "#141414" }}>{row.file}</span>
            <span className="font-nunito font-normal" style={{ fontSize: "14px", color: "#525252" }}>{row.size}</span>
            <div style={{ display: "flex", gap: "8px" }}>
              <button title="Download" style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1px solid #E5E5E5", background: "#FFFFFF", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Download size={14} style={{ color: "#525252" }} />
              </button>
              <button title="Delete" style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1px solid #FECDCA", background: "#FEF3F2", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Trash2 size={14} style={{ color: "#F04438" }} />
              </button>
            </div>
          </div>
        ))}
      </SectionCard>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// SECURITY TAB
// ─────────────────────────────────────────────────────────────────
const SESSIONS = [
  { device: "Chrome (Windows)", location: "USA",       lastActive: "Today, 09:20 AM" },
  { device: "Safari (MacOS)",   location: "Australia", lastActive: "Yesterday" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SecurityTab({ settings, setSettings }: { settings: AdminSettings; setSettings: (s: AdminSettings) => void }) {
  const policy = settings.passwordPolicy || { minLength: "8 Characters", expiry: "Every 60 days", requireNumbers: true, requireSpecial: true };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updatePolicy = (k: keyof PasswordPolicy, v: string | boolean) => setSettings({ ...settings, passwordPolicy: { ...policy, [k]: v } });

  const [twoFA, setTwoFA]               = useState<"enable" | "disable">("enable");
  const [deviceVerify, setDeviceVerify] = useState<"enable" | "disable">("enable");
  const [showSession, setShowSession]   = useState<"enable" | "disable">("enable");
  const [apiKey, setApiKey]             = useState("sk_live_abc123xyz789secretkey");
  const [showKey, setShowKey]           = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

      {/* Account Security */}
      <SectionCard title="Account Security">
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <RadioToggle label="Two-Factor Authentication" value={twoFA} onChange={setTwoFA} />
          {divider}
          <RadioToggle label="Device Login Verification" value={deviceVerify} onChange={setDeviceVerify} />
          {divider}
          <RadioToggle label="Show Active Session" value={showSession} onChange={setShowSession} />
        </div>
      </SectionCard>

      {/* API Access */}
      <SectionCard title="API Access">
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <FieldLabel>API Access Key</FieldLabel>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <div style={{ flex: 1, position: "relative" }}>
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                readOnly
                className="font-nunito font-normal focus:outline-none"
                style={{ ...inputStyle, paddingRight: "44px", color: "#141414" }}
              />
              <button type="button" onClick={() => setShowKey(!showKey)} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center" }}>
                {showKey ? <EyeOff size={16} style={{ color: "#737373" }} /> : <Eye size={16} style={{ color: "#737373" }} />}
              </button>
            </div>
            <button
              onClick={() => setApiKey("sk_live_" + Math.random().toString(36).slice(2))}
              className="font-nunito font-bold"
              style={{ padding: "10px 16px", borderRadius: "8px", border: "1px solid #D6D6D6", background: "#FFFFFF", fontSize: "14px", color: "#424242", cursor: "pointer", whiteSpace: "nowrap", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)" }}
            >
              Generate New API Key
            </button>
          </div>
        </div>
      </SectionCard>

      {/* Session Management */}
      <SectionCard title="Session Management">
        <div style={{ border: "1px solid #E5E5E5", borderRadius: "10px", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 140px 180px 90px", gap: "12px", padding: "10px 16px", background: "#FAFAFA", borderBottom: "1px solid #F2F4F7" }}>
            {["Device", "Location", "Last Active", "Action"].map((h) => (
              <span key={h} className="font-nunito font-semibold" style={{ fontSize: "12px", color: "#525252" }}>{h}</span>
            ))}
          </div>
          {SESSIONS.map((s, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 140px 180px 90px", gap: "12px", padding: "14px 16px", borderBottom: i < SESSIONS.length - 1 ? "1px solid #F2F4F7" : "none", alignItems: "center" }}>
              <span className="font-nunito font-normal" style={{ fontSize: "14px", color: "#141414" }}>{s.device}</span>
              <span className="font-nunito font-normal" style={{ fontSize: "14px", color: "#525252" }}>{s.location}</span>
              <span className="font-nunito font-normal" style={{ fontSize: "14px", color: "#525252" }}>{s.lastActive}</span>
              <button className="font-nunito font-bold" style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #FECDCA", background: "#FEF3F2", fontSize: "12px", color: "#F04438", cursor: "pointer", whiteSpace: "nowrap" }}>
                Revoke
              </button>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Password Policy */}
      <SectionCard title="Password Policy">
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <SelectField 
              label="Minimum Length" 
              value={policy.minLength} 
              onChange={(v) => updatePolicy("minLength", v)}
              options={["6 Characters", "8 Characters", "10 Characters", "12 Characters"]} 
            />
            <SelectField 
              label="Password Expiry" 
              value={policy.expiry} 
              onChange={(v) => updatePolicy("expiry", v)}
              options={["Never", "Every 30 days", "Every 60 days", "Every 90 days"]} 
            />
          </div>
          {divider}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span className="font-nunito font-medium" style={{ fontSize: "14px", color: "#424242" }}>Require Numbers</span>
              <ToggleSwitch 
                value={!!policy.requireNumbers} 
                onChange={(v) => updatePolicy("requireNumbers", v)} 
              />
            </div>
            {divider}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span className="font-nunito font-medium" style={{ fontSize: "14px", color: "#424242" }}>Require Special Characters</span>
              <ToggleSwitch 
                value={!!policy.requireSpecial} 
                onChange={(v) => updatePolicy("requireSpecial", v)} 
              />
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// ADMIN ACCOUNTS TAB
// ─────────────────────────────────────────────────────────────────

type AdminView = "list" | "add" | "edit";

function AdminStatusBadge({ status }: { status: string }) {
  const s = status === "Active"
    ? { bg: "#ECFDF3", border: "#ABEFC6", color: "#067647" }
    : { bg: "#FEF3F2", border: "#FDA29B", color: "#F04438" };
  return (
    <span className="font-nunito font-semibold" style={{
      display: "inline-flex", alignItems: "center", fontSize: "12px", lineHeight: "18px",
      padding: "2px 8px", borderRadius: "9999px",
      background: s.bg, border: `1px solid ${s.border}`, color: s.color, whiteSpace: "nowrap",
    }}>{status}</span>
  );
}

function AdminForm({
  title, initial, cancelLabel = "Cancel", saveLabel, onSave, onCancel, isEdit = false, adminId,
}: {
  title: string;
  initial: { name: string; email: string; role: string; status: "enable" | "disable" };
  cancelLabel?: string;
  saveLabel: string;
  onSave: () => void;
  onCancel: () => void;
  isEdit?: boolean;
  adminId?: string;
}) {
  const [form, setForm] = useState(initial);
  const [showPw, setShowPw] = useState(false);
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleAction = async () => {
    if (!form.name || !form.email || (!isEdit && !password)) {
      alert("Please fill in all required fields.");
      return;
    }
    setSaving(true);
    try {
      console.log(isEdit ? "Updating admin account..." : "Creating new admin account...");
      const userData: Record<string, unknown> = {
        displayName: form.name,
        email: form.email,
        role: form.role || "Editor",
        status: form.status === "enable" ? "Active" : "Disabled",
        updatedAt: serverTimestamp(),
      };
      if (password) userData.password = password;

      if (isEdit && adminId) {
        await setDoc(doc(db, "users", adminId), userData, { merge: true });
        await logActivity({
          type: "Admin",
          activity: `Updated admin account for "${form.name}"`,
          targetName: form.name
        });
      } else {
        userData.createdAt = serverTimestamp();
        await addDoc(collection(db, "users"), userData);
        await logActivity({
          type: "Admin",
          activity: `Created new admin account for "${form.name}"`,
          targetName: form.name
        });
      }
      onSave();
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      console.error("Detailed Admin save failed:", error);
      let msg = `Failed to save admin account.`;
      if (error.code === "permission-denied") {
        msg = "Permission denied. Please ensure your Firestore rules allow admins to manage the 'users' collection.";
      } else if (error.message) {
        msg += ` Error: ${error.message}`;
      }
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SectionCard title={title}>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <FieldLabel>Full Name</FieldLabel>
            <input
              type="text" placeholder="Enter name" value={form.name}
              onChange={(e) => set("name")(e.target.value)}
              className="font-nunito font-normal placeholder:text-gray-400 focus:outline-none"
              style={{ ...inputStyle }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <FieldLabel>Email</FieldLabel>
            <input
              type="email" placeholder="Enter email" value={form.email}
              onChange={(e) => set("email")(e.target.value)}
              className="font-nunito font-normal placeholder:text-gray-400 focus:outline-none"
              style={{ ...inputStyle }}
            />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <FieldLabel>{isEdit ? "New Password (leave blank to keep current)" : "Password"}</FieldLabel>
          <div style={{ position: "relative" }}>
            <input
              type={showPw ? "text" : "password"}
              placeholder="••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="font-nunito font-normal placeholder:text-gray-400 focus:outline-none"
              style={{ ...inputStyle, paddingRight: "44px" }}
            />
            <button type="button" onClick={() => setShowPw(!showPw)}
              style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center" }}>
              {showPw ? <EyeOff size={16} style={{ color: "#737373" }} /> : <Eye size={16} style={{ color: "#737373" }} />}
            </button>
          </div>
        </div>

        <SelectField
          label="Role"
          value={form.role}
          onChange={set("role")}
          options={["Super Admin", "Editor", "Reviewer"]}
          placeholder="Choose"
        />

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <FieldLabel>Status</FieldLabel>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            {(["enable", "disable"] as const).map((opt) => (
              <label key={opt} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
                onClick={() => setForm((f) => ({ ...f, status: opt }))}>
                <div style={{
                  width: "16px", height: "16px", borderRadius: "50%", flexShrink: 0,
                  border: `2px solid ${form.status === opt ? "#F63D68" : "#D6D6D6"}`,
                  background: "#FFFFFF", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {form.status === opt && <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#F63D68" }} />}
                </div>
                <span className="font-nunito font-normal" style={{ fontSize: "14px", color: "#737373", textTransform: "capitalize" }}>
                  {opt === "enable" ? "Enable" : "Disable"}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", paddingTop: "4px" }}>
          <button type="button" onClick={onCancel} className="font-nunito font-bold"
            disabled={saving}
            style={{ padding: "10px 16px", borderRadius: "8px", border: "1px solid #D6D6D6", background: "#FFFFFF", fontSize: "14px", color: "#424242", cursor: saving ? "not-allowed" : "pointer", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", opacity: saving ? 0.6 : 1 }}>
            {cancelLabel}
          </button>
          <button type="button" onClick={handleAction} className="font-nunito font-bold"
            disabled={saving}
            style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "10px 16px", borderRadius: "8px", border: "1px solid #F63D68", background: "#F63D68", fontSize: "14px", color: "#FFFFFF", cursor: saving ? "not-allowed" : "pointer", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", opacity: saving ? 0.6 : 1 }}>
            {saving && <Loader2 size={14} className="animate-spin" />}
            {saveLabel}
          </button>
        </div>
      </div>
    </SectionCard>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function AdminAccountsTab({ settings, setSettings }: { settings: AdminSettings; setSettings: (s: AdminSettings) => void }) {
  const [view, setView]         = useState<AdminView>("list");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editTarget, setEditTarget] = useState<any | null>(null);
  const [search, setSearch]     = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [admins, setAdmins]     = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const q = query(collection(db, "users"), where("role", "in", ["Admin", "Super Admin", "Editor", "Reviewer"]));
    const unsub = onSnapshot(q, (snap) => {
      setAdmins(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = admins.filter(
    (a) => (a.displayName || a.name || "").toLowerCase().includes(search.toLowerCase()) ||
           (a.email || "").toLowerCase().includes(search.toLowerCase())
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleToggleStatus = async (admin: any) => {
    const newStatus = admin.status === "Active" ? "Disabled" : "Active";
    try {
      await setDoc(doc(db, "users", admin.id), { status: newStatus }, { merge: true });
      await logActivity({
        type: "Admin",
        activity: `${newStatus === "Active" ? "Enabled" : "Disabled"} admin account for "${admin.displayName || admin.name}"`,
        targetName: admin.displayName || admin.name
      });
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      console.error("Toggle admin status failed:", error);
      let msg = "Failed to update status.";
      if (error.code === "permission-denied") {
        msg = "Permission denied. Please ensure your Firestore rules allow admins to manage the 'users' collection.";
      } else if (error.message) {
        msg += ` Error: ${error.message}`;
      }
      alert(msg);
    }
  };

  if (view === "add") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button onClick={() => setView("list")} className="font-nunito font-bold"
            style={{ fontSize: "14px", color: "#424242", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            Admin Accounts
          </button>
          <ChevronRight size={14} style={{ color: "#A3A3A3" }} />
          <span className="font-nunito font-bold" style={{ fontSize: "14px", color: "#F63D68" }}>Add New</span>
        </div>
        <AdminForm
          title="Add New Member"
          initial={{ name: "", email: "", role: "", status: "enable" }}
          saveLabel="Add"
          onCancel={() => setView("list")}
          onSave={() => setView("list")}
        />
      </div>
    );
  }

  if (view === "edit" && editTarget) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button onClick={() => setView("list")} className="font-nunito font-bold"
            style={{ fontSize: "14px", color: "#424242", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            Admin Accounts
          </button>
          <ChevronRight size={14} style={{ color: "#A3A3A3" }} />
          <span className="font-nunito font-bold" style={{ fontSize: "14px", color: "#F63D68" }}>Edit Admin</span>
        </div>
        <AdminForm
          title="Edit Admin"
          initial={{ 
            name: editTarget.displayName || editTarget.name || "", 
            email: editTarget.email || "", 
            role: editTarget.role || "", 
            status: editTarget.status === "Active" ? "enable" : "disable" 
          }}
          isEdit
          adminId={editTarget.id}
          saveLabel="Save"
          onCancel={() => setView("list")}
          onSave={() => setView("list")}
        />
      </div>
    );
  }

  return (
    <SectionCard title="Admin Account List" action={
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ position: "relative" }}>
          <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#737373", pointerEvents: "none" }} />
          <input
            type="text" placeholder="Search" value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="font-nunito font-normal focus:outline-none"
            style={{ height: "40px", width: "280px", paddingLeft: "38px", paddingRight: "14px", borderRadius: "8px", border: "1px solid #E5E5E5", fontSize: "14px", color: "#141414", background: "#FFFFFF", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)" }}
          />
        </div>
        <button onClick={() => setView("add")} className="font-nunito font-bold"
          style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "10px 14px", borderRadius: "8px", border: "1px solid #D6D6D6", background: "#FFFFFF", fontSize: "14px", color: "#424242", cursor: "pointer", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", whiteSpace: "nowrap" }}>
          <Plus size={15} /> Add Admin
        </button>
      </div>
    }>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 130px 110px 90px", gap: "12px", padding: "10px 0", borderBottom: "1px solid #F2F4F7" }}>
        {["Name", "Email", "Role", "Status", "Action"].map((h) => (
          <span key={h} className="font-nunito font-semibold" style={{ fontSize: "12px", color: "#525252" }}>{h}</span>
        ))}
      </div>
      {loading ? (
        <div style={{ padding: "32px 0", textAlign: "center" }}>
          <Loader2 className="animate-spin" size={24} style={{ color: "#F63D68" }} />
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: "32px 0", textAlign: "center" }}>
          <p className="font-nunito font-semibold" style={{ fontSize: "14px", color: "#A3A3A3" }}>No admins found</p>
        </div>
      ) : filtered.map((row, i) => (
        <div key={row.id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 130px 110px 90px", gap: "12px", padding: "16px 0", borderBottom: i < filtered.length - 1 ? "1px solid #F2F4F7" : "none", alignItems: "center" }}>
          <span className="font-nunito font-normal" style={{ fontSize: "16px", color: "#141414" }}>{row.displayName || row.name || "N/A"}</span>
          <span className="font-nunito font-normal" style={{ fontSize: "16px", color: "#525252" }}>{row.email}</span>
          <span className="font-nunito font-normal" style={{ fontSize: "16px", color: "#525252" }}>{row.role}</span>
          <div><AdminStatusBadge status={row.status || "Active"} /></div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button title="Edit" onClick={() => { setEditTarget(row); setView("edit"); }}
              style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1px solid #E5E5E5", background: "#FAFAFA", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Pencil size={14} style={{ color: "#525252" }} />
            </button>
            <button 
              title={row.status === "Active" ? "Disable" : "Enable"}
              onClick={() => handleToggleStatus(row)}
              style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1px solid #E5E5E5", background: "#FAFAFA", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              {row.status === "Active"
                ? <Lock size={14} style={{ color: "#525252" }} />
                : <Unlock size={14} style={{ color: "#525252" }} />}
            </button>
          </div>
        </div>
      ))}
    </SectionCard>
  );
}

// ─────────────────────────────────────────────────────────────────
// EMAIL TEMPLATES TAB
// ─────────────────────────────────────────────────────────────────
// Email Templates logic

type EmailView = "list" | "edit";

function EmailTemplatesTab() {
  const [view, setView]       = useState<EmailView>("list");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editTarget, setEditTarget] = useState<EmailTemplate | null>(null);
  const [search, setSearch]   = useState("");
  const [templateName, setTemplateName] = useState("");
  const [body, setBody]       = useState("");
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    const q = query(collection(db, "email_templates"));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as EmailTemplate));
      setTemplates(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = templates.filter(
    (t) => t.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    if (!templateName || !editTarget || saving) return;
    setSaving(true);
    try {
      await setDoc(doc(db, "email_templates", editTarget.id), {
        name: templateName,
        body: body,
        lastUpdated: serverTimestamp()
      }, { merge: true });
      
      await logActivity({
        type: "Settings",
        activity: `Updated email template "${templateName}"`,
        targetName: templateName
      });
      setView("list");
    } catch (err) {
      console.error("Save template failed:", err);
      alert("Failed to save template.");
    } finally {
      setSaving(false);
    }
  };

  if (view === "edit" && editTarget) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button onClick={() => setView("list")} className="font-nunito font-bold"
            style={{ fontSize: "14px", color: "#424242", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            Email Templates
          </button>
          <ChevronRight size={14} style={{ color: "#A3A3A3" }} />
          <span className="font-nunito font-bold" style={{ fontSize: "14px", color: "#F63D68" }}>Edit {editTarget.name}</span>
        </div>

        <SectionCard title="Edit Email Template">
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <FieldLabel>Template Name</FieldLabel>
              <input
                type="text" value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="font-nunito font-normal focus:outline-none"
                style={{ ...inputStyle }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <FieldLabel>Email Body</FieldLabel>
              <div style={{ border: "1px solid #E5E5E5", borderRadius: "8px", overflow: "hidden", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "2px", padding: "8px 12px", background: "#FAFAFA", borderBottom: "1px solid #E5E5E5", flexWrap: "wrap" }}>
                  {[
                    { icon: <Bold size={15} />,          title: "Bold" },
                    { icon: <Italic size={15} />,        title: "Italic" },
                    { icon: <Underline size={15} />,     title: "Underline" },
                    { icon: <Strikethrough size={15} />, title: "Strikethrough" },
                  ].map(({ icon, title }) => (
                    <button key={title} title={title} type="button"
                      style={{ width: "28px", height: "28px", borderRadius: "4px", border: "none", background: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#525252" }}>
                      {icon}
                    </button>
                  ))}
                </div>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="font-nunito font-normal focus:outline-none"
                  style={{
                    width: "100%", minHeight: "260px", padding: "16px",
                    border: "none", background: "#FFFFFF", fontSize: "15px",
                    color: "#282828", lineHeight: "24px", resize: "vertical",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", paddingTop: "4px" }}>
              <button type="button" onClick={() => setView("list")} disabled={saving} className="font-nunito font-bold"
                style={{ padding: "10px 16px", borderRadius: "8px", border: "1px solid #D6D6D6", background: "#FFFFFF", fontSize: "14px", color: "#424242", cursor: saving ? "not-allowed" : "pointer", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", opacity: saving ? 0.6 : 1 }}>
                Cancel
              </button>
              <button type="button" onClick={handleSave} disabled={saving} className="font-nunito font-bold"
                style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "10px 16px", borderRadius: "8px", border: "1px solid #F63D68", background: "#F63D68", fontSize: "14px", color: "#FFFFFF", cursor: saving ? "not-allowed" : "pointer", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", opacity: saving ? 0.6 : 1 }}>
                {saving && <Loader2 size={14} className="animate-spin" />}
                Save Template
              </button>
            </div>
          </div>
        </SectionCard>
      </div>
    );
  }

  return (
    <SectionCard title="Email Templates List" action={
      <div style={{ position: "relative" }}>
        <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#737373", pointerEvents: "none" }} />
        <input
          type="text" placeholder="Search" value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="font-nunito font-normal focus:outline-none"
          style={{ height: "40px", width: "280px", paddingLeft: "38px", paddingRight: "14px", borderRadius: "8px", border: "1px solid #E5E5E5", fontSize: "14px", color: "#141414", background: "#FFFFFF", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)" }}
        />
      </div>
    }>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 200px 80px", gap: "12px", padding: "10px 0", borderBottom: "1px solid #F2F4F7" }}>
        {["Template Name", "Last Updated", "Action"].map((h) => (
          <span key={h} className="font-nunito font-semibold" style={{ fontSize: "12px", color: "#525252" }}>{h}</span>
        ))}
      </div>
      {loading ? (
        <div style={{ padding: "32px 0", textAlign: "center" }}>
          <Loader2 className="animate-spin" size={24} style={{ color: "#F63D68" }} />
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: "32px 0", textAlign: "center" }}>
          <p className="font-nunito font-semibold" style={{ fontSize: "14px", color: "#A3A3A3" }}>No templates found</p>
        </div>
      ) : filtered.map((row, i) => (
        <div key={row.id} style={{ display: "grid", gridTemplateColumns: "1fr 200px 80px", gap: "12px", padding: "16px 0", borderBottom: i < filtered.length - 1 ? "1px solid #F2F4F7" : "none", alignItems: "center" }}>
          <span className="font-nunito font-normal" style={{ fontSize: "16px", color: "#141414" }}>{row.name}</span>
          <span className="font-nunito font-normal" style={{ fontSize: "16px", color: "#525252" }}>
            {(row.lastUpdated as Timestamp)?.toDate ? (row.lastUpdated as Timestamp).toDate().toLocaleDateString() : ((row.lastUpdated as string) || "N/A")}
          </span>
          <div style={{ display: "flex", gap: "8px" }}>
            <button title="Edit" onClick={() => { setEditTarget(row); setTemplateName(row.name); setBody(row.body); setView("edit"); }}
              style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1px solid #E5E5E5", background: "#FAFAFA", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Pencil size={14} style={{ color: "#525252" }} />
            </button>
            <button title="Preview"
              style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1px solid #E5E5E5", background: "#FAFAFA", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Eye size={14} style={{ color: "#525252" }} />
            </button>
          </div>
        </div>
      ))}
    </SectionCard>
  );
}

// ─────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────
const TABS: SettingsTab[] = [
  "General", "Admin Accounts", "Permissions",
  "Email Templates", "Feature Toggles", "Backup & Data", "Security",
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("General");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [settings, setSettings]   = useState<AdminSettings | null>(null);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "admin"), {
      next: (snap) => {
        if (snap.exists()) {
          setSettings(snap.data());
        } else {
          // Initial defaults if doc doesn't exist
          setSettings({
            language: "English",
            currency: "USD",
            uploadLogo: "enable",
            filterWords: "disable",
            features: { story: true, sdk: false, ai: true, backup: true, audio: false },
            passwordPolicy: { minLength: "8 Characters", expiry: "Every 60 days", requireNumbers: true, requireSpecial: true },
            permissions: {
              "Super Admin": { Access: "Full system access", Settings: "Full Access", Stories: "Editable", Games: "Full system access", Users: "Restricted", Purchases: "Full Access", Assets: "Full system access" },
              "Editor": { Stories: "View Only", Games: "Edit", Assets: "View Only", Users: "View Only", Purchases: "View Only", Settings: "View Only", Access: "Restricted" },
              "Reviewer": { Stories: "Restricted", Games: "View Only", Assets: "Full Access", Users: "Edit", Purchases: "Restricted", Settings: "Restricted", Access: "Restricted" }
            }
          });
        }
        setLoading(false);
      },
      error: (err) => {
        console.error("Settings listener failed:", err);
        // Even if it fails, we should stop loading and show defaults or error
        setSettings({
          language: "English",
          currency: "USD",
          uploadLogo: "enable",
          filterWords: "disable",
          features: { story: true, sdk: false, ai: true, backup: true, audio: false },
          passwordPolicy: { minLength: "8 Characters", expiry: "Every 60 days", requireNumbers: true, requireSpecial: true },
          permissions: {
            "Super Admin": { Access: "Full system access", Settings: "Full Access", Stories: "Editable", Games: "Full system access", Users: "Restricted", Purchases: "Full Access", Assets: "Full system access" },
            "Editor": { Stories: "View Only", Games: "Edit", Assets: "View Only", Users: "View Only", Purchases: "View Only", Settings: "View Only", Access: "Restricted" },
            "Reviewer": { Stories: "Restricted", Games: "View Only", Assets: "Full Access", Users: "Edit", Purchases: "Restricted", Settings: "Restricted", Access: "Restricted" }
          }
        });
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const handleSaveAll = async () => {
    if (!settings || saving) return;
    setSaving(true);
    try {
      console.log("Saving all admin settings...");
      await setDoc(doc(db, "settings", "admin"), {
        ...settings,
        lastUpdated: serverTimestamp(),
      });
      await logActivity({
        type: "Settings",
        activity: "Updated system settings",
        targetName: "Admin Settings"
      });
      alert("Settings saved successfully!");
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      console.error("Save settings failed:", error);
      let msg = "Failed to save settings.";
      if (error.code === "permission-denied") {
        msg = "Permission denied. Please ensure your Firestore rules allow writes to the 'settings' collection.";
      } else if (error.message) {
        msg += ` Error: ${error.message}`;
      }
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return <div style={{ padding: "60px", textAlign: "center" }} className="font-nunito">Loading settings...</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Page header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <h1 className="font-nunito font-semibold" style={{ fontSize: "30px", lineHeight: "38px", color: "#141414" }}>
            Settings
          </h1>
          <p className="font-nunito font-normal" style={{ fontSize: "16px", lineHeight: "24px", color: "#525252" }}>
            Manage admin accounts, permissions, system settings, and more.
          </p>
        </div>
        <button 
          onClick={handleSaveAll}
          disabled={saving}
          className="font-nunito font-bold" 
          style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "10px 16px", borderRadius: "8px",
            border: "1px solid #F63D68", background: "#F63D68",
            fontSize: "14px", color: "#FFFFFF", cursor: saving ? "not-allowed" : "pointer",
            boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", whiteSpace: "nowrap", flexShrink: 0,
            opacity: saving ? 0.7 : 1,
            transition: "all 0.15s",
          }}>
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: "inline-flex", background: "#FAFAFA", borderRadius: "10px", padding: "4px", gap: "4px", alignSelf: "flex-start" }}>
        {TABS.map((tab) => {
          const active = activeTab === tab;
          return (
            <button key={tab} onClick={() => setActiveTab(tab)} className="font-nunito"
              style={{
                padding: "4px 12px", borderRadius: "6px", border: "none", cursor: "pointer",
                background: active ? "#FFFFFF" : "transparent",
                color: active ? "#F63D68" : "#737373",
                fontWeight: active ? 600 : 500, fontSize: "14px",
                boxShadow: active ? "0px 1px 2px rgba(16,24,40,0.06), 0px 1px 3px rgba(16,24,40,0.1)" : "none",
                transition: "all 0.15s", whiteSpace: "nowrap",
              }}>
              {tab}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {activeTab === "General"          && <GeneralTab settings={settings} setSettings={setSettings} />}
      {activeTab === "Admin Accounts"   && <AdminAccountsTab settings={settings} setSettings={setSettings} />}
      {activeTab === "Permissions"      && <PermissionsTab settings={settings} setSettings={setSettings} />}
      {activeTab === "Email Templates"  && <EmailTemplatesTab />}
      {activeTab === "Feature Toggles"  && <FeatureTogglesTab features={settings.features || {}} setFeatures={(f) => setSettings({ ...settings, features: f })} />}
      {activeTab === "Backup & Data"    && <BackupTab settings={settings} setSettings={setSettings} />}
      {activeTab === "Security"         && <SecurityTab settings={settings} setSettings={setSettings} />}
    </div>
  );
}
