# ShopEase — Full-Stack eCommerce Platform

A production-ready, responsive eCommerce website built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Firebase** (Authentication, Firestore, Storage, Hosting).

## Features

- **22 customer-facing pages**: Home, Shop, Categories, Product Details, Search, Cart, Checkout, Order Success, Login, Register, Forgot Password, Profile, Order History, Wishlist, Contact, About, FAQ, Privacy Policy, Terms, Shipping Policy, Return Policy, 404
- **Full admin panel** (role-gated): Dashboard with analytics, Product/Category/Order/Customer/Coupon/Banner management, Review moderation, Site & SEO settings, Role management, Reports with CSV export, Backup & Restore
- **Customer features**: search, category/brand/price/rating filters, wishlist, cart, coupons, secure checkout (Cash on Delivery), order tracking, email verification, password reset, reviews & ratings, related & recently-viewed products
- **Security**: Firebase Auth, Firestore Security Rules enforcing role-based authorization server-side, input sanitization, client-side rate limiting, strict CSP headers, no admin functionality ever reachable by customer accounts
- **SEO**: dynamic sitemap.xml & robots.txt, per-page metadata, Open Graph tags, JSON-LD structured data (Organization, WebSite, Product)
- **Performance**: lazy-loaded images via `next/image`, code-split routes, pagination, in-memory caching patterns

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS |
| State | Zustand (cart, recently viewed) + React Context (auth) |
| Backend | Firebase Authentication, Firestore, Storage |
| Hosting | Firebase Hosting (with Next.js framework support) |
| Icons | lucide-react |

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Firebase project

1. Go to the [Firebase Console](https://console.firebase.google.com) and create a new project.
2. Enable **Authentication** → Sign-in methods: **Email/Password** and **Google**.
3. Enable **Firestore Database** (start in production mode).
4. Enable **Storage**.
5. Register a **Web App** in Project Settings and copy the config values.

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in your Firebase config values in `.env.local`.

### 4. Deploy security rules

```bash
npm install -g firebase-tools
firebase login
firebase use --add   # select your project, alias it "default"
firebase deploy --only firestore:rules,firestore:indexes,storage
```

### 5. Seed the database

```bash
npm run seed
```

This populates categories, 25 sample products across 8 categories, default site settings, and a demo coupon (`WELCOME10`).

> **Note:** Firestore rules require the writer to already be an admin for most writes. For the initial seed, either run it against the Firestore Emulator (`firebase emulators:start`, set `NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true`) or temporarily loosen `firestore.rules` writes, seed, then redeploy the real rules from this repo.

### 6. Create your first admin account

1. Register a normal account on the site (`/register`).
2. In the Firebase Console, open **Firestore → users → [your uid]**.
3. Change the `role` field from `customer` to `admin`.
4. Sign out and back in — you'll now see **Admin Dashboard** in the account menu.

### 7. Run the development server

```bash
npm run dev
```

Visit `http://localhost:3000`.

## Deployment (Firebase Hosting)

```bash
npm run build
firebase deploy
```

Your site will be live at `https://<your-project-id>.web.app`.

### Connecting a custom domain & Google Search Console

1. In Firebase Hosting settings, click **Add custom domain** and follow the DNS verification steps.
2. Once verified, submit your sitemap (`https://yourdomain.com/sitemap.xml`) in [Google Search Console](https://search.google.com/search-console).

## Project Structure

```
src/
  app/                    # Next.js App Router pages
    (auth)/               # Login, Register, Forgot Password
    (shop)/                # Shop, Cart, Checkout, Product, Categories, Search
    (account)/             # Profile, Orders, Wishlist
    admin/                 # Full admin panel (role-gated)
    [static pages]/        # About, Contact, FAQ, legal pages
  components/             # Reusable UI, organized by domain
  context/                # AuthContext, cart & recently-viewed Zustand stores
  data/                   # Seed data (categories, products) — also used as
                          # local dev fallback data for the storefront
  lib/
    firebase/             # All Firestore/Auth/Storage data-access functions
    utils.ts, rateLimit.ts
  types/                  # Shared TypeScript types
scripts/seed.ts           # Database seeding script
firestore.rules           # Server-enforced authorization rules
storage.rules              # Storage upload rules
firestore.indexes.json     # Composite indexes for compound queries
```

## Security Notes

- **Role-based access control** is enforced in `firestore.rules`, not just in the UI — a customer account can never read/write admin-only data even by calling the client SDK directly.
- Passwords are never handled by application code — Firebase Authentication manages hashing and storage.
- All free-text user input (reviews, contact form, checkout address) is sanitized client-side before being written, and further constrained by Firestore rules server-side.
- Client-side rate limiting throttles login, registration, password reset, coupon, and contact-form attempts; Firebase Authentication's built-in server-side throttling is the authoritative protection layer.

## License

This project was generated as a demo/starter template. Customize freely for your own use.
