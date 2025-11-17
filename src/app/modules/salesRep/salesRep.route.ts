import express from "express";
import { USER_ROLES } from "../../../enums/user";
import auth from "../../middlewares/auth";
import { SalesRepController } from "./salesRep.controller";

const router = express.Router();

router.post("/", auth(USER_ROLES.USER), SalesRepController.createSalesRepData);
router.get("/", auth(USER_ROLES.USER), SalesRepController.getSalesRepData);
export const SalesRepRoutes = router;
