import jwt from "jsonwebtoken";
import { env } from "../config/env";

interface AccessTokenPayload {
  userId: string;
}

interface RefreshTokenPayload {
  userId: string;
}

export const generateAccessToken = (userId: string): string => {
  return jwt.sign(
    {
      userId,
    } satisfies AccessTokenPayload,
    env.jwtSecret,
    {
      expiresIn: "12m",
    },
  );
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
