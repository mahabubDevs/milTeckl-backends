import { IPromotion } from "./promotionMercent.interface";
import { Promotion } from "./promotionMercent.model";



export const PromotionService = {
    createPromotion: async (payload: Partial<IPromotion>) => {
        const promotion = new Promotion(payload);
        return promotion.save();
    },

    getAllPromotions: async () => {
        return Promotion.find();
    },

    getSinglePromotion: async (id: string) => {
        return Promotion.findById(id);
    },

   updatePromotion: async (id: string, payload: Partial<IPromotion>) => {
  return Promotion.findByIdAndUpdate(id, payload, { new: true });
},


    deletePromotion: async (id: string) => {
        return Promotion.findByIdAndDelete(id);
    },

    togglePromotion: async (id: string) => {
        const promotion = await Promotion.findById(id);
        if (!promotion) return null;
        promotion.isActive = !promotion.isActive;
        return promotion.save();
    }
};
