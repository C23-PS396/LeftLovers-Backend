import { Request, Response } from "express";
import { ActiveFoodDto, FoodDto } from "../../dto/food/foodDto";
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
