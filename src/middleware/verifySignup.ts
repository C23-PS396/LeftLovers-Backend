import { NextFunction, Request, Response } from "express";
import { validate } from "email-validator";
import db from "../../config/db";

export const checkDuplicateUsernameOrEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let users;
  const { email, username } = req.body;

  if (req.baseUrl.includes("customer")) {
    users = await db.customer.findMany({
      where: { OR: [{ username }, { email }] },
    });
  } else if (req.baseUrl.includes("seller")) {
    users = await db.seller.findMany({
      where: { OR: [{ username }, { email }] },
    });
  } else {
    return res.status(401).send({ message: "Wrong url path" });
  }

  if (users.length === 0) {
    next();
  } else {
    const user = users[0];
    if (user.username === username) {
      return res
        .status(409)
        .send({ message: `User with usename ${username} already exist!` });
    } else {
      return res
        .status(409)
        .send({ message: `User with email ${email} already exist!` });
    }
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
