import { Bank } from "@prisma/client";
import { BankDto } from "../../dto/bank/bankDto";
import axios from "axios";
import { ILUMA_API_KEY, ILUMA_API_URL } from "../../../config/config";
import { Request, Response } from "express";
import db from "../../../config/db";

export const addBankAccount = async (req: Request, res: Response) => {
  const { sellerId, accounts } = req.body;
  const data: { message: string; data?: Bank }[] = [];

  const sellerCount = await db.seller.count({ where: { id: sellerId } });
  if (sellerCount == 0) {
    return res
      .status(400)
      .send({ message: `Seller with id ${sellerId} not found` });
  }

  await Promise.all(
    (accounts as BankDto[]).map(async (accountItem) => {
      try {
        const accountCount = await db.bank.count({
          where: {
            sellerId: sellerId,
            accountNumber: accountItem.accountNumber,
            name: accountItem.name,
          },
        });

        if (accountCount != 0) {
          data.push({ message: "User has already have that account" });
        } else {
          const account = await db.bank.create({
            data: {
              name: accountItem.name,
              code: accountItem.code,
              swiftCode: accountItem.swiftCode,
              accountNumber: accountItem.accountNumber,
              sellerId: sellerId,
            },
          });
          data.push({ message: "Account successfully added", data: account });
        }
      } catch (error: any) {
        data.push({ message: error });
      }
    })
  );

  return res.status(200).send({ data: data });
};

export const getBank = async (req: Request, res: Response) => {
  try {
    const result = await axios.get(
      `${ILUMA_API_URL}/bank/available_bank_codes`,
      {
        headers: {
          Authorization: `Basic ${ILUMA_API_KEY}`,
        },
      }
    );
    return res.status(200).send({ data: result.data });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};
