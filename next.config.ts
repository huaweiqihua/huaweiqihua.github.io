import type { NextConfig } from "next";

const isGitHubPagesExport = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: isGitHubPagesExport ? "export" : undefined,
  images: {
    unoptimized: isGitHubPagesExport,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      }
    ]
  }
};

export default nextConfig;
