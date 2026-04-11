"use client";

// Settings — Account: 214:17395 | Notifications: 214:17709
//            Parental Controls: 214:17778 | Security: 214:18127

import { useState } from "react";
import { Upload, XCircle, Eye, EyeOff, LogOut } from "lucide-react";

/* ─────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────── */
type Tab = "Account" | "Notifications" | "Parental Controls" | "Security";
const TABS: Tab[] = ["Account", "Notifications", "Parental Controls", "Security"];

/* ─────────────────────────────────────────────────────────
   Shared UI primitives (stateless — safe at module scope)
───────────────────────────────────────────────────────── */
function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "24px" }}>
      <span className="font-nunito font-semibold" style={{ fontSize: "18px", lineHeight: "28px", color: "#141414" }}>
        {title}
      </span>
      {children}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="font-nunito font-semibold" style={{ fontSize: "14px", lineHeight: "20px", color: "#424242" }}>
      {children}
    </label>
  );
}

function TextInput({ placeholder, type = "text" }: { placeholder: string; type?: string }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="font-nunito font-normal placeholder:text-gray-400 focus:outline-none"
      style={{ width: "100%", height: "44px", padding: "10px 14px", borderRadius: "8px", border: "1px solid #E5E5E5", fontSize: "16px", color: "#292929", background: "#FFFFFF", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", boxSizing: "border-box" }}
    />
  );
}

function PasswordInput({ label, placeholder }: { label: string; placeholder: string }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
      <FieldLabel>{label}</FieldLabel>
      <div style={{ position: "relative" }}>
        <input
          type={show ? "text" : "password"}
          placeholder={placeholder}
          className="font-nunito font-normal placeholder:text-gray-400 focus:outline-none"
          style={{ width: "100%", height: "44px", padding: "10px 44px 10px 14px", borderRadius: "8px", border: "1px solid #E5E5E5", fontSize: "16px", color: "#292929", background: "#FFFFFF", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", boxSizing: "border-box" }}
        />
        <button
          type="button"
          onClick={() => setShow(p => !p)}
          style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", padding: 0 }}
        >
          {show ? <EyeOff size={16} style={{ color: "#737373" }} /> : <Eye size={16} style={{ color: "#737373" }} />}
        </button>
      </div>
    </div>
  );
}

function InputField({ label, placeholder, type = "text" }: { label: string; placeholder: string; type?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
      <FieldLabel>{label}</FieldLabel>
      <TextInput placeholder={placeholder} type={type} />
    </div>
  );
}

function SelectField({ label, defaultVal, options }: { label: string; defaultVal: string; options: string[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
      <FieldLabel>{label}</FieldLabel>
      <div style={{ position: "relative" }}>
        <select
          defaultValue={defaultVal}
          className="font-nunito font-normal focus:outline-none"
          style={{ width: "100%", height: "44px", padding: "10px 40px 10px 14px", borderRadius: "8px", border: "1px solid #E5E5E5", fontSize: "16px", color: "#292929", background: "#FFFFFF", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", appearance: "none", cursor: "pointer" }}
        >
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <svg style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="20" height="20" fill="none" viewBox="0 0 20 20">
          <path d="M5 7.5l5 5 5-5" stroke="#424242" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{ width: "36px", height: "20px", borderRadius: "9999px", background: on ? "#F63D68" : "#F2F4F7", border: "none", cursor: "pointer", padding: "2px", display: "flex", alignItems: "center", justifyContent: on ? "flex-end" : "flex-start", flexShrink: 0, transition: "background 0.2s" }}
    >
      <div style={{ width: "16px", height: "16px", borderRadius: "9999px", background: "#FFFFFF", boxShadow: "0px 1px 2px rgba(16,24,40,0.06), 0px 1px 3px rgba(16,24,40,0.10)" }} />
    </button>
  );
}

function ToggleRow({ label, on, onToggle }: { label: string; on: boolean; onToggle: () => void }) {
  return (
    <div style={{ background: "#FAFAFA", borderRadius: "12px", padding: "16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "6px" }}>
      <span className="font-nunito font-semibold" style={{ fontSize: "14px", lineHeight: "20px", color: "#424242" }}>
        {label}
      </span>
      <Toggle on={on} onToggle={onToggle} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Page — all state lives here, content rendered inline
───────────────────────────────────────────────────────── */
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Account");

  // Notifications state
  const [storyProgressEmail, setStoryProgressEmail] = useState(true);
  const [newBadgeEmail, setNewBadgeEmail]             = useState(true);
  const [purchasesEmail, setPurchasesEmail]           = useState(true);
  const [marketingEmail, setMarketingEmail]           = useState(false);
  const [appActivity, setAppActivity]                 = useState(true);
  const [storyCompletion, setStoryCompletion]         = useState(true);
  const [promoOffers, setPromoOffers]                 = useState(true);

  // Parental controls state
  const [hideAdvanced, setHideAdvanced]         = useState(true);
  const [disableLinks, setDisableLinks]         = useState(true);
  const [ageAppropriate, setAgeAppropriate]     = useState(true);
  const [bedtime, setBedtime]                   = useState(true);

  // Security state
  const [twoFA, setTwoFA] = useState(false);

  const devices = [
    { name: "Chrome on Windows (You)", location: "USA",       lastActive: "Active now",              online: true },
    { name: "iPhone app",              location: "Australia",  lastActive: "Last active 2 hours ago", online: false },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* ── Page Header ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <h1 className="font-nunito font-semibold" style={{ fontSize: "30px", lineHeight: "38px", color: "#141414" }}>Settings</h1>
          <p className="font-nunito font-normal" style={{ fontSize: "16px", lineHeight: "24px", color: "#525252" }}>
            Manage your account, preferences, and parental controls.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button type="button" className="font-nunito font-semibold" style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #D6D6D6", background: "#FFFFFF", fontSize: "14px", lineHeight: "20px", color: "#424242", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", cursor: "pointer" }}>
            Cancel
          </button>
          <button type="button" className="font-nunito font-bold text-white" style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #F63D68", background: "#F63D68", fontSize: "14px", lineHeight: "20px", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", cursor: "pointer" }}>
            Save
          </button>
        </div>
      </div>

      {/* ── Tab Bar ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "4px", paddingBottom: "12px", borderBottom: "1px solid #E5E5E5" }}>
        {TABS.map(tab => {
          const active = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={active ? "font-nunito font-semibold" : "font-nunito font-medium"}
              style={{ height: "36px", padding: "8px 12px", borderRadius: "6px", border: "none", cursor: "pointer", fontSize: "14px", lineHeight: "20px", color: active ? "#F63D68" : "#292929", background: active ? "#FFFFFF" : "transparent", boxShadow: active ? "0px 1px 2px rgba(16,24,40,0.06), 0px 1px 3px rgba(16,24,40,0.10)" : "none", transition: "all 0.15s", whiteSpace: "nowrap" }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════
          ACCOUNT TAB
      ══════════════════════════════════════════════════ */}
        <div style={{ display: activeTab === "Account" ? "flex" : "none", flexDirection: "column", gap: "16px" }}>

          {/* Parent Profile */}
          <SectionCard title="Parent Profile">
            <InputField label="Name" placeholder="Sarah" />
            <div style={{ display: "flex", gap: "20px" }}>
              <InputField label="Email" placeholder="sarah@untitledui.com" type="email" />
              <InputField label="Phone Number" placeholder="+1 (555) 000-0000" type="tel" />
            </div>
            {/* Your photo */}
            <div style={{ display: "flex", gap: "32px", alignItems: "flex-start", flexWrap: "wrap" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span className="font-nunito font-semibold" style={{ fontSize: "14px", lineHeight: "20px", color: "#424242" }}>Your photo</span>
                <span className="font-nunito font-normal" style={{ fontSize: "14px", lineHeight: "20px", color: "#737373" }}>This will be displayed on your profile.</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "24px", flex: 1 }}>
                <div style={{ width: "80px", height: "80px", borderRadius: "9999px", background: "#F2F4F7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "0.75px solid rgba(0,0,0,0.08)" }}>
                  <span className="font-nunito font-semibold" style={{ fontSize: "24px", color: "#737373" }}>S</span>
                </div>
                <div style={{ flex: 1, background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "8px", padding: "16px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", cursor: "pointer" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "8px", border: "1px solid #E5E5E5", background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)" }}>
                    <Upload size={20} style={{ color: "#424242" }} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <span className="font-nunito font-semibold" style={{ fontSize: "14px", color: "#F63D68" }}>Click to upload</span>
                    <span className="font-nunito font-normal" style={{ fontSize: "14px", color: "#525252" }}>or drag and drop</span>
                  </div>
                  <span className="font-nunito font-normal" style={{ fontSize: "12px", lineHeight: "18px", color: "#525252" }}>SVG, PNG, JPG or mp4 (max. 800×400px)</span>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Language Preference */}
          <SectionCard title="Language Preference">
            <SelectField label="Preferred Language" defaultVal="English" options={["English", "Spanish", "French", "Arabic", "Portuguese"]} />
          </SectionCard>

          {/* Delete Account */}
          <SectionCard title="DELETE ACCOUNT">
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <span className="font-nunito font-semibold" style={{ fontSize: "14px", lineHeight: "20px", color: "#424242" }}>If you delete this account:</span>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {["All child profiles", "Story history", "Game progress", "Purchased content access"].map(item => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <XCircle size={16} style={{ color: "#F04438", flexShrink: 0 }} />
                    <span className="font-nunito font-normal" style={{ fontSize: "12px", lineHeight: "18px", color: "#525252" }}>{item}</span>
                  </div>
                ))}
              </div>
              <div>
                <button type="button" className="font-nunito font-bold" style={{ padding: "8px 14px", borderRadius: "8px", border: "1px solid #FECDCA", background: "#FEF3F2", fontSize: "12px", lineHeight: "18px", color: "#F04438", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", cursor: "pointer" }}>
                  Delete my Account
                </button>
              </div>
            </div>
          </SectionCard>

        </div>

      {/* ══════════════════════════════════════════════════
          NOTIFICATIONS TAB
      ══════════════════════════════════════════════════ */}
        <div style={{ display: activeTab === "Notifications" ? "flex" : "none", flexDirection: "column", gap: "16px" }}>

          <SectionCard title="Email Notifications">
            <div style={{ display: "flex", gap: "32px" }}>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
                <ToggleRow label="Story Progress Updates"  on={storyProgressEmail} onToggle={() => setStoryProgressEmail(p => !p)} />
                <ToggleRow label="Purchase Confirmations"  on={purchasesEmail}     onToggle={() => setPurchasesEmail(p => !p)} />
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
                <ToggleRow label="New Badge Earned"  on={newBadgeEmail}   onToggle={() => setNewBadgeEmail(p => !p)} />
                <ToggleRow label="Marketing Updates" on={marketingEmail}  onToggle={() => setMarketingEmail(p => !p)} />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Push Notifications">
            <div style={{ display: "flex", gap: "32px" }}>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
                <ToggleRow label="App Activity"       on={appActivity}    onToggle={() => setAppActivity(p => !p)} />
                <ToggleRow label="Promotional Offers" on={promoOffers}    onToggle={() => setPromoOffers(p => !p)} />
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
                <ToggleRow label="Story Completion Alerts" on={storyCompletion} onToggle={() => setStoryCompletion(p => !p)} />
              </div>
            </div>
          </SectionCard>

        </div>

      {/* ══════════════════════════════════════════════════
          PARENTAL CONTROLS TAB
      ══════════════════════════════════════════════════ */}
        <div style={{ display: activeTab === "Parental Controls" ? "flex" : "none", flexDirection: "column", gap: "16px" }}>

          <SectionCard title="Child Access Rules">
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {["Mia", "Noah", "David"].map(child => (
                <div key={child} style={{ background: "#FAFAFA", borderRadius: "12px", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  <span className="font-nunito font-semibold" style={{ fontSize: "18px", lineHeight: "28px", color: "#141414" }}>{child}</span>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <SelectField label="Content Rating"    defaultVal="Age-appropriate (3-7)" options={["Age-appropriate (3-7)", "Educational only", "All content"]} />
                    <SelectField label="Daily Screen Time" defaultVal="1h 30m"                options={["30m", "1h", "1h 30m", "2h", "Unlimited"]} />
                  </div>
                  <SelectField label="Allowed Categories" defaultVal="Stories & Games" options={["Stories only", "Games only", "Stories & Games", "All"]} />
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Content Restrictions">
            <div style={{ display: "flex", gap: "32px" }}>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
                <ToggleRow label="Hide advanced games"                on={hideAdvanced}    onToggle={() => setHideAdvanced(p => !p)} />
                <ToggleRow label="Allow only age-appropriate content" on={ageAppropriate}  onToggle={() => setAgeAppropriate(p => !p)} />
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
                <ToggleRow label="Disable external links" on={disableLinks} onToggle={() => setDisableLinks(p => !p)} />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Time Controls">
            <SelectField label="Daily Time Limit for All Children" defaultVal="1h 30m" options={["30m", "1h", "1h 30m", "2h", "3h", "Unlimited"]} />
            <ToggleRow label="Bedtime Mode ( 8:00 PM to 7:00 AM )" on={bedtime} onToggle={() => setBedtime(p => !p)} />
          </SectionCard>

        </div>

      {/* ══════════════════════════════════════════════════
          SECURITY TAB
      ══════════════════════════════════════════════════ */}
        <div style={{ display: activeTab === "Security" ? "flex" : "none", flexDirection: "column", gap: "16px" }}>

          <SectionCard title="Change Password">
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <PasswordInput label="Current Password" placeholder="••••••••" />
              <div style={{ display: "flex", gap: "20px" }}>
                <PasswordInput label="New Password"         placeholder="" />
                <PasswordInput label="Re-type New Password" placeholder="" />
              </div>
            </div>
            <div>
              <button type="button" className="font-nunito font-bold text-white" style={{ padding: "8px 14px", borderRadius: "8px", border: "1px solid #F63D68", background: "#F63D68", fontSize: "12px", lineHeight: "18px", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", cursor: "pointer" }}>
                Update Password
              </button>
            </div>
          </SectionCard>

          <SectionCard title="Login &amp; Devices">
            <div style={{ borderRadius: "8px", overflow: "hidden", border: "1px solid #F2F4F7" }}>
              <div style={{ display: "flex", background: "#FAFAFA", borderBottom: "1px solid #F2F4F7" }}>
                {["Device", "Location", "Last Active", "Action"].map((col, i) => (
                  <div key={col} style={{ flex: i === 3 ? "0 0 80px" : 1, padding: "14px 20px" }}>
                    <span className="font-nunito font-semibold" style={{ fontSize: "12px", lineHeight: "18px", color: "#525252" }}>{col}</span>
                  </div>
                ))}
              </div>
              {devices.map((d, i) => (
                <div key={d.name} style={{ display: "flex", alignItems: "center", background: "#FFFFFF", borderBottom: i < devices.length - 1 ? "1px solid #EAECF0" : "none" }}>
                  <div style={{ flex: 1, padding: "16px 20px" }}>
                    <span className="font-nunito font-normal" style={{ fontSize: "16px", lineHeight: "24px", color: "#525252" }}>{d.name}</span>
                  </div>
                  <div style={{ flex: 1, padding: "16px 20px" }}>
                    <span className="font-nunito font-normal" style={{ fontSize: "16px", lineHeight: "24px", color: "#525252" }}>{d.location}</span>
                  </div>
                  <div style={{ flex: 1, padding: "16px 20px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "10px", height: "10px", borderRadius: "9999px", background: d.online ? "#17B26A" : "#D0D5DD", border: "1.5px solid #FFFFFF", flexShrink: 0 }} />
                    <span className="font-nunito font-normal" style={{ fontSize: "16px", lineHeight: "24px", color: "#525252" }}>{d.lastActive}</span>
                  </div>
                  <div style={{ flex: "0 0 80px", padding: "16px 20px" }}>
                    <button type="button" style={{ width: "28px", height: "28px", borderRadius: "9999px", background: "#FAFAFA", border: "1px solid #E5E5E5", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                      <LogOut size={14} style={{ color: "#525252" }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Two-Factor Authentication">
            <ToggleRow label="Enable Two-Factor Authentication" on={twoFA} onToggle={() => setTwoFA(p => !p)} />
          </SectionCard>

        </div>

    </div>
  );
}
