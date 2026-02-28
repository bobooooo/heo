import { prisma } from "../lib/prisma";

export type ProfileInput = {
  name?: string | null;
  phone?: string | null;
  wechat?: string | null;
};

export async function getProfile(userId: string) {
  return prisma.profile.findUnique({ where: { userId } });
}

export async function updateProfile(userId: string, input: ProfileInput) {
  return prisma.profile.upsert({
    where: { userId },
    create: {
      userId,
      name: input.name ?? null,
      phone: input.phone ?? null,
      wechat: input.wechat ?? null,
    },
    update: {
      name: input.name ?? undefined,
      phone: input.phone ?? undefined,
      wechat: input.wechat ?? undefined,
    },
  });
}
