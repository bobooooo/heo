import { afterAll, expect, it } from "vitest";
import { prisma } from "../../lib/prisma";
import { updateProfile } from "../profile";

const username = `profile_${Date.now()}`;
let userId = "";

it("updates profile", async () => {
  const user = await prisma.user.create({
    data: { username, password: "test" },
  });
  userId = user.id;

  const profile = await updateProfile(user.id, { name: "张三" });
  expect(profile.name).toBe("张三");
});

afterAll(async () => {
  if (userId) {
    await prisma.profile.deleteMany({ where: { userId } });
    await prisma.user.deleteMany({ where: { id: userId } });
  }
  await prisma.$disconnect();
});
