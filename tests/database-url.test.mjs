import { test } from "node:test";
import assert from "node:assert/strict";
import { getDatabaseUrl } from "../src/lib/database-url.mjs";

const env = { DB_HOST: "db.example.com", DB_PORT: "5431", DB_USER: "user@name", DB_PASSWORD: "p@ss:/word", DB_NAME: "my database", DB_SSL_MODE: "require" };

test("builds a PostgreSQL URL with encoded credentials and database name", () => {
  const url = new URL(getDatabaseUrl(env));
  assert.equal(url.hostname, env.DB_HOST);
  assert.equal(url.port, env.DB_PORT);
  assert.equal(decodeURIComponent(url.username), env.DB_USER);
  assert.equal(decodeURIComponent(url.password), env.DB_PASSWORD);
  assert.equal(decodeURIComponent(url.pathname.slice(1)), env.DB_NAME);
  assert.equal(url.searchParams.get("sslmode"), "require");
});

test("rejects incomplete or invalid database settings without exposing secrets", () => {
  assert.throws(() => getDatabaseUrl({ ...env, DB_HOST: "" }), /DB_HOST/);
  assert.throws(() => getDatabaseUrl({ ...env, DB_PORT: "70000" }), /DB_PORT/);
  assert.throws(() => getDatabaseUrl({ ...env, DB_SSL_MODE: "invalid" }), /DB_SSL_MODE/);
});

test("supports an existing DATABASE_URL", () => {
  assert.equal(getDatabaseUrl({ DATABASE_URL: "postgresql://localhost/db" }), "postgresql://localhost/db");
});
