import { cache } from "react";
import { prisma } from "./prisma";

// React.cache() ensures these functions are deduplicated within a single request
// This prevents redundant database queries when the same data is needed in multiple components

export const getDeals = cache(async (userId: string, stage?: string) => {
  return prisma.deal.findMany({
    where: {
      salesRepId: userId,
      ...(stage && { stage }),
    },
    orderBy: { updatedAt: "desc" },
  });
});

export const getDealById = cache(async (dealId: string, userId: string) => {
  return prisma.deal.findFirst({
    where: {
      id: dealId,
      salesRepId: userId,
    },
    include: {
      files: {
        orderBy: { uploadedAt: "desc" },
      },
    },
  });
});

export const getDashboardStats = cache(async (userId: string) => {
  const currentYear = new Date().getFullYear();
  const startOfYear = new Date(currentYear, 0, 1);

  const [wonDeals, dealsByStage, recentDeals] = await Promise.all([
    prisma.deal.findMany({
      where: {
        salesRepId: userId,
        stage: "WON",
        updatedAt: { gte: startOfYear },
      },
    }),
    prisma.deal.groupBy({
      by: ["stage"],
      where: { salesRepId: userId },
      _count: { stage: true },
    }),
    prisma.deal.findMany({
      where: { salesRepId: userId },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
  ]);

  const ytdClosed = wonDeals.reduce((sum, deal) => sum + deal.dealValue, 0);

  return { ytdClosed, dealsByStage, recentDeals };
});

export const getClientDeals = cache(async (companyName: string) => {
  return prisma.deal.findMany({
    where: {
      clientCompanyName: companyName,
      stage: { in: ["QUOTED", "WON"] },
    },
    orderBy: { updatedAt: "desc" },
  });
});
