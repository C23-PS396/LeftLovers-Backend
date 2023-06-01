import { Router } from "express";
import { body, query } from "express-validator";
import validation from "../../middleware/requestBodyValidation";
import { isCustomer, verifyToken } from "../../middleware/authJwt";
import {
  fillReview,
  getMerchantRating,
  getReview,
} from "../../handler/reviewHandler/reviewHandler";

const router = Router();

/**
 * @swagger
 * /api/v1/review:
 *   post:
 *     summary: Fill a review for a transaction
 *     description: This endpoint allows customers to fill a review for a transaction.
 *     tags:
 *       - Review
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               transactionId:
 *                 type: string
 *                 format: uuid
 *                 description: The ID of the transaction.
 *               rating:
 *                 type: number
 *                 description: The rating given for the transaction.
 *               review:
 *                 type: string
 *                 description: The review content for the transaction.
 *             example:
 *               transactionId: aea7e369-0d62-4eb2-984a-ae7e298876b3
 *               rating: 4
 *               review: "Great transaction, highly recommended!"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Review filled successfully.
 *       '400':
 *         description: Invalid request body or missing fields.
 *       '401':
 *         description: Unauthorized, user not authenticated or not a customer.
 *       '500':
 *         description: Internal server error.
 */
router.post(
  "/",
  [
    validation([
      body("transactionId").exists().isUUID(),
      body("rating").exists().isInt(),
      body("review").exists().isString(),
    ]),
    verifyToken,
    isCustomer,
  ],
  fillReview
);

/**
 * @swagger
 * /api/v1/review:
 *   get:
 *     summary: Get review for a transaction
 *     description: This endpoint allows customers to get the review for a transaction. Optionally, you can filter the reviews based on merchantId, customerId, and transactionId query parameters.
 *     tags:
 *       - Review
 *     parameters:
 *       - in: query
 *         name: merchantId
 *         schema:
 *           type: string
 *         description: Optional. Filter reviews by merchant ID.
 *       - in: query
 *         name: customerId
 *         schema:
 *           type: string
 *         description: Optional. Filter reviews by customer ID.
 *       - in: query
 *         name: transactionId
 *         schema:
 *           type: string
 *         description: Optional. Filter reviews by transaction ID.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Review retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Review'
 *       '401':
 *         description: Unauthorized, user not authenticated or not a customer.
 *       '500':
 *         description: Internal server error.
 */
router.get("/", verifyToken, getReview);

/**
 * @swagger
 * /api/v1/review/merchant:
 *   get:
 *     summary: Get merchant rating
 *     description: This endpoint allows users to get the rating for a specific merchant.
 *     tags:
 *       - Review
 *     parameters:
 *       - in: query
 *         name: merchantId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the merchant to get the rating for.
 *         required: true
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Merchant rating retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 averageRating:
 *                   type: number
 *                   description: The average rating of the merchant.
 *                 totalReviews:
 *                   type: number
 *                   description: The total number of reviews for the merchant.
 *       '400':
 *         description: Invalid request or missing required parameters.
 *       '401':
 *         description: Unauthorized, user not authenticated.
 *       '500':
 *         description: Internal server error.
 */
router.get(
  "/merchant",
  [validation([query("merchantId").exists().isUUID()]), verifyToken],
  getMerchantRating
);

export default router;
