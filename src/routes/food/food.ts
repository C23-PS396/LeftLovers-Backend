import { Router } from "express";
import validation from "../../middleware/requestBodyValidation";
import { body } from "express-validator";
import { isSeller, verifyToken } from "../../middleware/authJwt";
import {
  activateFood,
  addFoods,
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

export default router;
