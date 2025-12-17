import { Schema, model, Types } from "mongoose";
import { INotification, NotificationModel } from "./notification.interface";

export enum NotificationType {
  SYSTEM = "system",
  POLICY = "policy",
  POINTS = "points",
  PAYMENT = "payment",
  REFERRAL = "referral",
  PROMOTION = "promotion",
  WELCOME = "welcome",
  DELETION = "deletion",
  MANUAL = "manual",
}

const notificationSchema = new Schema<INotification, NotificationModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: { type: String, required: true },
    body: { type: String, required: true },

    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
    },

    isRead: { type: Boolean, default: false },

    attachments: [{ type: String }],
    channel: {
      socket: { type: Boolean, default: true },
      push: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

export const Notification = model<INotification, NotificationModel>(
  "Notification",
  notificationSchema
);
