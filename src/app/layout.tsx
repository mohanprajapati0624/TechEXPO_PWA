import type { Metadata, Viewport } from "next";
import "react-international-phone/style.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tech Expo | Registration",
  description: "Your next connection starts here. Register for Tech Expo.",
  appleWebApp: { capable: true, title: "Tech Expo", statusBarStyle: "default" },
  icons: { icon: "/app-icon.svg", apple: "/icons/icon-192.png" },
};

export const viewport: Viewport = { themeColor: "#183c32" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
