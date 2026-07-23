import type { ReactNode } from "react";
import RequireAdmin from "@/components/admin/RequireAdmin";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({
  children,
}: AdminLayoutProps) {
  return (
    <RequireAdmin>
      <div className="min-h-screen bg-slate-100">
        <div className="flex">
          {/* Sidebar */}
          <AdminSidebar />

          {/* Main */}
          <div className="flex flex-1 flex-col lg:ml-64">
            <AdminNavbar />

            <main className="flex-1 p-6">
              {children}
            </main>
          </div>
        </div>
      </div>
    </RequireAdmin>
  );
}
