import { Request, Response, response } from "express";
import db from "../../../config/db";
import { Location, Prisma, Seller } from "@prisma/client";
import { startCase } from "lodash";
import axios, { AxiosError } from "axios";
import { ML_API_URL } from "../../../config/config";
import logger from "../../utils/logger";

export const registerMerchant = async (req: Request, res: Response) => {
  const { name, locationId, sellerId, profilePictureUrl } = req.body;
  const location = await db.location.findUnique({ where: { id: locationId } });

  if (!location) {
    return res.status(403).send({
      message: "Location isn't found",
    });
  }

  const merhcants = await db.merchant.findMany({
    where: {
      OR: [{ name }, { sellerId }],
    },
  });

  if (merhcants.length > 0) {
    const merchant = merhcants[0];
    if (merchant.name === name) {
      return res.status(403).send({
        message: `Merchant with name ${name} already exist! Use another name`,
      });
    } else {
      return res.status(403).send({
        message: `User already have merchant!`,
      });
    }
  }

  db.merchant
    .create({
      data: {
        name,
        locationId,
        sellerId,
        profilePictureUrl,
      },
    })
    .then(async (merchant) => {
      return res.status(201).send({
        message: "Merchant succefully registered",
        data: await db.merchant.findUnique({
          where: { id: merchant.id },
          include: { seller: true, location: true },
        }),
      });
    })
    .catch((err: Error) => {
      return res.status(500).send({ message: err });
    });
};

export const getMerchant = async (req: Request, res: Response) => {
  const { id, sellerId, isActive, category } = req.query;

  const whereMerchant: Prisma.MerchantWhereInput = {};
  const whereReview: Prisma.ReviewWhereInput = {};

  if (id || sellerId) {
    whereMerchant.OR = [
      { id: id as string | undefined },
      { sellerId: sellerId as string | undefined },
    ];
  }

  if (isActive && isActive === "true") {
    whereMerchant.Food = {
      some: {
        activeFood: {
          AND: [
            { isActive: true, stock: { gt: 0 }, endTime: { gte: new Date() } },
          ],
        },
      },
    };
  }

  if (category) {
    whereMerchant.Food = {
      some: {
        category: {
          some: {
            name: {
              contains: startCase(category as string | undefined),
              mode: "insensitive",
            },
          },
        },
      },
    };
  }

  const merchant = await db.merchant.findMany({
    where: whereMerchant,
    include: { seller: true, location: true },
  });

  if (id || sellerId) {
    whereReview.OR = [
      { merchant: { id: id as string | undefined } },
      { merchant: { sellerId: sellerId as string | undefined } },
    ];
  }

  const review = await db.review.groupBy({
    by: ["merchantId"],
    where: whereReview,
    _avg: { rating: true },
    _count: { rating: true },
  });

  if (id || sellerId) {
    if (!merchant || merchant.length <= 0) {
      return res.status(400).send({
        message: "Merchant not found",
      });
    }

    const statistics = await db.transaction.aggregate({
      where: { merchantId: merchant[0].id, status: 5 },
      _sum: {
        totalprice: true,
      },
      _count: {
        id: true,
      },
    });

    const data = {
      ...merchant[0],
      rating: { ...review[0] },
      statistic: statistics,
    };
    return res.status(200).send({ data });
  }

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

  return res.status(200).send({
    data,
  });
};

export const getRecommendation = async (req: Request, res: Response) => {
  const { customerId } = req.query;
  const where: Prisma.CustomerWhereInput = {};

  if (customerId) {
    where.id = customerId as string;
  }

  await axios
    .get(`${ML_API_URL}/getPrediction`, {
      params: {
        user_id: customerId as string,
      },
    })
    .then((response) => response.data)
    .then(async (data: string[]) => {
      logger.info(data);
      const merchantId: string[] = [];

      data.map((d) => {
        merchantId.push(d);
      });

      const merchant = await db.merchant.findMany({
        where: {
          id: {
            in: merchantId,
          },
        },
        include: { seller: true, location: true },
      });

      const review = await db.review.groupBy({
        by: ["merchantId"],
        _avg: { rating: true },
        _count: { rating: true },
      });

      const dataResponse: {
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

        dataResponse.push({ ...merchant, rating });
      });

      return res.status(200).send({
        data: dataResponse,
      });
    })
    .catch((err: AxiosError) => {
      logger.error(err);
      return res.status(500).send(err.response?.data);
    });
};
