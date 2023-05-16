import { Router } from "express";
import validation from "../../middleware/requestBodyValidation";
import { body } from "express-validator";
import { isSeller, verifyToken } from "../../middleware/authJwt";
import { addFoods } from "../../handler/foodHandler/foodHandler";

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

export default router;
