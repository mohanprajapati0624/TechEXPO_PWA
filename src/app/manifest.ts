import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tech Expo",
    short_name: "Tech Expo",
    description: "Register for Tech Expo.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f8f2",
    theme_color: "#183c32",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
