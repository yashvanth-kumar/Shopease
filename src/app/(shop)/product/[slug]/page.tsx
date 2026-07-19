import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { productsSeed } from "@/data/products";
import ProductGallery from "@/components/product/ProductGallery";
import AddToCartPanel from "@/components/product/AddToCartPanel";
import StarRating from "@/components/ui/StarRating";
import ProductReviews from "@/components/reviews/ProductReviews";
import RecentlyViewedTracker from "@/components/product/RecentlyViewedTracker";
import RecentlyViewedSection from "@/components/product/RecentlyViewedSection";
import ProductCard from "@/components/product/ProductCard";
import { calculateDiscountPercent, formatCurrency } from "@/lib/utils";

interface Props {
  params: { slug: string };
}

function getProduct(slug: string) {
  return productsSeed.find((p) => p.slug === slug && p.isActive);
}

export function generateStaticParams() {
  return productsSeed.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const product = getProduct(params.slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.seoTitle || product.title,
    description: product.seoDescription || product.shortDescription,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: product.title,
      description: product.shortDescription,
      images: [{ url: product.images[0] }],
    },
  };
}

export default function ProductDetailPage({ params }: Props) {
  const product = getProduct(params.slug);
  if (!product) notFound();

  const related = productsSeed
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id && p.isActive)
    .slice(0, 6);

  const discount = calculateDiscountPercent(product.price, product.compareAtPrice);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.images,
    description: product.shortDescription,
    sku: product.sku,
    brand: { "@type": "Brand", name: product.brand },
    aggregateRating:
      product.reviewCount > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
          }
        : undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.price,
      availability:
        product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="container-page py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <RecentlyViewedTracker productId={product.id} />

      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-ink-500">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/" className="hover:text-brand-700">Home</Link></li>
          <li>/</li>
          <li><Link href={`/categories/${product.categorySlug}`} className="hover:text-brand-700 capitalize">{product.categorySlug.replace("-", " ")}</Link></li>
          <li>/</li>
          <li className="font-medium text-ink-900 truncate max-w-[200px]">{product.title}</li>
        </ol>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} title={product.title} />

        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-brand-600">{product.brand}</p>
          <h1 className="mt-1 font-display text-2xl font-bold text-ink-900 sm:text-3xl">
            {product.title}
          </h1>

          <div className="mt-3">
            <StarRating rating={product.rating} reviewCount={product.reviewCount} />
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-ink-900">{formatCurrency(product.price)}</span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <>
                <span className="text-lg text-ink-400 line-through">
                  {formatCurrency(product.compareAtPrice)}
                </span>
                <span className="rounded-full bg-accent-100 px-2 py-0.5 text-xs font-bold text-accent-700">
                  Save {discount}%
                </span>
              </>
            )}
          </div>

          <p className="mt-4 text-sm leading-relaxed text-ink-600">{product.shortDescription}</p>

          <div className="mt-6 border-t border-ink-100 pt-6">
            <AddToCartPanel product={product} />
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-ink-100 px-3 py-1 text-xs text-ink-600">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="font-display text-xl font-bold text-ink-900">Product Description</h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-600">
            {product.description}
          </p>

          <div className="mt-10">
            <ProductReviews productId={product.id} />
          </div>
        </div>

        <div>
          <h2 className="font-display text-lg font-bold text-ink-900">Details</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between border-b border-ink-100 py-2">
              <dt className="text-ink-500">SKU</dt>
              <dd className="font-medium text-ink-900">{product.sku}</dd>
            </div>
            <div className="flex justify-between border-b border-ink-100 py-2">
              <dt className="text-ink-500">Brand</dt>
              <dd className="font-medium text-ink-900">{product.brand}</dd>
            </div>
            <div className="flex justify-between border-b border-ink-100 py-2">
              <dt className="text-ink-500">Availability</dt>
              <dd className="font-medium text-ink-900">
                {product.stock > 0 ? "In Stock" : "Out of Stock"}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display text-xl font-bold text-ink-900">Related Products</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <RecentlyViewedSection excludeId={product.id} />
    </div>
  );
                                  }
