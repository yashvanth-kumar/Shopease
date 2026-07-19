"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import RequireAuth from "@/components/auth/RequireAuth";
import { useAuth } from "@/context/AuthContext";
import { updateUserProfile } from "@/lib/firebase/users";
import { resendVerificationEmail } from "@/lib/firebase/auth";
import { sanitizeInput } from "@/lib/utils";

function ProfileContent() {
  const { firebaseUser, profile, refreshProfile } = useAuth();
  const [displayName, setDisplayName] = useState(profile?.displayName ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!firebaseUser) return;
    setSaving(true);
    try {
      await updateUserProfile(firebaseUser.uid, {
        displayName: sanitizeInput(displayName),
        phone: sanitizeInput(phone),
      });
      await refreshProfile();
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleResendVerification() {
    if (!firebaseUser) return;
    try {
      await resendVerificationEmail(firebaseUser);
      toast.success("Verification email sent!");
    } catch {
      toast.error("Failed to send verification email.");
    }
  }

  return (
    <div className="container-page max-w-2xl py-8">
      <h1 className="font-display text-2xl font-bold text-ink-900 sm:text-3xl">My Profile</h1>

      {firebaseUser && !firebaseUser.emailVerified && (
        <div className="mt-4 flex items-center justify-between rounded-lg bg-accent-50 p-4 text-sm text-accent-800">
          <span>Your email address is not verified.</span>
          <button onClick={handleResendVerification} className="font-semibold underline">
            Resend email
          </button>
        </div>
      )}

      <form onSubmit={handleSave} className="card mt-6 space-y-4 p-6">
        <div>
          <label htmlFor="displayName" className="mb-1.5 block text-sm font-medium text-ink-700">
            Full Name
          </label>
          <input
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink-700">
            Email
          </label>
          <input id="email" value={firebaseUser?.email ?? ""} disabled className="input-field bg-ink-50" />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-ink-700">
            Phone Number
          </label>
          <input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="input-field"
          />
        </div>
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <RequireAuth>
      <ProfileContent />
    </RequireAuth>
  );
}
