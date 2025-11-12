import { Schema, model } from "mongoose";
import { IPromotion } from "./promotionMercent.interface";


const promotionSchema = new Schema(
  {
    name: { type: String, required: true },
    discountPercentage: { type: Number, required: true },
    promotionType: { type: String, required: true },
    customerSegment: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    image: { type: String },
    isActive: { type: Boolean, default: true },

    // New field: availableDays
    availableDays: {
      type: [
        {
          type: String,
          enum: ["all", "sun", "mon", "tue", "wed", "thu", "fri", "sat"],
        },
      ],
      default: ["all"],
    },
  },
  { timestamps: true }
);

export const Promotion = model<IPromotion>("PromotionMercent", promotionSchema);
