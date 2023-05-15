import { Request, Response } from "express";
import { Categories } from "../../models";
import logger from "../../utils/logger";
import { startCase } from "lodash";

export const addCategories = async (req: Request, res: Response) => {
  const { categories } = req.body;
  const categoryList = categories as string[];
  const data: object[] = [];

  await Promise.all(
    categoryList.map(async (name) => {
      const [category, created] = await Categories.findOrCreate({
        where: {
          name: startCase(name),
        },
      });
      if (created) {
        data.push({
          category,
          status: "Successfully created",
        });
      } else {
        data.push({
          category,
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
  const category = await Categories.findOne({ where: { id } });

  return res
    .status(200)
    .send({ message: "Sucessfully get all the category", data: category });
};

export const getAllCategory = async (_req: Request, res: Response) => {
  const categories = await Categories.findAll();

  return res
    .status(200)
    .send({ message: "Sucessfully get all the category", data: categories });
};
