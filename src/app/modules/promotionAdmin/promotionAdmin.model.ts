import { Schema, model } from "mongoose";
import { IPromotion } from "./promotionAdmin.interface";


const promotionSchema = new Schema({
    name: { type: String, required: true },
    customerReach: { type: Number, required: true },
    discountPercentage: { type: Number, required: true },
    promotionType: { type: String, required: true },
    customerSegment: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    image: { type: String },
    isActive: { type: Boolean, default: true },
    // createdBy: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
}, { timestamps: true });

export const Promotion = model<IPromotion>("Promotion", promotionSchema);
