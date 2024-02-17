const ShortUniqueId = require("short-unique-id");
const { v4: uuidv4 } = require("uuid");
const { randomUUID } = new ShortUniqueId({ length: 10 });
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

module.exports = { generateEventCode, generateCertificateCode };
