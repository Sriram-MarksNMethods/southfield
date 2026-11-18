import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components is off: this is a static marketing site, and Swiper reads
  // the clock while rendering, which Cache Components refuses to prerender.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
