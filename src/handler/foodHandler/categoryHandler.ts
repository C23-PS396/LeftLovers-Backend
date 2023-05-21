import { Request, Response } from "express";
import { startCase } from "lodash";
import db from "../../../config/db";

export const addCategory = async (req: Request, res: Response) => {
  const { categories } = req.body;
  const categoryList = categories as string[];
  const data: object[] = [];

  await Promise.all(
    categoryList.map(async (categoryListItem) => {
      try {
        const category = await db.category.create({
          data: { name: startCase(categoryListItem) },
        });

        data.push({ catagory: category, message: "Successfully created" });
      } catch (err) {
        data.push({
          category: await db.category.findUnique({
            where: { name: startCase(categoryListItem) },
          }),
          message: "Already created",
        });
      }
    })
  );

  return res.status(201).send({
    message: "Sucessfully generate the category",
    data,
  });
};

export const getCategoryById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const category = await db.category.findUnique({ where: { id } });

  return res
    .status(200)
    .send({ message: "Sucessfully get the category", data: category });
};

export const getAllCategory = async (_req: Request, res: Response) => {
  const category = await db.category.findMany();

  return res
    .status(200)
    .send({ message: "Sucessfully get all categories", data: category });
};
