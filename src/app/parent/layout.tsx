import { ParentSidebar } from "@/components/parent/Sidebar";
import { ParentHeader } from "@/components/parent/Header";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { CartProvider } from "@/contexts/CartContext";

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <CartProvider>
        <div className="flex min-h-screen" style={{ background: "#FFF5F6" }}>
          <ParentSidebar />
          <div className="flex flex-col flex-1 min-w-0" style={{ padding: "20px 20px 20px 0", gap: "20px", display: "flex", flexDirection: "column" }}>
            <ParentHeader />
            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </div>
        </div>
      </CartProvider>
    </ProtectedRoute>
  );
}
