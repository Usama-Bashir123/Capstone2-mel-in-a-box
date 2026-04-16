"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { AdminSidebar } from "@/components/admin/Sidebar";
import { AdminHeader } from "@/components/admin/Header";
import { Loader2 } from "lucide-react";

const AUTHORIZED_ADMINS = ["admin@gmail.com"];

export default function AdminAppLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/admin/login");
      } else {
        if (!AUTHORIZED_ADMINS.includes(user.email || "")) {
          console.warn("Unauthorized admin access attempt:", user.email);
          await signOut(auth);
          router.push("/admin/login?error=unauthorized");
        } else {
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FFF5F6]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-[#F63D68]" />
          <p className="font-nunito text-gray-500">Checking authorization...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen" style={{ background: "#FFF5F6" }}>
      <AdminSidebar />
      <div
        className="flex flex-col flex-1 min-w-0"
        style={{ padding: "20px 20px 20px 0", gap: "20px", display: "flex", flexDirection: "column" }}
      >
        <AdminHeader />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
