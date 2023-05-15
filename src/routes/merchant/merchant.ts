import { Router } from "express";
import {
  getAllMerchant,
  getMerchantById,
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
 *     summary: Get all merchants
 *     tags:
 *       - Merchant
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
router.get("/", [verifyToken, isSeller], getAllMerchant);

/**
 * @swagger
 * /api/v1/merchant/{id}:
 *   get:
 *     summary: Get a merchant by ID
 *     tags:
 *       - Merchant
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the merchant
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success. Returns the merchant details.
 *       401:
 *         description: Unauthorized. Missing or invalid token.
 *       404:
 *         description: Merchant not found.
 *       500:
 *         description: Internal server error.
 */
router.get("/:id", [verifyToken, isSeller], getMerchantById);

export default router;
