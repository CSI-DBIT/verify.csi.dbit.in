const ShortUniqueId = require("short-unique-id");
const { v4: uuidv4 } = require("uuid");
const { randomUUID } = new ShortUniqueId({ length: 10 });
const generateUniqueCode = () => {
  // Generate a UUID
  const uniqueId = uuidv4();
  // Generate a unique-shortid
  const shortId = randomUUID();
  // Combine UUID with shortid and event name
  const eventCode = `${shortId}-${uniqueId}`;
  return eventCode;
};

module.exports = { generateUniqueCode };
