import { Server } from "socket.io";
import { User } from "../app/modules/user/user.model";

export const cleanupStaleSockets = async (io: Server) => {
    console.log("Running cleanup of stale sockets...");
    const sockets = await io.fetchSockets();
    const activeSocketIds = sockets.map(s => s.id);

    await User.updateMany(
        {},
        { $pull: { socketIds: { $nin: activeSocketIds } } }
    );
};
