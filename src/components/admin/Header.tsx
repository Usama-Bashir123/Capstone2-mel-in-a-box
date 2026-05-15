"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Bell, LogOut, User, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

// Mock notifications data with links
const mockNotifications = [
  {
    id: 1,
    title: "New User Registration",
    message: "A new parent account has been created.",
    time: "5 mins ago",
    type: "info",
    isRead: false,
    href: "/admin/users",
  },
  {
    id: 2,
    title: "System Alert",
    message: "High traffic detected on the video streaming server.",
    time: "1 hour ago",
    type: "warning",
    isRead: false,
    href: "/admin/videos",
  },
  {
    id: 3,
    title: "Content Approval",
    message: "A new story 'The Brave Little Explorer' needs your approval.",
    time: "2 hours ago",
    type: "success",
    isRead: true,
    href: "/admin/stories",
  },
];

export function AdminHeader() {
  const router = useRouter();
  const user = auth.currentUser;
  
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/admin/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Handle clicking outside to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const handleNotificationClick = (notification: typeof mockNotifications[0]) => {
    // Mark as read
    setNotifications(notifications.map(n => 
      n.id === notification.id ? { ...n, isRead: true } : n
    ));
    // Close dropdown
    setIsNotificationsOpen(false);
    // Navigate to the linked page
    router.push(notification.href);
  };

  return (
    <header
      className="bg-white flex items-center justify-between z-40 relative"
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
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="w-10 h-10 rounded-full border border-[#E5E5E5] bg-white shadow-sm flex items-center justify-center relative hover:bg-gray-50 transition-colors"
          >
            <Bell size={18} className="text-[#424242]" />
            {unreadCount > 0 && (
              <span className="absolute top-[8px] right-[8px] w-2 h-2 rounded-full bg-[#D92D20] ring-2 ring-white" />
            )}
          </button>

          {/* Notifications Dropdown */}
          <AnimatePresence>
            {isNotificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute right-0 top-[calc(100%+12px)] w-[360px] bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#E5E5E5] overflow-hidden z-50"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-[#E5E5E5] bg-[#FAFAFA]">
                  <h3 className="font-nunito font-bold text-[#141414]">Notifications</h3>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllAsRead}
                      className="text-xs font-nunito font-medium text-[#F63D68] hover:text-[#d42c54] transition-colors"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                {/* List */}
                <div className="max-h-[380px] overflow-y-auto">
                  {notifications.length > 0 ? (
                    <div className="flex flex-col">
                      {notifications.map((notification) => (
                        <div 
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`flex items-start gap-3 p-4 border-b border-[#E5E5E5] last:border-0 hover:bg-gray-50 transition-colors cursor-pointer ${!notification.isRead ? 'bg-[#F63D68]/5' : ''}`}
                        >
                          {/* Icon based on type */}
                          <div className="mt-1 flex-shrink-0">
                            {notification.type === 'success' && <CheckCircle2 size={18} className="text-green-500" />}
                            {notification.type === 'warning' && <AlertCircle size={18} className="text-amber-500" />}
                            {notification.type === 'info' && <Info size={18} className="text-blue-500" />}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-nunito ${!notification.isRead ? 'font-bold text-[#141414]' : 'font-semibold text-[#424242]'}`}>
                              {notification.title}
                            </p>
                            <p className="text-xs font-nunito text-[#737373] mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-[10px] font-nunito text-[#A3A3A3] mt-2">
                              {notification.time}
                            </p>
                          </div>
                          
                          {/* Unread dot indicator */}
                          {!notification.isRead && (
                            <div className="w-2 h-2 rounded-full bg-[#F63D68] mt-2 flex-shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center flex flex-col items-center justify-center text-[#737373]">
                      <Bell size={32} className="mb-3 text-[#E5E5E5]" />
                      <p className="font-nunito text-sm">No new notifications</p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-[#E5E5E5] bg-[#FAFAFA] text-center">
                  <button 
                    onClick={() => {
                      setIsNotificationsOpen(false);
                      router.push("/admin/activity");
                    }}
                    className="text-sm font-nunito font-semibold text-[#141414] hover:text-[#F63D68] transition-colors"
                  >
                    View all activity
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

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
