import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

// Create transporter with explicit IPv4 settings
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use STARTTLS
  requireTLS: true,
  auth: {
    user: process.env.GOOGLE_USER,
    pass: process.env.GOOGLE_PASS,
  },
  // Force IPv4 by specifying family
  socketOptions: {
    family: 4, // Use IPv4 only
  },
  // Increase timeout for Render's network
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

// Verify transporter on startup (but don't crash if it fails)
transporter
  .verify()
  .then(() => {
    console.log("Email transporter is ready to send emails");
  })
  .catch((err) => {
    console.error("Email transporter verification failed:", err.message);
    console.log("Email sending may fail, but registration will continue");
  });

export async function sendEmail({ to, subject, html, text }) {
  const mailOptions = {
    from: process.env.GOOGLE_USER,
    to,
    subject,
    html,
    text,
  };

  try {
    const details = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to:", to);
    return details;
  } catch (error) {
    console.error("Error sending email to", to, ":", error.message);
    // Don't throw the error - let registration succeed even if email fails
    // Just log it for debugging
    return null;
  }
}
