import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const libsql = createClient({
  url: `${Bun.env.TURSO_DATABASE_URL}`,
  authToken: `${Bun.env.TURSO_AUTH_TOKEN}`,
});

const adapter = new PrismaLibSQL(libsql);
export const prisma = new PrismaClient({ adapter });