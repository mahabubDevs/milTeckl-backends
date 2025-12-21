import mongoose, { Types } from "mongoose";
import { Promotion } from "../../mercent/promotionMercent/promotionMercent.model";
import { DigitalCard } from "./digitalCard.model";
import { generateCardCode } from "./generateCardCode";
import QueryBuilder from "../../../../util/queryBuilder";
import { IDigitalCard } from "../../mercent/mercentCustomerList/mercentInterface";

// const addPromotionToDigitalCard = async (
//   userId: string,
//   promotionId: string
// ) => {

//   // Promotion check
//   const promotion = await Promotion.findById(promotionId);
//   if (!promotion) {
//     throw new Error("Promotion not found");
//   }

//   const merchantId = promotion.merchantId;

//   // Digital card check (user + merchant)
//   let digitalCard = await DigitalCard.findOne({ userId, merchantId });

//   // If digital card does not exist → create new
//   if (!digitalCard) {
//     digitalCard = await DigitalCard.create({
//       userId,
//       merchantId,
//       cardCode: generateCardCode(),
//       promotions: [],
//     });
//   }

//   // Convert promotionId → ObjectId
//   const promotionObjectId = new Types.ObjectId(promotionId);

//   // Add promotion if not exists already
//   if (!digitalCard.promotions.includes(promotionObjectId)) {
//     digitalCard.promotions.push(promotionObjectId);
//   }

//   // Save changes
//   await digitalCard.save();

//   return digitalCard;
// };

const addPromotionToDigitalCard = async (
  userId: string,
  promotionId: string
) => {
  // Promotion check
  const promotion = await Promotion.findById(promotionId);
  if (!promotion) {
    throw new Error("Promotion not found");
  }

  const merchantId = promotion.merchantId;

  // Digital card check (user + merchant)
  let digitalCard = await DigitalCard.findOne({ userId, merchantId });

  // If digital card does not exist → create new
  if (!digitalCard) {
    digitalCard = await DigitalCard.create({
      userId,
      merchantId,
      cardCode: generateCardCode(),
      promotions: [],
    });
  }

  // Convert promotionId → ObjectId
  const promotionObjectId = new Types.ObjectId(promotionId);

  // Add promotion if not exists already
  const alreadyAdded = digitalCard.promotions.some(
    (p) => p.promotionId && p.promotionId.equals(promotionObjectId)
  );

  if (!alreadyAdded) {
    digitalCard.promotions.push({
      promotionId: promotionObjectId,
      status: "pending", // default status
      usedAt: null,
    });
  }

  await digitalCard.save();

  // Populate promotion details for response
  await digitalCard.populate({
    path: "promotions.promotionId",
    model: "PromotionMercent",
  });

  // Format response
  const allPromotions = digitalCard.promotions.map((promo) => ({
    cardCode: digitalCard.cardCode,
    status: promo.status,
    usedAt: promo.usedAt,
    promotion: promo.promotionId,
  }));

  return {
    totalPromotions: allPromotions.length,
    promotions: allPromotions,
  };
};

const getUserAddedPromotions = async (
  userId: string,
  query: Record<string, any>
) => {
  const { page = 1, limit = 10, searchTerm } = query;

  const pageNum = Number(page) || 1;
  const perPage = Number(limit) || 10;

  const pipeline: any[] = [
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
      },
    },

    { $unwind: "$promotions" },

    // ❗ Skip used promotions
    {
      $match: {
        "promotions.status": { $ne: "used" }, // used promotions exclude
      },
    },

    {
      $lookup: {
        from: "promotionmercents",
        localField: "promotions.promotionId",
        foreignField: "_id",
        as: "promotion",
      },
    },
    { $unwind: "$promotion" },

    // Lookup merchant to get businessName
    {
      $lookup: {
        from: "users",
        localField: "promotion.merchantId",
        foreignField: "_id",
        as: "merchant",
      },
    },
    { $unwind: "$merchant" },

    // Search
    searchTerm
      ? {
          $match: {
            "promotion.name": { $regex: searchTerm, $options: "i" },
          },
        }
      : { $match: {} },

    {
      $facet: {
        metadata: [{ $count: "total" }],

        data: [
          { $skip: (pageNum - 1) * perPage },
          { $limit: perPage },

          {
            $project: {
              _id: 0,
              cardCode: "$cardCode",
              status: "$promotions.status",
              usedAt: "$promotions.usedAt",
              promotion: "$promotion",
              merchantBusinessName: "$merchant.businessName",
            },
          },
        ],
      },
    },
  ];

  const result = await DigitalCard.aggregate(pipeline);

  const total = result[0].metadata[0]?.total || 0;
  const promotions = result[0].data;

  return {
    data: { totalPromotions: total, promotions },
    pagination: {
      total,
      page: pageNum,
      limit: perPage,
      totalPage: Math.ceil(total / perPage) || 1,
    },
  };
};

