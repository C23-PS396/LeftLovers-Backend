import { Request, Response } from "express";
import {
  ActiveFoodDto,
  FoodDto,
  FoodTransaction,
} from "../../dto/food/foodDto";
import db from "../../../config/db";
import { Food, Category } from "@prisma/client";
import { calculateEndDate } from "../../utils/getEndDate";
import logger from "../../utils/logger";

export const addFoods = async (req: Request, res: Response) => {
  const { foods, merchantId } = req.body;
  const foodList = foods as object[];
  const data: {
    data:
      | (Food & { category: Category[] })
      | { food: (Food & { category: Category[] }) | null }
      | null;
    message: string;
  }[] = [];
  const merchant = await db.merchant.findUnique({ where: { id: merchantId } });

  if (!merchant) {
    return res
      .status(400)
      .send({ message: `Merchant with id ${merchantId} doesn't exist` });
  }

  await Promise.all(
    foodList.map(async (foodListItem: object) => {
      const foodObj: FoodDto = foodListItem as FoodDto;

      const foodsObj = await db.food.findMany({
        where: { name: foodObj.name, merchantId },
      });

      if (foodsObj[0]) {
        data.push({
          data: {
            food: await db.food.findUnique({
              where: { id: foodsObj[0].id },
              include: { category: true },
            }),
          },
          message: "Food is already there at the merchant",
        });
      } else {
        try {
          const food = await db.food.create({
            data: {
              name: foodObj.name,
              price: foodObj.price,
              pictureUrl: foodObj.pictureUrl,
              merchantId,
              category: {
                connectOrCreate: foodObj.category.map((name) => {
                  return { create: { name }, where: { name } };
                }),
              },
            },
          });

          const foodWithCategory = await db.food.findUnique({
            where: { id: food.id },
            include: { category: true },
          });

          data.push({
            data: foodWithCategory,
            message: "Food is successfully added to the merchant",
          });
        } catch (err) {
          data.push({ message: err as string, data: null });
        }
      }
    })
  );

  return res.status(201).send({ data });
};

export const activateFood = async (req: Request, res: Response) => {
  const { foods, merchantId } = req.body;
  const data: object[] = [];
  const activeFoodList = foods as ActiveFoodDto[];
  const merchant = await db.merchant.findUnique({ where: { id: merchantId } });

  if (!merchant) {
    return res
      .status(400)
      .send({ message: `Merchant with id ${merchantId} doesn't exist` });
  }

  await Promise.all(
    activeFoodList.map(async (activeFoodListItem: ActiveFoodDto) => {
      const foodId = activeFoodListItem.foodId;
      const food = await db.food.findUnique({ where: { id: foodId } });

      if (food) {
        const activeFood = await db.activeFood.findUnique({
          where: { foodId },
        });
        const curretDate = new Date();
        if (
          activeFood &&
          (activeFood.isActive || activeFood.endTime > curretDate)
        ) {
          data.push({
            message: "Food is already active",
            data: await db.activeFood.findUnique({
              where: { foodId },
              include: { food: true },
            }),
          });
        } else {
          try {
            if (activeFood) {
              await db.activeFood.delete({ where: { foodId } });
            }

            const newActiveFood = await db.activeFood.create({
              data: {
                foodId: activeFoodListItem.foodId,
                stock: activeFoodListItem.stock,
                startTime: curretDate,
                endTime: calculateEndDate(
                  curretDate,
                  activeFoodListItem.durationInHour * 60 * 60
                ),
                durationInSecond: activeFoodListItem.durationInHour * 60 * 60,
                isActive: activeFoodListItem.isActive || true,
              },
              include: { food: true },
            });

            data.push({
              message: "Food is activated",
              data: newActiveFood,
            });
          } catch (error) {
            logger.error(error);
          }
        }
      } else {
        data.push({ message: "Food is not found" });
      }
    })
  );

  return res.status(201).send({ data });
};

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
      merchantId: merchantId,
      customerId: customerId,
      isValid: true,
      isPaid: false,
      payConfirmed: false,
      isDone: false,
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
          result.push({ message: message });
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
    .send({ data: transaction, result: result, message: messageData });
};
