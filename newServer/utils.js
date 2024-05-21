const ShortUniqueId = require("short-unique-id");
const { v4: uuidv4 } = require("uuid");
const { randomUUID } = new ShortUniqueId({ length: 10 });
require("dotenv").config();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const generateEventCode = () => {
  const uniqueId = uuidv4();
  const shortId = randomUUID();
  const eventCode = `${shortId}-${uniqueId}`;
  return eventCode;
};
const generateCertificateCode = () => {
  const certificateCode = randomUUID();
  return certificateCode;
};
const createTransporter = async () => {
  try {
    const oauth2Client = new OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.REFRESH_TOKEN,
    });

    const accessToken = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          console.log("*ERR: ", err);
          reject();
        }
        resolve(token);
      });
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.USER_EMAIL,
        accessToken,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
      },
    });
    return transporter;
  } catch (err) {
    return err;
  }
};

const sendEmail = async (emailOptions) => {
  try {
    let emailTransporter = await createTransporter();
    await emailTransporter.sendMail(emailOptions);
    return { success: true, message: "Email sent" };
  } catch (err) {
    console.log("ERROR: ", err);
    return { success: false, message: "Email not sent" };
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);

  // Check if date is valid
  if (!(date instanceof Date)) {
    console.error("Invalid date:", dateString);
    return "Invalid Date";
  }

  // Format date in local format
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

module.exports = {
  generateEventCode,
  generateCertificateCode,
  formatDate,
  sendEmail,
};
