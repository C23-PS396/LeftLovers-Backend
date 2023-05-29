import { Request, Response } from "express";
import db from "../../../config/db";

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
        message: `User already have merchant!}`,
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
  const { id, sellerId } = req.query;
  let merchant;

  if (id || sellerId) {
    merchant = await db.merchant.findMany({
      where: {
        OR: [
          { id: id as string | undefined },
          { sellerId: sellerId as string | undefined },
        ],
      },
      include: { seller: true, location: true },
    });
  } else {
    merchant = await db.merchant.findMany({
      include: { seller: true, location: true },
    });
  }

  if (!merchant || merchant.length <= 0) {
    return res.status(400).send({
      message: "Merchant not found",
    });
  }

  return res.status(200).send({
    data: merchant,
  });
};
