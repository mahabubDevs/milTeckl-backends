import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { AuditService } from "./audit.service";

const getAuditLogs = catchAsync(async (req, res) => {
  const logs = await AuditService.getAllLogsExceptMerchant(req.query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Audit logs retrieved successfully (merchant logs excluded)",
    data: logs,
  });
});


const getAuditLogsByUser = catchAsync(async (req, res) => {
  // 🔐 logged-in user
  const user = req.user as { _id: string };

  if (!user?._id) {
    return sendResponse(res, {
      success: false,
      statusCode: StatusCodes.UNAUTHORIZED,
      message: "Unauthorized user",
      data: null,
    });
  }

  const logs = await AuditService.getLogsByUserId(
    user._id,
    req.query
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "User audit logs retrieved successfully",
    data: logs,
  });
});




export const AuditController = {
  getAuditLogs,
  getAuditLogsByUser
};
