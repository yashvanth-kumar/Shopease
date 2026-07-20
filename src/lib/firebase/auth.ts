import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "./config";
import type { UserProfile } from "@/types";

/**
 * Registers a new customer account, sets their display name, sends an
 * email verification link, and creates their Firestore profile document.
 * New accounts always default to the "customer" role — role escalation to
 * admin/manager can only be done from the admin panel by an existing admin,
 * never from client-side signup code.
 */
export async function registerUser(email: string, password: string, displayName: string) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName });
  await sendEmailVerification(credential.user);

  const profile: Omit<UserProfile, "createdAt" | "updatedAt"> & {
    createdAt: unknown;
    updatedAt: unknown;
  } = {
    uid: credential.user.uid,
    email,
    displayName,
    role: "customer",
    emailVerified: false,
    wishlist: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(doc(db, "users", credential.user.uid), profile);
  return credential.user;
}

export async function loginUser(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  const credential = await signInWithPopup(auth, provider);
  const userRef = doc(db, "users", credential.user.uid);
  const existing = await getDoc(userRef);

  if (!existing.exists()) {
    const profile = {
      uid: credential.user.uid,
      email: credential.user.email ?? "",
      displayName: credential.user.displayName ?? "Customer",
      photoURL: credential.user.photoURL ?? undefined,
      role: "customer" as const,
      emailVerified: credential.user.emailVerified,
      wishlist: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(userRef, profile);
  }

  return credential.user;
}

export async function logoutUser() {
  await fbSignOut(auth);
}

export async function resendVerificationEmail(user: User) {
  await sendEmailVerification(user);
}

export async function requestPasswordReset(email: string) {
  await sendPasswordResetEmail(auth, email);
}

export function subscribeToAuthChanges(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Fetches the Firestore profile (including role) for a given uid.
 * The user's role must always be read from Firestore — never trusted from
 * client state alone — because Firestore security rules are the actual
 * authorization boundary enforced server-side by Firebase.
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  return snap.data() as UserProfile;
}
