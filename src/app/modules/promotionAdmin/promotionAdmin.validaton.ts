import { z } from "zod";

// Create & Update Promotion Schema
export const createPromotionSchema = z.object({
    name: z.string().min(1, "Promotion name is required"),
    customerReach: z.number({ invalid_type_error: "Customer reach must be a number" }),
    discountPercentage: z.number({ invalid_type_error: "Discount percentage must be a number" }),
    promotionType: z.string().min(1, "Promotion type is required"),
    customerSegment: z.string().min(1, "Customer segment is required"),
    startDate: z.preprocess(arg => new Date(arg as string), z.date()),
    endDate: z.preprocess(arg => new Date(arg as string), z.date()),
});

// Optional: for partial update
export const updatePromotionSchema = createPromotionSchema.partial();
