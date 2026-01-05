import { Request, Response } from "express";
import { ApiResponse } from "../types";
import { User } from "../models";
import { logger } from "../utils/logger";

function generateAffiliateCode(length = 10): string {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let out = "";
  for (let i = 0; i < length; i++)
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out;
}
export const getMyAffiliateCode = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({
        success: false,
        error: { message: "Unauthorized" },
      } as ApiResponse);
      return;
    }
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        error: { message: "User not found" },
      } as ApiResponse);
      return;
    }

    if (!user.affiliateCode) {
      for (let i = 0; i < 5; i++) {
        const code = generateAffiliateCode(10);
        const exists = await User.exists({ affiliateCode: code });
        if (!exists) {
          user.affiliateCode = code;
          await user.save();
          break;
        }
      }
    }

    res.json({
      success: true,
      data: { affiliateCode: user.affiliateCode },
    } as ApiResponse);
  } catch (error: any) {
    logger.error("Error getting affiliate code:", {
      service: "sports-degens-backend",
      error: error.message,
    });
    res.status(500).json({
      success: false,
      error: { message: error.message },
    } as ApiResponse);
  }
};

export const redeemAffiliateCode = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res
        .status(401)
        .json({
          success: false,
          error: { message: "Unauthorized" },
        } as ApiResponse);
      return;
    }

    const { code } = req.body as { code?: string };
    const cleaned = (code || "").trim().toUpperCase();
    if (!cleaned) {
      res
        .status(400)
        .json({
          success: false,
          error: { message: "code is required" },
        } as ApiResponse);
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res
        .status(404)
        .json({
          success: false,
          error: { message: "User not found" },
        } as ApiResponse);
      return;
    }

    if (user.referredBy) {
      res
        .status(400)
        .json({
          success: false,
          error: { message: "Affiliate code already redeemed" },
        } as ApiResponse);
      return;
    }

    const referrer = await User.findOne({ affiliateCode: cleaned });
    if (!referrer) {
      res
        .status(404)
        .json({
          success: false,
          error: { message: "Invalid affiliate code" },
        } as ApiResponse);
      return;
    }

    if (referrer._id.toString() === user._id.toString()) {
      res
        .status(400)
        .json({
          success: false,
          error: { message: "Cannot redeem your own code" },
        } as ApiResponse);
      return;
    }

    user.referredBy = referrer._id;
    await user.save();

    res.json({ success: true, data: { redeemed: true } } as ApiResponse);
  } catch (error: any) {
    logger.error("Error redeeming affiliate code", {
      service: "sports-degens-backend",
      error: error.message,
    });
    res
      .status(500)
      .json({
        success: false,
        error: { message: error.message },
      } as ApiResponse);
  }
};
