import { Types } from "mongoose";
import { User } from "../app/modules/user/user.model";
import {
  Notification,
  NotificationType,
} from "../app/modules/notification/notification.model";
import { INotification } from "../app/modules/notification/notification.interface";

interface SendNotificationInput {
  userIds: Types.ObjectId[] | string[];
  title: string;
  body: string;
  type: NotificationType;
  metadata?: Record<string, any>;
  attachments?: string[];
  channel?: {
    socket?: boolean;
    push?: boolean;
  };
}

export const sendNotification = async ({
  userIds,
  title,
  body,
  type,
  metadata,
  attachments,
  channel = { socket: true, push: false },
}: SendNotificationInput) => {
  if (!userIds?.length) return [];

  // 1. Create notifications
  const notifications = await Notification.insertMany(
    userIds.map((userId) => ({
      userId,
      title,
      body,
      type,
      metadata,
      attachments,
      channel,
    })),
    { ordered: false }
  );

  // 2. Emit exact saved notification data
  if (channel.socket) {
    const users = await User.find({ _id: { $in: userIds } }).select(
      "_id socketIds"
    );

    const notificationMap = new Map<string, INotification[]>();

    notifications.forEach((n) => {
      const key = n.userId.toString();
      if (!notificationMap.has(key)) notificationMap.set(key, []);
      notificationMap.get(key)!.push(n);
    });

    users.forEach((user) => {
      const userNotifications = notificationMap.get(user._id.toString());
      if (!userNotifications?.length) return;

      user.socketIds?.forEach((socketId: string) => {
        userNotifications.forEach((notification) => {
          io.to(socketId).emit("newNotification", notification);
        });
      });
    });
  }

  // 3. Push notifications (future)
  if (channel.push) {
    // FCM / APNS
  }

  return notifications;
};
