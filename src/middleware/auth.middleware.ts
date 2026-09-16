// middleware/authenticate.ts

import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { env } from "../config/env";
import { AccessTokenPayload } from "../utils/jwt";
import { User } from "../modules/auth/auth.model";

// ============================================================
// CHANGE 1: Make middleware async
// ============================================================
// We fetch the user from DB so req.user contains the complete
// AuthUser structure and the latest role/organization information.

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });

      return;
    }

    const [type, token] = authorization.split(" ");

    if (type !== "Bearer" || !token) {
      res.status(401).json({
        success: false,
        message: "Invalid authorization header",
      });

      return;
    }

    // ============================================================
    // CHANGE 2: Verify JWT
    // ============================================================
    const decoded = jwt.verify(token, env.jwtSecret) as AccessTokenPayload;

    // ============================================================
    // CHANGE 3: Get current user from database
    // ============================================================
    // Do not directly assign decoded to req.user because
    // AccessTokenPayload contains userId, while AuthUser contains
    // id, email, role, organizationId, etc.
    const user = await User.findById(decoded.userId).select(
      "_id email role organizationId",
    );

    if (!user) {
      res.status(401).json({
        success: false,
        message: "User not found",
      });

      return;
    }

    // ============================================================
    // CHANGE 4: Assign the correct AuthUser structure
    // ============================================================
    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      organizationId: user.organizationId?.toString(),
    };

    next();
  } catch {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
