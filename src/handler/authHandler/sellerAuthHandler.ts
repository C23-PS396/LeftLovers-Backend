import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../../../config/db";
import { SECRET } from "../../../config/config";

export const signupSeller = async (req: Request, res: Response) => {
  const { username, fullname, email, password } = req.body;

  const encryptedPassword = bcrypt.hashSync(password);

  const role = await db.role.findUnique({ where: { name: "seller" } });

  db.seller
    .create({
      data: {
        username,
        password: encryptedPassword,
        email,
        roleId: role?.id as string,
        fullname,
      },
    })
    .then(async (seller) => {
      const token = jwt.sign(
        {
          id: seller.id,
          username: seller.username,
          email: seller.email,
          fullname: seller.fullname,
          role: "seller",
        },
        SECRET,
        {
          expiresIn: 60 * 60 * 24, // 24 hour
        }
      );

      return res.status(201).send({
        message: "User was registered sucessfully",
        data: await db.seller.findUnique({
          where: { id: seller.id },
          include: { role: true },
        }),
        token: token,
      });
    })
    .catch((err: Error) => {
      return res.status(500).send({ message: err });
    });
};

export const signinSeller = async (req: Request, res: Response) => {
  const { credential, password } = req.body;

  const sellers = await db.seller.findMany({
    where: {
      OR: [{ email: credential }, { username: credential }],
    },
    include: { role: true },
  });

  if (sellers.length === 0) {
    return res.status(400).send({ message: "User not found" });
  }

  const seller = sellers[0];

  const passwordIsValid = bcrypt.compareSync(password, seller.password);

  if (!passwordIsValid) {
    return res.status(400).send({ message: "Wrong password" });
  }

  const token = jwt.sign(
    {
      id: seller.id,
      username: seller.username,
      email: seller.email,
      fullname: seller.fullname,
      role: seller.role.name,
    },
    SECRET,
    {
      expiresIn: 60 * 60 * 24, // 24 hour
    }
  );

  res.status(200).send({
    message: "User signed in successfully",
    data: seller,
    token,
  });
};
