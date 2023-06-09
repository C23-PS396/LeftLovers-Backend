import { Router } from "express";
import {
  getMerchant,
  getRecommendation,
  getTransactionSummary,
  registerMerchant,
} from "../../handler/merchantHandler/merchantHandler";
import { isSeller, verifyToken } from "../../middleware/authJwt";
import validation from "../../middleware/requestBodyValidation";
import { body, query } from "express-validator";

const router = Router();

/**
 * @swagger
 * /api/v1/merchant/register:
 *   post:
 *     summary: Register merchant
 *     tags:
 *       - Merchant
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               locationId:
 *                 type: string
 *               sellerId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Merchant registered successfully
 *       400:
 *         description: Bad request. Invalid name, locationId, or sellerId
 *       401:
 *         description: Unauthorized. Missing or invalid token
 *       500:
 *         description: Internal server error
 */
router.post(
  "/register",
  [
    validation([
      body("name").exists(),
      body("locationId").exists(),
      body("sellerId").exists(),
    ]),
    verifyToken,
    isSeller,
  ],
  registerMerchant
);

/**
 * @swagger
 * /api/v1/merchant:
 *   get:
 *     summary: Get all merchants or filter by ID or Seller ID
 *     tags:
 *       - Merchant
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: ID of the merchant
 *       - in: query
 *         name: sellerId
 *         schema:
 *           type: string
 *         description: Seller ID associated with the merchant
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: True if you want get merchant that has active food
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Merchant that have food with this category
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
router.get("/", [verifyToken], getMerchant);

/**
 * @swagger
 * /api/v1/merchant/recommendation:
 *   get:
 *     summary: Get all recomended merchant
 *     tags:
 *       - Merchant
 *     parameters:
 *       - in: query
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the customer
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
router.get("/recommendation", [verifyToken], getRecommendation);

/**
 * @swagger
 * /api/v1/merchant/summary:
 *   get:
 *     summary: Get all summary statistic
 *     tags:
 *       - Merchant
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
  "/summary",
  [validation([query("merchantId").exists().isUUID()])],
  getTransactionSummary
);

export default router;
