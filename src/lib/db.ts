import { PrismaClient } from "@prisma/client";
import { getDatabaseUrl } from "./database-url.mjs";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
let prisma = globalForPrisma.prisma;

export function getPrisma() {
  prisma ??= new PrismaClient({ datasources: { db: { url: getDatabaseUrl(process.env) } } });
  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
  return prisma;
}
