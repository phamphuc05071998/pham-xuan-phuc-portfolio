import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";
const repositoryName = "pham-xuan-phuc-portfolio";

const nextConfig: NextConfig = {
  output: isGitHubPages ? "export" : undefined,
  basePath: isGitHubPages ? `/${repositoryName}` : "",
  assetPrefix: isGitHubPages ? `/${repositoryName}/` : undefined,
  trailingSlash: isGitHubPages,
  images: {
    unoptimized: true,
  },
  typescript: {
    tsconfigPath: isGitHubPages ? "./tsconfig.pages.json" : "./tsconfig.json",
  },
};

export default nextConfig;
