import cron from "node-cron";

import { logger } from "../shared/logger";
import { updateMerchantVipCustomersJob } from "./vipCustomer";


export const startCronJobs = () => {
    try {
        cron.schedule("0 2 * * *", async () => {
            try {
                logger.info("[CRON] VIP customer update started");
                await updateMerchantVipCustomersJob();
                logger.info("[CRON] VIP customer update finished");
            } catch (error) {
                logger.error("[CRON] VIP customer update failed", error);
            }
        });

        logger.info("[CRON] All cron jobs registered");
    } catch (error) {
        logger.error("[CRON] Failed to initialize cron jobs", error);
    }
};
