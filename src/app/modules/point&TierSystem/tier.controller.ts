import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { TierService } from "./tier.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { createTierSchema, updateTierSchema } from "./tier.validation";

const createTier = catchAsync(async (req: Request, res: Response) => {
  const body = req.body.data ? JSON.parse(req.body.data) : req.body;

  await createTierSchema.parseAsync({
    name: body.name,
    pointsThreshold: Number(body.pointsThreshold),
    reward: body.reward,
    accumulationRule: body.accumulationRule,
    redemptionRule: body.redemptionRule,
    minTotalSpend: Number(body.minTotalSpend),
    isActive: body.isActive !== undefined ? Boolean(body.isActive) : undefined,
  });

  const payload: any = {
    name: body.name,
    pointsThreshold: Number(body.pointsThreshold),
    reward: body.reward,
    accumulationRule: body.accumulationRule,
    redemptionRule: body.redemptionRule,
    minTotalSpend: Number(body.minTotalSpend),
    isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
    admin: (req.user as any)?._id,
  };

  const result = await TierService.createTierToDB(payload);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Tier created successfully",
    data: result,
  });
});

const updateTier = catchAsync(async (req: Request, res: Response) => {
  const body = req.body.data ? JSON.parse(req.body.data) : req.body;

  await updateTierSchema.parseAsync(body);

  const payload: any = {
    ...(body.name && { name: body.name }),
    ...(body.pointsThreshold && { pointsThreshold: Number(body.pointsThreshold) }),
    ...(body.reward && { reward: body.reward }),
    ...(body.accumulationRule && { accumulationRule: body.accumulationRule }),
    ...(body.redemptionRule && { redemptionRule: body.redemptionRule }),
    ...(body.minTotalSpend && { minTotalSpend: Number(body.minTotalSpend) }),
    ...(body.isActive !== undefined && { isActive: Boolean(body.isActive) }),
  };

  const result = await TierService.updateTierToDB(req.params.id, payload);
  if (!result) throw new ApiError(StatusCodes.NOT_FOUND, "Tier not found");

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Tier updated successfully",
    data: result,
  });
});

const getTier = catchAsync(async (req: Request, res: Response) => {
  const result = await TierService.getTierFromDB((req.user as any)?._id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Tiers retrieved successfully",
    data: result,
  });
});

const getSingleTier = catchAsync(async (req: Request, res: Response) => {
  const result = await TierService.getSingleTierFromDB(req.params.id);
  if (!result) throw new ApiError(StatusCodes.NOT_FOUND, "Tier not found");

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Tier retrieved successfully",
    data: result,
  });
});

const deleteTier = catchAsync(async (req: Request, res: Response) => {
  const result = await TierService.deleteTierToDB(req.params.id);
  if (!result) throw new ApiError(StatusCodes.NOT_FOUND, "Tier not found");

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Tier deleted successfully",
    data: result,
  });
});

export const TierController = {
  createTier,
  updateTier,
  getTier,
  getSingleTier,
  deleteTier,
};
