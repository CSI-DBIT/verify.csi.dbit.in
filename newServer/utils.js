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
        reject();
      }
      resolve(token);
    });
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL,
      accessToken,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
    },
  });

  return transporter;
};

module.exports = {
  generateEventCode,
  generateCertificateCode,
  createTransporter,
};
