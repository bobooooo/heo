import { afterAll, expect, it } from "vitest";
import { prisma } from "../../lib/prisma";
import { createNotification } from "../notifications";

let notificationId = "";
let userId = "";

it("creates notification", async () => {
  const user = await prisma.user.create({
    data: { username: `note_${Date.now()}`, password: "test" },
  });
  userId = user.id;

  const note = await createNotification(user.id, "selected", { offerId: "o1" });
  notificationId = note.id;
  expect(note.type).toBe("selected");
});

afterAll(async () => {
  if (notificationId) {
    await prisma.notification.deleteMany({ where: { id: notificationId } });
  }
  if (userId) {
    await prisma.user.deleteMany({ where: { id: userId } });
  }
  await prisma.$disconnect();
});
