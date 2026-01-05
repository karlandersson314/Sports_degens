import { Request, Response, NextFunction } from "express";

type Bucket = {
  resetAt: number;
  count: number;
};

/**
 * Very small in-memory rate limiter (good for dev + single instance).
 * If you later run multiple instances, swap this with Redis-backed limiter.
 */
export function rateLimit(options?: { windowMs?: number; max?: number }) {
  const windowMs =
    options?.windowMs ??
    Number(process.env.AUTH_RATE_LIMIT_WINDOW_MS ?? 60_000);
  const max = options?.max ?? Number(process.env.AUTH_RATE_LIMIT_MAX ?? 60);

  const buckets = new Map<string, Bucket>();

  return (req: Request, res: Response, next: NextFunction) => {
    const key = (req.ip || "unknown").toString();
    const now = Date.now();

    const bucket = buckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
      buckets.set(key, { resetAt: now + windowMs, count: 1 });
      res.setHeader("X-RateLimit-Limit", String(max));
      res.setHeader("X-RateLimit-Remaining", String(Math.max(0, max - 1)));
      res.setHeader(
        "X-RateLimit-Reset",
        String(Math.ceil((now + windowMs) / 1000))
      );
      return next();
    }

    bucket.count += 1;
    const remaining = Math.max(0, max - bucket.count);
    res.setHeader("X-RateLimit-Limit", String(max));
    res.setHeader("X-RateLimit-Remaining", String(remaining));
    res.setHeader(
      "X-RateLimit-Reset",
      String(Math.ceil(bucket.resetAt / 1000))
    );

    if (bucket.count > max) {
      res.status(429).json({
        success: false,
        error: { message: "Too many requests. Please try again later." },
      });
      return;
    }

    next();
  };
}
