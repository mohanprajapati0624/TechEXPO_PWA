import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Rethink_Sans } from "next/font/google";
import "react-international-phone/style.css";
import "./globals.css";

const futura = localFont({
  src: [
    { path: "../../public/fonts/FuturaPT-Light.woff2", weight: "300" },
    { path: "../../public/fonts/FuturaPT-Book.woff2", weight: "400" },
    { path: "../../public/fonts/FuturaPT-Medium.woff2", weight: "500" },
    { path: "../../public/fonts/FuturaPT-Demi.woff2", weight: "600" },
    { path: "../../public/fonts/FuturaPT-Bold.woff2", weight: "700" },
  ],
  variable: "--font-futura",
  display: "swap",
});

const rethink = Rethink_Sans({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-rethink", display: "swap" });

export const metadata: Metadata = {
  title: "Let's Connect | Softqube Technologies",
  description: "Share your details and interests with Softqube Technologies.",
  appleWebApp: { capable: true, title: "Softqube", statusBarStyle: "black-translucent" },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = { themeColor: "#08aff7", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${futura.variable} ${rethink.variable}`}><body>{children}</body></html>;
}
