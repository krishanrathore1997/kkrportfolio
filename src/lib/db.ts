import { PrismaClient } from "@/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool, PoolConfig } from "pg";
import { parse as parseConnectionString } from "pg-connection-string";
import dotenv from "dotenv";
import path from "path";

// Ensure env vars are loaded (especially during Next.js build / static generation)
if (!process.env.DATABASE_URL) {
  dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

let prismaInstance: PrismaClient;

if (globalForPrisma.prisma) {
  prismaInstance = globalForPrisma.prisma;
} else {
  const connectionString = process.env.DATABASE_URL || "";
  const isSupabase = connectionString.includes("supabase") || connectionString.includes("sslmode=require");

  let pool: Pool;
  if (isSupabase) {
    const config = parseConnectionString(connectionString);
    config.ssl = { rejectUnauthorized: false };
    pool = new Pool(config as unknown as PoolConfig);
  } else {
    pool = new Pool({
      connectionString,
    });
  }

  const adapter = new PrismaPg(pool);
  prismaInstance = new PrismaClient({ adapter });
}

export const prisma = prismaInstance;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
