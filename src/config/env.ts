import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(3000),

  FRONTEND_URL: z.string().url().optional(),

  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),

  JWT_SECRET: z.string().min(16, "JWT_SECRET must be at least 16 characters"),
  JWT_EXPIRES_IN: z.string().default("7d"),

  // Sports tools
  ODDS_API_KEY: z.string().optional(),
  ODDS_API_BASE_URL: z
    .string()
    .url()
    .default("https://api.the-odds-api.com/v4"),

  // Stripe
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_PRICE_ID: z.string().optional(),

  // Auth hardening (v02)
  CAPTCHA_LOGIN_REQUIRED: z
    .string()
    .optional()
    .transform((v) => (v ?? "").toLowerCase() === "true"),
  CAPTCHA_TTL_SECONDS: z.coerce.number().int().positive().default(300),
  AUTH_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  AUTH_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(20),

  // Safety / dev helpers
  TOOLS_DEV_BYPASS: z
    .string()
    .optional()
    .transform((v) => (v ?? "").toLowerCase() === "true"),
});

export type Env = z.infer<typeof envSchema>;

export function getEnv(): Env {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    // Keep this readable in logs
    const issues = parsed.error.issues
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join("; ");
    throw new Error(`Invalid environment configuration: ${issues}`);
  }
  return parsed.data;
}
