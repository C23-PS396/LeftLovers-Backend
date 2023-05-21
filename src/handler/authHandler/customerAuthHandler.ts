import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../../../config/db";
import { SECRET } from "../../../config/config";

export const signupCustomer = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  const encryptedPassword = bcrypt.hashSync(password);

  const role = await db.role.findUnique({ where: { name: "customer" } });

  db.customer
    .create({
      data: {
        username,
        password: encryptedPassword,
        email,
        roleId: role?.id as string,
      },
    })
    .then(async (customer) => {
      return res.status(201).send({
        message: "User was registered sucessfully",
        data: await db.customer.findUnique({
          where: { id: customer.id },
          include: { role: true },
        }),
      });
    })
    .catch((err: Error) => {
      return res.status(500).send({ message: err });
    });
};

export const signinCustomer = async (req: Request, res: Response) => {
  const { credential, password } = req.body;

  const customers = await db.customer.findMany({
    where: {
      OR: [{ email: credential }, { username: credential }],
    },
    include: { role: true },
  });

  if (customers.length === 0) {
    return res.status(400).send({ message: "User not found" });
  }

  const customer = customers[0];

  const passwordIsValid = bcrypt.compareSync(password, customer.password);

  if (!passwordIsValid) {
    return res.status(400).send({ message: "Wrong password" });
  }

  const token = jwt.sign(
    {
      id: customer.id,
      username: customer.username,
      email: customer.email,
      role: customer.role.name,
    },
    SECRET,
    {
      expiresIn: 60 * 60 * 24, // 24 hour
    }
  );

  res.status(200).send({
    message: "User signed in successfully",
    data: customer,
    token,
  });
};
