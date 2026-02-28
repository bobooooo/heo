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
