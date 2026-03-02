import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

export async function createNotification(
  userId: string,
  type: string,
  payload: Prisma.InputJsonValue
) {
  return prisma.notification.create({
    data: { userId, type, payload },
  });
}

export async function listNotifications(userId: string) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function markNotificationRead(id: string, userId: string) {
  const notification = await prisma.notification.findFirst({
    where: { id, userId },
  });
  if (!notification) return null;

  return prisma.notification.update({
    where: { id },
    data: { readAt: new Date() },
  });
}
