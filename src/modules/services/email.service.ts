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
