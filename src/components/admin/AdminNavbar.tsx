"use client";

import { useAuth } from "@/context/AuthContext";
import { LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import toast from "react-hot-toast";

export default function AdminNavbar() {
  const { profile } = useAuth();

  async function handleLogout() {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
    } catch {
      toast.error("Logout failed");
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
      <div>
        <h1 className="text-xl font-bold text-gray-900">
          ShopEase Admin
        </h1>

        <p className="text-sm text-gray-500">
          Welcome back, {profile?.displayName || "Administrator"}
        </p>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
      >
        <LogOut size={18} />
        Logout
      </button>
    </header>
  );
}
