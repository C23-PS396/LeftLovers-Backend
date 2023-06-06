import { Request, Response } from "express";

export const getWeeklyLeaderboard = async (req: Request, res: Response) => {
  const today = new Date();
  const currentDay = today.getDay();
  const daysSinceSunday = (currentDay + 7 - 0) % 7;
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - daysSinceSunday);
  startOfWeek.setHours(0, 0, 0, 0);

  const leaderboard = await db.transaction.groupBy({
    by: ["customerId"],
    orderBy: { _sum: { totalprice: "desc" } },
    where: { createdAt: { gte: startOfWeek } },
    take: 10,
    _sum: { totalprice: true },
  });

  const customerIds = leaderboard.map((item) => item.customerId);

  const customers = await db.customer.findMany({
    where: { id: { in: customerIds } },
  });

  const data: {
    totalPoint: { totalprice: number | null };
    id: string;
    createdAt: Date;
    updatedAt: Date;
    fullname: string | null;
    username: string;
    email: string;
    password: string;
    roleId: string;
  }[] = [];

  leaderboard.map((lead) => {
    const customerId = lead.customerId;
    const idx = customers.findIndex((cust) => {
      return cust.id === customerId;
    });

    data.push({ ...customers[idx], totalPoint: lead._sum });
  });

  return res.status(200).send(data);
};
