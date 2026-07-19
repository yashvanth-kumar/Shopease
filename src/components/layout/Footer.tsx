import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";

const SHOP_LINKS = [
  { href: "/shop", label: "All Products" },
  { href: "/categories", label: "Categories" },
  { href: "/shop?sort=newest", label: "New Arrivals" },
  { href: "/shop?featured=true", label: "Featured" },
];

const HELP_LINKS = [
  { href: "/faq", label: "FAQ" },
  { href: "/shipping-policy", label: "Shipping Policy" },
  { href: "/return-policy", label: "Return & Refund Policy" },
  { href: "/contact", label: "Contact Us" },
];

const COMPANY_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
];

export default function Footer() {
  return (
    <footer className="border-t border-ink-100 bg-ink-950 text-ink-200">
      <div className="container-page grid grid-cols-2 gap-8 py-12 sm:grid-cols-2 lg:grid-cols-5">
        <div className="col-span-2">
          <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
              S
            </span>
            ShopEase
          </Link>
          <p className="mt-3 max-w-sm text-sm text-ink-400">
            Everything you need, delivered fast. Quality products across electronics, fashion,
            home, beauty, and more — with secure checkout and easy returns.
          </p>
          <div className="mt-4 flex gap-3">
            <a href="https://facebook.com" aria-label="Facebook" className="rounded-lg bg-ink-900 p-2 hover:bg-ink-800">
              <Facebook size={18} />
            </a>
            <a href="https://instagram.com" aria-label="Instagram" className="rounded-lg bg-ink-900 p-2 hover:bg-ink-800">
              <Instagram size={18} />
            </a>
            <a href="https://twitter.com" aria-label="Twitter" className="rounded-lg bg-ink-900 p-2 hover:bg-ink-800">
              <Twitter size={18} />
            </a>
            <a href="https://youtube.com" aria-label="YouTube" className="rounded-lg bg-ink-900 p-2 hover:bg-ink-800">
              <Youtube size={18} />
            </a>
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-white">Shop</h3>
          <ul className="space-y-2">
            {SHOP_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-ink-400 hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-white">Help</h3>
          <ul className="space-y-2">
            {HELP_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-ink-400 hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-white">Company</h3>
          <ul className="space-y-2">
            {COMPANY_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-ink-400 hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="mt-4 space-y-2 text-sm text-ink-400">
            <li className="flex items-center gap-2">
              <Mail size={14} /> support@shopease-demo.com
            </li>
            <li className="flex items-center gap-2">
              <Phone size={14} /> +1 (800) 555-0199
            </li>
            <li className="flex items-start gap-2">
              <MapPin size={14} className="mt-0.5 shrink-0" /> 500 Market St, San Francisco, CA
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ink-900">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-4 text-xs text-ink-500 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} ShopEase. All rights reserved.</p>
          <p>Built with Next.js, Tailwind CSS &amp; Firebase.</p>
        </div>
      </div>
    </footer>
  );
}
