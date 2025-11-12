import { Router } from "express";

import multer from "multer";

import { PromotionController } from "./promotionAdmin.controller";
import fileUploadHandler from "../../middlewares/fileUploaderHandler";
import validateRequest from "../../middlewares/validateRequest";
import { createPromotionSchema } from "./promotionAdmin.validaton";

const router = Router();
const upload = multer({ dest: "uploads/" }); // image upload

router.post(
    "/",
    fileUploadHandler(),
    // validateRequest(createPromotionSchema),


    PromotionController.createPromotion
);
router.get("/", PromotionController.getAllPromotions);
router.get("/:id", PromotionController.getSinglePromotion);
// routes/promo.routes.ts
router.patch(
  "/:id",
  fileUploadHandler(), // createPromotion এর মতো middleware
//   validateRequest(updatePromotionSchema), // optional: partial validation
  PromotionController.updatePromotion
);

router.delete("/:id", PromotionController.deletePromotion);
router.patch("/toggle/:id", PromotionController.togglePromotion);

export const PromoRoutes = router;
