import { Router } from "express";
import {
  getMerchant,
  registerMerchant,
} from "../../handler/merchantHandler/merchantHandler";
import { isSeller, verifyToken } from "../../middleware/authJwt";
import validation from "../../middleware/requestBodyValidation";
import { body } from "express-validator";

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
router.get("/", [verifyToken, isSeller], getMerchant);

export default router;
