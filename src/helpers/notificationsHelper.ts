import { Types } from "mongoose";
import { User } from "../app/modules/user/user.model";
import {
  Notification,
  NotificationType,
} from "../app/modules/notification/notification.model";

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
  if (!userIds?.length) return;

  // 1️ Insert notifications (one per user)
  const notifications = await Notification.insertMany(
    userIds.map((userId) => ({
      userId,
      title,
      body,
      type,
      metadata,
      attachments,
      channel,
    }))
  );

  // 2️ Emit to connected users only
  if (channel.socket) {
    const users = await User.find({ _id: { $in: userIds } }).select(
      "socketIds"
    );

    users.forEach((user) => {
      user.socketIds?.forEach((socketId: string) => {
        io.to(socketId).emit("newNotification", {
          title,
          body,
          type,
          metadata,
          attachments,
          createdAt: new Date(),
        });
      });
    });
  }

  // 3️ Push notifications (future)
  if (channel.push) {
    // TODO: integrate FCM / APNS
  }

  return notifications;
};
