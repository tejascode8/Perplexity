import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";
import dns from "dns";

// Custom DNS lookup that only returns IPv4 addresses
const lookupIPv4 = (hostname, options, callback) => {
  dns.lookup(hostname, { family: 4, all: true }, (err, addresses) => {
    if (err) {
      return callback(err);
    }
    // Return only IPv4 addresses
    const ipv4Addresses = addresses.filter((addr) => addr.family === 4);
    if (ipv4Addresses.length === 0) {
      return callback(new Error(`No IPv4 addresses found for ${hostname}`));
    }
    // Return the first IPv4 address
    callback(null, ipv4Addresses[0].address, ipv4Addresses[0].family);
  });
};

// Create transporter with explicit IPv4 settings and SSL
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, // SSL port
  secure: true, // Use SSL
  auth: {
    user: process.env.GOOGLE_USER,
    pass: process.env.GOOGLE_PASS,
  },
  // Force IPv4 using custom DNS lookup
  dns: {
    lookup: lookupIPv4,
  },
  // Force IPv4 by specifying family at socket level
  socketOptions: {
    family: 4, // Use IPv4 only
  },
  // Increase timeout for Render's network
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
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
