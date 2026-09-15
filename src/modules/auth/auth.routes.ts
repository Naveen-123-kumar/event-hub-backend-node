import { Router } from "express";

import {
  register,
  login,
  refreshAccessToken,
  logout,
  forgotPasswordController,
  resetPasswordController,
  generateOtpController,
  validateOtpController,
  verifyEmailController,
  googleLoginController,
  googleCallbackController,
} from "./auth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", logout);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);
router.post("/generate-otp", generateOtpController);
router.post("/validate-otp", validateOtpController);
router.post("/verify-email", verifyEmailController);
router.get("/google", googleLoginController);
router.get("/google/callback", googleCallbackController);

export default router;
