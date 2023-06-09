import { Router } from "express";
import validation from "../../middleware/requestBodyValidation";
import { body, query } from "express-validator";
import { isSeller, verifyToken } from "../../middleware/authJwt";
import {
  activateFood,
  addFoods,
  deleteFood,
  getFoodByFilter,
} from "../../handler/foodHandler/foodHandler";

const router = Router();

/**
 * @swagger
 * /api/v1/food/create:
 *   post:
 *     summary: Create new foods
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
 *               merchantId:
 *                 type: string
 *               foods:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     price:
 *                       type: number
 *                     category:
 *                       type: array
 *                       items:
 *                         type: string
 *     responses:
 *       200:
 *         description: Foods created successfully
 *       400:
 *         description: Bad request. Invalid request body format
 *       401:
 *         description: Unauthorized. Missing or invalid token
 *       500:
 *         description: Internal server error
 */
router.post(
  "/create",
  [
    validation([
      body("merchantId").exists().isUUID(),
      body("foods").exists().isArray(),
      body("foods.*.name").exists(),
      body("foods.*.name").notEmpty(),
      body("foods.*.price").notEmpty().isNumeric(),
      body("foods.*.category").notEmpty().isArray(),
    ]),
    verifyToken,
    isSeller,
  ],
  addFoods
);

/**
 * @swagger
 * /api/v1/food/active:
 *   post:
 *     summary: Activate food items
 *     tags:
 *       - Food
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               merchantId:
 *                 type: string
 *               foods:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     foodId:
 *                       type: string
 *                     stock:
 *                       type: number
 *                     durationInHour:
 *                       type: number
 *     responses:
 *       200:
 *         description: Food items activated successfully
 *       400:
 *         description: Bad request. Invalid request body format
 *       500:
 *         description: Internal server error
 */
router.post(
  "/active",
  [
    validation([
      body("merchantId").exists().isUUID(),
      body("foods").exists().isArray(),
      body("foods.*.foodId").exists().isUUID(),
      body("foods.*.stock").exists().isNumeric(),
      body("foods.*.durationInHour").exists().isNumeric(),
    ]),
    verifyToken,
    isSeller,
  ],
  activateFood
);

/**
 * @swagger
 * /api/v1/food:
 *   get:
 *     summary: Get food
 *     tags:
 *       - Food
 *     parameters:
 *       - in: query
 *         name: merchantId
 *         required: false
 *         description: ID of the merchant
 *         schema:
 *           type: string
 *       - in: query
 *         name: category
 *         required: false
 *         description: Category of food
 *         schema:
 *           type: string
 *       - in: query
 *         name: isActive
 *         required: false
 *         description: True if you want get just for active food
 *         schema:
 *           type: boolean
 *
 *     responses:
 *       200:
 *         description: Food items purchased successfully
 *       400:
 *         description: Bad request. Invalid request body format
 *       401:
 *         description: Unauthorized. Missing or invalid token
 *       500:
 *         description: Internal server error
 */
router.get("", [verifyToken], getFoodByFilter);

/**
 * @swagger
 * /api/v1/food:
 *   delete:
 *     summary: Delete food item
 *     tags:
 *       - Food
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         description: ID of the food item to delete
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Food item deleted successfully
 *       400:
 *         description: Bad request. Invalid request parameters
 *       401:
 *         description: Unauthorized. Missing or invalid token
 *       500:
 *         description: Internal server error
 */
router.delete(
  "",
  [validation([query("id").exists().isUUID()]), verifyToken, isSeller],
  deleteFood
);

export default router;
