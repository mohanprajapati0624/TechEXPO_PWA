import nextEnv from "@next/env";
import QRCode from "qrcode";
import sharp from "sharp";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

nextEnv.loadEnvConfig(process.cwd());
const appUrl = process.env.NEXT_PUBLIC_APP_URL;
let url;
try {
  url = new URL(appUrl);
} catch {
  throw new Error("Set NEXT_PUBLIC_APP_URL to the full app URL before building.");
}
if (!["http:", "https:"].includes(url.protocol)) {
  throw new Error("NEXT_PUBLIC_APP_URL must be an HTTP or HTTPS URL.");
}
if (url.protocol !== "https:" && !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)) {
  throw new Error("NEXT_PUBLIC_APP_URL must use HTTPS except for localhost.");
}

const qrDir = join(process.cwd(), "public", "qr");
const iconDir = join(process.cwd(), "public", "icons");
await Promise.all([mkdir(qrDir, { recursive: true }), mkdir(iconDir, { recursive: true })]);
const options = { errorCorrectionLevel: "H", margin: 4, color: { dark: "#000000", light: "#FFFFFF" } };
await Promise.all([
  writeFile(join(qrDir, "app-qr.svg"), await QRCode.toString(appUrl, { ...options, type: "svg" })),
  QRCode.toFile(join(qrDir, "app-qr.png"), appUrl, { ...options, width: 1024 }),
]);
const icon = await readFile(join(process.cwd(), "public", "app-icon.svg"));
await Promise.all([192, 512].map((size) =>
  sharp(icon).resize(size, size).png().toFile(join(iconDir, `icon-${size}.png`))
));
console.log(`Generated QR assets for ${url.origin} and PWA icons.`);
