/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    compiler: {
        styledComponents: true,
    },
    pageExtensions: ["page.tsx", "page.ts", "api.ts"],
};

module.exports = nextConfig;
