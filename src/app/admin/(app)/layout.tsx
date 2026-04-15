import { AdminSidebar } from "@/components/admin/Sidebar";
import { AdminHeader } from "@/components/admin/Header";

export default function AdminAppLayout({ children }: { children: React.ReactNode }) {
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
