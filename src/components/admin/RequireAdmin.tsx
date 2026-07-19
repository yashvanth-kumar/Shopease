"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ShieldAlert } from "lucide-react";

/**
 * Gates all /admin routes so only users whose Firestore profile has
 * role "admin" or "manager" can view them. This is a UX-layer guard —
 * the actual, unbypassable enforcement lives in firestore.rules, which
 * independently reject any admin-only read/write from a non-admin uid
 * regardless of what the client believes. Customers can never reach
 * admin functionality even if they navigate directly to an /admin URL
 * or tamper with client-side state, because every admin data operation
 * re-checks the role server-side via security rules.
 */
export default function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { firebaseUser, profile, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !firebaseUser) {
      router.push("/login");
    }
  }, [loading, firebaseUser, router]);

  if (loading) {
    return <div className="container-page py-24 text-center text-ink-500">Loading...</div>;
  }

  if (!firebaseUser) return null;

  if (!isAdmin) {
    return (
      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
          <ShieldAlert size={30} />
        </div>
        <h1 className="mt-5 font-display text-2xl font-bold text-ink-900">Access Denied</h1>
        <p className="mt-2 max-w-sm text-sm text-ink-500">
          You don&apos;t have permission to view the admin panel. This area is restricted to
          ShopEase administrators.
        </p>
        <p className="mt-1 text-xs text-ink-400">Signed in as {profile?.email}</p>
      </div>
    );
  }

  return <>{children}</>;
}
