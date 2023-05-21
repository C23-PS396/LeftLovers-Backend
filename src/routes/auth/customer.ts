import { Router } from "express";
import {
  signupCustomer,
  signinCustomer,
} from "../../handler/authHandler/customerAuthHandler";
import validation from "../../middleware/requestBodyValidation";
import { body } from "express-validator";
import {
  checkDuplicateUsernameOrEmail,
  checkEmailIsValid,
} from "../../middleware/verifySignup";

const router = Router();

/**
 * @swagger
 * /api/v1/auth/customer/signup:
 *   post:
 *     summary: Customer sign up
 *     tags:
 *       - Authentication/Customer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
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
      body("email").exists(),
      body("password").exists(),
      body("username").exists(),
    ]),
    checkDuplicateUsernameOrEmail,
    checkEmailIsValid,
  ],
  signupCustomer
);

/**
 * @swagger
 * /api/v1/auth/customer/signin:
 *   post:
 *     summary: Customer sign in
 *     tags:
 *       - Authentication/Customer
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
  signinCustomer
);

export default router;
