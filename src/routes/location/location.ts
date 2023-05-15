import { Router } from "express";
import { isSeller, verifyToken } from "../../middleware/authJwt";
import validation from "../../middleware/requestBodyValidation";
import { body, query } from "express-validator";
import {
  getDistrict,
  getProvince,
  getRegency,
  getVillage,
  registerLocation,
} from "../../handler/locationHandler/locationHandler";

const router = Router();

/**
 * @swagger
 * /api/v1/location/create:
 *   post:
 *     summary: Register location
 *     tags:
 *       - Location
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               province:
 *                 type: string
 *               regency:
 *                 type: string
 *               district:
 *                 type: string
 *               village:
 *                 type: string
 *               fullLocation:
 *                 type: string
 *     responses:
 *       201:
 *         description: Location registered successfully
 *       400:
 *         description: Bad request. Invalid province, regency, district, village, or fullLocation
 *       401:
 *         description: Unauthorized. Missing or invalid token
 *       500:
 *         description: Internal server error
 */
router.post(
  "/create",
  [
    validation([
      body("province").exists(),
      body("regency").exists(),
      body("district").exists(),
      body("village").exists(),
      body("fullLocation").exists(),
    ]),
    verifyToken,
    isSeller,
  ],
  registerLocation
);

/**
 * @swagger
 * /api/v1/location/province:
 *   get:
 *     summary: Get province list
 *     tags:
 *       - Location
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success. Returns the list of provinces.
 *       401:
 *         description: Unauthorized. Missing or invalid token.
 *       500:
 *         description: Internal server error.
 */
router.get("/province", [verifyToken], getProvince);

/**
 * @swagger
 * /api/v1/location/regency:
 *   get:
 *     summary: Get regency list
 *     tags:
 *       - Location
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: province_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the province to retrieve regencies for
 *     responses:
 *       200:
 *         description: Success. Returns the list of regencies for the specified province.
 *       401:
 *         description: Unauthorized. Missing or invalid token.
 *       500:
 *         description: Internal server error.
 */
router.get(
  "/regency",
  [
    validation([query("province_id").exists()]), // Request validation middleware
    verifyToken, // Authorization middleware
  ],
  getRegency
);

/**
 * @swagger
 * /api/v1/location/district:
 *   get:
 *     summary: Get district list
 *     tags:
 *       - Location
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: regency_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the regency to retrieve district for
 *     responses:
 *       200:
 *         description: Success. Returns the list of district for the specified province.
 *       401:
 *         description: Unauthorized. Missing or invalid token.
 *       500:
 *         description: Internal server error.
 */
router.get(
  "/district",
  [
    validation([query("regency_id").exists()]), // Request validation middleware
    verifyToken, // Authorization middleware
  ],
  getDistrict
);

/**
 * @swagger
 * /api/v1/location/village:
 *   get:
 *     summary: Get village list
 *     tags:
 *       - Location
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: district_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the district to retrieve village for
 *     responses:
 *       200:
 *         description: Success. Returns the list of village for the specified district.
 *       401:
 *         description: Unauthorized. Missing or invalid token.
 *       500:
 *         description: Internal server error.
 */
router.get(
  "/village",
  [validation([query("district_id").exists()]), verifyToken],
  getVillage
);

export default router;
