import "dotenv/config";
import pg from "pg";
import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Runtime uses the pooled connection string
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 20000, 
  connectionTimeoutMillis: 15000, 
});

// An error on an idle connection must never crash the server
pool.on("error", (err) => console.error("Postgres pool error:", err.message));

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
});

export default prisma;