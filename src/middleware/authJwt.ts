import { NextFunction, Response } from "express";
import { SECRET } from "../../config/config";
import jwt, { JwtPayload } from "jsonwebtoken";
import { CustomRequest } from "../types/types";

export const verifyToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  let token: string | undefined = req.headers.authorization as
    | string
    | undefined;

  if (!token) {
    return res.status(401).send({
      message: "No token provided!",
    });
  } else {
    token = token.split(" ")[1];
  }

  jwt.verify(token, SECRET, (err: any, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    req.userId = (decoded as JwtPayload).id;
    req.role = (decoded as JwtPayload).role.toLowerCase();
    next();
  });
};

export const isAdmin = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.role !== "admin") {
    return res.status(401).send({
      message: "Require Admin Role!",
    });
  }

  next();
};

export const isSeller = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.role !== "seller") {
    return res.status(401).send({
      message: "Require Seller Role!",
    });
  }

  next();
};

export const isCustomer = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.role !== "customer") {
    return res.status(401).send({
      message: "Require Customer Role!",
    });
  }

  next();
};
