import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ink-100 text-ink-400">
        <SearchX size={32} />
      </div>
      <h1 className="mt-6 font-display text-4xl font-bold text-ink-900">404</h1>
      <p className="mt-2 text-lg font-medium text-ink-700">Page Not Found</p>
      <p className="mt-2 max-w-md text-sm text-ink-500">
        The page you're looking for doesn't exist or may have been moved. Let's get you back on
        track.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary">
          Back to Home
        </Link>
        <Link href="/shop" className="btn-outline">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
