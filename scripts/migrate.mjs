import nextEnv from "@next/env";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { getDatabaseUrl } from "../src/lib/database-url.mjs";

nextEnv.loadEnvConfig(process.cwd());
let databaseUrl;
try {
  databaseUrl = getDatabaseUrl(process.env);
} catch (error) {
  console.error(error instanceof Error ? error.message : "Invalid database configuration.");
  process.exit(1);
}

const result = spawnSync(process.execPath, [
  join(process.cwd(), "node_modules", "prisma", "build", "index.js"),
  "migrate",
  "deploy",
], { stdio: "inherit", env: { ...process.env, DATABASE_URL: databaseUrl } });
if (result.error) {
  console.error("Could not start Prisma migration:", result.error);
  process.exit(1);
}
process.exit(result.status ?? 1);
