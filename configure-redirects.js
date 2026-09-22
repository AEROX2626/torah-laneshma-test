const fs = require("fs");

const newConfig = `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Articles Mapping
      { source: '/%D7%A4%D7%A8%D7%A9%D7%95%D7%AA-%D7%94%D7%A9%D7%91%D7%95%D7%A2/%D7%A4%D7%A8%D7%A9%D7%AA-%D7%9C%D7%9A-%D7%9C%D7%9A', destination: '/articles/lech-lecha', permanent: true },
      { source: '/%D7%A4%D7%A8%D7%A9%D7%95%D7%AA-%D7%94%D7%A9%D7%91%D7%95%D7%A2/%D7%A4%D7%A8%D7%A9%D7%AA-%D7%A0%D7%97', destination: '/articles/noah', permanent: true },
      { source: '/%D7%A4%D7%A8%D7%A9%D7%95%D7%AA-%D7%94%D7%A9%D7%91%D7%95%D7%A2/%D7%A4%D7%A8%D7%A9%D7%AA-%D7%95%D7%99%D7%A8%D7%90', destination: '/articles/vayera', permanent: true },
      { source: '/%D7%A4%D7%A8%D7%A9%D7%95%D7%AA-%D7%94%D7%A9%D7%91%D7%95%D7%A2/%D7%9E%D7%94%D7%95-%D7%91%D7%99%D7%98%D7%97%D7%95%D7%9F-%D7%91%D7%94%D7%A9%D7%9D', destination: '/articles/bitachon', permanent: true },
      { source: '/%D7%A4%D7%A8%D7%A9%D7%95%D7%AA-%D7%94%D7%A9%D7%91%D7%95%D7%A2/%D7%94%D7%9B%D7%99%D7%A8%D7%95-%D7%90%D7%AA-%D7%94%D7%97%D7%91%D7%A8%D7%95%D7%AA%D7%90-%D7%94%D7%98%D7%9C%D7%A4%D7%95%D7%A0%D7%99%D7%AA-%D7%A9%D7%9C%D7%A0%D7%95', destination: '/articles/chavruta', permanent: true },
      { source: '/%D7%A4%D7%A8%D7%A9%D7%95%D7%AA-%D7%94%D7%A9%D7%91%D7%95%D7%A2', destination: '/#content', permanent: true },

      // Adopt an Avrech (Donations)
      { source: '/%D7%90%D7%9E%D7%A5-%D7%90%D7%91%D7%A8%D7%9A(:path*)', destination: '/adopt', permanent: true },
      { source: '/100-%D7%9E%D7%94%D7%AA%D7%A8%D7%95%D7%9E%D7%94-%D7%99%D7%A9%D7%99%D7%A8%D7%95%D7%AA-%D7%9C%D7%90%D7%91%D7%A8%D7%9A', destination: '/adopt', permanent: true },
      { source: '/%D7%98%D7%95%D7%A4%D7%A1-%D7%94%D7%A6%D7%98%D7%A8%D7%A4%D7%95%D7%AA-%D7%90%D7%9E%D7%A5-%D7%90%D7%91%D7%A8%D7%9A', destination: '/adopt', permanent: true },
      { source: '/%D7%90%D7%A4%D7%A9%D7%A8-%D7%9C%D7%AA%D7%A8%D7%95%D7%9D-%D7%9E%D7%9E%D7%A2%D7%A9%D7%A8-%D7%9B%D7%A1%D7%A4%D7%99%D7%9D', destination: '/adopt', permanent: true },
      { source: '/%D7%9C%D7%94%D7%99%D7%95%D7%AA-%D7%A9%D7%95%D7%AA%D7%A3-%D7%91%D7%9C%D7%99%D7%9E%D7%95%D7%93-%D7%94%D7%AA%D7%95%D7%A8%D7%94', destination: '/adopt', permanent: true },
      { source: '/%D7%90%D7%99%D7%9F-%D7%A6%D7%95%D7%A8%D7%9A-%D7%91%D7%A1%D7%9B%D7%95%D7%9D-%D7%97%D7%95%D7%93%D7%A9%D7%99-%D7%A7%D7%91%D7%95%D7%A2', destination: '/adopt', permanent: true },

      // Home Sections (How it works, About, FAQ, Join)
      { source: '/%D7%90%D7%99%D7%9A-%D7%96%D7%94-%D7%A2%D7%95%D7%91%D7%93(:path*)', destination: '/#how', permanent: true },
      { source: '/%D7%9E%D7%94-%D7%96%D7%94-%D7%97%D7%91%D7%A8%D7%95%D7%AA%D7%90', destination: '/#about', permanent: true },
      { source: '/%D7%94%D7%90%D7%9D-%D7%94-%D7%97%D7%91%D7%A8%D7%95%D7%AA%D7%90-%D7%94%D7%98%D7%9C%D7%A4%D7%95%D7%A0%D7%99%D7%AA-%D7%99%D7%97%D7%96%D7%99%D7%A8-%D7%90%D7%95%D7%AA%D7%99-%D7%91%D7%AA%D7%A9%D7%95%D7%91%D7%94', destination: '/#faq', permanent: true },
      { source: '/%D7%90%D7%A4%D7%A9%D7%A8-%D7%9C%D7%94%D7%A6%D7%99%D7%A2-%D7%9C%D7%9A-%D7%97%D7%91%D7%A8%D7%95%D7%AA%D7%90', destination: '/#join', permanent: true },
      { source: '/%D7%94%D7%A9%D7%90%D7%99%D7%A8%D7%95-%D7%A4%D7%A8%D7%98%D7%99%D7%9D-%D7%A2%D7%9B%D7%A9%D7%99%D7%95', destination: '/#join', permanent: true },

      // Catchall for variants of the main page (Wix duplicates)
      { source: '/%D7%97%D7%91%D7%A8%D7%95%D7%AA%D7%90-%D7%98%D7%9C%D7%A4%D7%95%D7%A0%D7%99%D7%AA-%D7%9C%D7%9C%D7%99%D7%9E%D7%95%D7%93-%D7%AA%D7%95%D7%A8%D7%94-%D7%9C%D7%9C%D7%90-%D7%A2%D7%9C%D7%95%D7%AA(:path*)', destination: '/', permanent: true }
    ];
  },
};

export default nextConfig;
`;

fs.writeFileSync("next.config.ts", newConfig, "utf8");
