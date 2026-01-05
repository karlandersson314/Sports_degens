import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { JwtPayload } from "../types";

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Auth middleware: validates JWT and attaches req.user
 */

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      res.status(500).json({
        success: false,
        error: { message: "Server misconfigured: JWT_SECRET missing" },
      });
      return;
    }

    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      res
        .status(401)
        .json({ success: false, error: { message: "No token provided" } });
      return;
    }

    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    req.user = decoded;
    next();
  } catch (_error) {
    res
      .status(401)
      .json({ success: false, error: { message: "Invalid token" } });
  }
};

/**
 * Tools access gate.
 * - In dev, you can bypass with TOOLS_DEV_BYPASS=true
 * - In prod, user must have hasToolsAccess=true
 */
export const requireToolsAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // DEV bypass (intentionally very explicit)
    if ((process.env.TOOLS_DEV_BYPASS || "").toLowerCase() === "true") {
      next();
      return;
    }

    if (!req.user) {
      res
        .status(401)
        .json({ success: false, error: { message: "Unauthorized" } });
      return;
    }

    const user = await User.findById(req.user.userId).select("hasToolsAccess");
    if (!user || !user.hasToolsAccess) {
      res.status(403).json({
        success: false,
        error: {
          message:
            "Tools access required. Please subscribe to access sports betting tools.",
        },
      });
      return;
    }

    next();
  } catch (_error) {
    res.status(500).json({
      success: false,
      error: { message: "Error checking tools access" },
    });
  }
};
