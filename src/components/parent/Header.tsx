"use client";

// Parent Header — Figma node 263:26939
// bg white border #E5E5E5 r=12 p=12 gap=32 h=hug w=1069
// Search: 320px input r=8 border #E5E5E5 shadow-xs icon-leading
// Actions: 40×40 circle buttons border #E5E5E5 shadow-xs

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, Bell, Settings, ShoppingCart, CheckCircle2, AlertCircle, Info, Gift } from "lucide-react";
import { useAuth } from "@/components/auth/auth-context";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { AnimatePresence, motion } from "framer-motion";

// Mock notifications data for Parent Dashboard
const mockParentNotifications = [
  {
    id: 1,
    title: "Story Completed!",
    message: "Your child has successfully finished reading 'The Brave Little Explorer'.",
    time: "10 mins ago",
    type: "success",
    isRead: false,
    href: "/parent/story-progress",
  },
  {
    id: 2,
    title: "New Reward Unlocked",
    message: "A new achievement badge was earned in the Memory Match game.",
    time: "2 hours ago",
    type: "reward",
    isRead: false,
    href: "/parent/rewards",
  },
  {
    id: 3,
    title: "New Party Themes Available",
    message: "Explore our latest collection of interactive party themes in the shop.",
    time: "1 day ago",
    type: "info",
    isRead: true,
    href: "/parent/party-themes",
  },
];

export function ParentHeader() {
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems } = useCart();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockParentNotifications);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const displayName = user?.displayName || user?.email?.split("@")[0] || "User";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const isPartyThemes = pathname.startsWith("/parent/party-themes") || pathname.startsWith("/parent/cart");

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

  const handleNotificationClick = (notification: typeof mockParentNotifications[0]) => {
    setNotifications(notifications.map(n => 
      n.id === notification.id ? { ...n, isRead: true } : n
    ));
    setIsNotificationsOpen(false);
    router.push(notification.href);
  };

  return (
    <header
      className="bg-white relative z-40"
      style={{
        borderRadius: "12px",
        border: "1px solid #E5E5E5",
        padding: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        marginBottom: "0",
      }}
    >
      {/* Search — 320px, icon-leading, r=8, border #E5E5E5 */}
      <div style={{ position: "relative", width: "320px" }}>
        <Search size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#A3A3A3" }} />
        <input
          type="text"
          placeholder="Search"
          className="font-nunito font-normal placeholder:text-gray-400 focus:outline-none"
          style={{
            width: "100%",
            height: "44px",
            paddingLeft: "42px",
            paddingRight: "14px",
            borderRadius: "8px",
            border: "1px solid #E5E5E5",
            fontSize: "16px",
            lineHeight: "24px",
            color: "#141414",
            background: "#FFFFFF",
            boxShadow: "0px 1px 2px 0px rgba(16,24,40,0.05)",
          }}
        />
      </div>

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>

        {/* Cart icon — visible on party-themes & cart pages */}
        {isPartyThemes && (
          <Link
            href="/parent/cart"
            style={{
              position: "relative", width: "40px", height: "40px", borderRadius: "20px",
              border: "1px solid #E5E5E5", background: "#FFFFFF",
              boxShadow: "0px 1px 2px 0px rgba(16,24,40,0.05)",
              display: "flex", alignItems: "center", justifyContent: "center",
              textDecoration: "none",
            }}
          >
            <ShoppingCart size={18} style={{ color: "#424242" }} />
            {totalItems > 0 && (
              <span style={{
                position: "absolute", top: "5px", right: "5px",
                minWidth: "16px", height: "16px", borderRadius: "9999px",
                background: "#F63D68", border: "2px solid #FFFFFF",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "9px", fontWeight: 700, color: "#FFFFFF",
                fontFamily: "Nunito, sans-serif", lineHeight: 1, padding: "0 3px",
              }}>
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </Link>
        )}

        {/* Notification */}
        <div style={{ position: "relative" }} ref={dropdownRef}>
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "20px",
              border: "1px solid #E5E5E5",
              background: "#FFFFFF",
              boxShadow: "0px 1px 2px 0px rgba(16,24,40,0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              cursor: "pointer",
            }}
            className="hover:bg-gray-50 transition-colors"
          >
            <Bell size={18} style={{ color: "#424242" }} />
            {unreadCount > 0 && (
              <span style={{ position: "absolute", top: "8px", right: "8px", width: "8px", height: "8px", borderRadius: "50%", background: "#D92D20", border: "2px solid white" }} />
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
                            {notification.type === 'reward' && <Gift size={18} className="text-amber-500" />}
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
                      router.push("/parent");
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

        {/* Settings */}
        <Link
          href="/parent/settings"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "20px",
            border: "1px solid #E5E5E5",
            background: "#FFFFFF",
            boxShadow: "0px 1px 2px 0px rgba(16,24,40,0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            textDecoration: "none",
          }}
          className="hover:bg-gray-50 transition-colors"
        >
          <Settings size={18} style={{ color: "#424242" }} />
        </Link>

        {/* Avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "#F2F4F7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              overflow: "hidden",
              border: "1px solid #E5E5E5",
            }}
          >
            {user?.photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.photoURL}
                alt="Avatar"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <span className="font-inter font-semibold" style={{ fontSize: "16px", color: "#525252" }}>{initials}</span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
