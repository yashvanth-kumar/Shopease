import type { Metadata } from "next";
import RequireAdmin from "@/components/admin/RequireAdmin";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAdmin>
      <div className="flex">
        <AdminSidebar />
        <div className="min-w-0 flex-1 bg-ink-50">
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </div>
      </div>
    </RequireAdmin>
  );
}
