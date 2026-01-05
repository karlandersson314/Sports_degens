import crypto from "crypto";
import { CaptchaChallenge } from "../../models/CaptchaChallenge";
import { getEnv } from "../../config/env";

function sha256(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function genSessionId(): string {
  return crypto.randomBytes(16).toString("hex");
}

export type CaptchaChallengeResponse = {
  captchaId: number;
  sessionId: string;
  prompt: string;
  expiresAt: Date;
};

export class CaptchaService {
  /**
   * Simple math captcha for v02 scaffold.
   * In v03 we can replace this with hCaptcha/reCAPTCHA or a richer internal captcha.
   */
  async createChallenge(userId?: string): Promise<CaptchaChallengeResponse> {
    const env = getEnv();
    const a = Math.floor(Math.random() * 9) + 1;
    const b = Math.floor(Math.random() * 9) + 1;
    const answer = String(a + b);
    const prompt = `What is ${a} + ${b}?`;

    const now = new Date();
    const expiresAt = new Date(now.getTime() + env.CAPTCHA_TTL_SECONDS * 1000);
    const sessionId = genSessionId();
    const captchaId = Date.now();

    await CaptchaChallenge.create({
      id: captchaId,
      user_id: userId,
      session_id: sessionId,
      prompt,
      answer_hash: sha256(answer),
      created_at: now,
      expires_at: expiresAt,
      attempts: 0,
      success: false,
    });

    return { captchaId, sessionId, prompt, expiresAt };
  }

  async verifyChallenge(params: {
    captchaId: number;
    sessionId: string;
    answer: string;
    maxAttempts?: number;
  }): Promise<{ ok: boolean; reason?: string }> {
    const { captchaId, sessionId, answer, maxAttempts = 5 } = params;
    const doc = await CaptchaChallenge.findOne({
      id: captchaId,
      session_id: sessionId,
    });
    if (!doc) return { ok: false, reason: "Captcha not found" };
    if (doc.success) return { ok: true };

    const now = new Date();
    if (doc.expires_at <= now) return { ok: false, reason: "Captcha expired" };
    if (doc.attempts >= maxAttempts)
      return { ok: false, reason: "Too many attempts" };

    doc.attempts += 1;
    const isCorrect = sha256(String(answer).trim()) === doc.answer_hash;
    if (isCorrect) {
      doc.success = true;
      doc.solved_at = now;
    }
    await doc.save();

    return isCorrect ? { ok: true } : { ok: false, reason: "Incorrect answer" };
  }
}

export const captchaService = new CaptchaService();
