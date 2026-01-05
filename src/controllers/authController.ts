import { Request, Response } from "express";
import { authService } from "../services/auth/AuthService";
import { captchaService } from "../services/auth/CaptchaService";
import { LoginHistory } from "../models/LoginHistory";
import { getEnv } from "../config/env";
import { ApiResponse } from "../types";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({
        success: false,
        error: { message: "Username, email, and password are required" },
      } as ApiResponse);
      return;
    }

    const user = await authService.register({ username, email, password });

    // Don't send password hash in response
    const userResponse = {
      id: user._id,
      username: user.username,
      email: user.email,
      level: user.level,
      xp: user.xp,
      hasToolsAccess: user.hasToolsAccess,
    };

    res.status(201).json({
      success: true,
      data: { user: userResponse },
    } as ApiResponse);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: { message: error.message },
    } as ApiResponse);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const env = getEnv();
    const { email, password, captchaId, captchaSessionId, captchaAnswer } =
      req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: { message: "Email and password are required" },
      } as ApiResponse);
      return;
    }
    // Optional captcha (v02 scaffold): enforce only when CAPTCHA_LOGIN_REQUIRED=true
    if (env.CAPTCHA_LOGIN_REQUIRED) {
      if (!captchaId || !captchaSessionId || !captchaAnswer) {
        res.status(400).json({
          success: false,
          error: { message: "Captcha is required for login" },
        } as ApiResponse);
        return;
      }

      const verify = await captchaService.verifyChallenge({
        captchaId: Number(captchaId),
        sessionId: String(captchaSessionId),
        answer: String(captchaAnswer),
      });

      if (!verify.ok) {
        res.status(400).json({
          success: false,
          error: { message: verify.reason ?? "Captcha verification failed" },
        } as ApiResponse);
        return;
      }
    }

    const { user, token } = await authService.login({ email, password });

    // Record login history (v02)
    const ip =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.ip ||
      "unknown";
    const userAgent = (req.headers["user-agent"] as string) || "unknown";
    await LoginHistory.create({
      id: Date.now(),
      user_id: user._id.toString(),
      logged_in_at: new Date(),
      ip_address: ip,
      user_agent: userAgent,
    });

    // Don't send password hash in response
    const userResponse = {
      id: user._id,
      username: user.username,
      email: user.email,
      level: user.level,
      xp: user.xp,
      hasToolsAccess: user.hasToolsAccess,
    };

    res.json({
      success: true,
      data: {
        user: userResponse,
        token,
      },
    } as ApiResponse);
  } catch (error: any) {
    res.status(401).json({
      success: false,
      error: { message: error.message },
    } as ApiResponse);
  }
};
/**
 * v02 captcha scaffold
 * GET/POST challenge and verify endpoints to support bot protection.
 */
export const createCaptchaChallenge = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req.body?.userId || req.query?.userId) as
      | string
      | undefined;
    const challenge = await captchaService.createChallenge(userId);
    res.json({ success: true, data: challenge } as ApiResponse);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { message: error.message },
    } as ApiResponse);
  }
};

export const verifyCaptchaChallenge = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { captchaId, sessionId, answer } = req.body;
    const result = await captchaService.verifyChallenge({
      captchaId: Number(captchaId),
      sessionId: String(sessionId),
      answer: String(answer),
    });

    if (!result.ok) {
      res.status(400).json({
        success: false,
        error: { message: result.reason ?? "Captcha failed" },
      } as ApiResponse);
      return;
    }

    res.json({ success: true, data: { ok: true } } as ApiResponse);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { message: error.message },
    } as ApiResponse);
  }
};

// v04: return current authenticated user (useful for Postman testing)
export const getMe = async (req: Request, res: Response) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ success: false, error: { message: "Unauthorized" } });
  }
  return res.json({ success: true, data: { user: req.user } });
};
