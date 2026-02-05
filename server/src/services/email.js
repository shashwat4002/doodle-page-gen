import nodemailer from "nodemailer";
import { env } from "../config/env.js";

let transporter;

const hasSmtpConfig =
  !!env.SMTP_HOST && !!env.SMTP_USER && !!env.SMTP_PASS && !!env.EMAIL_FROM;

const getTransporter = () => {
  if (!hasSmtpConfig) {
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }

  return transporter;
};

export const sendPasswordResetEmail = async (to, token) => {
  const transport = getTransporter();
  const resetUrl = `${env.FRONTEND_URL}/auth/reset-password?token=${encodeURIComponent(
    token,
  )}`;

  if (!transport) {
    console.warn(
      "[SochX email] SMTP not configured, would send password reset to",
      to,
      "with link:",
      resetUrl,
    );
    return;
  }

  await transport.sendMail({
    from: env.EMAIL_FROM,
    to,
    subject: "SochX – Reset your password",
    text: `You requested a password reset for your SochX account.\n\nReset link: ${resetUrl}\n\nIf you didn't request this, you can safely ignore this email.`,
    html: `<p>You requested a password reset for your SochX account.</p>
<p><a href="${resetUrl}">Click here to reset your password</a></p>
<p>If you didn't request this, you can safely ignore this email.</p>`,
  });
};

