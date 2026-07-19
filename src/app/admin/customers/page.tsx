"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { getAllUsersForAdmin, setUserDisabled } from "@/lib/firebase/users";
import { formatDate } from "@/lib/utils";
import type { UserProfile } from "@/types";

export default function AdminCustomersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toggleTarget, setToggleTarget] = useState<UserProfile | null>(null);

  async function load() {
    setLoading(true);
    try {
      const data = await getAllUsersForAdmin();
      setUsers(data.filter((u) => u.role === "customer"));
    } catch {
      toast.error("Failed to load customers.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = users.filter(
    (u) =>
      u.displayName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  async function handleToggleDisabled() {
    if (!toggleTarget) return;
    try {
      await setUserDisabled(toggleTarget.uid, !toggleTarget.disabled);
      toast.success(toggleTarget.disabled ? "Customer re-enabled" : "Customer disabled");
      load();
    } catch {
      toast.error("Failed to update customer status.");
    } finally {
      setToggleTarget(null);
    }
  }

  return (
    <div>
      <AdminPageHeader title="Customers" subtitle={`${users.length} registered customers`} />

      <div className="mb-4 max-w-sm">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="input-field"
        />
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink-50">
            <tr>
              <th className="px-4 py-3 font-medium text-ink-500">Name</th>
              <th className="px-4 py-3 font-medium text-ink-500">Email</th>
              <th className="px-4 py-3 font-medium text-ink-500">Joined</th>
              <th className="px-4 py-3 font-medium text-ink-500">Status</th>
              <th className="px-4 py-3 text-right font-medium text-ink-500">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={5} className="py-8 text-center text-ink-400">Loading customers...</td></tr>}
            {!loading && filtered.length === 0 && <tr><td colSpan={5} className="py-8 text-center text-ink-400">No customers found</td></tr>}
            {filtered.map((u) => (
              <tr key={u.uid} className="border-t border-ink-100">
                <td className="px-4 py-3 font-medium text-ink-900">{u.displayName}</td>
                <td className="px-4 py-3 text-ink-600">{u.email}</td>
                <td className="px-4 py-3 text-ink-600">{formatDate(u.createdAt)}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${u.disabled ? "bg-red-50 text-red-600" : "bg-brand-50 text-brand-700"}`}>
                    {u.disabled ? "Disabled" : "Active"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setToggleTarget(u)} className="text-sm font-semibold text-brand-700 hover:underline">
                    {u.disabled ? "Enable" : "Disable"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {toggleTarget && (
        <ConfirmDialog
          title={toggleTarget.disabled ? "Enable Customer" : "Disable Customer"}
          message={`Are you sure you want to ${toggleTarget.disabled ? "re-enable" : "disable"} ${toggleTarget.displayName}'s account?`}
          confirmLabel={toggleTarget.disabled ? "Enable" : "Disable"}
          danger={!toggleTarget.disabled}
          onCancel={() => setToggleTarget(null)}
          onConfirm={handleToggleDisabled}
        />
      )}
    </div>
  );
}
