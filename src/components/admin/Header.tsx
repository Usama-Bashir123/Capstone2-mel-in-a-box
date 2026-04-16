"use client";

import { Search, Bell, LogOut, User } from "lucide-react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export function AdminHeader() {
  const router = useRouter();
  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/admin/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <header
      className="bg-white flex items-center justify-between"
      style={{
        borderRadius: "12px",
        border: "1px solid #E5E5E5",
        padding: "12px",
        gap: "16px",
      }}
    >
      {/* Search */}
      <div className="relative w-[320px]">
        <Search
          size={16}
          className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[#A3A3A3]"
        />
        <input
          type="text"
          placeholder="Search"
          className="font-nunito w-full h-[44px] pl-[42px] pr-[14px] rounded-lg border border-[#E5E5E5] text-[16px] text-[#141414] focus:outline-none focus:ring-2 focus:ring-rose-500/10 placeholder:text-[#A3A3A3] bg-white shadow-sm"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* User Info */}
        {user && (
          <div className="flex items-center gap-3 px-3 py-1.5 border-r border-[#E5E5E5] hidden md:flex">
            <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center border border-rose-100">
              <User size={16} className="text-[#F63D68]" />
            </div>
            <div className="flex flex-col">
              <span className="font-nunito font-semibold text-[13px] text-[#141414] truncate max-w-[120px]">
                {user.displayName || "Admin"}
              </span>
              <span className="font-nunito text-[11px] text-[#737373] truncate max-w-[120px]">
                {user.email}
              </span>
            </div>
          </div>
        )}

        {/* Notifications */}
        <button
          className="w-10 h-10 rounded-full border border-[#E5E5E5] bg-white shadow-sm flex items-center justify-center relative hover:bg-gray-50 transition-colors"
        >
          <Bell size={18} className="text-[#424242]" />
          <span className="absolute top-[8px] right-[8px] w-1.5 h-1.5 rounded-full bg-[#D92D20]" />
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          title="Logout"
          className="w-10 h-10 rounded-full border border-[#E5E5E5] bg-white shadow-sm flex items-center justify-center text-[#737373] hover:text-[#D92D20] hover:bg-red-50 transition-all"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
