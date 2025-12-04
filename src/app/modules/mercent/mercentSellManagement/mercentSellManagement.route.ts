import express from "express";
import auth from "../../../middlewares/auth";
import { USER_ROLES } from "../../../../enums/user";
import mercentSellManagementController from "./mercentSellManagement.controller";


const router = express.Router();

router.post("/checkout", auth(USER_ROLES.MERCENT), mercentSellManagementController.checkout);
// router.post(
//   "/finalize-checkout",
//   auth(USER_ROLES.MERCENT),
//   mercentSellManagementController.finalizeCheckout
// );

export const SellManagementRoute = router;
