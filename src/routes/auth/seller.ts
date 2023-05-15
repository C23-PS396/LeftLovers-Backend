import { Router } from "express";
import {
  signupSeller,
  signinSeller,
} from "../../handler/authHandler/sellerAuthHandler";
import validation from "../../middleware/requestBodyValidation";
import { body } from "express-validator";
import {
  checkDuplicateUsernameOrEmail,
  checkEmailIsValid,
} from "../../middleware/verifySignup";

const router = Router();

/**
 * @swagger
 * /api/v1/auth/seller/signup:
 *   post:
 *     summary: Seller sign up
 *     tags:
 *       - Authentication/Seller
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname: 
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               username:
 *                 type: string
 *     responses:
 *       200:
 *         description: User signed up successfully
 *       400:
 *         description: Email is not valid
 *       403:
 *         description: Bad request. Invalid email, password or username
 *       409:
 *         description: Conflict. Username or email already exists
 *       500:
 *         description: Internal server error
 */
router.post(
  "/signup",
  [
    validation([
      body("fullname").exists(),
      body("email").exists(),
      body("password").exists(),
      body("username").exists(),
    ]),
    checkDuplicateUsernameOrEmail,
    checkEmailIsValid,
  ],
  signupSeller
);

/**
 * @swagger
 * /api/v1/auth/seller/signin:
 *   post:
 *     summary: Seller sign in
 *     tags:
 *       - Authentication/Seller
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               credential: 
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User signed in successfully
 *       400:
 *         description: Bad request. Invalid credential or password
 *       500:
 *         description: Internal server error
 */
router.post(
  "/signin",
  [validation([body("credential").exists(), body("password").exists()])],
  signinSeller
);

export default router;
