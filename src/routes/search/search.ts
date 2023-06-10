import { Router } from "express";
import { searchHandler } from "../../handler/searchHandler/searchHandlers";
import validation from "../../middleware/requestBodyValidation";
import { query } from "express-validator";
import { verifyToken } from "../../middleware/authJwt";

/**
 * @swagger
 * tags:
 *   name: Search
 *   description: Search merchant based on query
 */
const router = Router();

/**
 * @swagger
 * /api/v1/search:
 *   get:
 *     summary: Get merchant based on query
 *     tags:
 *       - Search
 *     parameters:
 *       - in: query
 *         name: query
 *         required: false
 *         description: query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Merchant succesfully fetched
 *       400:
 *         description: Bad request. Invalid request body format
 *       401:
 *         description: Unauthorized. Missing or invalid token
 *       500:
 *         description: Internal server error
 */
router.get(
  "/",
  [validation([query("query").optional().isString()]), verifyToken],
  searchHandler
);

export default router;
