import nodemailer from "nodemailer";
import { env } from "../../config/env";

const transporter = nodemailer.createTransport({
  host: env.emailHost,
  port: env.emailPort,
  secure: false,

  auth: {
    user: env.emailUser,
    pass: env.emailPassword,
  },
});

export const sendPasswordResetEmail = async (
  email: string,
  resetUrl: string,
): Promise<void> => {
  await transporter.sendMail({
    from: env.emailFrom,

    to: email,

    subject: "Reset your EventHub password",

    html: `
      <div style="font-family: Arial, sans-serif;">
        
        <h2>Reset Your EventHub Password</h2>

        <p>
          We received a request to reset your EventHub password.
        </p>

        <p>
          Click the button below to set a new password:
        </p>

        <a
          href="${resetUrl}"
          style="
            display: inline-block;
            padding: 12px 20px;
            background-color: #000;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
          "
        >
          Set New Password
        </a>

        <p style="margin-top: 20px;">
          This link will expire in 15 minutes.
        </p>

        <p>
          If you did not request a password reset,
          you can safely ignore this email.
        </p>

      </div>
    `,
  });
};

export const sendVerificationOtpEmail = async (
  email: string,
  otp: string,
): Promise<void> => {
  await transporter.sendMail({
    from: env.emailFrom,
    to: email,
    subject: "Verify your EventHub email",
    html: `
      <div
        style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        "
      >
        <h2>Verify Your EventHub Email</h2>

        <p>
          Thank you for registering with EventHub.
          Please use the OTP below to verify your email address.
        </p>

        <div
          style="
            margin: 30px 0;
            padding: 20px;
            background-color: #f5f5f5;
            text-align: center;
            border-radius: 8px;
          "
        >
          <h1
            style="
              letter-spacing: 8px;
              margin: 0;
            "
          >
            ${otp}
          </h1>
        </div>

        <p>
          This OTP will expire in <strong>10 minutes</strong>.
        </p>

        <p>
          If you did not create an EventHub account,
          you can safely ignore this email.
        </p>

        <p>
          Regards,<br />
          EventHub Team
        </p>
      </div>
    `,
  });
};
