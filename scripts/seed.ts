/**
 * Seeds Firestore with initial catalog data: categories, products, a demo
 * coupon, and default site settings. Run once after setting up a new
 * Firebase project and before going live.
 *
 * Usage:
 *   1. Fill in .env.local with your Firebase project credentials
 *   2. npm run seed
 *
 * This script uses the Firebase client SDK, so it authenticates as an
 * anonymous/admin-configured context — for a brand-new project, temporarily
 * relax firestore.rules writes (or run against the Firestore emulator)
 * while seeding, then redeploy the production rules from firestore.rules
 * before going live.
 */
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { categoriesSeed } from "../src/data/categories";
import { productsSeed } from "../src/data/products";
import { DEFAULT_SETTINGS } from "../src/lib/firebase/settings";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

async function seed() {
  if (!firebaseConfig.projectId) {
    console.error(
      "Missing NEXT_PUBLIC_FIREBASE_PROJECT_ID. Please configure .env.local before seeding."
    );
    process.exit(1);
  }

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  console.log("Seeding categories...");
  for (const category of categoriesSeed) {
    await setDoc(doc(db, "categories", category.id), {
      ...category,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
  console.log(`  ✓ ${categoriesSeed.length} categories seeded`);

  console.log("Seeding products...");
  for (const product of productsSeed) {
    await setDoc(doc(db, "products", product.id), {
      ...product,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
  console.log(`  ✓ ${productsSeed.length} products seeded`);

  console.log("Seeding site settings...");
  await setDoc(doc(db, "settings", "site"), DEFAULT_SETTINGS);
  console.log("  ✓ Site settings initialized");

  console.log("Seeding demo coupon...");
  await setDoc(doc(db, "coupons", "demo-welcome10"), {
    id: "demo-welcome10",
    code: "WELCOME10",
    type: "percentage",
    value: 10,
    minOrderValue: 25,
    maxDiscount: 50,
    usageLimit: 1000,
    usedCount: 0,
    perUserLimit: 1,
    startsAt: Date.now(),
    expiresAt: Date.now() + 365 * 86_400_000,
    isActive: true,
    createdAt: serverTimestamp(),
  });
  console.log("  ✓ Demo coupon WELCOME10 created (10% off orders over $25)");

  console.log("\n✅ Seeding complete!");
  console.log("\nNext steps:");
  console.log("  1. Deploy firestore.rules: firebase deploy --only firestore:rules");
  console.log("  2. Create your first admin user by registering normally,");
  console.log('     then manually setting role: "admin" on that user document');
  console.log("     in the Firebase Console (Firestore > users > [uid] > role).");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
