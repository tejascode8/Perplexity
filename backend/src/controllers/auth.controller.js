import "dotenv/config";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 * @body    { username, email, password }
 * @returns { message, success, user }
 */

export async function register(req, res) {
  const { username, email, password } = req.body;

  const isUserAlreadyExists = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  if (isUserAlreadyExists) {
    return res.status(400).json({
      message: "User with this email or username already exists",
      success: false,
      err: "User already exists",
    });
  }

  const user = await userModel.create({ username, email, password });

  const emailVerificationToken = jwt.sign(
    {
      email: user.email,
    },
    process.env.JWT_SECRET_KEY,
  );

  await sendEmail({
    to: email,
    subject: "Welcome to Perplexity!",
    html: `
                <p>Hi ${username},</p>
                <p>Thank you for registering at <strong>Perplexity</strong>. We're excited to have you on board!</p>
                <p>Please verify your email address by clicking the link below:</p>
                <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
                <p>If you did not create an account, please ignore this email.</p>
                <p>Best regards,<br>The Perplexity Team</p>
        `,
  });

  res.status(201).json({
    message: "User registered successfully",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

/**
 * @desc    Login a user and return JWT token in cookie
 * @route   POST /api/auth/login
 * @access  Public
 * @body    { email, password }
 * @returns { message, success, user, token }
 */

export async function login(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "Invalid email or password",
      success: false,
      err: "user not found",
    });
  }

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    return res.status(400).json({
      message: "Invalid email or password",
      success: false,
      err: "Incorrect password",
    });
  }

  if (!user.verified) {
    return res.status(400).json({
      message: "Please verify your email before logging in",
      success: false,
      err: "Email not verified",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
      email: user.email,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" },
  );

  res.cookie("token", token);

  res.status(200).json({
    message: "Login successful",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
    // token,
  });
}

/**
 * @desc    Get logged in user details
 * @route   GET /api/auth/get-me
 * @access  Private
 * @returns { message, success, user }
 */

export async function getMe(req, res) {
  // If req.user is null (no token or invalid token)
  if (!req.user) {
    return res.status(200).json({
      message: "No authenticated user",
      success: true,
      user: null,
    });
  }

  const userId = req.user.id;
  const user = await userModel.findById(userId).select("-password");

  if (!user) {
    return res.status(404).json({
      message: "user not found",
      success: false,
    });
  }

  res.status(200).json({
    message: "User detail fetched successfully",
    success: true,
    user,
  });
}

/**
 * @desc    Verify email address
 * @route   GET /api/auth/verify-email
 * @access  Public
 * @query   { token }
 * @returns { message, success }
 */

export async function verifyEmail(req, res) {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await userModel.findOne({ email: decoded.email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid token",
        success: false,
        err: "User not found ",
      });
    }

    user.verified = true;

    await user.save();

    const html = ` <h3>Hi ${user.username},</h3>
                <p>Your email has been successfully verified. You can now log in to your account and start using Perplexity!</p>
                <a href="http://localhost:3000/login">Go to Login</a>
                <p>Best regards,<br>The Perplexity Team</p>`;

    return res.send(html);
  } catch (err) {
    res.status(400).json({
      message: "Invalid or expired token",
      success: false,
      err: err.message,
    });
  }
}
