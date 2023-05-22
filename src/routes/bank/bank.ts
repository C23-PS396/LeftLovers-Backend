import { Router } from "express";
import { isSeller, verifyToken } from "../../middleware/authJwt";
import validation from "../../middleware/requestBodyValidation";
import { body } from "express-validator";
import { addBankAccount, getBank } from "../../handler/bankHandler/bankHandler";

const router = Router();

/**
 * @swagger
 * /api/v1/bank:
 *   post:
 *     summary: Add a bank account
 *     tags: [Bank]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sellerId:
 *                 type: string
 *               accounts:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     code:
 *                       type: string
 *                     swiftCode:
 *                       type: string
 *                     accountNumber:
 *                       type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bank account added successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post(
  "/",
  [
    validation([
      body("sellerId").exists().isUUID(),
      body("accounts").exists().isArray(),
      body("accounts.*.name").exists().isString(),
      body("accounts.*.code").exists().isString(),
      body("accounts.*.swiftCode").exists().isString(),
      body("accounts.*.accountNumber").exists().isString(),
    ]),
    verifyToken,
    isSeller,
  ],
  addBankAccount
);

/**
 * @swagger
 * tags:
 *   name: Bank
 *   description: Bank API
 * /api/v1/bank:
 *   get:
 *     summary: Get bank details
 *     tags: [Bank]
 *     responses:
 *       200:
 *         description: Bank details retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/", getBank);

export default router;
