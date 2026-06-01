/**
 * Applies scripts/ensure-pgvector.sql using DATABASE_URL from apps/backend/.env
 * (same source as Prisma). Shell `psql "$DATABASE_URL"` often misses .env and
 * connects to the wrong database.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import "dotenv/config";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));
const databaseUrl = process.env.DATABASE_URL?.trim();

if (!databaseUrl) {
    console.error(
        "DATABASE_URL is not set. Copy apps/backend/.env.example to apps/backend/.env",
    );
    process.exit(1);
}

const sql = readFileSync(join(__dirname, "ensure-pgvector.sql"), "utf8");
const client = new pg.Client({ connectionString: databaseUrl });

try {
    await client.connect();
    const dbName = (await client.query<{ current_database: string }>(
        "SELECT current_database()",
    )).rows[0]?.current_database;
    console.log(`Connected to database: ${dbName}`);
    await client.query(sql);
    console.log("pgvector setup applied successfully.");
} catch (error) {
    console.error("pgvector setup failed:", error);
    process.exit(1);
} finally {
    await client.end();
}
