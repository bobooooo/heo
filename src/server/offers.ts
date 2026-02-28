import { prisma } from "../lib/prisma";

export type OfferInput = {
  name: string;
  phone: string;
  wechat: string;
};

export async function createOffer(
  requestId: string,
  helperId: string,
  input: OfferInput
) {
  return prisma.helpOffer.create({
    data: {
      requestId,
      helperId,
      name: input.name,
      phone: input.phone,
      wechat: input.wechat,
    },
  });
}

export async function selectOffer(
  requestId: string,
  offerId: string,
  ownerId?: string
) {
  const request = await prisma.helpRequest.findUnique({
    where: { id: requestId },
    include: { offers: true },
  });
  if (!request) return null;
  if (ownerId && request.userId !== ownerId) return null;

  const selected = request.offers.find((offer) => offer.id === offerId);
  if (!selected) return null;

  await prisma.$transaction([
    prisma.helpRequest.update({
      where: { id: requestId },
      data: { status: "MATCHED" },
    }),
    prisma.helpOffer.update({
      where: { id: offerId },
      data: { status: "SELECTED" },
    }),
    prisma.helpOffer.updateMany({
      where: { requestId, id: { not: offerId } },
      data: { status: "REJECTED" },
    }),
  ]);

  return { selectedId: offerId };
}

export async function cancelOffer(offerId: string, helperId: string) {
  const offer = await prisma.helpOffer.findUnique({ where: { id: offerId } });
  if (!offer || offer.helperId !== helperId) return null;

  await prisma.helpOffer.update({
    where: { id: offerId },
    data: { status: "CANCELED" },
  });

  if (offer.status === "SELECTED") {
    await prisma.helpRequest.update({
      where: { id: offer.requestId },
      data: { status: "OPEN" },
    });
  }

  return offer;
}

export async function cancelOfferByOwner(offerId: string, ownerId: string) {
  const offer = await prisma.helpOffer.findUnique({
    where: { id: offerId },
    include: { request: true },
  });
  if (!offer) return null;
  if (offer.request.userId !== ownerId) return null;

  await prisma.helpOffer.update({
    where: { id: offerId },
    data: { status: "CANCELED" },
  });

  if (offer.status === "SELECTED") {
    await prisma.helpRequest.update({
      where: { id: offer.requestId },
      data: { status: "OPEN" },
    });
  }

  return offer;
}
