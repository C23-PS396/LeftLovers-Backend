import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import { secret } from "../../../config/config";
import jwt from "jsonwebtoken";
import { Customer, Role } from "../../models";

export const sinupCustomer = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  const encryptedPassword = bcrypt.hashSync(password);

  const role = await Role.findOne({
    where: {
      name: "customer",
    },
  });

  Customer.create({
    username,
    password: encryptedPassword,
    email,
    roleId: role?.id as string,
  })
    .then((customer) => {
      return res.status(201).send({
        message: "User was registered sucessfully",
        data: customer,
      });
    })
    .catch((err: Error) => {
      return res.status(500).send({ message: err });
    });
};

export const signinCustomer = async (req: Request, res: Response) => {
  const { credential, password } = req.body;

  const customer = await Customer.findOne({
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

  if (!customer) {
    return res.status(400).send({ message: "User not found" });
  }

  const passwordIsValid = bcrypt.compareSync(password, customer?.password);

  if (!passwordIsValid) {
    return res.status(400).send({ message: "Wrong password" });
  }

  const role = await Role.findOne({
    where: {
      id: customer.roleId,
    },
  });

  const token = jwt.sign(
    {
      id: customer.id,
      username: customer.username,
      email: customer.email,
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
      id: customer.id,
      username: customer.username,
      email: customer.email,
      roles: role?.name,
      accessToken: token,
    },
  });
};
