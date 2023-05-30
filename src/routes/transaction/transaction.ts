import { Router } from "express";
import { isSeller, verifyToken } from "../../middleware/authJwt";
import { getTransaction } from "../../handler/foodHandler/foodHandler";
import validation from "../../middleware/requestBodyValidation";
import { query } from "express-validator";

const router = Router();

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
  [validation([query("merchantId").exists().isUUID()]), verifyToken, isSeller],
  getTransaction
);

export default router;
