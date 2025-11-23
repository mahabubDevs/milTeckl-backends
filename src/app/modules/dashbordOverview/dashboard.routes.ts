import { Router } from "express";
import { DashboardController } from "./dashboard.controller";

import { USER_ROLES } from "../../../enums/user";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { DashboardValidation } from "./dasboard.validation";

const router = Router();

router.get(
  "/total-revenue",
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validateRequest(DashboardValidation.totalRevenueZodSchema),
  DashboardController.getTotalRevenue
);

router.get(
  "/ethnicity-distribution",
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  DashboardController.getEthnicityDistribution
);

// Gender distribution
router.get(
  "/gender-distribution",
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  DashboardController.getGenderDistribution
);

// Monthly signups
router.get(
  "/monthly-signups",
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  DashboardController.getMonthlySignups
);

export const DashboardRoutes = router;
