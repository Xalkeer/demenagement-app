import prisma from '../config/database';

export const createNotification = async (title: string, message: string) => {
  return await prisma.notification.create({
    data: {
      title,
      message,
    },
  });
};

export const getNotifications = async () => {
  return await prisma.notification.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50, // Keep it light
  });
};

export const markAsRead = async (id: number) => {
  return await prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });
};

export const markAllAsRead = async () => {
  return await prisma.notification.updateMany({
    where: { isRead: false },
    data: { isRead: true },
  });
};
