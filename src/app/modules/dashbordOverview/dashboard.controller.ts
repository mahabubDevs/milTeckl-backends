import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { DashboardService } from "./dashboard.service";

// Dashboard Stats

const getTotalRevenue = catchAsync(async (req: Request, res: Response) => {
  const result = await DashboardService.getTotalRevenue(req.query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Total revenue fetched successfully",
    data: result,
  });
});

const getEthnicityDistribution = catchAsync(
  async (req: Request, res: Response) => {
    const data = await DashboardService.getEthnicityDistribution();
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Ethnicity distribution fetched successfully",
      data,
    });
  }
);

// Gender distribution
const getGenderDistribution = catchAsync(
  async (req: Request, res: Response) => {
    const data = await DashboardService.getGenderDistribution();
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Gender distribution fetched successfully",
      data,
    });
  }
);

// Monthly signups
const getMonthlySignups = catchAsync(async (req: Request, res: Response) => {
  const data = await DashboardService.getMonthlySignups();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Monthly user signups fetched successfully",
    data,
  });
});

export const DashboardController = {
  getTotalRevenue,
  getEthnicityDistribution,
  getGenderDistribution,
  getMonthlySignups,
};
