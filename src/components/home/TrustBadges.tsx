import { Truck, ShieldCheck, RotateCcw, Headphones } from "lucide-react";

const BADGES = [
  { icon: Truck, title: "Free Shipping", desc: "On orders over $50" },
  { icon: ShieldCheck, title: "Secure Checkout", desc: "128-bit SSL encryption" },
  { icon: RotateCcw, title: "Easy Returns", desc: "30-day return window" },
  { icon: Headphones, title: "24/7 Support", desc: "Here whenever you need us" },
];

export default function TrustBadges() {
  return (
    <section className="border-y border-ink-100 bg-ink-50">
      <div className="container-page grid grid-cols-2 gap-6 py-8 sm:grid-cols-4">
        {BADGES.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
              <Icon size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink-900">{title}</p>
              <p className="text-xs text-ink-500">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
