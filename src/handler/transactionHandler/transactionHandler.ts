import { Request, Response } from "express";
import db from "../../../config/db";
import logger from "../../utils/logger";
import { FoodTransaction } from "../../dto/food/foodDto";

export const buyFood = async (req: Request, res: Response) => {
  const { merchantId, customerId, foods }: FoodTransaction = req.body;

  const merchant = await db.merchant.findUnique({ where: { id: merchantId } });
  if (!merchant) {
    return res
      .status(400)
      .send({ message: `Merchant with id ${merchantId} not found` });
  }

  const customer = await db.customer.findUnique({ where: { id: customerId } });
  if (!customer) {
    return res
      .status(400)
      .send({ message: `Customer with id ${customerId} not found` });
  }

  let transaction = await db.transaction.create({
    data: {
      totalprice: 0,
      merchantId,
      customerId,
      status: 1,
    },
  });
  let totalPrice = 0;
  const result: { message: string }[] = [];

  await Promise.all(
    foods.map(async (foodItem) => {
      try {
        const activeFood = await db.activeFood.findUnique({
          where: { foodId: foodItem.foodId },
          include: { food: true },
        });

        if (
          !activeFood ||
          (!activeFood?.isActive && activeFood.endTime < new Date())
        ) {
          let message = "";
          if (activeFood?.food.name) {
            message = `Food with name ${
              activeFood?.food.name as string
            } is not available now`;
          } else {
            message = `Food with id ${foodItem.foodId} is not available now`;
          }
          result.push({ message });
        } else if ((activeFood?.stock as number) < foodItem.quantity) {
          result.push({
            message: `Foods with name ${
              activeFood?.food.name as string
            } out of the stock`,
          });
        } else {
          result.push({
            message: `Food with name ${
              activeFood?.food.name as string
            } succesfully added`,
          });
          await db.foodTransaction.create({
            data: {
              foodId: foodItem.foodId,
              quantity: foodItem.quantity,
              foodName: activeFood?.food.name as string,
              foodPrice: activeFood?.food.price as number,
              transactionId: transaction.id,
            },
          });

          totalPrice +=
            ((
              await db.food.findUnique({
                where: { id: foodItem.foodId },
              })
            )?.price as number) * foodItem.quantity;

          await db.activeFood.update({
            where: { foodId: foodItem.foodId },
            data: {
              stock: (activeFood?.stock as number) - foodItem.quantity,
            },
          });
        }
      } catch (err) {
        logger.error(err);
      }
    })
  );
  let messageData = "";
  let status = 0;

  if (totalPrice > 0) {
    transaction = await db.transaction.update({
      where: { id: transaction.id },
      data: { totalprice: totalPrice },
      include: { food: true },
    });
    messageData = "Transaction succesfull";
    status = 200;
  } else {
    transaction = await db.transaction.delete({
      where: { id: transaction.id },
    });
    messageData = "Transaction failed!";
    status = 400;
  }

  return res
    .status(status)
    .send({ data: transaction, result, message: messageData });
};

export const getTransaction = async (req: Request, res: Response) => {
  const { merchantId } = req.query;

  const merchant = await db.merchant.findUnique({
    where: { id: merchantId as string | undefined },
  });

  if (!merchant)
    return res
      .status(400)
      .send({ message: `Merchant with id ${merchantId} doesn;t found` });

  const transaction = await db.transaction.findMany({
    where: { merchantId: merchantId as string | undefined },
    include: {
      food: true,
      customer: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return res.status(200).send({
    transaction: "Transaction has successfully fetched",
    data: transaction,
  });
};

export const changeTransactionStatus = async (req: Request, res: Response) => {
  const { status, transactionId } = req.body;

  let transaction = await db.transaction.findUnique({
    where: { id: transactionId },
  });

  if (!transaction)
    return res
      .status(400)
      .send({ message: `Transaction with id ${transactionId} doesn't exist` });

  if (status < 1 || status > 6)
    return res.status(400).send({ message: `Status=${status} is not valid` });

  transaction = await db.transaction.update({
    where: { id: transactionId },
    data: {
      status: Number(status),
    },
    include: {
      food: true,
      merchant: true,
    },
  });

  return res.status(200).send({
    message: "Transaction Status has been updated",
    data: transaction,
  });
};