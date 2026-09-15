import bcrypt from "bcrypt";
import crypto from "crypto";
import { User, PasswordResetToken, Otp } from "./auth.model";
import {
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  GenerateOtpInput,
  ValidateOtpInput,
  VerifyEmailInput,
} from "./auth.validation";
import { RefreshToken } from "./auth.model";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt";
import {
  sendPasswordResetEmail,
  sendVerificationOtpEmail,
} from "../services/email.service";
import { env } from "../../config/env";

export const registerUser = async (data: RegisterInput) => {
  const { email, password } = data;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    email,
    password: hashedPassword,
  });

  return {
    id: user._id,
    email: user.email,
    isEmailVerified: user.isEmailVerified,
    createdAt: user.createdAt,
  };
};

export const loginUser = async (data: LoginInput) => {
  const { email, password } = data;

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // Verify email before allowing login
  if (!user.isEmailVerified) {
    throw new Error("Email yet to be verified");
  }

  const accessToken = generateAccessToken(user._id.toString());

  const refreshToken = generateRefreshToken(user._id.toString());

  await RefreshToken.create({
    userId: user._id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  return {
    accessToken,
    refreshToken,
  };
};

export const forgotPassword = async (
  data: ForgotPasswordInput,
): Promise<void> => {
  const { email } = data;

  const user = await User.findOne({
    email,
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Delete previous reset tokens
  await PasswordResetToken.deleteMany({
    userId: user._id,
  });

  // Generate a NEW password-reset token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Hash token before storing it
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Token valid for 15 minutes
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await PasswordResetToken.create({
    userId: user._id,
    token: hashedToken,
    expiresAt,
  });

  // IMPORTANT:
  // Send RAW token in email
  const resetUrl = `${env.frontendUrl}/reset-password?token=${resetToken}`;

  console.log("RESET URL:", resetUrl);

  await sendPasswordResetEmail(user.email, resetUrl);
};

export const resetPassword = async (
  data: ResetPasswordInput,
): Promise<void> => {
  const { token, password } = data;

  // Hash the token received from frontend
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // Find reset token
  const resetToken = await PasswordResetToken.findOne({
    token: hashedToken,
  });
  if (!resetToken) {
    throw new Error("Invalid or expired reset token");
  }

  // Check expiry
  if (resetToken.expiresAt < new Date()) {
    await PasswordResetToken.deleteOne({
      _id: resetToken._id,
    });

    throw new Error("Reset token has expired");
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Update user password
  await User.findByIdAndUpdate(resetToken.userId, {
    password: hashedPassword,
  });

  // Delete token so it cannot be reused
  await PasswordResetToken.deleteOne({
    _id: resetToken._id,
  });
};

export const generateOtp = async (data: GenerateOtpInput) => {
  const { email } = data;

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  await Otp.deleteMany({
    userId: user._id,
  });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await Otp.create({
    userId: user._id,
    otp,
    expiresAt,
    attempts: 0,
  });
  await sendVerificationOtpEmail(user.email, otp);

  return {
    otp,
    expiresAt,
  };
};

export const validateOtp = async (data: ValidateOtpInput) => {
  const { email, otp } = data;

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid OTP");
  }

  const storedOtp = await Otp.findOne({
    userId: user._id,
  });

  if (!storedOtp) {
    throw new Error("Invalid or expired OTP");
  }

  // Check expiry
  if (storedOtp.expiresAt < new Date()) {
    await Otp.deleteOne({
      _id: storedOtp._id,
    });

    throw new Error("OTP has expired");
  }

  // Check maximum attempts
  const MAX_ATTEMPTS = 5;

  if (storedOtp.attempts >= MAX_ATTEMPTS) {
    await Otp.deleteOne({
      _id: storedOtp._id,
    });

    throw new Error("Maximum OTP attempts exceeded");
  }

  // Check OTP
  if (storedOtp.otp !== otp) {
    storedOtp.attempts += 1;

    await storedOtp.save();

    const remainingAttempts = MAX_ATTEMPTS - storedOtp.attempts;

    if (remainingAttempts <= 0) {
      await Otp.deleteOne({
        _id: storedOtp._id,
      });

      throw new Error("Maximum OTP attempts exceeded");
    }

    throw new Error(`Invalid OTP. ${remainingAttempts} attempts remaining`);
  }

  // Correct OTP
  await Otp.deleteOne({
    _id: storedOtp._id,
  });

  return {
    userId: user._id,
    verified: true,
  };
};

export const verifyEmail = async (data: VerifyEmailInput) => {
  const { email, otp } = data;

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid Email or OTP");
  }

  if (user.isEmailVerified) {
    throw new Error("Email is already verified");
  }

  const storedOtp = await Otp.findOne({
    userId: user._id,
  });

  if (!storedOtp) {
    throw new Error("Invalid or expired OTP");
  }

  if (storedOtp.expiresAt < new Date()) {
    await Otp.deleteOne({
      _id: storedOtp._id,
    });

    throw new Error("OTP has expired");
  }

  const MAX_ATTEMPTS = 5;

  if (storedOtp.attempts >= MAX_ATTEMPTS) {
    await Otp.deleteOne({
      _id: storedOtp._id,
    });

    throw new Error("Maximum OTP attempts exceeded");
  }

  if (storedOtp.otp !== otp) {
    storedOtp.attempts += 1;

    await storedOtp.save();

    const remainingAttempts = MAX_ATTEMPTS - storedOtp.attempts;

    if (remainingAttempts <= 0) {
      await Otp.deleteOne({
        _id: storedOtp._id,
      });

      throw new Error("Maximum OTP attempts exceeded");
    }

    throw new Error(`Invalid OTP. ${remainingAttempts} attempts remaining`);
  }

  user.isEmailVerified = true;

  await user.save();

  await Otp.deleteOne({
    _id: storedOtp._id,
  });

  return {
    userId: user._id,
    email: user.email,
    isEmailVerified: user.isEmailVerified,
  };
};
