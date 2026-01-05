import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { rateLimit } from "../../middleware/rateLimit";
import {
  getMyAffiliateCode,
  redeemAffiliateCode,
} from "../../controllers/affiliateController";

const router = Router();

router.use(authenticate);

router.get("/me", rateLimit({ max: 120 }), getMyAffiliateCode);
router.post("/redeem", rateLimit({ max: 30 }), redeemAffiliateCode);

export default router;
