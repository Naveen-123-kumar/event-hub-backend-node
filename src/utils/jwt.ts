import jwt from "jsonwebtoken";

import { env } from "../config/env";
import { UserRole } from "../modules/auth/auth.types";

export interface AccessTokenPayload {
  userId: string;
  role: UserRole;
  organizationId?: string;
}

interface RefreshTokenPayload {
  userId: string;
}

export const generateAccessToken = (payload: AccessTokenPayload): string => {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: "12m",
  });
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    {
      userId,
    } satisfies RefreshTokenPayload,
    env.jwtSecret,
    {
      expiresIn: "1d",
    },
  );
};
