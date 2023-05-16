import { Request, Response } from "express";
import { Category } from "../../models";
import logger from "../../utils/logger";
import { startCase } from "lodash";

export const addCategory = async (req: Request, res: Response) => {
  const { category } = req.body;
  const categoryList = category as string[];
  const data: object[] = [];

  await Promise.all(
    categoryList.map(async (name) => {
      const [categoryRes, created] = await Category.findOrCreate({
        where: {
          name: startCase(name),
        },
      });
      if (created) {
        data.push({
          category: categoryRes,
          status: "Successfully created",
        });
      } else {
        data.push({
          categpory: categoryRes,
          status: "Already created",
        });
      }
      logger.info(data);
    })
  );

  return res.status(201).send({
    message: "Sucessfully generate the category",
    data,
  });
};

export const getCategoryById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const category = await Category.findOne({ where: { id } });

  return res
    .status(200)
    .send({ message: "Sucessfully get all the category", data: category });
};

export const getAllCategory = async (_req: Request, res: Response) => {
  const category = await Category.findAll();

  return res
    .status(200)
    .send({ message: "Sucessfully get all the category", data: category });
};
