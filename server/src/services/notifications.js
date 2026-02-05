import { prisma } from "../db/prisma.js";
import { getIO } from "../realtime/socket.js";

export const notifyUser = async (userId, type, message, payload = null) => {
  const notification = await prisma.notification.create({
    data: {
      userId,
      type,
      message,
      payload,
    },
  });

  const io = getIO();
  if (io) {
    io.to(`user:${userId}`).emit("notification", notification);
  }

  return notification;
};

