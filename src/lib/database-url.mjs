/**
 * @param {NodeJS.ProcessEnv} env
 * @returns {string}
 */
export function getDatabaseUrl(env) {
  if (env.DATABASE_URL) return env.DATABASE_URL;

  const required = ["DB_HOST", "DB_PORT", "DB_USER", "DB_PASSWORD", "DB_NAME"];
  const missing = required.filter((key) => !env[key]);
  if (missing.length) {
    throw new Error(`Missing database configuration: ${missing.join(", ")}.`);
  }

  const { DB_HOST: host, DB_PORT: port, DB_USER: user, DB_PASSWORD: password, DB_NAME: name } = env;
  if (!host || /[\/@?#\s]/.test(host)) throw new Error("DB_HOST must be a hostname or IP address.");
  if (!port || !/^\d+$/.test(port) || Number(port) < 1 || Number(port) > 65535) {
    throw new Error("DB_PORT must be a valid port number.");
  }
  const sslMode = env.DB_SSL_MODE || "require";
  if (!["disable", "prefer", "require", "verify-ca", "verify-full"].includes(sslMode)) {
    throw new Error("DB_SSL_MODE must be disable, prefer, require, verify-ca, or verify-full.");
  }

  let url;
  try {
    url = new URL(`postgresql://${host}:${port}`);
  } catch {
    throw new Error("DB_HOST must be a valid hostname or IP address.");
  }
  url.username = user;
  url.password = password;
  url.pathname = `/${encodeURIComponent(name)}`;
  url.searchParams.set("sslmode", sslMode);
  return url.toString();
}
