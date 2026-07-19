"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { firebaseUser, loading } = useAuth();
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

  return <>{children}</>;
}
