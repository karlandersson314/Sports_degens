import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(3).max(32),
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  // v02: optional captcha fields (enforced by env flag)
  captchaId: z.union([z.string(), z.number()]).optional(),
  captchaSessionId: z.string().optional(),
  captchaAnswer: z.string().optional(),
});

export const captchaChallengeSchema = z.object({
  userId: z.string().optional(),
});

export const captchaVerifySchema = z.object({
  captchaId: z.union([z.string(), z.number()]),
  sessionId: z.string(),
  answer: z.string(),
});
