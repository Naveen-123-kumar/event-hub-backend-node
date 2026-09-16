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

import {
  getLinkedInAuthUrl,
  getLinkedInAccessToken,
  getLinkedInUserInfo,
} from "./linkedin.service";

import jwt from "jsonwebtoken";
import { RefreshToken } from "./auth.model";
import { google } from "googleapis";
import { env } from "../../config/env";
import { User } from "./auth.model";
import { generateAccessToken } from "../../utils/jwt";
import { getGoogleAuthUrl } from "./google.service";
import { UserRole } from "./auth.types";

//Registration
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

//Login
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

//Refresh access token
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
    const user = await User.findById(decoded.userId);

    if (!user) {
      res.status(401).json({
        success: false,
        message: "User not found",
      });

      return;
    }

    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      role: user.role,
      organizationId: user.organizationId?.toString(),
    });
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

//Logout
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

//Forgot password
export const forgotPasswordController = async (req: Request, res: Response) => {
  try {
    const data = forgotPasswordSchema.parse(req.body);

    await forgotPassword(data);

    return res.status(200).json({
      success: true,
      message:
        "If the email is registered, a password reset link has been sent.",
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

//Reset password
export const resetPasswordController = async (req: Request, res: Response) => {
  try {
    const data = resetPasswordSchema.parse(req.body);

    await resetPassword(data);

    return res.status(200).json({
      success: true,
      message: "Password has been reset successfully.",
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

//OTP generator
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

//OTP validator
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

//Email verification
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

//Google Auth 2.0
export const googleLoginController = (_req: Request, res: Response) => {
  const authUrl = getGoogleAuthUrl();
  return res.redirect(authUrl);
};

export const googleCallbackController = async (req: Request, res: Response) => {
  try {
    const { code } = req.query;

    if (!code || typeof code !== "string") {
      return res.status(400).json({
        success: false,
        message: "Google authorization code is missing",
      });
    }

    const oauth2Client = new google.auth.OAuth2(
      env.googleClientId,
      env.googleClientSecret,
      env.googleCallbackUrl,
    );

    const { tokens } = await oauth2Client.getToken(code);

    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });

    const { data } = await oauth2.userinfo.get();

    if (!data.email) {
      return res.status(400).json({
        success: false,
        message: "Google email not available",
      });
    }

    const googleId = data.id;

    if (!googleId) {
      return res.status(400).json({
        success: false,
        message: "Google user ID not available",
      });
    }

    let user = await User.findOne({
      email: data.email,
    });

    if (!user) {
      user = await User.create({
        email: data.email,
        isEmailVerified: true,
        authProvider: "google",
        providerId: googleId,
        role: UserRole.CUSTOMER,
      });
    } else if (!user.providerId) {
      user.providerId = googleId;
      user.authProvider = "google";
      user.isEmailVerified = true;

      await user.save();
    }

    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      role: user.role,
      organizationId: user.organizationId?.toString(),
    });

    return res.redirect(
      `${env.frontendUrl}/oauth-success?token=${accessToken}`,
    );
  } catch (error) {
    console.error("Google authentication error:", error);

    return res.status(500).json({
      success: false,
      message: "Google authentication failed",
    });
  }
};

//Lindedln Auth 2.0
export const linkedinLoginController = (_req: Request, res: Response) => {
  const authUrl = getLinkedInAuthUrl();
  return res.redirect(authUrl);
};

export const linkedinCallbackController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { code } = req.query;

    if (!code || typeof code !== "string") {
      return res.status(400).json({
        success: false,
        message: "LinkedIn authorization code is missing",
      });
    }

    // 1. Exchange authorization code
    //    for LinkedIn access token
    const linkedinAccessToken = await getLinkedInAccessToken(code);

    // 2. Get LinkedIn user information
    const linkedInUser = await getLinkedInUserInfo(linkedinAccessToken);

    if (!linkedInUser.sub) {
      return res.status(400).json({
        success: false,
        message: "LinkedIn user ID not available",
      });
    }

    if (!linkedInUser.email) {
      return res.status(400).json({
        success: false,
        message: "LinkedIn email not available",
      });
    }

    const linkedinId = linkedInUser.sub;

    // 3. Find existing EventHub user
    let user = await User.findOne({
      email: linkedInUser.email,
    });

    // 4. Create new user
    if (!user) {
      user = await User.create({
        email: linkedInUser.email,
        isEmailVerified: true,
        authProvider: "linkedin",
        providerId: linkedinId,
        role: UserRole.CUSTOMER,
      });
    }

    // 5. Link LinkedIn to existing user
    else if (!user.providerId) {
      user.providerId = linkedinId;
      user.authProvider = "linkedin";
      user.isEmailVerified = true;

      await user.save();
    }

    // 6. Generate EventHub access token
    const eventHubAccessToken = generateAccessToken({
      userId: user._id.toString(),
      role: user.role,
      organizationId: user.organizationId?.toString(),
    });
    // 7. Redirect frontend
    return res.redirect(
      `${env.frontendUrl}/oauth-success?token=${eventHubAccessToken}`,
    );
  } catch (error) {
    console.error("LinkedIn authentication error:", error);

    return res.status(500).json({
      success: false,
      message: "LinkedIn authentication failed",
    });
  }
};
