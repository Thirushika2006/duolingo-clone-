import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This app is fully client/data-driven (React Query + runtime params), so the
  // experimental prerender cache features add friction without benefit here.
  cacheComponents: false,
  partialPrefetching: false,
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
