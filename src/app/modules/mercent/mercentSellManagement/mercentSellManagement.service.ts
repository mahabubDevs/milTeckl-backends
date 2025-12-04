import { Types } from "mongoose";

import { Promotion } from "../../mercent/promotionMercent/promotionMercent.model";
import { DigitalCard } from "../../customer/digitalCard/digitalCard.model";
import { Sell } from "./mercentSellManagement.model";


const checkout = async (
  merchantId: string,
  digitalCardCode: string,
  totalBill: number,
  promotionId?: string
) => {

  // 1. Find Digital Card
  const digitalCard = await DigitalCard.findOne({
    merchantId: new Types.ObjectId(merchantId),
    cardCode: digitalCardCode
  }).populate("promotions");

  if (!digitalCard) {
    throw new Error("Digital Card not found for this merchant");
  }

  // 2. Find selected promotion
  let discount = 0;
  let selectedPromotion = null;
  if (promotionId) {
    selectedPromotion = await Promotion.findById(promotionId);
    if (selectedPromotion) {
      discount = selectedPromotion.discountPercentage || 0;
    }
  }

  // 3. Calculate discounted bill
  const discountedBill = totalBill - (totalBill * discount) / 100;

  // 4. Points earned = discounted bill
  const pointsEarned = discountedBill;

  // 5. Update Digital Card points
  digitalCard.availablePoints = (digitalCard.availablePoints || 0) + pointsEarned;
  await digitalCard.save();

  // 6. Save transaction
  const sell = await Sell.create({
    merchantId,
    userId: digitalCard.userId,
    digitalCardId: digitalCard._id,
    promotionId: selectedPromotion?._id,
    totalBill,
    discountedBill,
    pointsEarned
  });

  return sell;
};

export const SellService = { checkout };
