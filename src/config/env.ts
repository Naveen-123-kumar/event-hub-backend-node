import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT) || 5000,

  mongoUri: process.env.MONGO_URI || "",

  jwtSecret: process.env.JWT_SECRET || "",

  emailHost: process.env.EMAIL_HOST || "",
  emailPort: Number(process.env.EMAIL_PORT) || 587,
  emailUser: process.env.EMAIL_USER || "",
  emailPassword: process.env.EMAIL_PASSWORD || "",
  emailFrom: process.env.EMAIL_FROM || "",

  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",

  // Google
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL || "",

  // LinkedIn
  linkedinClientId: process.env.LINKEDIN_CLIENT_ID || "",
  linkedinClientSecret: process.env.LINKEDIN_CLIENT_SECRET || "",
  linkedinCallbackUrl: process.env.LINKEDIN_CALLBACK_URL || "",
};
