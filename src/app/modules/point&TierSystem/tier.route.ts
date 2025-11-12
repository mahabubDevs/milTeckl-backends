import express from "express";
import { TierController } from "./tier.controller";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { createTierSchema, updateTierSchema } from "./tier.validation";

const router = express.Router();

// Create Tier
router.post("/", auth(), validateRequest(createTierSchema), TierController.createTier);

// Get all tiers for admin
router.get("/", auth(), TierController.getTier);

// Get single tier
router.get("/:id", auth(), TierController.getSingleTier);

// Update tier
router.patch("/:id", auth(), validateRequest(updateTierSchema), TierController.updateTier);

// Delete tier
router.delete("/:id", auth(), TierController.deleteTier);

export const TierRoutes = router;
