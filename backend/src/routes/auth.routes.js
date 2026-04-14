import { Router } from "express";
import {
  register,
  verifyEmail,
  login,
  getMe,
} from "../controllers/auth.controller.js";
import {
  registerValidator,
  loginValidator,
} from "../validators/auth.validator.js";
import { authUser } from "../middlewares/auth.middleware.js";

const authRouter = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 * @body { username, email, password }
 * @returns { message, success, user }
 */
authRouter.post("/register", registerValidator, register);

/**
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 * @body { email, password }
 * @returns { message, success, user, token }
 */
authRouter.post("/login", loginValidator, login);

/**
 * @route GET /api/auth/verify-email
 * @desc Verify user's email
 * @access Public
 * @query { token }
 * @returns { message, success }
 */
authRouter.get("/verify-email", verifyEmail);

/**
 * @route GET /api/auth/get-me
 * @desc Get logged in user details
 * @access Private
 * @returns { message, success, user }
 */
authRouter.get("/get-me", authUser, getMe);

export default authRouter;
