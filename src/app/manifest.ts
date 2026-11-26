import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Let's Connect",
    short_name: "Connect",
    description: "Share your details and tell us what interests you.",
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
