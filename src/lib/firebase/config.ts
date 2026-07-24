import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// All values are read from environment variables so no secrets are hardcoded.
// See .env.example for the required keys. Firebase web config values are
// not secret by design (they are safe to expose in client bundles), but we
// still keep them in env vars for easy multi-environment deployment.
//
// NOTE: Firebase Storage is intentionally not initialized here. Product image
// uploads are handled via Cloudinary (see ProductFormModal.tsx). Firestore and
// Auth remain unchanged.
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);

// Optional local emulator support for development without touching production data.
// Enable by setting NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true in .env.local
let emulatorsConnected = false;
if (
  typeof window !== "undefined" &&
  process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true" &&
  !emulatorsConnected
) {
  try {
    connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
    connectFirestoreEmulator(db, "localhost", 8080);
    emulatorsConnected = true;
  } catch {
    // Emulators already connected or unavailable — safe to ignore.
  }
}
