import type { Metadata, Viewport } from "next";
import "react-international-phone/style.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Let's Connect | Softqube Technologies",
  description: "Share your details and interests with Softqube Technologies.",
  appleWebApp: { capable: true, title: "Softqube", statusBarStyle: "default" },
  icons: { icon: "/logos/Group%205.svg", apple: "/icons/icon-192.png" },
};

export const viewport: Viewport = { themeColor: "#101820" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
