import withLlamaIndex from 'llamaindex/next';

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['auth0-ai-js'],
};

export default withLlamaIndex(nextConfig);
