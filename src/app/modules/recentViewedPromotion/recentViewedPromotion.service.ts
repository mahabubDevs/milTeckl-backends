import mongoose from "mongoose";
import { RecentViewedPromotion } from "./recentViewedPromotion.model";

const LIMIT = 10;

const addRecentViewedToDB = async (
  userId: mongoose.Types.ObjectId,
  promotionId: mongoose.Types.ObjectId
) => {
  let record = await RecentViewedPromotion.findOne({ userId });

  if (!record) {
    return RecentViewedPromotion.create({
      userId,
      items: [{ promotionId }],
    });
  }

  // Remove if already exists
  record.items = record.items.filter(
    (i) => i.promotionId.toString() !== promotionId.toString()
  );

  // Add to beginning (most recent)
  record.items.unshift({ promotionId });

  // Limit to last 10 items
  record.items = record.items.slice(0, LIMIT);

  await record.save();
  return record;
};

const getRecentViewedFromDB = async (userId: mongoose.Types.ObjectId) => {
  const record = await RecentViewedPromotion.findOne({ userId })
    .populate("items.promotionId")
    .lean();

  return record?.items || [];
};

export const RecentViewedPromotionService = {
  addRecentViewedToDB,
  getRecentViewedFromDB,
};
