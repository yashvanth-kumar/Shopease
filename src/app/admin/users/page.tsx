"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useAuth } from "@/context/AuthContext";
import { getAllUsersForAdmin, setUserRole } from "@/lib/firebase/users";
import type { UserProfile, UserRole } from "@/types";

export default function AdminUsersPage() {
  const { profile: currentProfile } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pendingChange, setPendingChange] = useState<{ user: UserProfile; role: UserRole } | null>(null);

  async function load() {
    setLoading(true);
    try {
      setUsers(await getAllUsersForAdmin());
    } catch {
      toast.error("Failed to load users.");
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

  async function handleConfirmRoleChange() {
    if (!pendingChange) return;
    try {
      await setUserRole(pendingChange.user.uid, pendingChange.role);
      toast.success(`${pendingChange.user.displayName} is now a ${pendingChange.role}`);
      load();
    } catch {
      toast.error("Failed to update role. Only existing admins can grant admin access.");
    } finally {
      setPendingChange(null);
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Admin Users & Roles"
        subtitle="Manage who has administrative access to ShopEase. Handle with care."
      />

      <div className="mb-4 rounded-lg border border-accent-200 bg-accent-50 p-3 text-sm text-accent-800">
        Only existing admins can grant or revoke admin/manager access. Role changes are enforced
        server-side by Firestore security rules, so this list always reflects the real permission
        state of every account.
      </div>

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
              <th className="px-4 py-3 font-medium text-ink-500">Current Role</th>
              <th className="px-4 py-3 text-right font-medium text-ink-500">Change Role</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={4} className="py-8 text-center text-ink-400">Loading users...</td></tr>}
            {!loading && filtered.map((u) => (
              <tr key={u.uid} className="border-t border-ink-100">
                <td className="px-4 py-3 font-medium text-ink-900">{u.displayName}</td>
                <td className="px-4 py-3 text-ink-600">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                    u.role === "admin" ? "bg-brand-600 text-white" :
                    u.role === "manager" ? "bg-brand-100 text-brand-700" : "bg-ink-100 text-ink-600"
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <select
                    value={u.role}
                    disabled={u.uid === currentProfile?.uid}
                    onChange={(e) => setPendingChange({ user: u, role: e.target.value as UserRole })}
                    className="input-field w-auto !py-1.5 text-sm"
                  >
                    <option value="customer">Customer</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pendingChange && (
        <ConfirmDialog
          title="Change User Role"
          message={`Change ${pendingChange.user.displayName}'s role to "${pendingChange.role}"? This will ${pendingChange.role !== "customer" ? "grant" : "remove"} administrative access.`}
          confirmLabel="Confirm Change"
          danger={pendingChange.role === "admin"}
          onCancel={() => setPendingChange(null)}
          onConfirm={handleConfirmRoleChange}
        />
      )}
    </div>
  );
}
