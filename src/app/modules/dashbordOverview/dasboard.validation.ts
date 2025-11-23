import { z } from "zod";

const totalRevenueZodSchema = z.object({
  query: z.object({
    start: z.preprocess(
      (val) => (val ? new Date(val as string) : undefined),
      z.date({
        required_error: "Start Date is required",
      })
    ),
    end: z.preprocess(
      (val) => (val ? new Date(val as string) : undefined),
      z.date({
        required_error: "End Date is required",
      })
    ),
  }),
});

export const DashboardValidation = {
  totalRevenueZodSchema,
};
