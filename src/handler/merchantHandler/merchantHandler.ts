import { Request, Response } from "express";
import { Op } from "sequelize";
import { Merchant, Location } from "../../models";

export const registerMerchant = async (req: Request, res: Response) => {
  const { name, locationId, sellerId, profilePictureUrl } = req.body;

  const location = await Location.findOne({
    where: {
      id: locationId,
    },
  });

  if (!location) {
    return res.status(403).send({
      message: "Location isn't valid",
    });
  }

  const merchant = await Merchant.findOne({
    where: {
      [Op.or]: [{ name }, { sellerId }],
    },
  });

  if (merchant) {
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

  Merchant.create({
    name,
    locationId,
    sellerId,
    profilePictureUrl,
  })
    .then((merchantObj) => {
      return res.status(201).send({
        message: "Merchant succefully registered",
        data: merchantObj,
      });
    })
    .catch((err: Error) => {
      return res.status(500).send({ message: err });
    });
};

export const getAllMerchant = async (_req: Request, res: Response) => {
  const merchants = await Merchant.findAll();

  return res.status(200).send({
    data: merchants,
  });
};

export const getMerchantById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const merchant = await Merchant.findOne({ where: { id } });

  if (!merchant) {
    return res.status(400).send({
      message: "Merchant not found",
    });
  }

  return res.status(200).send({
    data: merchant,
  });
};
