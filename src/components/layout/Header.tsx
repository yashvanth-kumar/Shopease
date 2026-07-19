"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ShoppingCart, Heart, User, Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCartStore } from "@/context/cartStore";
import { logoutUser } from "@/lib/firebase/auth";
import toast from "react-hot-toast";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/categories", label: "Categories" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const router = useRouter();
  const { firebaseUser, profile, isAdmin } = useAuth();
  const itemCount = useCartStore((s) => s.itemCount());
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setMobileOpen(false);
    }
  }

  async function handleLogout() {
    await logoutUser();
    toast.success("Signed out successfully");
    setAccountOpen(false);
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-ink-100 bg-white/95 backdrop-blur">
      <div className="container-page flex h-16 items-center gap-4">
        <button
          className="rounded-lg p-2 hover:bg-ink-100 md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold text-brand-700">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
            S
          </span>
          <span className="hidden sm:inline">ShopEase</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-100 hover:text-ink-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <form onSubmit={handleSearch} className="ml-2 hidden flex-1 max-w-md lg:flex" role="search">
          <div className="relative w-full">
            <Search
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, brands..."
              aria-label="Search products"
              className="input-field pl-10"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-1">
          <Link
            href="/search"
            className="rounded-lg p-2 hover:bg-ink-100 lg:hidden"
            aria-label="Search"
          >
            <Search size={20} />
          </Link>

          <Link
            href="/wishlist"
            className="hidden rounded-lg p-2 hover:bg-ink-100 sm:block"
            aria-label="Wishlist"
          >
            <Heart size={20} />
          </Link>

          <Link href="/cart" className="relative rounded-lg p-2 hover:bg-ink-100" aria-label={`Cart, ${itemCount} items`}>
            <ShoppingCart size={20} />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-accent-500 px-1 text-[10px] font-bold text-white">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>

          <div className="relative">
            <button
              className="rounded-lg p-2 hover:bg-ink-100"
              onClick={() => setAccountOpen((v) => !v)}
              aria-label="Account menu"
              aria-expanded={accountOpen}
            >
              <User size={20} />
            </button>

            {accountOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-56 animate-scaleIn rounded-xl border border-ink-100 bg-white p-2 shadow-popover"
                onMouseLeave={() => setAccountOpen(false)}
              >
                {firebaseUser ? (
                  <>
                    <div className="border-b border-ink-100 px-3 py-2">
                      <p className="truncate text-sm font-semibold text-ink-900">
                        {profile?.displayName || "My Account"}
                      </p>
                      <p className="truncate text-xs text-ink-500">{firebaseUser.email}</p>
                    </div>
                    <Link href="/profile" className="block rounded-lg px-3 py-2 text-sm hover:bg-ink-100" onClick={() => setAccountOpen(false)}>
                      My Profile
                    </Link>
                    <Link href="/orders" className="block rounded-lg px-3 py-2 text-sm hover:bg-ink-100" onClick={() => setAccountOpen(false)}>
                      Order History
                    </Link>
                    <Link href="/wishlist" className="block rounded-lg px-3 py-2 text-sm hover:bg-ink-100 sm:hidden" onClick={() => setAccountOpen(false)}>
                      Wishlist
                    </Link>
                    {isAdmin && (
                      <Link href="/admin" className="block rounded-lg px-3 py-2 text-sm font-medium text-brand-700 hover:bg-brand-50" onClick={() => setAccountOpen(false)}>
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="mt-1 block w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-ink-100" onClick={() => setAccountOpen(false)}>
                      Sign In
                    </Link>
                    <Link href="/register" className="block rounded-lg px-3 py-2 text-sm hover:bg-ink-100" onClick={() => setAccountOpen(false)}>
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {mobileOpen && (
        <nav className="animate-slideDown border-t border-ink-100 bg-white px-4 py-3 md:hidden" aria-label="Mobile navigation">
          <form onSubmit={handleSearch} className="mb-3">
            <div className="relative">
              <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                aria-label="Search products"
                className="input-field pl-10"
              />
            </div>
          </form>
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-100"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
