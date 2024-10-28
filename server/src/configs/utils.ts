import ShortUniqueId from "short-unique-id";
import { v4 as uuidv4 } from "uuid";

const { randomUUID } = new ShortUniqueId({ length: 10 });

// Hash password
export const hashPassword = async (password: string): Promise<string> => {
  return await Bun.password.hash(password);
};

// Compare password
export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return await Bun.password.verify(password, hash);
};

export const generateComplexId = () => {
  const uniqueId = uuidv4();
  const shortId = randomUUID();
  const complexId = `${shortId}-${uniqueId}`;
  return complexId;
};
export const generateSmallId = () => {
  const certificateCode = randomUUID();
  return certificateCode;
};

export const getExpTimestamp = (seconds: number) => {
  const currentTimeMillis = Date.now();
  const secondsIntoMillis = seconds * 1000;
  const expirationTimeMillis = currentTimeMillis + secondsIntoMillis;
  return Math.floor(expirationTimeMillis / 1000);
};
