import nodemailer from "nodemailer";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import crypto from "crypto";

interface SendEmailProps {
  email: string;
  emailType: "VERIFY" | "RESET";
  userId: string;
}

export const sendEmail = async ({
  email,
  emailType,
  userId,
}: SendEmailProps) => {
  try {
    // Generate a random token
    const token = crypto.randomBytes(32).toString("hex");

    // Hash token before storing in database
    const hashedToken = await bcrypt.hash(token, 10);

    // Set token and expiry in database
    const updateData =
      emailType === "VERIFY"
        ? {
            verifyToken: hashedToken,
            verifyTokenExpiry: Date.now() + 3600000,
          }
        : {
            forgotPasswordToken: hashedToken,
            forgotPasswordTokenExpiry: Date.now() + 3600000,
          };

    const user = await User.findByIdAndUpdate(userId, updateData);

    if (!user) {
      throw new Error("User not found");
    }

    // Configure Mailtrap
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: false,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    // Create verification/reset link
    const emailLink =
      emailType === "VERIFY"
        ? `${process.env.DOMAIN}/verifyemail?token=${token}&userId=${userId}`
        : `${process.env.DOMAIN}/resetpassword?token=${token}&userId=${userId}`;

    // Send email
    const mailResponse = await transporter.sendMail({
      from: "Auth Project <test@example.com>",
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify Your Email" : "Reset Your Password",
      html: `
        <h2>${emailType === "VERIFY" ? "Verify Your Email" : "Reset Your Password"}</h2>
        <p>Click below to continue:</p>
        <a href="${emailLink}">Click Here</a>
        <p>This link expires in 1 hour.</p>
      `,
    });

    return mailResponse;
  } catch (error) {
    console.error("Send Email Error:", error);
    throw error;
  }
};
