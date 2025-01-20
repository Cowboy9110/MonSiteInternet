import { neon, NeonQueryFunction } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../server/models/schema";
import { sql } from "drizzle-orm";
import { logger } from "../server/utils/logger";

if (!process.env.DATABASE_URL) {
  logger.log("DATABASE_URL must be set. Did you forget to provision a database?", "error");
  throw new Error("DATABASE_URL not configured");
}

// Configure neon client with detailed error logging
logger.log("Initializing Neon client...");
logger.log(`Attempting to connect to database with URL pattern: ${process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@')}`);

const sql_connection: NeonQueryFunction<boolean, boolean> = neon(process.env.DATABASE_URL);
logger.log("Neon client created successfully");

logger.log("Initializing Drizzle...");
export const db = drizzle(sql_connection, { schema });
logger.log("Drizzle instance created successfully");

// Test the connection immediately
export async function testConnection() {
  try {
    logger.log("Testing database connection...");
    const result = await db.execute<{ current_database: string, current_user: string, version: string }>(
      sql`SELECT current_database(), current_user, version();`
    );

    // Handle the result as a row array
    const rows = result.rows;
    if (rows && rows.length > 0) {
      const dbInfo = rows[0];
      logger.log(`Database connection successful. Connected to: ${JSON.stringify(dbInfo)}`);
      return result;
    }
    throw new Error("No database information returned");
  } catch (error) {
    logger.log(`Database connection test failed with error: ${error}`, "error");
    throw error;
  }
}

// Execute initial connection test
testConnection().catch((error) => {
  logger.log(`Initial connection test failed: ${error}`, "error");
  process.exit(1);
});