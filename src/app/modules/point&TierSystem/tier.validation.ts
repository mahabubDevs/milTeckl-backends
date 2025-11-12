import { z } from "zod";

export const createTierSchema = z.object({
  name: z.string().min(1, "Tier name is required"),
  pointsThreshold: z.number({ invalid_type_error: "Points threshold must be a number" }).nonnegative(),
  reward: z.string().min(1, "Reward is required"),
  accumulationRule: z.string().min(1, "Accumulation rule is required"),
  redemptionRule: z.string().min(1, "Redemption rule is required"),
  minTotalSpend: z.number({ invalid_type_error: "Min total spend must be a number" }).nonnegative(),
  isActive: z.boolean().optional(),
});

export const updateTierSchema = createTierSchema.partial();
