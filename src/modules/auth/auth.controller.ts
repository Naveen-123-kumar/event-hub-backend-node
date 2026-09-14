import { Request, Response } from "express";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  generateOtpSchema,
  validateOtpSchema,
  verifyEmailSchema,
} from "./auth.validation";

import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  generateOtp,
  validateOtp,
  verifyEmail,
} from "./auth.service";

import jwt from "jsonwebtoken";
import { RefreshToken } from "./auth.model";
import { generateAccessToken } from "../../utils/jwt";
import { env } from "../../config/env";
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = registerSchema.parse(req.body);

    const user = await registerUser(validatedData);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });

      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const user = await loginUser(validatedData);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: user,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({
        success: false,
        message: error.message,
      });

      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const refreshAccessToken = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(401).json({
        success: false,
        message: "Refresh token is required",
      });

      return;
    }

    const storedToken = await RefreshToken.findOne({
      token: refreshToken,
    });

    if (!storedToken) {
      res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });

      return;
    }

    if (storedToken.expiresAt < new Date()) {
      await RefreshToken.deleteOne({
        _id: storedToken._id,
      });

      res.status(401).json({
        success: false,
        message: "Refresh token expired",
      });

      return;
    }

    const decoded = jwt.verify(refreshToken, env.jwtSecret) as {
      userId: string;
    };

    const accessToken = generateAccessToken(decoded.userId);

    res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",
      data: {
        accessToken,
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid refresh token",
    });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({
        success: false,
        message: "Refresh token is required",
      });

      return;
    }

    const result = await RefreshToken.deleteOne({
      token: refreshToken,
    });

    if (result.deletedCount === 0) {
      res.status(404).json({
        success: false,
        message: "Refresh token not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const forgotPasswordController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const validatedData = forgotPasswordSchema.parse(req.body);

    const result = await forgotPassword(validatedData);

    res.status(200).json({
      success: true,
      message: "If the email exists, a password reset link will be sent",
      data: result,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });

      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const resetPasswordController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const validatedData = resetPasswordSchema.parse(req.body);

    await resetPassword(validatedData);

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });

      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const generateOtpController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const validatedData = generateOtpSchema.parse(req.body);

    const result = await generateOtp(validatedData);

    res.status(200).json({
      success: true,
      message: "OTP generated successfully",
      data: result,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });

      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const validateOtpController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const validatedData = validateOtpSchema.parse(req.body);

    const result = await validateOtp(validatedData);

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      data: result,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });

      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const verifyEmailController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const validatedData = verifyEmailSchema.parse(req.body);

    const result = await verifyEmail(validatedData);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      data: result,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });

      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
