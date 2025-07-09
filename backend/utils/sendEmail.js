import nodemailer from "nodemailer";
import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.OAUTH_CLIENT_ID,
  process.env.OAUTH_CLIENT_SECRET,
  process.env.OAUTH_REDIRECT_URI
);
//console.log("🔁 OAUTH_REFRESH_TOKEN:", process.env.OAUTH_REFRESH_TOKEN);

oAuth2Client.setCredentials({
  refresh_token: process.env.OAUTH_REFRESH_TOKEN,
});

export const sendEmail = async ({ email, subject, message }) => {
  try {
    console.log("🔐 Getting access token...");
    const accessToken = await oAuth2Client.getAccessToken();
    console.log("✅ Got access token:", accessToken.token);

    console.log("📤 Creating transporter...");
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.OAUTH_USER,
        clientId: process.env.OAUTH_CLIENT_ID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    console.log("📨 Sending email to:", email);
    const result = await transporter.sendMail({
      from: `MERNAuction <${process.env.OAUTH_USER}>`,
      to: email,
      subject,
      text: message,
    });

    console.log("✅ Email sent successfully:", result.response);
  } catch (error) {
    console.error("❌ Email send failed:", error);
    throw error;
  }
};
