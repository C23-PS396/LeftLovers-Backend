import { Prisma, Seller, Location } from "@prisma/client";
import { Request, Response } from "express";

export const searchHandler = async (req: Request, res: Response) => {
  const { query } = req.query;

  let where: Prisma.MerchantWhereInput = {};

  if (query)
    where = {
      OR: [
        {
          Food: {
            some: {
              OR: [
                {
                  name: {
                    contains: query as string | undefined,
                    mode: "insensitive",
                  },
                },
                {
                  category: {
                    some: {
                      name: {
                        contains: query as string | undefined,
                        mode: "insensitive",
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          name: {
            contains: query as string | undefined,
            mode: "insensitive",
          },
        },
      ],
    };

  const merchant = await db.merchant.findMany({
    where,
    include: { seller: true, location: true },
  });

  const review = await db.review.groupBy({
    by: ["merchantId"],
    _avg: { rating: true },
    _count: { rating: true },
  });

  const data: {
    rating: {};
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    profilePictureUrl: string | null;
    sellerId: string;
    locationId: string;
    seller: Seller;
    location: Location;
  }[] = [];

  merchant.map((merchant) => {
    const idx = review.findIndex((review) => {
      return review.merchantId === merchant.id;
    });
    let rating = {};
    if (idx >= 0) rating = { ...review[idx] };

    data.push({ ...merchant, rating });
  });

  return res.status(200).send({ data });
};
