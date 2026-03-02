import { prisma } from "../lib/prisma";
import { createNotification } from "./notifications";
import { getDefaultCommunityId } from "./cities";

export type RequestInput = {
  cityId: string;
  communityId?: string;
  time: string;
  title: string;
  category: string;
  detail: string;
  contactPhone: string;
  contactWechat: string;
};

export type RequestFilters = {
  cityId?: string;
  communityId?: string;
  status?: "OPEN" | "MATCHED" | "COMPLETED" | "CANCELED";
};

export async function createRequest(userId: string, input: RequestInput) {
  const resolvedCommunityId =
    input.communityId ?? (await getDefaultCommunityId(input.cityId));

  return prisma.helpRequest.create({
    data: {
      userId,
      cityId: input.cityId,
      communityId: resolvedCommunityId,
      time: new Date(input.time),
      title: input.title,
      category: input.category,
      detail: input.detail,
      contactPhone: input.contactPhone,
      contactWechat: input.contactWechat,
    },
  });
}

export async function listRequests(filters: RequestFilters) {
  return prisma.helpRequest.findMany({
    where: {
      cityId: filters.cityId,
      communityId: filters.communityId,
      status: filters.status,
    },
    include: {
      city: true,
      community: true,
      _count: { select: { offers: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function listRequestsByUser(userId: string) {
  return prisma.helpRequest.findMany({
    where: { userId },
    include: {
      city: true,
      community: true,
      offers: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getRequest(id: string) {
  if (!id) return null;
  return prisma.helpRequest.findUnique({
    where: { id },
    include: {
      city: true,
      community: true,
      offers: true,
      _count: { select: { offers: true } },
    },
  });
}

export async function cancelRequest(id: string, userId: string) {
  const request = await prisma.helpRequest.findUnique({
    where: { id },
    include: { offers: true },
  });
  if (!request || request.userId !== userId) {
    return null;
  }

  const updated = await prisma.helpRequest.update({
    where: { id },
    data: { status: "CANCELED" },
  });

  const helperIds = request.offers.map((offer) => offer.helperId);
  await Promise.all(
    helperIds.map((helperId) =>
      createNotification(helperId, "request_canceled", { requestId: id })
    )
  );

  return updated;
}

export async function completeRequest(id: string, userId: string) {
  const request = await prisma.helpRequest.findUnique({
    where: { id },
    include: { offers: true },
  });
  if (!request || request.userId !== userId) {
    return null;
  }

  const updated = await prisma.helpRequest.update({
    where: { id },
    data: { status: "COMPLETED" },
  });

  const selectedHelpers = request.offers
    .filter((offer) => offer.status === "SELECTED")
    .map((offer) => offer.helperId);

  await Promise.all(
    selectedHelpers.map((helperId) =>
      createNotification(helperId, "request_completed", { requestId: id })
    )
  );

  return updated;
}
