import nodemailer from "nodemailer";
import verificationEmail from "../../emails/verificationEmail";
import { render } from "@react-email/render";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "gettruefeedback@gmail.com",
      pass: process.env.APP_PASSWORD      
    },
  });

  try {
    
    const html = await render(verificationEmail({ username, otp: verifyCode }));

    const info = await transporter.sendMail({
      from: '"True Feedback" <gettruefeedback@gmail.com>',
      to: email,
      subject: "True Feedback Verification Email",
      html,
    });

    console.log("✅ Message sent:", info.messageId);
    return {
      success: true,
      message: "Verification email sent successfully",
    };
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}
