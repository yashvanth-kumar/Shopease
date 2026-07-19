import Link from "next/link";

export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2 font-display text-xl font-bold text-brand-700">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
              S
            </span>
            ShopEase
          </Link>
        </div>
        <div className="card p-6 sm:p-8">
          <h1 className="font-display text-2xl font-bold text-ink-900">{title}</h1>
          <p className="mt-1 text-sm text-ink-500">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>
        {footer && <div className="mt-5 text-center text-sm text-ink-600">{footer}</div>}
      </div>
    </div>
  );
}
