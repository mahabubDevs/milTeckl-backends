import { NotificationType } from "../app/modules/notification/notification.model";
import { User } from "../app/modules/user/user.model";
import { sendNotification } from "./notificationsHelper";


export const notifyAllActiveUsers = async ({
    title,
    body,
    type,
    metadata,
}: {
    title: string;
    body: string;
    type: NotificationType;
    metadata?: Record<string, any>;
}) => {
    const users = await User.find({ status: 'active' }).select('_id');

    await sendNotification({
        userIds: users.map((u) => u._id),
        title,
        body,
        type,
        metadata,
    });
};
