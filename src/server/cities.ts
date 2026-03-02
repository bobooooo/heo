import { prisma } from "../lib/prisma";

export async function listCities() {
  return prisma.city.findMany({ orderBy: { name: "asc" } });
}

export async function listCommunities(cityId: string) {
  return prisma.community.findMany({
    where: { cityId },
    orderBy: { name: "asc" },
  });
}

export async function getDefaultCommunityId(cityId: string) {
  const defaultCommunity = await prisma.community.findFirst({
    where: { cityId, name: "不限" },
  });
  if (defaultCommunity) return defaultCommunity.id;

  const fallback = await prisma.community.findFirst({
    where: { cityId },
    orderBy: { name: "asc" },
  });
  if (fallback) return fallback.id;

  const created = await prisma.community.create({
    data: { cityId, name: "不限" },
  });
  return created.id;
}
