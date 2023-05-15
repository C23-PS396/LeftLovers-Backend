import { NextFunction, Request, Response } from "express";
import { validate } from "email-validator";
import { Customer, Seller } from "../models";
import { Op } from "sequelize";

export const checkDuplicateUsernameOrEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let userType;

  if (req.baseUrl.includes("customer")) {
    userType = Customer;
  } else if (req.baseUrl.includes("seller")) {
    userType = Seller;
  } else {
    return res.status(401).send({ message: "Wrong url path" });
  }

  const { email, username } = req.body;

  const user = await userType.findOne({
    where: {
      [Op.or]: [
        {
          username,
        },
        {
          email,
        },
      ],
    },
  });

  if (!user) {
    next();
  } else if (user.username === username) {
    return res
      .status(409)
      .send({ message: `User with usename ${username} already exist!` });
  } else {
    return res
      .status(409)
      .send({ message: `User with email ${email} already exist!` });
  }
};

export const checkEmailIsValid = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;

  if (!validate(email)) {
    return res.status(400).send({ message: `${email} is not valid email!` });
  }

  next();
};
