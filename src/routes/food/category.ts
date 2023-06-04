import { Router } from "express";
import validation from "../../middleware/requestBodyValidation";
import { body } from "express-validator";
import {
  addCategory,
  getAllCategory,
  getCategoryById,
} from "../../handler/foodHandler/categoryHandler";
import { isSeller, verifyToken } from "../../middleware/authJwt";

const router = Router();

/**
 * @swagger
 * /api/v1/food/category/add:
 *   post:
 *     summary: Add categories of Food
 *     tags:
 *       - Food
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Categories added successfully
 *       400:
 *         description: Bad request. Invalid categories format
 *       401:
 *         description: Unauthorized. Missing or invalid token
 *       500:
 *         description: Internal server error
 */
router.post(
  "/add",
  [validation([body("categories").isArray().exists()]), verifyToken, isSeller],
  addCategory
);

/**
 * @swagger
 * /api/v1/food/category/{id}:
 *   get:
 *     summary: Get a category by ID
 *     tags:
 *       - Food
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Category ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the category
 *       401:
 *         description: Unauthorized. Missing or invalid token
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", [verifyToken], getCategoryById);

/**
 * @swagger
 * /api/v1/food/category:
 *   get:
 *     summary: Get all categories
 *     tags:
 *       - Food
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the categories
 *       401:
 *         description: Unauthorized. Missing or invalid token
 *       500:
 *         description: Internal server error
 */
router.get("/", getAllCategory);

export default router;
