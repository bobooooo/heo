import { prisma } from "../lib/prisma";

export type RequestInput = {
  cityId: string;
  communityId: string;
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
  return prisma.helpRequest.create({
    data: {
      userId,
      cityId: input.cityId,
      communityId: input.communityId,
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
    orderBy: { createdAt: "desc" },
  });
}

export async function getRequest(id: string) {
  return prisma.helpRequest.findUnique({ where: { id } });
}

export async function cancelRequest(id: string, userId: string) {
  const request = await prisma.helpRequest.findUnique({ where: { id } });
  if (!request || request.userId !== userId) {
    return null;
  }
  return prisma.helpRequest.update({
    where: { id },
    data: { status: "CANCELED" },
  });
}

export async function completeRequest(id: string, userId: string) {
  const request = await prisma.helpRequest.findUnique({ where: { id } });
  if (!request || request.userId !== userId) {
    return null;
  }
  return prisma.helpRequest.update({
    where: { id },
    data: { status: "COMPLETED" },
  });
}
