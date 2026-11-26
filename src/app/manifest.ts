import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Softqube Technologies",
    short_name: "Softqube",
    description: "Share your details and interests with Softqube Technologies.",
    start_url: "/",
    display: "standalone",
    background_color: "#04123a",
    theme_color: "#08aff7",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
