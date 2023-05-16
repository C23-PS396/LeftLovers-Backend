import { Request, Response } from "express";
import { Category, Food, FoodCategory, Merchant } from "../../models";
import { FoodDto } from "../../dto/food/foodDto";
import { startCase } from "lodash";
import { FoodInstance } from "../../models/food/food";

export const addFoods = async (req: Request, res: Response) => {
  const { foods, merchantId } = req.body;
  const foodList = foods as object[];
  const data: object[] = [];

  const merchant = await Merchant.findOne({ where: { id: merchantId } });

  if (!merchant) {
    return res
      .status(4000)
      .send(`Merchant with id ${merchantId} doesn't exist`);
  }

  await Promise.all(
    foodList.map(async (food: object) => {
      const foodObj: FoodDto = food as FoodDto;

      let foodRes = await Food.findOne({
        where: { name: foodObj.name, merchantId },
      });

      if (foodRes) {
        data.push({
          data: { food: foodRes },
          message: "Food is already there at the merchant",
        });
      } else {
        foodRes = (await Food.create({
          name: foodObj.name,
          price: foodObj.price,
          pictureUrl: foodObj.pictureUrl,
          merchantId,
        })) as FoodInstance;

        data.push({
          data: { food: foodRes },
          message: "Food successfully added to merchant",
        });
      }

      foodObj.category.map(async (name) => {
        const categoryName = startCase(name);

        const [categoryRes, _created] = await Category.findOrCreate({
          where: { name: categoryName },
        });

        const categoryId = categoryRes.id;
        const foodId = foodRes?.id as string;

        FoodCategory.findOrCreate({
          where: {
            categoryId,
            foodId,
          },
        });
      });
    })
  );

  return res.status(201).send({ data });
};
