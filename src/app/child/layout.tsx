import { ChildSidebar } from "@/components/child/Sidebar";
import { ChildHeader } from "@/components/child/Header";

export default function ChildLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-rose-25">
      <ChildSidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <ChildHeader />
        <main className="flex-1 p-5 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
