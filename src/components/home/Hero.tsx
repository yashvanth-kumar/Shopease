import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700">
      <div className="container-page grid gap-8 py-14 sm:py-20 lg:grid-cols-2 lg:items-center lg:py-24">
        <div className="animate-slideUp text-white">
          <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-brand-100">
            Free shipping on orders over ₹299
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            Everything you need,
            <br />
            delivered fast.
          </h1>
          <p className="mt-4 max-w-md text-base text-brand-100 sm:text-lg">
            Shop electronics, fashion, home goods, beauty, and more — all in one place, with
            secure checkout and easy returns.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/shop" className="btn-primary bg-white text-brand-800 hover:bg-brand-50">
              Shop Now <ArrowRight size={16} />
            </Link>
            <Link href="/categories" className="btn-outline border-white/30 bg-transparent text-white hover:bg-white/10">
              Browse Categories
            </Link>
          </div>
        </div>

        <div className="relative hidden aspect-[4/3] animate-fadeIn lg:block">
          <Image
            src="https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1000&q=80"
            alt="Shopping bags with a variety of products"
            fill
            priority
            sizes="(max-width: 1024px) 0px, 50vw"
            className="rounded-2xl object-cover shadow-popover"
          />
        </div>
      </div>
    </section>
  );
}
