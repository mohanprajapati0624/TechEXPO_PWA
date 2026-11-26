import type { Metadata, Viewport } from "next";
import "react-international-phone/style.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Let's Connect | Share Your Details",
  description: "Share your details and tell us what interests you.",
  appleWebApp: { capable: true, title: "Let's Connect", statusBarStyle: "default" },
  icons: { icon: "/app-icon.svg", apple: "/icons/icon-192.png" },
};

export const viewport: Viewport = { themeColor: "#183c32" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
