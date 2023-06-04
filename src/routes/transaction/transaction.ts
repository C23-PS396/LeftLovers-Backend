import { Router } from "express";
import { isCustomer, isSeller, verifyToken } from "../../middleware/authJwt";
import validation from "../../middleware/requestBodyValidation";
import { body, query } from "express-validator";
import {
  buyFood,
  changeTransactionStatus,
  getTransaction,
} from "../../handler/transactionHandler/transactionHandler";

const router = Router();

/**
 * @swagger
 * /api/v1/transaction:
 *   post:
 *     summary: Buy food items
 *     tags:
 *       - Transaction
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               merchantId:
 *                 type: string
 *               customerId:
 *                 type: string
 *               foods:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     foodId:
 *                       type: string
 *                     quantity:
 *                       type: number
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
router.post(
  "/",
  [
    validation([
      body("merchantId").exists().isUUID(),
      body("customerId").exists().isUUID(),
      body("foods").exists().isArray(),
      body("foods.*.foodId").exists().isUUID(),
      body("foods.*.quantity").exists().isNumeric(),
    ]),
    verifyToken,
    isCustomer,
  ],
  buyFood
);

/**
 * @swagger
 * /api/v1/transaction:
 *   get:
 *     summary: Get all transaction based on merchantId
 *     tags:
 *       - Transaction
 *     parameters:
 *       - in: query
 *         name: merchantId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the merchant
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success. Returns the list of merchants.
 *       401:
 *         description: Unauthorized. Missing or invalid token.
 *       500:
 *         description: Internal server error.
 */
router.get(
  "/",
  [validation([query("merchantId").exists().isUUID()]), verifyToken],
  getTransaction
);

/**
 * @swagger
 * /api/v1/transaction/update:
 *   patch:
 *     summary: Update transaction status
 *     tags:
 *       - Transaction
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: number
 *               transactionId:
 *                 type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Transaction status updated successfully.
 *       400:
 *         description: Bad request. Invalid request body format.
 *       401:
 *         description: Unauthorized. Missing or invalid token.
 *       500:
 *         description: Internal server error.
 */
router.patch(
  "/update",
  [
    validation([
      body("status").exists().isNumeric(),
      body("transactionId").exists().isUUID(),
    ]),
    verifyToken,
  ],
  changeTransactionStatus
);

export default router;
