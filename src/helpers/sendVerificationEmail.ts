// import { resend } from "@/lib/resend";
// import verificationEmail from "../../emails/verificationEmail";
// import { ApiResponse } from "@/types/ApiResponse";

// export async function sendVerificationEmail(
//     email:string,
//     username:string, 
//     verifyCode:string  
// ):Promise<ApiResponse>{
//     try {
//         await resend.emails.send({
//             from: 'onboarding@resend.dev',
//             to: email,
//             subject: 'True Feedback Verification Email',
//             react: verificationEmail({username,otp:verifyCode}),
// });
//         return {
//             success:true,
//             message:"Verification email sent successfully"
//         }
//     } catch (emailError) {
//         console.log("Error sending verification error:",emailError)
//         return {
//             success:false,
//             message:"Failed to send verification email"
//         }
//     }
    
// }
import nodemailer from "nodemailer";
import verificationEmail from "../../emails/verificationEmail";
import { render } from "@react-email/render";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner"

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "gettruefeedback@gmail.com", // ✅ Your Gmail
      pass: "hvgk jxoi acxu zwwa",        // ✅ Your App Password
    },
  });

  try {
    // ✅ Render HTML from your React email component
    const html = await render(verificationEmail({ username, otp: verifyCode }));

    const info = await transporter.sendMail({
      from: '"True Feedback" <gettruefeedback@gmail.com>',
      to: email,
      subject: "True Feedback Verification Email",
      html,
    });

    console.log("✅ Message sent:", info.messageId);
    //toast("Verification email sent successfully")
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