const getUserDigitalCards = async (
  userId: string,
  query: Record<string, any>
) => {
  const { searchTerm, page = 1, limit = 10 } = query;
  const pageNum = Math.max(1, Number(page));
  const perPage = Math.max(1, Number(limit));

  const baseMatch = { userId: new mongoose.Types.ObjectId(userId) };

  // pipeline before facet: match -> lookup -> unwind -> optional search
  const pipeline: any[] = [
    { $match: baseMatch },
    {
      $lookup: {
        from: "users",
        localField: "merchantId",
        foreignField: "_id",
        as: "merchant",
      },
    },
    // keep docs if merchant missing to avoid accidental drops
    { $unwind: { path: "$merchant", preserveNullAndEmptyArrays: true } },
  ];

  if (searchTerm) {
    pipeline.push({
      $match: {
        $or: [
          { cardCode: { $regex: searchTerm, $options: "i" } },
          { "merchant.businessName": { $regex: searchTerm, $options: "i" } },
          { "merchant.firstName": { $regex: searchTerm, $options: "i" } },
        ],
      },
    });
  }

  // facet to get total count AND paginated data in one query
  pipeline.push({
    $facet: {
      metadata: [{ $count: "total" }],
      data: [
        { $skip: (pageNum - 1) * perPage },
        { $limit: perPage },
        {
          $project: {
            _id: 1,
            userId: 1,
            cardCode: 1,
            availablePoints: 1,
            promotions: 1,
            createdAt: 1,
            updatedAt: 1,
            merchant: {
              _id: "$merchant._id",
              firstName: "$merchant.firstName",
              businessName: "$merchant.businessName",
              profile: "$merchant.profile",
            },
          },
        },
      ],
    },
  });

  // run aggregation
  const aggResult = await DigitalCard.aggregate(pipeline);

  // aggResult is an array with a single object { metadata: [...], data: [...] }
  const metadata = aggResult[0]?.metadata ?? [];
  const data = aggResult[0]?.data ?? [];

  const total = metadata[0]?.total ?? 0;
  const totalPage = Math.ceil(total / perPage) || 1;

  const formattedCards = data.map((card: any) => ({
    _id: card._id,
    userId: card.userId,
    merchantId: card.merchant,
    cardCode: card.cardCode,
    availablePoints: card.availablePoints ?? 0,
    promotions: Array.isArray(card.promotions)
      ? card.promotions
          .map((p: any) => p?.promotionId?.toString())
          .filter(Boolean)
      : [],
    createdAt: card.createdAt,
    updatedAt: card.updatedAt,
  }));

  return {
    data: { totalDigitalCards: total, digitalCards: formattedCards },
    pagination: {
      total,
      page: pageNum,
      limit: perPage,
      totalPage,
    },
  };
};

const getPromotionsOfDigitalCard = async (digitalCardId: string) => {
  const digitalCard = await DigitalCard.findById(digitalCardId).populate(
    "promotions"
  ); // সমস্ত promotion details নিয়ে আসে

  if (!digitalCard) {
    throw new Error("Digital Card not found");
  }

  return {
    totalPromotions: digitalCard.promotions.length,
    promotions: digitalCard.promotions,
  };
};


const getMerchantDigitalCardWithPromotions = async (
  merchantId: string,
  code: string // can be digital card code OR promotion cardId
) => {
  let searchedByPromotionCode = false;
  let digitalCard: any = null;

  // 1️⃣ Try search by DIGITAL CARD code first
  digitalCard = await DigitalCard.findOne({
    merchantId,
    cardCode: code,
  }).populate({
    path: "promotions.promotionId",
    select:
      "name discountPercentage promotionType image startDate endDate status cardId",
  });

  if (!digitalCard) {
    // 2️⃣ If not found by digital card, try promotion cardId
    searchedByPromotionCode = true;

    // 🔹 Step 1: Find promotion by cardId (case-insensitive)
    const today = new Date();
    const promotion = await Promotion.findOne({
      cardId: { $regex: `^${code}$`, $options: "i" },
      merchantId,
      startDate: { $lte: today }, // startDate আজকের তারিখের আগে বা সমান
      endDate: { $gte: today },   // endDate আজকের তারিখের পরে বা সমান
    });

    console.log("Found promotion by cardId:", promotion);

    if (!promotion) return null;

    // 🔹 Step 2: Find merchant's digital card that contains this promotion and is pending + unused
    digitalCard = await DigitalCard.findOne({
      merchantId,
      "promotions.promotionId": promotion._id,
      "promotions.status": { $in: ["pending", "unused"] },
      "promotions.usedAt": null,
    }).populate({
      path: "promotions.promotionId",
      select:
        "name discountPercentage promotionType image startDate endDate status cardId",
    });
    if (!digitalCard) return null;
  }

  if (!digitalCard) return null;

  // 3️⃣ Filter only valid promotions
  const validPromotions = digitalCard.promotions
    .map((item: any) => {
      if (
  item.promotionId &&
  (item.status === "pending" || item.status === "unused") &&
  !item.usedAt
) {
  // ✅ Check promotion date
  const today = new Date();
  const startDate = new Date(item.promotionId.startDate);
  const endDate = new Date(item.promotionId.endDate);
  if (today < startDate || today > endDate) return null; // Skip if outside date range

  // If searching by promotion cardId, only return that promotion
  if (searchedByPromotionCode && item.promotionId.cardId.toUpperCase() !== code.toUpperCase()) {
    return null;
  }

  // ✅ Only valid promotions reach here
  console.log("Promotion to be returned:", {
    cardId: item.promotionId.cardId,
    name: item.promotionId.name,
    startDate: item.promotionId.startDate,
    endDate: item.promotionId.endDate,
    status: item.status,
  });

  return {
    status: item.status,
    usedAt: item.usedAt,
    ...item.promotionId.toObject(),
  };
}
      return null;
    })
    .filter(Boolean);

  if (validPromotions.length === 0) return null;

  return {
    digitalCard: {
      ...digitalCard.toObject(),
      promotions: validPromotions,
    },
  };
};




export const DigitalCardService = {
  addPromotionToDigitalCard,
  getUserAddedPromotions,
  getUserDigitalCards,
  getPromotionsOfDigitalCard,
  getMerchantDigitalCardWithPromotions,
};
