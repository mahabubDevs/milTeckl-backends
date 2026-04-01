
import { Subscription } from "../app/modules/subscription/subscription.model";
import { User } from "../app/modules/user/user.model";
import { SUBSCRIPTION_STATUS } from "../enums/user";
import { logger } from "../shared/logger";

export const expireSubscriptionsJob = async () => {
  try {
    logger.info("[CRON] Subscription expire check started");

    const now = new Date();

    // 🔍 Find expired subscriptions
    const expiredSubscriptions = await Subscription.find({
      status: "active",
      currentPeriodEnd: { $lt: now.toISOString() }, // সময় শেষ
    });

    logger.info(`[CRON] Found ${expiredSubscriptions.length} expired subscriptions`);

    for (const sub of expiredSubscriptions) {
      // 🔹 Update subscription status
      await Subscription.updateOne(
        { _id: sub._id },
        { $set: { status: "expired" } }
      );

      // 🔹 Update user subscription status
      await User.updateOne(
        { _id: sub.user },
        {
          $set: {
            subscription: SUBSCRIPTION_STATUS.INACTIVE,
            paymentStatus: "expired",
          },
        }
      );
    }

    logger.info("[CRON] Subscription expire check finished");
  } catch (error) {
    logger.error("[CRON] Subscription expire check failed", error);
  }
};