/**
 * Lightweight client-side rate limiter for sensitive, abuse-prone actions
 * (login attempts, coupon code guesses, review submissions, contact form
 * submits) that don't go through a dedicated backend endpoint.
 *
 * IMPORTANT: this is a UX-layer throttle only. The authoritative rate
 * limiting for this project happens at two levels that cannot be bypassed
 * by editing client code:
 *   1. Firebase Authentication's built-in per-account and per-IP throttling
 *      on sign-in/sign-up/password-reset requests.
 *   2. Firestore Security Rules, which reject writes that don't match the
 *      expected shape/ownership regardless of how many times they're tried.
 * This helper exists purely to give users fast, friendly feedback before
 * those server-side limits would kick in.
 */

interface AttemptRecord {
  count: number;
  firstAttempt: number;
}

const attempts = new Map<string, AttemptRecord>();

export function checkRateLimit(
  key: string,
  maxAttempts = 5,
  windowMs = 60_000
): { allowed: boolean; retryAfterMs?: number } {
  const now = Date.now();
  const record = attempts.get(key);

  if (!record || now - record.firstAttempt > windowMs) {
    attempts.set(key, { count: 1, firstAttempt: now });
    return { allowed: true };
  }

  if (record.count >= maxAttempts) {
    return { allowed: false, retryAfterMs: windowMs - (now - record.firstAttempt) };
  }

  record.count += 1;
  return { allowed: true };
}

export function resetRateLimit(key: string) {
  attempts.delete(key);
}
