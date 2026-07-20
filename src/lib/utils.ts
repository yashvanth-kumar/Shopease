import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number, currencySymbol = "$") {
  return `${currencySymbol}${amount.toFixed(2)}`;
}

export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatDate(timestamp: number | { seconds: number } | undefined) {
  if (!timestamp) return "";
  const ms =
    typeof timestamp === "number"
      ? timestamp
      : (timestamp as { seconds: number }).seconds * 1000;
  return new Date(ms).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function calculateDiscountPercent(price: number, compareAtPrice?: number) {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

/**
 * Basic client-side input sanitation for free-text fields (review comments,
 * contact form messages, addresses) to strip characters commonly used in
 * script-injection attempts before the value is ever written to Firestore.
 * This is a defense-in-depth measure — the primary XSS protection is that
 * React escapes all rendered text by default, and dangerouslySetInnerHTML
 * is never used anywhere in this codebase for user-supplied content.
 */
export function sanitizeInput(value: string) {
  return value
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, "")
    .trim();
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isStrongPassword(password: string) {
  // At least 8 chars, one letter, one number.
  return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password);
}

export function truncate(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}…`;
}

export function debounce<T extends (...args: never[]) => void>(fn: T, delay = 300) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
