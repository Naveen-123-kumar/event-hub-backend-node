import { google } from "googleapis";
import { env } from "../../config/env";
import { User } from "./auth.model";
import { UserRole } from "./auth.types";

export const googleOAuth2Client = new google.auth.OAuth2(
  env.googleClientId,
  env.googleClientSecret,
  env.googleCallbackUrl,
);

export const getGoogleAuthUrl = (): string => {
  return googleOAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["openid", "email", "profile"],
    prompt: "select_account",
  });
};
