import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import { secret } from "../../config/config";
import jwt from "jsonwebtoken";
import { Role, Seller } from "../../models";

export const signupSeller = async (req: Request, res: Response) => {
  const { fullname, username, email, password } = req.body;

  const encryptedPassword = bcrypt.hashSync(password);

  const role = await Role.findOne({
    where: {
      name: "seller",
    },
  });

  Seller.create({
    fullname: fullname,
    username: username,
    password: encryptedPassword,
    email: email,
    roleId: role?.id as string,
  })
    .then((seller) => {
      return res
        .status(201)
        .send({ message: "User was registered sucessfully", data: seller });
    })
    .catch((err: Error) => {
      return res.status(500).send({ message: err });
    });
};

export const signinSeller = async (req: Request, res: Response) => {
  const { credential, password } = req.body;

  const seller = await Seller.findOne({
    where: {
      [Op.or]: [
        {
          email: credential,
        },
        {
          username: credential,
        },
      ],
    },
    include: Role,
  });

  if (!seller) {
    return res.status(400).send({ message: "User not found" });
  }

  const passwordIsValid = bcrypt.compareSync(password, seller?.password);

  if (!passwordIsValid) {
    return res.status(400).send({ message: "Wrong password" });
  }

  const role = await Role.findOne({
    where: {
      id: seller.roleId,
    },
  });

  var token = jwt.sign(
    {
      id: seller.id,
      username: seller.username,
      email: seller.email,
      role: role?.name,
    },
    secret,
    {
      expiresIn: 60 * 60, // 1 hour
    }
  );

  res.status(200).send({
    message: "User signed in successfully",
    data: {
      id: seller.id,
      username: seller.username,
      email: seller.email,
      roles: role?.name,
      accessToken: token,
    },
  });
};
